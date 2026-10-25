/*
 * supabase-adapter.js
 * Backend online sungguhan pakai Supabase (Postgres + Realtime Presence), TANPA perlu login akun Claude.
 * Dimuat di index.html menggantikan claude-shim.js, setelah:
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *
 * Setup SQL (jalankan sekali di Supabase SQL Editor):
 *   create table if not exists players (
 *     id text primary key,
 *     data jsonb not null,
 *     level int generated always as ((data->>'level')::int) stored
 *   );
 *   alter table players enable row level security;
 *   create policy "public read" on players for select using (true);
 *   create policy "public write" on players for insert with check (true);
 *   create policy "public update" on players for update using (true);
 *
 * Catatan keamanan: kebijakan di atas membuka baca/tulis publik lewat anon key (cocok untuk game
 * kasual tanpa akun/password, sama seperti mode offline). Jangan simpan data sensitif di tabel ini.
 */
(function(){
  var SUPABASE_URL='https://ecndxpzvmvhbqpybiyph.supabase.co';
  var SUPABASE_ANON_KEY='sb_publishable_iXJF-VMdUngqYSbLHDxowA_FQExrL0h';
  if(SUPABASE_ANON_KEY.indexOf('YOUR-')>=0){ console.warn('supabase-adapter.js belum dikonfigurasi (isi SUPABASE_URL/SUPABASE_ANON_KEY).'); return; }
  if(!window.supabase || typeof window.supabase.createClient!=='function'){ console.warn('Supabase JS library tidak termuat.'); return; }
  var sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);

  var db={
    doc:function(path){
      var id=path.split('/').pop();
      return {
        get:function(){ return sb.from('players').select('data').eq('id',id).maybeSingle().then(function(r){
          var d=r.data&&r.data.data;
          // belum ada di server: pakai simpanan lama mode lokal (claude-shim) supaya progres tidak hilang
          if(!d){ try{ d=JSON.parse(localStorage.getItem('elyndor:db:v1')||'{}')[path]; }catch(e){} }
          return {id:id,exists:!!d,data:function(){ return d; }}; }); },
        set:function(obj){ return sb.from('players').upsert({id:id,data:obj}).then(function(){}); }
      };
    },
    collection:function(name){
      var ord=null, lim=50;
      var q={
        where:function(){ return q; },
        orderBy:function(f,dir){ ord=[f,dir]; return q; },
        limit:function(n){ lim=n; return q; },
        get:function(){
          var x=sb.from(name).select('id,data,level');
          if(ord) x=x.order(ord[0],{ascending:ord[1]!=='desc'});
          return x.limit(lim).then(function(r){
            var docs=(r.data||[]).map(function(row){ return {id:row.id,data:function(){ return row.data; }}; });
            return {docs:docs,size:docs.length,empty:!docs.length};
          });
        }
      };
      return q;
    }
  };

  // presence: satu channel global (klien sendiri sudah menyaring peer berdasarkan zona)
  var myKey='p'+Math.random().toString(36).slice(2,9);
  var cbs=[], state={}, heard={};
  var channel=null, joined=false, pending=null, lastSend=0, timer=null, gap=250, lastPayload=null, lastEvt=Date.now(), connectAt=0;
  var diag={status:'connecting',track:'-',peers:0,key:myKey,re:0};
  function list(){
    var out=[], now=Date.now();
    Object.keys(state).forEach(function(k){
      var arr=state[k]; if(!arr||!arr.length) return;
      // urutan meta tidak dijamin: ambil yang paling baru lewat cap waktu _t
      var best=arr[0]; for(var i=1;i<arr.length;i++){ if((arr[i]._t||0)>=(best._t||0)) best=arr[i]; }
      if(k!==myKey){
        // pemain yang koneksinya mati (HP dikunci/pindah aplikasi) tetap tercatat di server sampai timeout;
        // kalau 15 detik tidak ada kabar baru (normalnya tiap ≤5 detik), anggap sudah pergi supaya tidak jadi patung
        var h=heard[k]; if(!h||h.t!==best._t){ h=heard[k]={t:best._t,at:now}; }
        if(now-h.at>15000) return;
      }
      out.push({peer:k,isMe:k===myKey,presence:best});
    });
    return out;
  }
  function notify(){
    if(!channel) return;
    state=channel.presenceState();
    diag.peers=Object.keys(state).length;
    var l=list(); cbs.forEach(function(f){ try{ f({peers:l}); }catch(e){} });
  }
  function onEvt(){ lastEvt=Date.now(); notify(); }
  function flush(){
    timer=null; if(!joined||!pending) return;
    var p=pending, ch=channel; pending=null; lastSend=Date.now();
    p._t=lastSend; lastPayload=p;
    ch.track(p).then(function(r){
      diag.track=String(r);
      if(r==='ok') lastEvt=Date.now(); // balasan server = koneksi hidup
      // server menolak karena terlalu sering: perlambat kirim, jangan menyerah
      if(r==='rate limited') gap=Math.min(2000,gap*2); else if(r==='ok' && gap>250) gap=Math.max(250,gap-50);
    },function(e){ diag.track='error '+((e&&e.message)||e); });
  }
  // sambung (ulang) ke channel. Dipakai saat awal, dan saat koneksi ternyata mati diam-diam
  // (umum di HP: tab dibekukan saat pindah aplikasi, websocket putus tanpa kabar)
  var connecting=false;
  function connect(){
    if(connecting) return; connecting=true;
    var old=channel; channel=null; joined=false; lastEvt=connectAt=Date.now(); diag.re++; diag.status='connecting';
    Promise.resolve(old?sb.removeChannel(old):null).catch(function(){}).then(function(){
      connecting=false;
      var ch=sb.channel('elyndor-room',{config:{presence:{key:myKey}}});
      ch.on('presence',{event:'sync'},onEvt);
      ch.on('presence',{event:'join'},onEvt);
      ch.on('presence',{event:'leave'},onEvt);
      channel=ch;
      ch.subscribe(function(st){
        if(ch!==channel) return;
        diag.status=String(st);
        if(st==='SUBSCRIBED'){ joined=true; lastEvt=Date.now(); if(lastPayload&&!pending) pending=lastPayload; flush(); }
        else { joined=false; console.warn('Elyndor realtime: '+st); }
      });
    });
  }
  connect();
  function keepalive(){ if(joined&&lastPayload&&!pending){ pending=lastPayload; flush(); } }
  setInterval(function(){
    if(document.hidden) return;
    notify();
    // presence kita sendiri dipantulkan server; kalau 15 detik sepi padahal kita kirim tiap 5 detik, koneksinya mati
    // juga kalau 15 detik tidak kunjung tersambung
    if(Date.now()-lastEvt>15000 || (!joined && Date.now()-connectAt>15000)) connect();
    else if(Date.now()-lastSend>4500) keepalive();
  },1500);
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){ if(joined&&channel) channel.untrack().catch(function(){}); return; }
    if(Date.now()-lastEvt>8000) connect(); else keepalive();
  });
  var room={
    presence:function(p){
      pending=p;
      if(!timer) timer=setTimeout(flush,Math.max(0,gap-(Date.now()-lastSend)));
      return Promise.resolve();
    },
    onPeers:function(cb){ cbs.push(cb); return function(){ cbs=cbs.filter(function(x){ return x!==cb; }); }; },
    peers:function(){ return list(); }
  };

  // diagnosa: buka game dengan ?debug=1 untuk melihat status koneksi realtime di layar
  if(/[?&]debug=1/.test(location.search)){
    var box=document.createElement('div');
    box.style.cssText='position:fixed;left:4px;bottom:4px;z-index:99999;background:rgba(0,0,0,.75);color:#9f9;font:11px/1.3 monospace;padding:4px 6px;border-radius:4px;pointer-events:none;max-width:60vw';
    document.body.appendChild(box);
    setInterval(function(){ box.textContent='b16 rt:'+diag.status+' track:'+diag.track+' keys:'+diag.peers+' gap:'+gap+' re:'+diag.re+' me:'+diag.key; },500);
  }

  window.claude={ use:function(n){ return Promise.resolve(n==='db'?db:(n==='room'?room:null)); }, standalone:true };
})();

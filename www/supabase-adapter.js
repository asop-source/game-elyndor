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
  var channel=sb.channel('elyndor-room',{config:{presence:{key:myKey}}});
  var cbs=[], state={};
  function list(){
    var out=[];
    Object.keys(state).forEach(function(k){
      var arr=state[k]; if(!arr||!arr.length) return;
      // urutan meta tidak dijamin: ambil yang paling baru lewat cap waktu _t
      var best=arr[0]; for(var i=1;i<arr.length;i++){ if((arr[i]._t||0)>=(best._t||0)) best=arr[i]; }
      out.push({peer:k,isMe:k===myKey,presence:best});
    });
    return out;
  }
  function notify(){
    state=channel.presenceState();
    var l=list(); cbs.forEach(function(f){ try{ f({peers:l}); }catch(e){} });
  }
  // sync saja bisa terlewat di sebagian koneksi: dengarkan join/leave juga, dan segarkan berkala
  channel.on('presence',{event:'sync'},notify);
  channel.on('presence',{event:'join'},notify);
  channel.on('presence',{event:'leave'},notify);
  setInterval(function(){ if(joined) notify(); },1500);
  // track() hanya berlaku setelah join; kirim paling sering tiap 250 ms (batas pesan Realtime)
  var joined=false, pending=null, lastSend=0, timer=null;
  function flush(){
    timer=null; if(!joined||!pending) return;
    var p=pending; pending=null; lastSend=Date.now();
    p._t=lastSend; lastPayload=p; channel.track(p).catch(function(){});
  }
  var lastPayload=null;
  channel.subscribe(function(st){
    if(st==='SUBSCRIBED'){ joined=true; if(lastPayload&&!pending) pending=lastPayload; flush(); }
    else { joined=false; console.warn('Elyndor realtime: '+st); }
  });
  // kirim ulang presence terakhir tiap 5 detik supaya pemain yang diam tetap terlihat (dan pulih bila sempat putus)
  setInterval(function(){ if(joined&&lastPayload&&!pending&&Date.now()-lastSend>4500){ pending=lastPayload; flush(); } },5000);
  var room={
    presence:function(p){
      pending=p;
      if(!timer) timer=setTimeout(flush,Math.max(0,250-(Date.now()-lastSend)));
      return Promise.resolve();
    },
    onPeers:function(cb){ cbs.push(cb); return function(){ cbs=cbs.filter(function(x){ return x!==cb; }); }; },
    peers:function(){ return list(); }
  };

  window.claude={ use:function(n){ return Promise.resolve(n==='db'?db:(n==='room'?room:null)); }, standalone:true };
})();

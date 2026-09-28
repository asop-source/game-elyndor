/*
 * CONTOH kerangka adapter Supabase. BELUM DIUJI, jadikan titik awal.
 * Muat file ini di index.html menggantikan claude-shim.js, setelah <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *
 * Tabel yang dibutuhkan (SQL):
 *   create table players (id text primary key, data jsonb not null, level int generated always as ((data->>'level')::int) stored);
 *   -- aktifkan Row Level Security dan buat policy sesuai kebutuhanmu
 */
(function(){
  var SUPABASE_URL='https://XXXX.supabase.co', SUPABASE_KEY='ANON_KEY';
  var sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

  var db={
    doc:function(path){
      var id=path.split('/').pop();
      return {
        get:function(){ return sb.from('players').select('data').eq('id',id).maybeSingle().then(function(r){
          var d=r.data&&r.data.data; return {id:id,exists:!!d,data:function(){ return d; }}; }); },
        set:function(obj){ return sb.from('players').upsert({id:id,data:obj}).then(function(){}); }
      };
    },
    collection:function(){
      var ord=null,lim=50;
      var q={ orderBy:function(f,dir){ord=[f,dir];return q;}, limit:function(n){lim=n;return q;}, where:function(){return q;},
        get:function(){ var x=sb.from('players').select('id,data,level'); if(ord) x=x.order(ord[0],{ascending:ord[1]!=='desc'}); return x.limit(lim)
          .then(function(r){ var docs=(r.data||[]).map(function(row){ return {id:row.id,data:function(){ return row.data; }}; }); return {docs:docs}; }); } };
      return q;
    }
  };

  // presence: satu channel untuk semua pemain (bisa dipecah per zona supaya hemat)
  var channel=sb.channel('elyndor-room',{config:{presence:{key:'p'+Math.random().toString(36).slice(2,9)}}});
  var cbs=[], state={}, myKey=channel.presenceKey, mine={};
  function list(){ return Object.keys(state).map(function(k){ var arr=state[k]; return {peer:k,isMe:k===myKey,presence:arr[arr.length-1]}; }); }
  channel.on('presence',{event:'sync'},function(){ state=channel.presenceState(); var l=list(); cbs.forEach(function(f){ f({peers:l}); }); });
  channel.subscribe();
  var room={
    presence:function(p){ mine=p; return channel.track(p).then(function(){}); },
    onPeers:function(cb){ cbs.push(cb); return function(){ cbs=cbs.filter(function(x){return x!==cb;}); }; },
    peers:function(){ return list(); }
  };
  window.claude={ use:function(n){ return Promise.resolve(n==='db'?db:(n==='room'?room:null)); } };
})();

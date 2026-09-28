/*
 * claude-shim.js
 * Game ini awalnya dibuat sebagai "artifact" di dalam Claude, yang menyediakan objek window.claude
 * (database bersama + presence real-time). File ini meniru objek itu supaya game bisa jalan MANDIRI
 * di browser biasa, PWA, atau APK.
 *
 *  - db   : disimpan di localStorage (per perangkat). Progress karakter tersimpan.
 *  - room : memakai BroadcastChannel, jadi beberapa tab di perangkat yang sama saling melihat
 *           (berguna untuk uji coba multiplayer). Untuk multiplayer online sungguhan, ganti file ini
 *           dengan adapter backend (lihat docs/BACKEND.md dan backend-examples/).
 *
 * Kalau game dijalankan di dalam Claude (window.claude sudah ada), shim ini tidak menimpa apa pun.
 */
(function(){
  if(window.claude && typeof window.claude.use==='function') return;

  var KEY='elyndor:db:v1';
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){ return {}; } }
  function save(o){ try{ localStorage.setItem(KEY,JSON.stringify(o)); }catch(e){} }
  function clone(v){ return v===undefined?undefined:JSON.parse(JSON.stringify(v)); }
  function snap(id,data){ return {id:id,exists:data!==undefined,data:function(){ return clone(data); }}; }

  var db={
    doc:function(path){
      return {
        get:function(){ return Promise.resolve(snap(path.split('/').pop(),load()[path])); },
        set:function(data){ var o=load(); o[path]=clone(data); save(o); return Promise.resolve(); }
      };
    },
    collection:function(name){
      var ord=null, lim=1000, filters=[];
      var q={
        where:function(f,op,v){ filters.push([f,op,v]); return q; },
        orderBy:function(f,dir){ ord=[f,dir||'asc']; return q; },
        limit:function(n){ lim=n; return q; },
        get:function(){
          var o=load(), docs=Object.keys(o).filter(function(k){ return k.indexOf(name+'/')===0; })
            .map(function(k){ return snap(k.slice(name.length+1),o[k]); })
            .filter(function(d){ return filters.every(function(f){ return f[1]==='=='?d.data()[f[0]]===f[2]:true; }); });
          if(ord){ var f=ord[0], sgn=ord[1]==='desc'?-1:1; docs.sort(function(a,b){ var x=a.data()[f], y=b.data()[f]; return x===y?0:(x>y?sgn:-sgn); }); }
          docs=docs.slice(0,lim); return Promise.resolve({docs:docs,size:docs.length,empty:!docs.length});
        }
      };
      return q;
    }
  };

  // ---- presence antar-tab (BroadcastChannel) ----
  var me='p'+Math.random().toString(36).slice(2,9), peers={}, cbs=[], myPres=null, ch=null;
  function list(){
    var now=Date.now(), arr=[{peer:me,isMe:true,presence:myPres||{}}];
    Object.keys(peers).forEach(function(k){ if(now-peers[k].ts>7000) delete peers[k]; else arr.push(peers[k]); });
    return arr;
  }
  function emit(){ var l=list(); cbs.forEach(function(f){ try{ f({peers:l}); }catch(e){} }); }
  try{
    ch=new BroadcastChannel('elyndor-room');
    ch.onmessage=function(e){
      var m=e.data; if(!m||m.from===me) return;
      if(m.t==='pres'){ peers[m.from]={peer:m.from,isMe:false,presence:m.p,ts:Date.now()}; emit(); }
      else if(m.t==='bye'){ delete peers[m.from]; emit(); }
    };
    window.addEventListener('beforeunload',function(){ ch.postMessage({t:'bye',from:me}); });
    setInterval(function(){ if(myPres) ch.postMessage({t:'pres',from:me,p:myPres}); emit(); },2000);
  }catch(e){}
  var room={
    presence:function(p){ myPres=p; if(ch) ch.postMessage({t:'pres',from:me,p:p}); return Promise.resolve(); },
    onPeers:function(cb){ cbs.push(cb); return function(){ cbs=cbs.filter(function(x){ return x!==cb; }); }; },
    peers:function(){ return list(); }
  };

  window.claude={ use:function(name){ return Promise.resolve(name==='db'?db:(name==='room'?room:null)); }, standalone:true };
})();

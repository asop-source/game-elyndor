(function(){
'use strict';
var $=function(i){return document.getElementById(i);};
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function dist(a,b,c,d){var x=a-c,y=b-d;return Math.sqrt(x*x+y*y);}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function colorFor(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;var c=['#3B7DD8','#D4537E','#1D9E75','#7F55D9','#2E9CB0','#8A6D1F','#C0392B','#4E8A2A'];return c[Math.abs(h)%c.length];}
function genderFor(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return (Math.abs(h)%2)?'f':'m';}

/* ===================== DATA ===================== */
var ZONES={
 village:{label:'Desa Awal',sub:'Tempat aman para Perantau',w:1900,h:1450,minLv:1,safe:true,kind:'village',
  ground:'#8DC063',ground2:'#7FB356',path:'#DCC48E',start:{x:950,y:870},
  npcs:[{id:'ilra',x:810,y:730,name:'Penyihir Ilra',robe:'#6C5FD0',hat:true},{id:'bram',x:1220,y:960,name:'Pedagang Bram',robe:'#B8741A'}],
  portals:[{to:'forest',x:1790,y:870},{to:'ghost',x:950,y:1360}],spawns:[],chests:[{id:'v1',x:190,y:190,coin:15,pot:1}]},
 forest:{label:'Hutan Bisikan',sub:'Slime dan serigala berkeliaran',w:2470,h:1890,minLv:1,kind:'forest',
  ground:'#5B9B55',ground2:'#4D8B49',path:'#A58F60',start:{x:290,y:940},
  npcs:[{id:'toran',x:440,y:700,name:'Pemburu Toran',robe:'#C9582F'}],
  portals:[{to:'village',x:90,y:940},{to:'castle',x:2380,y:940}],
  spawns:[{type:'slime',n:12},{type:'wolf',n:8},{type:'ent',n:1,x:1300,y:1520}],chests:[{id:'f1',x:2260,y:190,coin:25,pot:1},{id:'f2',x:220,y:1710,coin:30}]},
 castle:{label:'Reruntuhan Kastil',sub:'Tulang-belulang tak mau tidur',w:2470,h:1890,minLv:4,kind:'castle',
  ground:'#A6A092',ground2:'#979182',path:'#C8BFAA',start:{x:290,y:940},
  npcs:[{id:'maren',x:460,y:700,name:'Penyihir Maren',robe:'#2E7FA8',hat:true}],
  portals:[{to:'forest',x:90,y:940},{to:'cave',x:2380,y:940}],
  spawns:[{type:'skeleton',n:10},{type:'bat',n:8},{type:'boneking',n:1,x:1300,y:1380}],chests:[{id:'c1',x:1230,y:190,coin:60,pot:2},{id:'c2',x:2260,y:1710,coin:50}]},
 cave:{label:'Gua Kristal',sub:'Cahaya dingin di bawah tanah',w:2470,h:1890,minLv:7,kind:'cave',
  ground:'#3E3858',ground2:'#35304D',path:'#51497A',start:{x:290,y:940},
  npcs:[{id:'sael',x:460,y:700,name:'Penyihir Sael',robe:'#1D9E75',hat:true}],
  portals:[{to:'castle',x:90,y:940},{to:'lair',x:2380,y:940}],
  spawns:[{type:'spider',n:9},{type:'golem',n:6},{type:'crystalking',n:1,x:1380,y:1380}],chests:[{id:'k1',x:220,y:190,coin:90,pot:2},{id:'k2',x:2260,y:1710,coin:100,pot:2}]},
 lair:{label:'Sarang Vaelgorn',sub:'Hanya yang berani yang kembali',w:2180,h:1600,minLv:10,kind:'lair',
  ground:'#6E3B2C',ground2:'#5E3226',path:'#8A543E',start:{x:290,y:800},
  npcs:[],portals:[{to:'cave',x:90,y:800}],
  spawns:[{type:'dragon',n:1,x:1520,y:800}],chests:[]},
 ghost:{label:'Desa Angker',sub:'Malam yang tak pernah berakhir',w:2470,h:1890,minLv:5,kind:'ghost',
  ground:'#26304A',ground2:'#202940',path:'#4B4A63',start:{x:290,y:940},
  npcs:[{id:'darmo',x:460,y:700,name:'Mbah Darmo',robe:'#5A4630',blangkon:true}],
  portals:[{to:'village',x:90,y:940}],
  spawns:[{type:'tuyul',n:10},{type:'pocong',n:9},{type:'kuntilanak',n:6},{type:'genderuwo',n:3},{type:'banaspati',n:1,x:1380,y:1015}],
  chests:[{id:'g1',x:2260,y:220,coin:120,pot:2},{id:'g2',x:220,y:1700,coin:110},{id:'g3',x:2290,y:1680,coin:140,pot:3}]}
};
var ORDER=['village','forest','castle','cave','lair','ghost'];

var MON={
 slime:{name:'Slime',hp:22,atk:4,spd:0.9,xp:7,coin:3,r:14,aggro:150,acd:1.3},
 wolf:{name:'Serigala',hp:40,atk:6,spd:1.7,xp:12,coin:5,r:16,aggro:200,acd:1.1},
 skeleton:{name:'Tengkorak',hp:75,atk:11,spd:1.3,xp:22,coin:9,r:16,aggro:210,acd:1.2},
 bat:{name:'Kelelawar',hp:45,atk:8,spd:2.1,xp:16,coin:7,r:13,aggro:230,acd:0.9},
 spider:{name:'Laba-laba kristal',hp:110,atk:15,spd:1.9,xp:32,coin:13,r:17,aggro:230,acd:1.0},
 golem:{name:'Golem kristal',hp:220,atk:22,spd:0.85,xp:55,coin:22,r:24,aggro:190,acd:1.6},
 tuyul:{name:'Tuyul',hp:55,atk:9,spd:2.0,xp:20,coin:8,r:12,aggro:210,acd:0.9,steal:3},
 pocong:{name:'Pocong',hp:120,atk:15,spd:1.1,xp:36,coin:12,r:15,aggro:200,acd:1.3,hop:true},
 kuntilanak:{name:'Kuntilanak',hp:95,atk:17,spd:1.5,xp:44,coin:16,r:15,aggro:260,acd:1.1,fly:true,wail:6},
 genderuwo:{name:'Genderuwo',hp:320,atk:27,spd:0.9,xp:95,coin:38,r:28,aggro:220,acd:1.7},
 dragon:{name:'Vaelgorn',hp:2400,atk:30,spd:1.1,xp:900,coin:300,r:58,aggro:420,acd:1.4,boss:true,respawn:90,title:'Naga Purba'},
 ent:{name:'Ki Ageng Rimba',hp:650,atk:20,spd:0.7,xp:220,coin:60,r:36,aggro:260,acd:1.6,boss:true,respawn:70,title:'Roh Hutan Purba'},
 boneking:{name:'Raja Baskara',hp:1000,atk:26,spd:1.0,xp:320,coin:85,r:30,aggro:260,acd:1.3,boss:true,respawn:75,title:'Raja Tulang Kastil'},
 crystalking:{name:'Sang Penjaga Kristal',hp:1600,atk:34,spd:0.7,xp:480,coin:130,r:44,aggro:260,acd:1.7,boss:true,respawn:85,title:'Penjaga Gua Kristal'},
 banaspati:{name:'Banaspati Agung',hp:1300,atk:30,spd:1.2,xp:400,coin:110,r:34,aggro:280,acd:1.2,boss:true,fly:true,wail:8,respawn:80,title:'Api Angker Terkuat'}
};

var ELEMENTS=[
 {id:'fire',ic:'🔥',name:'Api',c:'#E0601E',cdk:'#7a2e0c',skillName:'Bola Api',desc:'Bola api melesat ke musuh terdekat lalu meledak, membakar tanah di sekitarnya.',base:40,cd:[4,3.5,3]},
 {id:'water',ic:'💧',name:'Air',c:'#2E86D8',cdk:'#0f3a63',skillName:'Gelombang Air',desc:'Gelombang air menghantam ke depan, mendorong dan melukai semua musuh di jalurnya.',base:40,cd:[5,4,3.2]},
 {id:'wind',ic:'🌪️',name:'Udara',c:'#4FBFAE',cdk:'#0f4a40',skillName:'Puting Beliung',desc:'Angin puyuh menyedot musuh di sekitarmu lalu menghempaskan mereka menjauh.',base:40,cd:[6,5,4]},
 {id:'earth',ic:'🪨',name:'Tanah',c:'#8A5A2E',cdk:'#3d2712',skillName:'Duri Bumi',desc:'Duri batu menusuk keluar dari tanah, menjalar lurus ke arah musuh.',base:40,cd:[5,4.2,3.4]}
];
var ELM={}; ELEMENTS.forEach(function(a){ELM[a.id]=a;});
function elDef(){ return ELM[P.element]||ELEMENTS[0]; }
var SUPPORT=[
 {id:'spin',ic:'🌀',name:'Tebasan puyuh',desc:'Pedang berputar dua kali, menebas semua musuh di sekelilingmu.',max:3,base:25,cd:[6,5,4],unlock:1},
 {id:'dash',ic:'💨',name:'Terjangan kilat',desc:'Melesat ke depan meninggalkan bayangan, menebas musuh yang dilewati. Kebal saat melesat.',max:3,base:35,cd:[5,4,3],unlock:3},
 {id:'shield',ic:'🛡️',name:'Perisai cahaya',desc:'Kubah cahaya berputar yang menyerap damage selama 5 detik.',max:3,base:50,cd:[14,12,10],unlock:4},
 {id:'bolt',ic:'⚡',name:'Petir langit',desc:'Petir menyambar 3 / 4 / 5 musuh terdekat sekaligus.',max:3,base:60,cd:[8,7,6],unlock:5},
 {id:'meteor',ic:'☄️',name:'Hujan meteor',desc:'Meteor raksasa jatuh dari langit dan meledakkan area luas.',max:3,base:120,cd:[18,15,12],unlock:8}
];
var SUP={}; SUPPORT.forEach(function(a){SUP[a.id]=a;});
var SKILLS=[
 {id:'str',ic:'🗡️',name:'Tebasan tajam',desc:'+4 serangan per level',max:5,base:20},
 {id:'vit',ic:'❤️',name:'Jantung baja',desc:'+25 HP maksimum per level',max:5,base:20},
 {id:'agi',ic:'👟',name:'Kaki ringan',desc:'+8% kecepatan gerak per level',max:3,base:30},
 {id:'crit',ic:'🎯',name:'Mata elang',desc:'+7% peluang serangan kritikal',max:3,base:35},
 {id:'regen',ic:'🌿',name:'Regenerasi',desc:'Memulihkan HP perlahan saat bertualang',max:3,base:35}
];
function skillCost(s,l){return s.base+l*s.base;}

var QUESTS=[
 {giver:'ilra',type:'kill',target:'slime',n:5,title:'Lendir di hutan',desc:'Kalahkan 5 slime di Hutan Bisikan, lalu kembali ke Penyihir Ilra.',coin:30,xp:40,pot:1,
  offer:'Slime dari retakan mulai memenuhi Hutan Bisikan di timur desa. Tunjukkan padaku kau cukup kuat, Perantau.',
  done:'Bagus. Pemburu Toran di hutan butuh bantuan. Temui dia, dia tahu lebih banyak tentang retakan.'},
 {giver:'toran',type:'kill',target:'wolf',n:4,title:'Taring di kegelapan',desc:'Kalahkan 4 serigala, lalu lapor ke Pemburu Toran.',coin:45,xp:70,pot:2,
  offer:'Serigala di sini dulu jinak. Sejak Vaelgorn bangun, mata mereka menyala merah. Bantu aku mengurangi jumlah mereka.',
  done:'Kau petarung sungguhan. Ada suara aneh dari Reruntuhan Kastil di ujung hutan. Seorang penyihir bernama Maren tinggal di sana.'},
 {giver:'toran',type:'talk',target:'maren',title:'Suara dari reruntuhan',desc:'Temui Penyihir Maren di Reruntuhan Kastil (butuh Lv 4).',coin:25,xp:50,
  done:'Kau yang dikirim Toran? Syukurlah. Aku salah satu dari lima Penjaga, dan kekuatanku hampir habis.'},
 {giver:'maren',type:'kill',target:'skeleton',n:6,title:'Tulang yang bangkit',desc:'Kalahkan 6 tengkorak di Reruntuhan Kastil.',coin:80,xp:160,pot:2,
  offer:'Sihir naga membangkitkan prajurit kastil yang sudah lama mati. Tidurkan mereka kembali.',
  done:'Mereka tenang sekarang. Penjaga berikutnya, Sael, bersembunyi di Gua Kristal. Pergilah saat kau siap.'},
 {giver:'maren',type:'talk',target:'sael',title:'Cahaya di bawah tanah',desc:'Temui Penyihir Sael di Gua Kristal (butuh Lv 7).',coin:40,xp:100,
  done:'Maren masih hidup? Kabar terbaik yang kudengar sejak retakan muncul.'},
 {giver:'sael',type:'kill',target:'golem',n:3,title:'Jantung kristal',desc:'Kalahkan 3 golem kristal di Gua Kristal.',coin:140,xp:320,pot:3,
  offer:'Golem kristal menyerap cahaya gua untuk Vaelgorn. Hancurkan mereka sebelum naga itu jadi terlalu kuat.',
  done:'Sarang Vaelgorn kini melemah. Masuklah lewat gerbang timur gua. Dan ajak Perantau lain, naga itu tak bisa dikalahkan sendirian dengan mudah.'},
 {giver:'sael',type:'kill',target:'dragon',n:1,title:'Sang naga purba',desc:'Kalahkan Vaelgorn di sarangnya (butuh Lv 10), lalu kembali ke Sael.',coin:600,xp:1200,pot:5,
  offer:'Ini saatnya. Vaelgorn menunggu di sarangnya. Hindari lingkaran merah saat dia menyemburkan api.',
  done:'Kau melakukannya. Elyndor mulai pulih berkat kau dan para Perantau lain. Namamu akan dikenang, Pahlawan.'}
];

var LORE={
 ilra:[{q:'Apa itu Elyndor?',a:'Dunia yang dulu utuh, dijaga lima Penyihir Penjaga. Kini terpecah menjadi wilayah-wilayah yang dipisah gerbang sihir.'},
       {q:'Siapa Vaelgorn?',a:'Naga purba yang tidur di bawah gunung selama seribu tahun. Saat bangun, napasnya meretakkan dunia.'},
       {q:'Bagaimana aku jadi lebih kuat?',a:'Kalahkan monster untuk koin dan pengalaman. Tukar koin dengan skill di buku skill-mu. Dan jangan lupa beli ramuan dari Bram.'}],
 bram:[],
 toran:[{q:'Sudah lama berburu di sini?',a:'Dua puluh tahun. Belum pernah hutan ini sesunyi dan seseram sekarang.'},
        {q:'Tips melawan serigala?',a:'Mereka cepat. Serang saat mereka menerjang, lalu mundur. Ramuan bisa menyelamatkan nyawamu.'}],
 maren:[{q:'Apa yang terjadi pada kastil ini?',a:'Dulu istana raja Elyndor. Saat retakan muncul, tanahnya amblas dan para penjaganya tak pernah benar-benar pergi.'},
        {q:'Di mana Penjaga lainnya?',a:'Sael di Gua Kristal. Dua lainnya... aku belum bisa merasakan mereka. Mungkin di wilayah yang belum terbuka.'}],
 sael:[{q:'Kenapa gua ini bercahaya?',a:'Kristal di sini menyimpan sihir tua. Vaelgorn menginginkannya untuk memulihkan kekuatannya.'},
       {q:'Bagaimana mengalahkan naga?',a:'Bersama-sama. Dan perhatikan tanah: saat muncul lingkaran merah, menjauhlah sebelum api jatuh.'}]
};

var SQUESTS=[
 {target:'tuyul',n:6,title:'Tuyul pencuri',desc:'Kalahkan 6 tuyul di Desa Angker, lalu lapor ke Mbah Darmo.',coin:90,xp:140,pot:2,
  offer:'Nak, sejak retakan muncul, tuyul-tuyul dari kuburan mencuri uang warga. Kalau kau kena pukul mereka, koinmu diambil. Kalahkan mereka dan koinmu kembali.',
  done:'Bagus. Tuyul memang licik, tapi kau lebih cepat. Warga desa berterima kasih padamu.'},
 {target:'pocong',n:5,title:'Pocong yang tersesat',desc:'Kalahkan 5 pocong, lalu lapor ke Mbah Darmo.',coin:130,xp:220,pot:2,
  offer:'Ada arwah yang belum tenang. Tali kafannya belum dilepas, jadi ia melompat-lompat mencari jalan pulang. Bantu mereka beristirahat.',
  done:'Semoga arwah mereka tenang sekarang. Tapi malam ini masih ada tawa melengking dari atas pohon...'},
 {target:'kuntilanak',n:4,title:'Tawa di tengah malam',desc:'Kalahkan 4 kuntilanak, lalu lapor ke Mbah Darmo.',coin:180,xp:300,pot:3,
  offer:'Kalau kau mencium wangi melati lalu mendengar tawa melengking, itu kuntilanak. Mereka melayang dan menjerit. Hindari lingkaran di tanah saat ia meraung.',
  done:'Kau berani sekali. Sekarang tinggal penunggu beringin tua. Bersiaplah, ia kuat.'},
 {target:'genderuwo',n:2,title:'Penunggu beringin',desc:'Kalahkan 2 genderuwo (disarankan Lv 8+), lalu lapor ke Mbah Darmo.',coin:320,xp:520,pot:4,
  offer:'Genderuwo penunggu beringin tua sudah terlalu lama mengganggu desa ini. Kalahkan dua yang terbesar. Ajak Perantau lain kalau perlu.',
  done:'Desa ini akhirnya bisa tidur nyenyak. Terima kasih, Pahlawan. Desa Angker tak lagi terlalu angker.'}
];
LORE.darmo=[
 {q:'Apa itu tuyul?',a:'Makhluk kecil botak bertelinga lebar yang suka mencuri uang. Dalam cerita orang tua kami, ia dipelihara lewat pesugihan. Di sini mereka liar dan usil.'},
 {q:'Kenapa pocong melompat-lompat?',a:'Konon arwah yang tali kafannya belum dilepas. Tubuhnya terbungkus kain putih, jadi ia hanya bisa melompat. Jangan biarkan ia mendekat terlalu dekat.'},
 {q:'Bagaimana dengan kuntilanak?',a:'Perempuan berambut panjang berbaju putih. Ia melayang dan tertawa melengking. Bila tawanya terdengar dekat, artinya ia sedang jauh, dan sebaliknya.'},
 {q:'Siapa genderuwo?',a:'Makhluk besar berbulu hitam bermata merah. Ia gemar menghuni pohon beringin tua dan rumah kosong. Tubuhnya kuat, jadi jangan sendirian.'}
];
/* ===================== STATE ===================== */
var P=null, db=null, room=null, myRef=null, offline=false;
var cv=$('cv'), ctx=cv.getContext('2d'), W=0, H=0, DPR=1;
/* ===== Layar selalu mendatar: kalau HP terkunci tegak, seluruh game diputar 90 derajat ===== */
var LAND={forced:false,flip:false}, HOLDCLR=[];
try{ LAND.flip=localStorage.getItem('elyndor_flip')==='1'; }catch(e){}
function vsize(){ var vv=window.visualViewport; if(vv) return {w:vv.width,h:vv.height}; var de=document.documentElement; return {w:window.innerWidth||de.clientWidth, h:window.innerHeight||de.clientHeight}; }
function isPortraitScreen(){
  try{ var t=screen.orientation&&screen.orientation.type; if(t) return t.indexOf('portrait')===0; }catch(e){}
  if(typeof window.orientation==='number') return Math.abs(window.orientation)!==90;
  var v=vsize(); return v.h>v.w;
}
function applyLayout(){
  var app=$('app'); if(!app) return; var v=vsize();
  var vv=window.visualViewport;
  app.style.left=(vv?vv.offsetLeft:0)+'px'; app.style.top=(vv?vv.offsetTop:0)+'px';
  var lg=$('login'), inLogin=!!(lg&&lg.style.display!=='none');
  var forced=isPortraitScreen() && v.w<=v.h*1.25 && !inLogin;
  LAND.forced=forced; document.body.classList.toggle('lsforce',forced);
  if(forced){
    app.style.width=v.h+'px'; app.style.height=v.w+'px';
    app.style.transform=LAND.flip?('translateY('+v.h+'px) rotate(-90deg)'):('translateX('+v.w+'px) rotate(90deg)');
  } else { app.style.width=v.w+'px'; app.style.height=v.h+'px'; app.style.transform='none'; }
}
function toLocal(cx,cy){
  if(!LAND.forced){ var r=cv.getBoundingClientRect(); return {x:cx-r.left,y:cy-r.top}; }
  var v=vsize();
  return LAND.flip?{x:v.h-cy,y:cx}:{x:cy,y:v.w-cx};
}
function onViewChange(){ applyLayout(); if($('game').style.display==='block') resize(); }
try{ $('app').appendChild($('errBox')); }catch(e){}
applyLayout();
document.addEventListener('focusin',function(e){ var t=e.target; if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA')) setTimeout(onViewChange,0); });
document.addEventListener('focusout',function(){ setTimeout(onViewChange,200); });
try{ new MutationObserver(function(){ onViewChange(); }).observe($('login'),{attributes:true,attributeFilter:['style']}); }catch(e){}
window.addEventListener('resize',onViewChange);
window.addEventListener('orientationchange',function(){ setTimeout(onViewChange,150); setTimeout(onViewChange,600); });
try{ if(screen.orientation&&screen.orientation.addEventListener) screen.orientation.addEventListener('change',function(){ setTimeout(onViewChange,100); }); }catch(e){}
try{ if(window.visualViewport){ window.visualViewport.addEventListener('resize',onViewChange); window.visualViewport.addEventListener('scroll',onViewChange); } }catch(e){}
var cam={x:0,y:0}, zone=null, zoneId='village';
var monsters={}, particles=[], floaters=[], hazards=[], peers={}, bots={};
var input={jx:0,jy:0,keys:{}}, joy=null;
var atkCd=0, fireCd=0, potCd=0, hurtT=0, invT=0, atkT=0, atkCount=0, walkT=0, portalCd=0, regenAcc=0;
var sheetOpen=false, lastT=0, hudT=0, presT=0, lastPres='', saveT=0, dirty=false, saving=false, saveAgain=false;
var emoteT=0, dragonSkillT=6, bossDefeatedToast=false;
var fx=[], ground=[], projs=[], ghosts=[], timers=[], cds={}, readyFlag={};
var combo=0, comboT=0, atkKind=0, skillSeq=0, lastSkill=null, shakeT=0, shakeD=1, shakeM=0;
var pvpSeq=0, lastPvp=null;

function stats(){
  var s=P.skills, L=P.level;
  return {
    atk:10+(L-1)*3+(s.str||0)*4,
    maxHp:60+(L-1)*14+(s.vit||0)*25,
    spd:2.6*(1+0.08*(s.agi||0)),
    crit:0.05+0.07*(s.crit||0),
    regen:(s.regen||0)*0.9
  };
}
function xpNeed(L){return Math.round(30*Math.pow(L,1.45));}

/* ===================== AUDIO (Web Audio, tanpa file suara) ===================== */
var AUD={ctx:null,master:null,music:null,sfxG:null,an:null,noise:null,verbIn:null,muted:false,vm:0.75,vs:0.9,zone:null,bus:null,pending:null,last:{}};
try{ AUD.muted=localStorage.getItem('elyndor_mute')==='1'; var _vm=parseFloat(localStorage.getItem('elyndor_vm')), _vs=parseFloat(localStorage.getItem('elyndor_vs')); if(isFinite(_vm)) AUD.vm=clamp(_vm,0,1); if(isFinite(_vs)) AUD.vs=clamp(_vs,0,1); }catch(e){}
function midi(n){ return 440*Math.pow(2,(n-69)/12); }
function audInit(){
  try{
    if(AUD.ctx){ if(AUD.ctx.state==='suspended') AUD.ctx.resume(); return; }
    var C=window.AudioContext||window.webkitAudioContext; if(!C) return;
    var c=new C(); AUD.ctx=c;
    var comp=c.createDynamicsCompressor(); comp.threshold.value=-16; comp.ratio.value=4; comp.attack.value=0.005; comp.release.value=0.2;
    AUD.master=c.createGain(); AUD.master.gain.value=AUD.muted?0:0.85;
    AUD.music=c.createGain(); AUD.music.gain.value=0.8*AUD.vm;
    AUD.sfxG=c.createGain(); AUD.sfxG.gain.value=1.0*AUD.vs;
    AUD.an=c.createAnalyser(); AUD.an.fftSize=1024;
    AUD.music.connect(AUD.master); AUD.sfxG.connect(AUD.master);
    AUD.master.connect(comp); comp.connect(AUD.an); comp.connect(c.destination);
    var vin=c.createGain(), dl=c.createDelay(1), fb=c.createGain(), lp=c.createBiquadFilter(), wet=c.createGain();
    dl.delayTime.value=0.29; fb.gain.value=0.4; lp.type='lowpass'; lp.frequency.value=2400; wet.gain.value=0.5;
    vin.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(wet); wet.connect(AUD.master);
    AUD.verbIn=vin;
    var len=c.sampleRate*2, buf=c.createBuffer(1,len,c.sampleRate), d=buf.getChannelData(0);
    for(var i=0;i<len;i++) d[i]=Math.random()*2-1;
    AUD.noise=buf;
    if(c.state==='suspended') c.resume();
    if(AUD.pending){ var z=AUD.pending; AUD.zone=null; audZone(z); }
  }catch(e){ AUD.ctx=null; }
}
function audSetMuted(m){
  AUD.muted=!!m; try{ localStorage.setItem('elyndor_mute',m?'1':'0'); }catch(e){}
  if(AUD.ctx&&AUD.master){ var n=AUD.ctx.currentTime; AUD.master.gain.cancelScheduledValues(n); AUD.master.gain.setTargetAtTime(m?0:0.85,n,0.05); }
  var b=document.getElementById('mSndI'); if(b) b.textContent=m?'🔇':'🔊';
  if(!m) audInit();
}
function audSetVol(kind,v){
  v=clamp(+v||0,0,1);
  if(kind==='m'){ AUD.vm=v; try{localStorage.setItem('elyndor_vm',String(v));}catch(e){} if(AUD.music) AUD.music.gain.setTargetAtTime(0.8*v,AUD.ctx.currentTime,0.03); }
  else { AUD.vs=v; try{localStorage.setItem('elyndor_vs',String(v));}catch(e){} if(AUD.sfxG) AUD.sfxG.gain.setTargetAtTime(1.0*v,AUD.ctx.currentTime,0.03); }
}
function aTone(dest,f,t,dur,type,vol,o){
  o=o||{}; var c=AUD.ctx, a=o.a||0.01; if(dur<=a+0.02) dur=a+0.03;
  var osc=c.createOscillator(), g=c.createGain();
  osc.type=type||'sine'; osc.frequency.setValueAtTime(f,t);
  if(o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(1,o.to),t+dur);
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(vol,t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  osc.connect(g); g.connect(dest);
  if(o.send){ var s=c.createGain(); s.gain.value=o.send; g.connect(s); s.connect(AUD.verbIn); }
  if(o.vib){ var l=c.createOscillator(), lg=c.createGain(); l.frequency.value=o.vib; lg.gain.value=f*0.012; l.connect(lg); lg.connect(osc.frequency); l.start(t); l.stop(t+dur+0.05); }
  osc.start(t); osc.stop(t+dur+0.05);
}
function aNoise(dest,t,dur,vol,ftype,f0,f1,q,a){
  var c=AUD.ctx, src=c.createBufferSource(); src.buffer=AUD.noise; src.loop=true;
  var flt=c.createBiquadFilter(); flt.type=ftype||'lowpass'; flt.frequency.setValueAtTime(f0,t); if(f1) flt.frequency.exponentialRampToValueAtTime(f1,t+dur); flt.Q.value=q||0.7;
  var g=c.createGain(); a=a||0.005; if(dur<=a+0.02) dur=a+0.03;
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(vol,t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  src.connect(flt); flt.connect(g); g.connect(dest); src.start(t,Math.random()*1.5); src.stop(t+dur+0.05);
}
function aLoopNoise(dest,vol,ftype,f,q,lfoRate,lfoDepth){
  var c=AUD.ctx, src=c.createBufferSource(); src.buffer=AUD.noise; src.loop=true;
  var flt=c.createBiquadFilter(); flt.type=ftype; flt.frequency.value=f; flt.Q.value=q||0.7;
  var g=c.createGain(); g.gain.value=vol; src.connect(flt); flt.connect(g); g.connect(dest);
  var l=null; if(lfoRate){ l=c.createOscillator(); var lg=c.createGain(); l.frequency.value=lfoRate; lg.gain.value=lfoDepth; l.connect(lg); lg.connect(flt.frequency); l.start(); }
  src.start();
  return function(){ try{src.stop();}catch(e){} if(l){try{l.stop();}catch(e){}} };
}
function aDrone(dest,fs,vol,cut,type,lfoRate){
  var c=AUD.ctx, g=c.createGain(); g.gain.value=vol; var f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.value=cut; f.connect(g); g.connect(dest);
  var os=fs.map(function(fr){ var o=c.createOscillator(); o.type=type||'sawtooth'; o.frequency.value=fr; o.connect(f); o.start(); return o; });
  var l=null; if(lfoRate){ l=c.createOscillator(); var lg=c.createGain(); l.frequency.value=lfoRate; lg.gain.value=cut*0.35; l.connect(lg); lg.connect(f.frequency); l.start(); }
  return function(){ os.forEach(function(o){try{o.stop();}catch(e){}}); if(l){try{l.stop();}catch(e){}} };
}
function aBird(g,t){ var n=2+Math.floor(Math.random()*3), f=2400+Math.random()*1600; for(var k=0;k<n;k++) aTone(g,f,t+k*0.11,0.09,'sine',0.03,{to:f*1.35}); }
function aBellF(g,t,f,v){ aTone(g,f,t,3,'sine',0.06*v,{send:0.7}); aTone(g,f*2.76,t,1.6,'sine',0.025*v,{send:0.7}); aTone(g,f*5.4,t,0.8,'sine',0.012*v); }
function aBell(g,t,n,v){ aBellF(g,t,midi(n),v); }
function aKick(g,t,v){ aTone(g,95,t,0.3,'sine',v,{to:38,a:0.004}); aNoise(g,t,0.05,v*0.35,'lowpass',900,300); }
function pickWalk(b,max,step){ b.mi=clamp(b.mi+Math.floor(Math.random()*(step*2+1))-step,0,max); return b.mi; }

var ZMUS={
 village:{bpm:92,sc:[60,62,64,67,69,72,74,76],ch:[[48,55,60,64],[53,57,60,65],[55,59,62,67],[57,60,64,69]],
  start:function(b){ b.stops.push(aLoopNoise(b.g,0.018,'bandpass',600,0.6,0.1,150)); b.mi=3; },
  step:function(b,i,t){ var g=b.g;
    if(i%8===0){ this.ch[(i/8)%4].forEach(function(n,k){ aTone(g,midi(n),t,3.4,k===0?'sine':'triangle',k===0?0.10:0.045,{a:0.35,send:0.25}); }); }
    if(i%2===0 && Math.random()<0.62){ var n=this.sc[pickWalk(b,7,2)]; aTone(g,midi(n),t,0.55,'triangle',0.085,{send:0.4}); if(Math.random()<0.15) aTone(g,midi(n+12),t+0.25,0.4,'sine',0.04,{send:0.4}); }
    if(Math.random()<0.05) aBird(g,t); }},
 forest:{bpm:64,sc:[62,65,67,69,72,74,77,79],ch:[[38,45,50,53],[34,41,46,50],[36,43,48,52],[38,45,50,57]],
  start:function(b){ b.stops.push(aLoopNoise(b.g,0.05,'bandpass',420,0.9,0.11,180)); b.stops.push(aLoopNoise(b.g,0.012,'highpass',3200,0.5,0.3,800)); b.mi=3; },
  step:function(b,i,t){ var g=b.g;
    if(i%16===0){ this.ch[(i/16)%4].forEach(function(n){ aTone(g,midi(n),t,7,'sine',0.065,{a:0.9,send:0.3}); }); }
    if(i%4===0 && Math.random()<0.42){ var n=this.sc[pickWalk(b,7,2)]; aTone(g,midi(n),t,1.5,'sine',0.075,{a:0.09,vib:5,send:0.55}); }
    if(Math.random()<0.1){ var k,c=3+Math.floor(Math.random()*3); for(k=0;k<c;k++) aTone(g,4300,t+k*0.055,0.035,'sine',0.014); }
    if(Math.random()<0.012){ aTone(g,340,t,0.5,'sine',0.06,{to:300,a:0.05,send:0.6}); aTone(g,300,t+0.6,0.8,'sine',0.06,{to:250,a:0.05,send:0.6}); } }},
 castle:{bpm:56,sc:[57,60,62,64,65,69,71,72],
  start:function(b){ b.stops.push(aDrone(b.g,[55,55.6,110.2],0.05,260,'sawtooth',0.05)); b.stops.push(aLoopNoise(b.g,0.06,'bandpass',700,4,0.07,350)); },
  step:function(b,i,t){ var g=b.g;
    if(i%4===0 && Math.random()<0.24) aBell(g,t,this.sc[Math.floor(Math.random()*8)],1);
    if(i%32===0){ [45,52,57,60].forEach(function(n){ aTone(g,midi(n),t,6,'sine',0.04,{a:1.5,send:0.6}); }); } }},
 cave:{bpm:54,
  start:function(b){ b.stops.push(aDrone(b.g,[55,55.7],0.07,200,'sine')); b.stops.push(aLoopNoise(b.g,0.045,'lowpass',160,0.7,0.08,60)); },
  step:function(b,i,t){ var g=b.g;
    if(Math.random()<0.16){ var f=1000+Math.random()*900; aTone(g,f,t,0.14,'sine',0.06,{to:f*0.55,send:0.9}); }
    if(i%2===0 && Math.random()<0.11){ var n=[84,86,88,90,92,94][Math.floor(Math.random()*6)]; aTone(g,midi(n),t,2.4,'sine',0.035,{send:0.85}); aTone(g,midi(n)*2.01,t,1.2,'sine',0.012,{send:0.85}); } }},
 lair:{bpm:72,
  start:function(b){ b.stops.push(aDrone(b.g,[41.2,43.1],0.07,180,'sawtooth',0.15)); b.stops.push(aLoopNoise(b.g,0.08,'lowpass',120,0.7,0.2,60)); },
  step:function(b,i,t){ var g=b.g;
    if(i%4===0) aKick(g,t,0.3); if(i%8===4) aKick(g,t,0.18);
    if(i%16===12 && Math.random()<0.5){ [58,59,70].forEach(function(n){ aTone(g,midi(n),t,1.6,'triangle',0.035,{a:0.2,send:0.5}); }); }
    if(Math.random()<0.1){ aNoise(g,t,0.12,0.09,'lowpass',600,200); aTone(g,200,t,0.12,'sine',0.07,{to:80}); }
    if(Math.random()<0.012){ aNoise(g,t,1.6,0.14,'lowpass',420,90,0.7,0.2); aTone(g,70,t,1.6,'sawtooth',0.08,{to:38,a:0.15}); } }},
 ghost:{bpm:58,
  start:function(b){ b.stops.push(aDrone(b.g,[73.4,110.1],0.06,220,'sine',0.06)); b.stops.push(aLoopNoise(b.g,0.05,'bandpass',500,1.2,0.09,220)); b.stops.push(aLoopNoise(b.g,0.014,'highpass',3400,0.5,0.35,900)); },
  step:function(b,i,t){ var g=b.g, sl=function(k){ return 293.66*Math.pow(2,k/5); };
    if(i%32===0){ aTone(g,73.4,t,6,'sine',0.16,{send:0.6}); aTone(g,146.8,t,4,'sine',0.05,{send:0.6}); }
    if(i%8===0 && Math.random()<0.7){ aBellF(g,t,sl(Math.floor(Math.random()*10)-3),0.8); }
    if(i%4===2 && Math.random()<0.25){ aTone(g,sl(Math.floor(Math.random()*6)),t,1.4,'triangle',0.04,{a:0.02,send:0.7}); }
    if(Math.random()<0.015){ for(var k=0;k<3;k++) aTone(g,520,t+k*0.18,0.09,'triangle',0.08,{to:430}); }
    if(Math.random()<0.02){ aTone(g,300,t,0.5,'sine',0.05,{to:250,a:0.05,send:0.6}); aTone(g,280,t+0.7,0.9,'sine',0.05,{to:220,a:0.05,send:0.6}); }
    if(Math.random()<0.09){ var c2=3+Math.floor(Math.random()*3); for(var q2=0;q2<c2;q2++) aTone(g,4100,t+q2*0.06,0.035,'sine',0.012); }
    if(Math.random()<0.014){ var f0=560+Math.random()*120; aTone(g,f0,t,2.4,'sine',0.045,{to:f0*1.6,a:0.7,vib:6,send:0.9}); } }}
};

function audZone(id){
  AUD.pending=id;
  if(!AUD.ctx||!ZMUS[id]) return;
  if(AUD.zone===id) return;
  AUD.zone=id;
  var c=AUD.ctx, now=c.currentTime;
  if(AUD.bus){ var old=AUD.bus; try{ old.g.gain.cancelScheduledValues(now); old.g.gain.setValueAtTime(old.g.gain.value,now); old.g.gain.linearRampToValueAtTime(0,now+1.2); }catch(e){}
    clearInterval(old.timer); setTimeout(function(){ old.stops.forEach(function(f){f();}); try{old.g.disconnect();}catch(e){} },1500); }
  var bus={g:c.createGain(),stops:[],timer:null,step:0,next:now+0.15,mi:0};
  bus.g.gain.setValueAtTime(0.0001,now); bus.g.gain.linearRampToValueAtTime(1,now+1.6); bus.g.connect(AUD.music);
  AUD.bus=bus; var cfg=ZMUS[id];
  try{ cfg.start(bus); }catch(e){}
  bus.timer=setInterval(function(){
    try{
      var cc=AUD.ctx; if(!cc||cc.state!=='running'||AUD.bus!==bus) return;
      var now2=cc.currentTime; if(bus.next<now2-0.4) bus.next=now2;
      var dur=60/cfg.bpm/2;
      while(bus.next<now2+0.3){ if(!AUD.muted) cfg.step(bus,bus.step,bus.next); bus.next+=dur; bus.step++; }
    }catch(e){}
  },90);
}

var SFXGAP={hit:0.045,coin:0.06,growl:0.8,kill:0.05,giggle:0.7,moan:0.8,wail:0.9,growl2:0.9};
var SFX={
 swing0:function(t,v){ aNoise(AUD.sfxG,t,0.13,0.22*v,'bandpass',900,2600,1.2); },
 swing1:function(t,v){ aNoise(AUD.sfxG,t,0.13,0.22*v,'bandpass',2600,900,1.2); },
 swing2:function(t,v){ aNoise(AUD.sfxG,t,0.22,0.3*v,'bandpass',500,2200,1.0); aTone(AUD.sfxG,180,t,0.2,'sine',0.14*v,{to:70}); },
 hit:function(t,v){ aNoise(AUD.sfxG,t,0.08,0.3*v,'lowpass',2500,300); aTone(AUD.sfxG,160,t,0.12,'sine',0.3*v,{to:50}); },
 crit:function(t,v){ SFX.hit(t,v); aTone(AUD.sfxG,1400,t,0.18,'triangle',0.12*v,{to:2100,send:0.3}); },
 kill:function(t,v){ aTone(AUD.sfxG,420,t,0.35,'triangle',0.16*v,{to:110}); aNoise(AUD.sfxG,t,0.2,0.12*v,'lowpass',1800,200); },
 coin:function(t,v){ aTone(AUD.sfxG,988,t,0.12,'triangle',0.12*v); aTone(AUD.sfxG,1319,t+0.07,0.3,'triangle',0.12*v,{send:0.3}); },
 levelup:function(t,v){ [523,659,784,1047].forEach(function(f,i){ aTone(AUD.sfxG,f,t+i*0.09,0.5,'triangle',0.16*v,{send:0.4}); }); aTone(AUD.sfxG,2093,t+0.4,0.8,'sine',0.06*v,{send:0.6}); },
 hurt:function(t,v){ aTone(AUD.sfxG,120,t,0.18,'sine',0.3*v,{to:50}); aNoise(AUD.sfxG,t,0.12,0.16*v,'lowpass',900,200); },
 die:function(t,v){ aTone(AUD.sfxG,300,t,0.9,'sawtooth',0.14*v,{to:60,a:0.02}); aNoise(AUD.sfxG,t,0.8,0.1*v,'lowpass',800,100); },
 potion:function(t,v){ [0,0.09,0.18].forEach(function(o){ aTone(AUD.sfxG,400,t+o,0.09,'sine',0.15*v,{to:700}); }); },
 chest:function(t,v){ [659,831,988,1319].forEach(function(f,i){ aTone(AUD.sfxG,f,t+i*0.07,0.4,'triangle',0.13*v,{send:0.4}); }); },
 portal:function(t,v){ aNoise(AUD.sfxG,t,0.65,0.2*v,'bandpass',300,2500,1.5,0.1); aTone(AUD.sfxG,300,t,0.65,'sine',0.14*v,{to:900,a:0.1,send:0.5}); },
 quest:function(t,v){ aTone(AUD.sfxG,523,t,0.25,'triangle',0.14*v,{send:0.3}); aTone(AUD.sfxG,784,t+0.12,0.4,'triangle',0.14*v,{send:0.3}); },
 questdone:function(t,v){ [523,659,784,1047,1319].forEach(function(f,i){ aTone(AUD.sfxG,f,t+i*0.09,0.5,'triangle',0.14*v,{send:0.4}); }); },
 ui:function(t,v){ aTone(AUD.sfxG,700,t,0.05,'sine',0.1*v); },
 growl:function(t,v){ aTone(AUD.sfxG,90,t,0.28,'sawtooth',0.09*v,{to:60,a:0.03}); aNoise(AUD.sfxG,t,0.25,0.06*v,'lowpass',300,120); },
 boom:function(t,v){ aTone(AUD.sfxG,110,t,0.55,'sine',0.35*v,{to:40,a:0.004}); aNoise(AUD.sfxG,t,0.5,0.35*v,'lowpass',1200,100); },
 sk_fire:function(t,v){ aNoise(AUD.sfxG,t,0.5,0.3*v,'lowpass',1800,400,0.7,0.03); aTone(AUD.sfxG,200,t,0.4,'sawtooth',0.12*v,{to:90}); },
 sk_water:function(t,v){ for(var i=0;i<6;i++){ var f=300+Math.random()*600; aTone(AUD.sfxG,f,t+i*0.04,0.12,'sine',0.1*v,{to:f*1.6}); } aNoise(AUD.sfxG,t,0.5,0.22*v,'bandpass',600,1500,1.0,0.05); },
 sk_wind:function(t,v){ aNoise(AUD.sfxG,t,0.35,0.3*v,'bandpass',400,1800,2,0.05); aNoise(AUD.sfxG,t+0.3,0.4,0.25*v,'bandpass',1800,300,2,0.05); },
 sk_earth:function(t,v){ for(var i=0;i<5;i++){ aTone(AUD.sfxG,90,t+i*0.06,0.18,'sine',0.3*v,{to:40,a:0.004}); aNoise(AUD.sfxG,t+i*0.06,0.12,0.22*v,'lowpass',500,150); } },
 sk_spin:function(t,v){ aNoise(AUD.sfxG,t,0.25,0.28*v,'bandpass',800,2400,1.2); aNoise(AUD.sfxG,t+0.24,0.25,0.28*v,'bandpass',800,2400,1.2); },
 sk_dash:function(t,v){ aNoise(AUD.sfxG,t,0.22,0.3*v,'highpass',600,3000,0.8); aTone(AUD.sfxG,500,t,0.2,'sine',0.08*v,{to:1400}); },
 sk_shield:function(t,v){ [784,988,1175,1568].forEach(function(f,i){ aTone(AUD.sfxG,f,t+i*0.05,1.2,'triangle',0.07*v,{a:0.05,send:0.6}); }); aNoise(AUD.sfxG,t,0.5,0.1*v,'bandpass',800,3000,1.5,0.05); },
 sk_bolt:function(t,v){ aNoise(AUD.sfxG,t,0.1,0.35*v,'highpass',2000,4000); for(var i=0;i<4;i++) aNoise(AUD.sfxG,t+0.03+i*0.05,0.04,0.2*v,'highpass',1800,3500);
   aTone(AUD.sfxG,1500,t,0.25,'sawtooth',0.1*v,{to:100}); aNoise(AUD.sfxG,t+0.1,0.8,0.28*v,'lowpass',300,60,0.7,0.05); },
 sk_meteor:function(t,v){ aNoise(AUD.sfxG,t,0.95,0.2*v,'bandpass',200,1600,1.0,0.5);
   aTone(AUD.sfxG,120,t+0.95,1.0,'sine',0.5*v,{to:30,a:0.004}); aNoise(AUD.sfxG,t+0.95,1.2,0.5*v,'lowpass',900,80,0.7,0.005); },
 giggle:function(t,v){ [0,0.08,0.16,0.24].forEach(function(o,i){ aTone(AUD.sfxG,900+i*90,t+o,0.07,'triangle',0.08*v,{to:1300}); }); },
 moan:function(t,v){ aTone(AUD.sfxG,220,t,0.8,'sine',0.09*v,{to:170,a:0.12,vib:4,send:0.5}); },
 wail:function(t,v){ aTone(AUD.sfxG,700,t,1.0,'sine',0.1*v,{to:1100,a:0.15,vib:7,send:0.7}); aNoise(AUD.sfxG,t,0.8,0.04*v,'bandpass',1500,900,2,0.2); },
 growl2:function(t,v){ aTone(AUD.sfxG,62,t,0.55,'sawtooth',0.13*v,{to:40,a:0.05}); aNoise(AUD.sfxG,t,0.5,0.09*v,'lowpass',250,90); }
};
function sfx(name,vol){
  if(!AUD.ctx||AUD.muted||AUD.ctx.state!=='running') return;
  try{ var f=SFX[name]; if(!f) return; var t=AUD.ctx.currentTime+0.005, gap=SFXGAP[name];
    if(gap){ if(t-(AUD.last[name]||0)<gap) return; AUD.last[name]=t; }
    f(t,vol==null?1:vol); }catch(e){}
}
function monAggro(m,d){
  var v=clamp(1-d/520,0.2,1), n={tuyul:'giggle',pocong:'moan',kuntilanak:'wail',genderuwo:'growl2',dragon:'growl2',golem:'growl2',wolf:'growl',skeleton:'growl',spider:'growl',ent:'growl2',boneking:'growl2',crystalking:'growl2',banaspati:'wail'}[m.type];
  if(n) sfx(n,v);
}
document.addEventListener('visibilitychange',function(){ try{ if(!AUD.ctx) return; if(document.hidden) AUD.ctx.suspend(); else AUD.ctx.resume(); }catch(e){} });
['pointerup','touchend','click','keydown'].forEach(function(ev){ document.addEventListener(ev,function(){ audInit(); },{passive:true}); });


/* ===================== ZONE BUILD ===================== */
function buildZone(id){
  var z=ZONES[id]; if(z.built) return z;
  var r=rng(id.charCodeAt(0)*7919+z.w), deco=[];
  function blocked(x,y,rad){
    var i; for(i=0;i<z.portals.length;i++) if(dist(x,y,z.portals[i].x,z.portals[i].y)<130) return true;
    for(i=0;i<z.npcs.length;i++) if(dist(x,y,z.npcs[i].x,z.npcs[i].y)<100) return true;
    for(i=0;i<z.chests.length;i++) if(dist(x,y,z.chests[i].x,z.chests[i].y)<70) return true;
    if(dist(x,y,z.start.x,z.start.y)<120) return true;
    for(i=0;i<z.spawns.length;i++) if(z.spawns[i].x && dist(x,y,z.spawns[i].x,z.spawns[i].y)<260) return true;
    for(i=0;i<deco.length;i++) if(dist(x,y,deco[i].x,deco[i].y)<rad) return true;
    return false;
  }
  function add(t,x,y,s,col){deco.push({t:t,x:x,y:y,s:s||1,col:col||0,v:r()});}
  function scatter(t,n,rad,col){var tries=0;while(n>0&&tries<n*60){tries++;var x=90+r()*(z.w-180),y=90+r()*(z.h-180);if(!blocked(x,y,rad)){add(t,x,y,0.85+r()*0.4,col);n--;}}}
  var btype={village:'tree',forest:'tree',castle:'wall',cave:'rock',lair:'rock',ghost:'bamboo'}[z.kind];
  var step=btype==='wall'?62:66;
  function border(x,y){for(var i=0;i<z.portals.length;i++) if(dist(x,y,z.portals[i].x,z.portals[i].y)<100) return; add(btype,x,y,btype==='wall'?1:1.1+r()*0.3,20);}
  for(var x=20;x<=z.w;x+=step){border(x,22);border(x,z.h-18);}
  for(var y=80;y<z.h-40;y+=step){border(22,y);border(z.w-22,y);}
  if(z.kind==='village'){
    [[300,300,'#B8452E'],[930,290,'#3E6FB0'],[290,800,'#6B8E23'],[1000,820,'#8E3E8E'],[640,230,'#C47A1C']].forEach(function(h){add('house',h[0],h[1],1,h[2]);});
    add('well',760,470,1);
    scatter('tree',12,90,1); scatter('bush',14,50); scatter('fence',0,0);
  } else if(z.kind==='forest'){ scatter('tree',48,80,2); scatter('bush',16,50); scatter('rock',8,60); }
  else if(z.kind==='castle'){ scatter('pillar',20,90); scatter('rock',12,60); scatter('banner',6,120); }
  else if(z.kind==='cave'){ scatter('crystal',28,80); scatter('stalag',16,60); scatter('rock',8,60); }
  else if(z.kind==='ghost'){
    [[560,270],[1000,320],[720,1000]].forEach(function(h){add('joglo',h[0],h[1],1,0);});
    add('beringin',900,650,1.5,0); add('beringin',1330,420,1.3,0); add('beringin',420,1010,1.2,0);
    for(var gi=0;gi<16;gi++){ var gx=1080+r()*520, gy=780+r()*420; if(!blocked(gx,gy,44)) add('nisan',gx,gy,0.9+r()*0.3,0); }
    [[250,560],[390,610],[600,650],[1200,650]].forEach(function(l){add('lantern',l[0],l[1],1,0);});
    scatter('bamboo',20,80); scatter('bush',10,50); scatter('rock',6,60);
  }
  else { scatter('rock',16,90); scatter('crystal',0,0); }
  deco.forEach(function(d){
    if(d.t==='tree') d.cr=18*d.s; else if(d.t==='rock') d.cr=18*d.s; else if(d.t==='pillar') d.cr=16;
    else if(d.t==='crystal') d.cr=15*d.s; else if(d.t==='stalag') d.cr=13*d.s; else if(d.t==='well') d.cr=28;
    else if(d.t==='house'){d.rw=120;d.rh=70;} else if(d.t==='wall'){d.rw=62;d.rh=34;}
    else if(d.t==='bamboo') d.cr=14*d.s; else if(d.t==='beringin') d.cr=28*d.s; else if(d.t==='nisan') d.cr=11*d.s; else if(d.t==='lantern') d.cr=6; else if(d.t==='joglo'){d.rw=130;d.rh=64;}
  });
  z.deco=deco;
  z.bg=renderBg(z,r);
  z.built=true;
  return z;
}

function renderBg(z,r){
  var c=document.createElement('canvas'); c.width=z.w; c.height=z.h; var g=c.getContext('2d');
  g.fillStyle=z.ground; g.fillRect(0,0,z.w,z.h);
  var i;
  if(z.kind==='castle'){
    g.strokeStyle='rgba(0,0,0,.08)'; g.lineWidth=2;
    for(var ty=0;ty<z.h;ty+=48){for(var tx=(ty/48%2)*24;tx<z.w;tx+=48){g.strokeRect(tx,ty,48,48);}}
  }
  for(i=0;i<70;i++){g.fillStyle=z.ground2;g.beginPath();g.ellipse(r()*z.w,r()*z.h,30+r()*90,20+r()*50,r()*3,0,6.3);g.fill();}
  g.strokeStyle=z.path; g.lineCap='round'; g.lineJoin='round'; g.lineWidth=z.kind==='village'?64:54;
  var cx=z.w/2, cy=z.h/2;
  z.portals.forEach(function(p){g.beginPath();g.moveTo(p.x,p.y);g.quadraticCurveTo((p.x+cx)/2,(p.y+cy)/2+(r()-.5)*260,cx,cy);g.stroke();});
  z.npcs.forEach(function(n){g.beginPath();g.moveTo(n.x,n.y+10);g.lineTo(cx,cy);g.stroke();});
  if(z.kind==='village'||z.kind==='forest'||z.kind==='castle'){
    var ry=z.h*0.12, pts=[], nseg=7, riverW=z.kind==='village'?46:56;
    for(i=0;i<=nseg;i++){var t=i/nseg;pts.push([t*z.w,ry+Math.sin(t*3.4+1.1)*42+(r()-.5)*20]);}
    var riverPath=function(){g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(var k=1;k<pts.length-1;k++){var mx=(pts[k][0]+pts[k+1][0])/2,my=(pts[k][1]+pts[k+1][1])/2;g.quadraticCurveTo(pts[k][0],pts[k][1],mx,my);}g.lineTo(pts[pts.length-1][0],pts[pts.length-1][1]);};
    g.lineCap='round';g.lineJoin='round';
    g.strokeStyle='#274F63';g.lineWidth=riverW+14;riverPath();g.stroke();
    var rc={village:'#4C9BC7',forest:'#3E86AE',castle:'#4A93BE'}[z.kind];
    g.strokeStyle=rc;g.lineWidth=riverW;riverPath();g.stroke();
    g.strokeStyle='rgba(255,255,255,.28)';g.lineWidth=5;g.setLineDash([16,14]);g.lineDashOffset=8;riverPath();g.stroke();g.setLineDash([]);
    var bi=Math.floor(pts.length/2),bx=(pts[bi][0]+pts[bi+1][0])/2,by=(pts[bi][1]+pts[bi+1][1])/2;
    g.save();g.translate(bx,by);
    g.fillStyle='rgba(0,0,0,.18)';g.fillRect(-13,-riverW/2-6,26,riverW+12);
    g.fillStyle='#8B5E34';g.fillRect(-11,-riverW/2-4,22,riverW+8);
    g.fillStyle='#6b4526';for(var pl=-riverW/2;pl<=riverW/2;pl+=9)g.fillRect(-11,pl,22,4);
    g.fillStyle='#5a3a20';g.fillRect(-13,-riverW/2-6,4,riverW+12);g.fillRect(9,-riverW/2-6,4,riverW+12);
    g.restore();
  }
  if(z.kind==='village'){g.fillStyle=z.path;g.beginPath();g.arc(cx,cy,150,0,6.3);g.fill();
    g.fillStyle='rgba(120,90,40,.15)';for(i=0;i<40;i++){g.beginPath();g.arc(cx+(r()-.5)*260,cy+(r()-.5)*260,4+r()*6,0,6.3);g.fill();}}
  if(z.kind==='cave'){
    for(i=0;i<3;i++){ var px=140+r()*(z.w-280), py=140+r()*(z.h-280); if(dist(px,py,z.start.x,z.start.y)<220) continue;
      var pr=55+r()*35;
      g.fillStyle='#100A22';g.beginPath();g.ellipse(px,py,pr+10,pr*0.6+8,0,0,6.3);g.fill();
      var pg=g.createRadialGradient(px,py,4,px,py,pr); pg.addColorStop(0,'#8FEFE0'); pg.addColorStop(0.5,'#3E9CC9'); pg.addColorStop(1,'#1E3A6E');
      g.fillStyle=pg;g.beginPath();g.ellipse(px,py,pr,pr*0.6,0,0,6.3);g.fill();
      g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(px-pr*0.25,py-pr*0.2,pr*0.3,pr*0.15,0,0,6.3);g.fill();
    }
  }
  if(z.kind==='lair'){
    var ry2=z.h*0.16,lp=[],ln=7;
    for(i=0;i<=ln;i++){var t2=i/ln;lp.push([t2*z.w,ry2+Math.sin(t2*3.1+2)*36+(r()-.5)*18]);}
    var lavaPath=function(){g.beginPath();g.moveTo(lp[0][0],lp[0][1]);for(var k=1;k<lp.length-1;k++){var mx=(lp[k][0]+lp[k+1][0])/2,my=(lp[k][1]+lp[k+1][1])/2;g.quadraticCurveTo(lp[k][0],lp[k][1],mx,my);}g.lineTo(lp[lp.length-1][0],lp[lp.length-1][1]);};
    g.lineCap='round';g.lineJoin='round';
    g.strokeStyle='#2A140C';g.lineWidth=58;lavaPath();g.stroke();
    g.strokeStyle='#D8481E';g.lineWidth=46;lavaPath();g.stroke();
    g.strokeStyle='#FFB13A';g.lineWidth=10;g.setLineDash([22,18]);g.lineDashOffset=6;lavaPath();g.stroke();g.setLineDash([]);
    var lbi=Math.floor(lp.length/2),lbx=(lp[lbi][0]+lp[lbi+1][0])/2,lby=(lp[lbi][1]+lp[lbi+1][1])/2;
    g.save();g.translate(lbx,lby);
    g.fillStyle='#5A544A';g.fillRect(-14,-38,28,76);
    g.fillStyle='#726A5C';for(var sp=-32;sp<=32;sp+=11)g.fillRect(-14,sp,28,5);
    g.restore();
    for(i=0;i<9;i++){var lx=150+r()*(z.w-300),ly=100+r()*(z.h-200);if(dist(lx,ly,z.start.x,z.start.y)<200||dist(lx,ly,1050,550)<160)continue;
      var rx=40+r()*60, ry=24+r()*30;
      g.fillStyle='#3A1A12';g.beginPath();g.ellipse(lx,ly,rx+8,ry+8,0,0,6.3);g.fill();
      g.fillStyle='#F06A1E';g.beginPath();g.ellipse(lx,ly,rx,ry,0,0,6.3);g.fill();
      g.fillStyle='#FFC24A';g.beginPath();g.ellipse(lx-rx*.2,ly-ry*.2,rx*.45,ry*.35,0,0,6.3);g.fill();}
    g.strokeStyle='#EDE3CF';g.lineWidth=5;
    for(i=0;i<25;i++){var bx=r()*z.w,by=r()*z.h,a=r()*3;g.beginPath();g.moveTo(bx,by);g.lineTo(bx+Math.cos(a)*18,by+Math.sin(a)*18);g.stroke();}
  }
  if(z.kind==='ghost'){
    for(i=0;i<9;i++){ var px=100+r()*(z.w-200), py=120+r()*(z.h-240); if(dist(px,py,z.start.x,z.start.y)<220) continue; var pw=50+r()*80, ph=pw*0.45;
      g.fillStyle='#161D33'; g.beginPath(); g.ellipse(px,py,pw+8,ph+6,0,0,6.3); g.fill();
      var gr=g.createLinearGradient(px-pw,py-ph,px+pw,py+ph); gr.addColorStop(0,'#2B4A6E'); gr.addColorStop(1,'#152238'); g.fillStyle=gr; g.beginPath(); g.ellipse(px,py,pw,ph,0,0,6.3); g.fill();
      g.fillStyle='rgba(180,220,255,.25)'; g.beginPath(); g.ellipse(px-pw*.25,py-ph*.25,pw*.35,ph*.2,0,0,6.3); g.fill(); }
  }
  var tufts={ghost:['#1B2540','#2E3B62','#2E3B62','#4FC9B8'],village:['#6FA844','#F2D35B','#F08BB0','#FFFFFF'],forest:['#3F7A3C','#E9E07A','#C95FA0','#6B4A2A'],castle:['#7A7466','#8A8373','#6E8A4A'],cave:['#6E5FB8','#4FC9B0','#2A2640'],lair:['#3B1E15','#A0452A']}[z.kind];
  for(i=0;i<420;i++){
    var x=r()*z.w,y=r()*z.h,col=tufts[Math.floor(r()*tufts.length)];
    g.fillStyle=col;
    if(z.kind==='village'||z.kind==='forest'){
      if(col==='#6FA844'||col==='#3F7A3C'){g.fillRect(x,y,2,6);g.fillRect(x+3,y-2,2,8);g.fillRect(x+6,y,2,5);}
      else if(col==='#6B4A2A'){g.fillStyle='#F2EBDD';g.fillRect(x+2,y,3,6);g.fillStyle='#C94A3A';g.beginPath();g.arc(x+3.5,y,6,Math.PI,0);g.fill();}
      else {g.beginPath();g.arc(x,y,3,0,6.3);g.fill();g.fillStyle='#FFF4B0';g.beginPath();g.arc(x,y,1.2,0,6.3);g.fill();}
    } else if(z.kind==='cave'){ g.beginPath();g.moveTo(x,y-5);g.lineTo(x+3,y);g.lineTo(x,y+5);g.lineTo(x-3,y);g.fill(); }
    else { g.beginPath();g.arc(x,y,2+r()*3,0,6.3);g.fill(); }
  }
  return c;
}

function zoneBossType(z){for(var i=0;i<z.spawns.length;i++){var T=MON[z.spawns[i].type];if(T&&T.boss)return z.spawns[i].type;}return null;}
function spawnMonsters(id){
  if(monsters[id]) return;
  var z=ZONES[id], r=rng(id.length*131+7), list=[], k=0;
  z.spawns.forEach(function(s){
    for(var i=0;i<s.n;i++){
      var x,y,t=0;
      if(s.x){x=s.x;y=s.y;} else {
        do{ x=200+r()*(z.w-400); y=160+r()*(z.h-320); t++; }
        while(t<50 && (dist(x,y,z.start.x,z.start.y)<380 || z.portals.some(function(p){return dist(x,y,p.x,p.y)<200;}) || z.npcs.some(function(n){return dist(x,y,n.x,n.y)<260;})));
      }
      var T=MON[s.type];
      list.push({id:id+'_'+(k++),type:s.type,x:x,y:y,hx:x,hy:y,hp:T.hp,maxHp:T.hp,state:'idle',cd:1,wt:r()*3,tx:x,ty:y,kbx:0,kby:0,hitT:0,anim:r()*10,f:0,dead:false,respawn:0,lunge:0});
    }
  });
  monsters[id]=list;
}

/* ===================== LOGIN ===================== */
function cleanName(n){return n.trim().replace(/\s+/g,' ').slice(0,16);}
function nameId(n){return n.toLowerCase().replace(/ /g,'_');}
$('enterBtn').addEventListener('click',login);
$('nameInput').addEventListener('keydown',function(e){if(e.key==='Enter')login();});

function freshPlayer(name){
  return {name:name,zone:'village',x:650,y:600,hp:60,level:1,xp:0,coins:0,potions:3,q:0,qa:false,qp:0,chests:[],visited:['village'],kills:0,hero:false,skills:{},element:'',gender:'',design:0,slots:[],v3:true,sq:0,sqa:false,sqp:0};
}
var GENDERS=[
 {id:'m',ic:'♂️',name:'Laki-laki'},
 {id:'f',ic:'♀️',name:'Perempuan'}
];
function isGender(g){ return g==='m'||g==='f'; }
function showGenderPicker(cb){
  $('login').style.display='none';
  var grid=$('gengrid'); grid.innerHTML='';
  GENDERS.forEach(function(g){
    var b=document.createElement('button'); b.className='gencard';
    b.innerHTML='<div class="ic">'+g.ic+'</div><b>'+g.name+'</b>';
    b.addEventListener('click',function(){ $('genpick').classList.remove('show'); cb(g.id); });
    grid.appendChild(b);
  });
  $('genpick').classList.add('show');
}
var DESIGNS=[
 {id:0,ic:'🙂',name:'Klasik'},
 {id:1,ic:'🥷',name:'Ikat Kepala'},
 {id:2,ic:'👒',name:'Caping Petani'},
 {id:3,ic:'🧢',name:'Peci'},
 {id:4,ic:'👑',name:'Mahkota'}
];
function isDesign(d){ return typeof d==='number' && d>=0 && d<DESIGNS.length; }
function showDesignPicker(cb){
  $('login').style.display='none';
  var grid=$('desgrid'); grid.innerHTML='';
  DESIGNS.forEach(function(dz){
    var b=document.createElement('button'); b.className='descard';
    b.innerHTML='<div class="ic">'+dz.ic+'</div><b>'+dz.name+'</b>';
    b.addEventListener('click',function(){ $('despick').classList.remove('show'); cb(dz.id); });
    grid.appendChild(b);
  });
  $('despick').classList.add('show');
}
function designFor(s){ var h=0; for(var i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return h%DESIGNS.length; }
function showElementPicker(cb){
  $('login').style.display='none';
  var grid=$('elgrid'); grid.innerHTML='';
  ELEMENTS.forEach(function(e){
    var b=document.createElement('button'); b.className='elcard'; b.style.setProperty('--c',e.c);
    b.innerHTML='<div class="ic">'+e.ic+'</div><b>'+e.name+'</b><span>'+e.skillName+'</span>';
    b.addEventListener('click',function(){ $('elpick').classList.remove('show'); cb(e.id); });
    grid.appendChild(b);
  });
  $('elpick').classList.add('show');
}
function login(){
  audInit();
  try{ if(screen.orientation&&screen.orientation.lock) screen.orientation.lock('landscape').catch(function(){}); }catch(e){}
  var msg=$('loginMsg'), name=cleanName($('nameInput').value);
  if(!name){msg.textContent='Tulis nama karaktermu dulu.';return;}
  if(!/^[A-Za-z0-9_ ]{2,16}$/.test(name)){msg.textContent='Nama 2–16 karakter: huruf, angka, spasi, atau _.';return;}
  msg.textContent='Membuka gerbang Elyndor...';
  $('enterBtn').disabled=true;
  var fail=function(t){msg.textContent=t;$('enterBtn').disabled=false;};
  if(typeof claude==='undefined'||!claude.use){ P=freshPlayer(name); pickNewCharacter(function(){ goOffline(name); }); return; }
  var settled=false;
  var toTimer=setTimeout(function(){
    if(settled) return; settled=true;
    P=freshPlayer(name);
    pickNewCharacter(function(){ goOffline(name); toast('Backend online tidak merespons, main mode latihan dulu ya.',2600); });
  },7000);
  claude.use('db').then(function(d){
    if(settled) return; settled=true; clearTimeout(toTimer);
    db=d;
    if(!db){ P=freshPlayer(name); pickNewCharacter(function(){ goOffline(name); }); return; }
    myRef=db.doc('players/'+nameId(name));
    return myRef.get().then(function(snap){
      if(snap.exists){
        P=loadPlayer(name,snap.data()||{});
        var needG=!isGender(P.gender), needE=!ELM[P.element];
        if(needG||needE){
          pickMissing(needG,needE,function(){
            P.v3=true;
            startGame((needE?'Elemenmu dipilih: '+ELM[P.element].name+'. ':'')+'Selamat datang kembali, '+P.name+'!');
          });
        } else if(!P.v3){
          P.coins+=60; P.v3=true;
          startGame('Selamat datang kembali, '+P.name+'! +60 koin kompensasi karena pembaruan skill kemarin sempat mereset skill pendukungmu — maaf soal itu.');
        } else {
          startGame('Selamat datang kembali, '+P.name+'!');
        }
      } else {
        P=freshPlayer(name);
        pickNewCharacter(function(){
          myRef.set(serialize()).then(function(){startGame('Karakter baru dibuat. Selamat datang, '+name+'!');})
          .catch(function(e){ if(e&&e.code==='invalid_argument'){ fail('Akunmu hanya bisa melihat, belum bisa menyimpan karakter. Minta pemilik game memberi akses Contributor.'); $('elpick').classList.remove('show'); $('genpick').classList.remove('show'); $('despick').classList.remove('show'); $('login').style.display='flex'; } else { $('elpick').classList.remove('show'); $('genpick').classList.remove('show'); $('despick').classList.remove('show'); $('login').style.display='flex'; fail('Gagal membuat karakter ('+((e&&e.code)||'error')+'). Coba lagi.'); } });
        });
      }
    });
  }).catch(function(e){
    if(settled) return; settled=true; clearTimeout(toTimer);
    var m=(e&&(e.code||e.message))||'error'; if($('game').style.display==='block') window.__showErr(m); else fail('Gagal terhubung ('+m+'). Coba lagi.');
  });
}
function pickNewCharacter(done){
  showGenderPicker(function(g){ P.gender=g; showDesignPicker(function(dz){ P.design=dz; showElementPicker(function(el){ P.element=el; P.skills[el]=1; done(); }); }); });
}
function pickMissing(needG,needE,done){
  var afterG=function(){ if(needE) showElementPicker(function(el){ P.element=el; if(!P.skills[el]) P.skills[el]=1; done(); }); else done(); };
  if(needG) showGenderPicker(function(g){ P.gender=g; afterG(); }); else afterG();
}
function loadPlayer(name,d0){
  var f=freshPlayer(name), out={}, k;
  for(k in f){
    var v=d0[k], dv=f[k];
    if(Array.isArray(dv)) out[k]=Array.isArray(v)?v.filter(function(x){return typeof x==='string';}):dv.slice();
    else if(dv!==null && typeof dv==='object') out[k]=(v && typeof v==='object' && !Array.isArray(v))?v:JSON.parse(JSON.stringify(dv));
    else if(typeof dv==='number') out[k]=(typeof v==='number' && isFinite(v))?v:dv;
    else if(typeof dv==='boolean') out[k]=!!v;
    else if(dv==='') out[k]=(typeof v==='string')?v:'';
    else out[k]=(typeof v===typeof dv && v!=='')?v:dv;
  }
  var sk={}; for(k in out.skills){ var n=+out.skills[k]; if(n>0) sk[k]=Math.floor(n); } out.skills=sk;
  if(!ZONES[out.zone]) out.zone='village';
  if(out.visited.indexOf('village')<0) out.visited.unshift('village');
  if(out.visited.indexOf(out.zone)<0) out.visited.push(out.zone);
  out.level=Math.max(1,Math.floor(out.level)); out.q=clamp(Math.floor(out.q),0,QUESTS.length); out.sq=clamp(Math.floor(out.sq),0,SQUESTS.length);
  out.name=(typeof d0.name==='string'&&d0.name)?d0.name.slice(0,16):name;
  return out;
}
function goOffline(name){
  offline=true; if(!P||P.name!==name) P=freshPlayer(name);
  startGame('Mode latihan: progress tidak tersimpan di tampilan ini.');
}

/* ===================== START ===================== */
function startGame(welcome){
  try{ startGameInner(welcome); }
  catch(e){ window.__showErr('Gagal memulai: '+((e&&e.message)||e)); }
}
function startGameInner(welcome){
  $('login').style.display='none'; $('game').style.display='block';
  $('mSndI').textContent=AUD.muted?'🔇':'🔊';
  resize();
  setupControls(); setupMenus();
  if(!offline && typeof claude!=='undefined'){
    claude.use('room').then(function(rm){ room=rm; if(!room) return;
      room.onPeers(function(ch){ onPeers(ch.peers); });
      try{ onPeers(room.peers()); }catch(e){}
    });
  }
  if(!ELM[P.element]) P.element=ELEMENTS[0].id;
  if(!P.skills[P.element]) P.skills[P.element]=1;
  applyElementUi(); ensureSlots(); renderSlots();
  var S=stats(); P.hp=clamp(P.hp||S.maxHp,1,S.maxHp);
  enterZone(P.zone,null,true);
  toast(welcome,3200);
  setTimeout(function(){ if(P.level===1&&P.kills===0) toast('Geser sisi kiri layar untuk berjalan. Tekan 🗡️ untuk menyerang atau bicara.',4500); },3400);
  lastT=performance.now(); requestAnimationFrame(loop);
}
function resize(){
  DPR=Math.min(window.devicePixelRatio||1,2);
  W=cv.clientWidth; H=cv.clientHeight;
  cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR);
}

function enterZone(id,fromId,keepPos){
  zoneId=id; P.zone=id; zone=buildZone(id); spawnMonsters(id);
  peers={}; hazards=[];
  audZone(id); if(!keepPos) sfx('portal');
  if(!keepPos){
    var back=fromId && zone.portals.filter(function(p){return p.to===fromId;})[0];
    if(back){ var ax=zone.w/2-back.x, ay=zone.h/2-back.y, al=Math.sqrt(ax*ax+ay*ay)||1; P.x=back.x+ax/al*110; P.y=back.y+ay/al*110; }
    else { P.x=zone.start.x; P.y=zone.start.y; }
  } else { P.x=clamp(P.x||zone.start.x,40,zone.w-40); P.y=clamp(P.y||zone.start.y,40,zone.h-40); }
  if(P.visited.indexOf(id)<0) P.visited.push(id);
  portalCd=1.2;
  var bs=zoneBossType(zone);
  if(bs){ $('bossbar').style.display='block'; $('bossName').textContent=MON[bs].name+(MON[bs].title?', '+MON[bs].title:''); }
  else { $('bossbar').style.display='none'; }
  $('bnT').textContent=zone.label; $('bnS').textContent=zone.sub;
  var b=$('banner'); b.style.opacity='1'; clearTimeout(enterZone.h); enterZone.h=setTimeout(function(){b.style.opacity='0';},2200);
  dirty=true; save(true); sendPresence(true); hud();
}

/* ===================== NETWORK ===================== */
function serialize(){
  return {name:P.name,zone:P.zone,x:Math.round(P.x),y:Math.round(P.y),hp:Math.round(P.hp),level:P.level,xp:P.xp,coins:P.coins,
    potions:P.potions,skills:P.skills,element:P.element,gender:P.gender,design:P.design,slots:P.slots,v3:true,sq:P.sq,sqa:P.sqa,sqp:P.sqp,q:P.q,qa:P.qa,qp:P.qp,chests:P.chests,visited:P.visited,kills:P.kills,hero:!!P.hero};
}
function save(force){
  if(offline||!myRef) return;
  if(!force && (!dirty || performance.now()-saveT<3000)) return;
  if(saving){saveAgain=true;return;}
  saving=true; dirty=false; saveT=performance.now();
  var done=function(){saving=false; if(saveAgain){saveAgain=false; save(true);}};
  myRef.set(serialize()).then(done,done);
}
function sendPresence(force){
  if(!room) return;
  var pr={n:P.name,z:zoneId,x:Math.round(P.x),y:Math.round(P.y),f:Math.round(P.f*100)/100||0,w:(input.jx||input.jy)?1:0,at:atkCount,lv:P.level,hp:Math.round(P.hp),mh:stats().maxHp,e:P.e||'',et:P.et||0,hero:P.hero?1:0,ak:atkKind,sn:skillSeq,g:P.gender||'m',el:P.element||'',ds:isDesign(P.design)?P.design:0};
  if(lastSkill){ pr.sk=lastSkill.sk; pr.sa=lastSkill.sa; pr.sx=lastSkill.sx; pr.sy=lastSkill.sy; }
  if(lastPvp){ pr.pvS=lastPvp.s; pr.pvT=lastPvp.t; pr.pvD=lastPvp.d; }
  var s=JSON.stringify(pr); if(!force && s===lastPres) return; lastPres=s;
  room.presence(pr).catch(function(){});
}
var ALLOWED_EMO=['👋','😄','😂','⚔️','❤️','🔥','🙏','😱','🎉'];
function onPeers(list){
  var seen={};
  (list||[]).forEach(function(p){
    if(p.isMe) return; var pr=p.presence||{};
    if(typeof pr.n!=='string'||!pr.n) return;
    var k=p.peer; seen[k]=1;
    var o=peers[k];
    if(pr.z!==zoneId){ if(o) delete peers[k]; allPeers[k]={n:pr.n.slice(0,16),z:pr.z,lv:+pr.lv||1}; return; }
    allPeers[k]={n:pr.n.slice(0,16),z:pr.z,lv:+pr.lv||1};
    if(!o){ o=peers[k]={x:+pr.x||0,y:+pr.y||0,walk:0,atkT:0,eT:0}; }
    o.n=pr.n.slice(0,16); o.tx=+pr.x||0; o.ty=+pr.y||0; o.f=+pr.f||0; o.w=!!pr.w; o.lv=+pr.lv||1; o.hp=+pr.hp||0; o.mh=Math.max(1,+pr.mh||1); o.hero=!!pr.hero;
    o.g=isGender(pr.g)?pr.g:'m'; o.el=ELM[pr.el]?pr.el:''; o.ds=isDesign(pr.ds)?pr.ds:0;
    if(o.lastAt!==undefined && pr.at!==o.lastAt){ o.atkT=0.25; o.ak=(+pr.ak||0)%3; } o.lastAt=pr.at;
    if(o.lastSn!==undefined && pr.sn!==o.lastSn && SKFX[pr.sk]){ var sa=+pr.sa||0; o.f=sa; SKFX[pr.sk](o,sa,{x:+pr.sx||o.x,y:+pr.sy||o.y},false); sfx('sk_'+pr.sk,clamp(1-dist(P.x,P.y,o.x,o.y)/600,0,0.4)); } o.lastSn=pr.sn;
    if(pr.e && ALLOWED_EMO.indexOf(pr.e)>=0 && pr.et!==o.et){ if(o.et!==undefined) o.eT=2.6; o.e=pr.e; o.et=pr.et; }
    if(o.lastPvS!==undefined && pr.pvS!==o.lastPvS && pr.pvT===P.name && !P.dead){ hurtPlayerPvp(+pr.pvD||0,o.n); } o.lastPvS=pr.pvS;
  });
  Object.keys(peers).forEach(function(k){if(!seen[k]) delete peers[k];});
  Object.keys(allPeers).forEach(function(k){if(!seen[k]) delete allPeers[k];});
  $('mPeopleN').textContent=(Object.keys(allPeers).length+1)+' online';
}
var allPeers={};

/* ===================== CONTROLS ===================== */
function setupControls(){
  cv.addEventListener('pointerdown',function(e){
    if(sheetOpen||!zone) return;
    var lp=toLocal(e.clientX,e.clientY), x=lp.x, y=lp.y;
    var w={x:x+cam.x,y:y+cam.y}, n=npcAt(w.x,w.y,44);
    if(n&&dist(P.x,P.y,n.x,n.y)<150){ openNpc(n); return; }
    if(x<W*0.55 && !joy){ joy={id:e.pointerId,ox:x,oy:y,x:x,y:y}; try{ cv.setPointerCapture(e.pointerId); }catch(er){} }
  });
  cv.addEventListener('pointermove',function(e){
    if(!joy||e.pointerId!==joy.id) return;
    var lp=toLocal(e.clientX,e.clientY); joy.x=lp.x; joy.y=lp.y;
    var dx=joy.x-joy.ox, dy=joy.y-joy.oy, l=Math.sqrt(dx*dx+dy*dy), R=50;
    if(l>R){ joy.ox=joy.x-dx/l*R; joy.oy=joy.y-dy/l*R; dx=joy.x-joy.ox; dy=joy.y-joy.oy; l=R; }
    var m=l<8?0:l/R; input.jx=l?dx/l*m:0; input.jy=l?dy/l*m:0;
  });
  var end=function(e){ if(joy&&e.pointerId===joy.id){ joy=null; input.jx=0; input.jy=0; } };
  cv.addEventListener('pointerup',end); cv.addEventListener('pointercancel',end);
  function hold(el,fn){ var t=null;
    var up=function(){ el.classList.remove('on'); clearInterval(t); }; HOLDCLR.push(up);
    el.addEventListener('pointerdown',function(e){e.preventDefault(); if(sheetOpen) return; el.classList.add('on'); fn(); clearInterval(t); t=setInterval(function(){ if(sheetOpen){ up(); return; } fn(); },120);});
    el.addEventListener('pointerup',up); el.addEventListener('pointerleave',up); el.addEventListener('pointercancel',up);
  }
  hold($('bAtk'),primaryAction);
  $('bSkill').addEventListener('pointerdown',function(e){e.preventDefault(); if(sheetOpen) return; castSkill();});
  [0,1].forEach(function(i){ $('sup'+i).addEventListener('pointerdown',function(e){e.preventDefault(); if(sheetOpen) return;
    var id=P.slots[i]; if(!id){ showSkills(); return; } castSupport(id); }); });
  $('bPot').addEventListener('pointerdown',function(e){e.preventDefault(); if(!sheetOpen) drinkPotion();});
  $('mEmo').addEventListener('click',openEmotes);
  window.addEventListener('keydown',function(e){
    if(!P||sheetOpen) { if(e.key==='Escape') closeSheet(); return; }
    input.keys[e.key.toLowerCase()]=true;
    if(e.key===' '||e.key==='j'||e.key==='J'){e.preventDefault();primaryAction();}
    if(e.key==='k'||e.key==='K'||e.key==='1') castSkill();
    if(e.key==='2'){ var s0=P.slots[0]; if(s0) castSupport(s0); }
    if(e.key==='3'){ var s1=P.slots[1]; if(s1) castSupport(s1); }
    if(e.key==='h'||e.key==='H') drinkPotion();
  });
  window.addEventListener('keyup',function(e){input.keys[e.key.toLowerCase()]=false;});
}
function keyVec(){
  var k=input.keys, x=0,y=0;
  if(k['a']||k['arrowleft'])x--; if(k['d']||k['arrowright'])x++; if(k['w']||k['arrowup'])y--; if(k['s']||k['arrowdown'])y++;
  var l=Math.sqrt(x*x+y*y); return l?{x:x/l,y:y/l}:null;
}

/* ===================== COMBAT ===================== */
function npcAt(x,y,r){ if(!zone) return null; for(var i=0;i<zone.npcs.length;i++){var n=zone.npcs[i]; if(dist(x,y,n.x,n.y)<r) return n;} return null; }
function nearestMonster(range){
  var best=null,bd=range; (monsters[zoneId]||[]).forEach(function(m){ if(m.dead) return; var d=dist(P.x,P.y,m.x,m.y)-MON[m.type].r; if(d<bd){bd=d;best=m;} }); return best;
}
function primaryAction(){
  var n=npcAt(P.x,P.y,85);
  if(n && !nearestMonster(60)){ openNpc(n); return; }
  swing();
}
function shake(m,d){ if(m>=shakeM*(shakeT/shakeD||0)){ shakeM=m; shakeT=d; shakeD=d; } }
function swing(){
  if(atkCd>0||P.dead||P.dashT>0) return;
  combo = comboT>0 ? (combo+1)%3 : 0; comboT=0.85; atkKind=combo;
  atkCd = combo===2?0.48:0.28; atkT=0.25; atkCount++; sfx('swing'+combo);
  var t=nearestMonster(120); if(t) P.f=Math.atan2(t.y-P.y,t.x-P.x);
  if(combo===2){ P.x+=Math.cos(P.f)*16; P.y+=Math.sin(P.f)*16; collide(P,14); }
  var S=stats(), hit=false, reach=combo===2?84:64, mult=combo===2?1.6:1;
  (monsters[zoneId]||[]).forEach(function(m){
    if(m.dead) return; var T=MON[m.type], d=dist(P.x,P.y,m.x,m.y);
    if(d>reach+T.r) return;
    var a=Math.atan2(m.y-P.y,m.x-P.x), diff=Math.abs(((a-P.f)+Math.PI*3)%(Math.PI*2)-Math.PI);
    if(diff>(combo===2?0.8:1.4) && d>T.r+14) return;
    var crit=Math.random()<S.crit, dmg=Math.round(S.atk*mult*(0.85+Math.random()*0.3)*(crit?1.9:1));
    hurtMonster(m,dmg,crit,a,T.boss?1:(combo===2?11:5)); hit=true;
    impact(m.x-Math.cos(a)*T.r*0.6,m.y-8-Math.sin(a)*T.r*0.6,crit);
  });
  Object.keys(peers).forEach(function(k){
    var o=peers[k], d=dist(P.x,P.y,o.x,o.y);
    if(d>reach+14) return;
    var a=Math.atan2(o.y-P.y,o.x-P.x), diff=Math.abs(((a-P.f)+Math.PI*3)%(Math.PI*2)-Math.PI);
    if(diff>(combo===2?0.8:1.4) && d>14+14) return;
    var crit=Math.random()<S.crit, dmg=Math.round(S.atk*mult*(0.85+Math.random()*0.3)*(crit?1.9:1));
    pvpHit(o,dmg,crit,a); hit=true;
    impact(o.x-Math.cos(a)*10,o.y-8-Math.sin(a)*10,crit);
  });
  (bots[zoneId]||[]).slice().forEach(function(b){
    var d=dist(P.x,P.y,b.x,b.y);
    if(d>reach+14) return;
    var a=Math.atan2(b.y-P.y,b.x-P.x), diff=Math.abs(((a-P.f)+Math.PI*3)%(Math.PI*2)-Math.PI);
    if(diff>(combo===2?0.8:1.4) && d>14+14) return;
    var crit=Math.random()<S.crit, dmg=Math.round(S.atk*mult*(0.85+Math.random()*0.3)*(crit?1.9:1));
    hurtBot(b,dmg,crit,a); hit=true;
    impact(b.x-Math.cos(a)*10,b.y-8-Math.sin(a)*10,crit);
  });
  if(hit) shake(combo===2?5:2.5,0.14);
  sendPresence();
}
function hurtBot(b,dmg,crit,a){
  b.hp-=dmg; sfx(crit?'crit':'hit');
  floaters.push({x:b.x+(Math.random()-.5)*16,y:b.y-34,t:crit?dmg+'!':String(dmg),c:crit?'#FFD34A':'#FFFFFF',life:.9,s:crit?20:15});
  if(b.hp<=0) killBot(b);
}
function killBot(b){
  var arr=bots[zoneId]||[], i=arr.indexOf(b); if(i>=0) arr.splice(i,1);
  for(var k=0;k<14;k++) particles.push({x:b.x,y:b.y,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6-1,life:.6,max:.6,c:'#FFE08A',r:4});
  shake(3,0.15); sfx('kill'); sfx('coin');
  var coin=3+Math.floor(Math.random()*4); P.coins+=coin;
  floaters.push({x:b.x,y:b.y-40,t:'+'+coin+' 🪙',c:'#FFD34A',life:1.2,s:15});
  dirty=true; hud();
}
function pvpHit(o,dmg,crit,a){
  pvpSeq++; lastPvp={s:pvpSeq,t:o.n,d:dmg};
  sfx(crit?'crit':'hit');
  floaters.push({x:o.x+(Math.random()-.5)*16,y:o.y-30,t:(crit?dmg+'!':String(dmg)),c:crit?'#FFD34A':'#FFFFFF',life:.9,s:crit?20:15});
  o.hp=Math.max(1,o.hp-dmg); o.atkT=0.25;
  sendPresence(true);
}
function impact(x,y,big){
  fx.push({k:'impact',x:x,y:y,t:0,d:0.22,s:big?1.6:1});
  for(var i=0;i<(big?14:8);i++){var a=Math.random()*6.28,v=2+Math.random()*4;particles.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.35,max:.35,c:big?'#FFD34A':'#FFF6D0',r:big?3.5:2.5});}
}
function areaDamage(x,y,r,base,kb){
  var S=stats(), n=0;
  (monsters[zoneId]||[]).forEach(function(m){ if(m.dead) return; var T=MON[m.type]; if(dist(x,y,m.x,m.y)>r+T.r) return;
    var crit=Math.random()<S.crit; hurtMonster(m,Math.round(base*(0.9+Math.random()*0.2)*(crit?1.8:1)),crit,Math.atan2(m.y-y,m.x-x),T.boss?0:kb); n++; });
  return n;
}
function skDmg(id){
  var A=stats().atk, l=P.skills[id]||1;
  return {fire:A*(1.8+0.5*l),water:A*(1.6+0.45*l),wind:A*(1.5+0.4*l),earth:A*(1.7+0.45*l),
    spin:A*(1.0+0.3*l),dash:A*(1.4+0.4*l),bolt:A*(2.1+0.5*l),meteor:A*(4+1.3*l)}[id]||A;
}
function coneDamage(o,ang,range,halfAngle,base,kb){
  var S=stats(), n=0;
  (monsters[zoneId]||[]).forEach(function(m){ if(m.dead) return; var T=MON[m.type], d=dist(o.x,o.y,m.x,m.y); if(d>range+T.r) return;
    var a=Math.atan2(m.y-o.y,m.x-o.x), diff=Math.abs(((a-ang)+Math.PI*3)%(Math.PI*2)-Math.PI); if(diff>halfAngle) return;
    var crit=Math.random()<S.crit; hurtMonster(m,Math.round(base*(0.9+Math.random()*0.2)*(crit?1.8:1)),crit,a,T.boss?0:kb); n++; });
  return n;
}
function fireCast(id,def,l,maxL){
  if(!l||P.dead) return; if((cds[id]||0)>0) return;
  cds[id]=def.cd[Math.min(maxL-1,l-1)]; readyFlag[id]=false;
  var tgt=nearestMonster(id==='meteor'?380:420), ang=tgt?Math.atan2(tgt.y-P.y,tgt.x-P.x):P.f; P.f=ang;
  var tp=tgt?{x:tgt.x,y:tgt.y}:{x:P.x+Math.cos(ang)*160,y:P.y+Math.sin(ang)*160};
  SKFX[id](P,ang,tp,true); sfx('sk_'+id);
  skillSeq++; lastSkill={sk:id,sa:Math.round(ang*100)/100,sx:Math.round(tp.x),sy:Math.round(tp.y)};
  sendPresence(true);
}
function castSkill(){ if(!P.element) return; fireCast(P.element,elDef(),P.skills[P.element]||0,3); }
function castSupport(id){ var def=SUP[id]; if(!def) return; fireCast(id,def,P.skills[id]||0,3); }
var SKFX={
  fire:function(o,ang,tp,real){
    projs.push({x:o.x+Math.cos(ang)*22,y:o.y-12+Math.sin(ang)*22,vx:Math.cos(ang)*9,vy:Math.sin(ang)*9,life:0.85,real:real,r:72,spin:0,elm:'fire'});
    fx.push({k:'ring',x:o.x+Math.cos(ang)*20,y:o.y-12+Math.sin(ang)*20,t:0,d:0.25,r0:6,r1:30,c:'255,150,40',w:5});
  },
  water:function(o,ang,tp,real){
    fx.push({k:'wave',o:o,ang:ang,t:0,d:0.5});
    for(var i=0;i<22;i++){var sp=ang+(Math.random()-.5)*0.8,v=4+Math.random()*5;particles.push({x:o.x+Math.cos(ang)*20,y:o.y-8+Math.sin(ang)*20,vx:Math.cos(sp)*v,vy:Math.sin(sp)*v,life:.5,max:.5,c:i%2?'#BFE6FF':'#3AA0E0',r:3+Math.random()*2});}
    if(real){ var dm=skDmg('water'); shake(4,0.16);
      timers.push({t:0.1,f:function(){ coneDamage(o,ang,150,0.55,dm,13); }});
      timers.push({t:0.24,f:function(){ coneDamage(o,ang,190,0.6,dm*0.7,10); }}); }
  },
  wind:function(o,ang,tp,real){
    o.spinT=0.55; o.spinA=ang; o.spinC='#4FBFAE';
    fx.push({k:'vortex',o:o,t:0,d:0.55});
    for(var i=0;i<28;i++){var a=i/28*6.28,rr=20+Math.random()*40;particles.push({x:o.x+Math.cos(a)*rr,y:o.y-6+Math.sin(a)*rr*0.7,vx:Math.cos(a+1.6)*3,vy:Math.sin(a+1.6)*3-1,life:.5,max:.5,c:i%2?'#EAFFFB':'#6FE0D0',r:2.5});}
    if(real){ var dm=skDmg('wind'); shake(4,0.2);
      timers.push({t:0.3,f:function(){ if(!P.dead) areaDamage(P.x,P.y,115,dm,15); }}); }
  },
  earth:function(o,ang,tp,real){
    fx.push({k:'spikeline',x:o.x,y:o.y,ang:ang,t:0,d:0.15});
    var n=5, dm=skDmg('earth'), range=34+(n-1)*38+24;
    for(var i=0;i<n;i++){ (function(i){ timers.push({t:0.06*i,f:function(){
      var dx=o.x+Math.cos(ang)*(34+i*38), dy=o.y+Math.sin(ang)*(34+i*38);
      fx.push({k:'spike',x:dx,y:dy,t:0,d:0.4}); ground.push({k:'crack',x:dx,y:dy,t:0,d:2.2,r:20});
    }}); })(i); }
    if(real){ timers.push({t:0.3,f:function(){ coneDamage(o,ang,range,0.42,dm,12); }}); shake(4,0.18); }
  },
  spin:function(o,ang,tp,real){
    o.spinT=0.5; o.spinA=ang;
    fx.push({k:'spin',o:o,t:0,d:0.5});
    for(var i=0;i<26;i++){var a=i/26*6.28;particles.push({x:o.x+Math.cos(a)*30,y:o.y-6+Math.sin(a)*30,vx:Math.cos(a+1.4)*4,vy:Math.sin(a+1.4)*4,life:.45,max:.45,c:i%2?'#DDF4FF':'#9FD8FF',r:3});}
    if(real){ var dm=skDmg('spin'); shake(4,0.25); areaDamage(P.x,P.y,100,dm,7); timers.push({t:0.24,f:function(){ if(!P.dead) areaDamage(P.x,P.y,100,dm,7); }}); }
  },
  dash:function(o,ang,tp,real){
    for(var i=0;i<14;i++){var a=ang+Math.PI+(Math.random()-.5)*0.8;particles.push({x:o.x,y:o.y,vx:Math.cos(a)*(3+Math.random()*4),vy:Math.sin(a)*(3+Math.random()*4),life:.35,max:.35,c:'#E8F6FF',r:3});}
    fx.push({k:'ring',x:o.x,y:o.y+10,t:0,d:0.3,r0:8,r1:46,c:'220,240,255',w:4,flat:true});
    if(real){ P.dashT=0.2; P.dashA=ang; P.dashHit={}; invT=Math.max(invT,0.32); }
    else { for(var j=0;j<6;j++) ghosts.push({x:o.x-Math.cos(ang)*j*30,y:o.y-Math.sin(ang)*j*30,f:ang,life:0.35-j*0.03,max:0.35,c:colorFor(o.n||'x')}); }
  },
  shield:function(o,ang,tp,real){
    o.shieldT=5; fx.push({k:'ring',x:o.x,y:o.y-8,t:0,d:0.45,r0:10,r1:70,c:'255,230,140',w:6});
    fx.push({k:'rise',o:o,t:0,d:0.7});
    if(real){ var S=stats(), l=P.skills.shield||1; P.shield=Math.round(S.maxHp*(0.3+0.12*l)); floaters.push({x:P.x,y:P.y-50,t:'🛡️ '+P.shield,c:'#FFE9A0',life:1.1,s:16}); }
  },
  bolt:function(o,ang,tp,real){
    var pts=[];
    if(real){ var l=P.skills.bolt||1, n=2+l;
      var ms=(monsters[zoneId]||[]).filter(function(m){return !m.dead && dist(P.x,P.y,m.x,m.y)<360;}).sort(function(a,b){return dist(P.x,P.y,a.x,a.y)-dist(P.x,P.y,b.x,b.y);}).slice(0,n);
      ms.forEach(function(m){pts.push({m:m});});
      if(!pts.length) pts.push({x:tp.x,y:tp.y});
    } else { for(var i=0;i<3;i++){var a=Math.random()*6.28,r=50+Math.random()*120; pts.push({x:o.x+Math.cos(a)*r,y:o.y+Math.sin(a)*r});} }
    fx.push({k:'charge',o:o,t:0,d:0.3});
    pts.forEach(function(p,i){ timers.push({t:0.12+i*0.11,f:function(){
      var x=p.m?p.m.x:p.x, y=p.m?p.m.y:p.y;
      fx.push({k:'bolt',x:x,y:y,t:0,d:0.32}); ground.push({k:'scorch',x:x,y:y,t:0,d:2.5,r:28});
      fx.push({k:'ring',x:x,y:y,t:0,d:0.3,r0:6,r1:55,c:'170,220,255',w:5,flat:true});
      for(var k=0;k<14;k++){var a=Math.random()*6.28,v=2+Math.random()*5;particles.push({x:x,y:y-6,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,life:.4,max:.4,c:k%2?'#FFFFFF':'#9FD8FF',r:2.5});}
      flashT=Math.max(flashT,0.12);
      if(real){ shake(4,0.15); if(p.m && !p.m.dead){ var S=stats(),crit=Math.random()<S.crit; hurtMonster(p.m,Math.round(skDmg('bolt')*(0.9+Math.random()*0.2)*(crit?1.8:1)),crit,0,0); if(!p.m.dead) p.m.stun=0.8; } }
    }}); });
  },
  meteor:function(o,ang,tp,real){
    ground.push({k:'tele',x:tp.x,y:tp.y,t:0,d:0.95,r:140});
    fx.push({k:'meteor',x:tp.x,y:tp.y,t:0,d:0.95});
    fx.push({k:'charge',o:o,t:0,d:0.5,c:'255,120,40'});
    timers.push({t:0.95,f:function(){
      fx.push({k:'boom',x:tp.x,y:tp.y,t:0,d:0.6,r:150});
      fx.push({k:'ring',x:tp.x,y:tp.y,t:0,d:0.55,r0:20,r1:200,c:'255,200,120',w:8,flat:true});
      ground.push({k:'scorch',x:tp.x,y:tp.y,t:0,d:4,r:95});
      for(var i=0;i<46;i++){var a=Math.random()*6.28,v=3+Math.random()*9;particles.push({x:tp.x,y:tp.y-10,vx:Math.cos(a)*v,vy:Math.sin(a)*v*0.6-2,life:.8,max:.8,c:i%3===0?'#5A3A2A':(i%3===1?'#FF7A1E':'#FFD34A'),r:3+Math.random()*4});}
      flashT=Math.max(flashT,0.2);
      if(real){ shake(11,0.45); areaDamage(tp.x,tp.y,140,skDmg('meteor'),14); } else shake(3,0.2);
    }});
  }
};
var flashT=0;
function hurtMonster(m,dmg,crit,a,kb){
  m.hp-=dmg; m.hitT=0.15; m.stopT=0.07; m.kbx=Math.cos(a)*kb; m.kby=Math.sin(a)*kb; m.state='chase'; sfx(crit?'crit':'hit');
  floaters.push({x:m.x+(Math.random()-.5)*16,y:m.y-MON[m.type].r-6,t:crit?dmg+'!':String(dmg),c:crit?'#FFD34A':'#FFFFFF',life:.9,s:crit?20:15});
  if(m.hp<=0) killMonster(m);
}
function killMonster(m){
  var T=MON[m.type]; m.dead=true; m.respawn=performance.now()/1000+(T.respawn||12);
  fx.push({k:'death',m:{type:m.type,x:m.x,y:m.y,f:m.f,anim:m.anim,hitT:0,lunge:0,hp:0,maxHp:1,state:'idle'},t:0,d:T.boss?1.2:0.45});
  fx.push({k:'soul',x:m.x,y:m.y-10,t:0,d:0.9});
  shake(T.boss?12:3,T.boss?0.6:0.15);
  for(var i=0;i<18;i++) particles.push({x:m.x,y:m.y,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6-1,life:.6,max:.6,c:i%3?monColor(m.type):'#FFE08A',r:4});
  var lootBack=m.loot||0; m.loot=0; P.coins+=T.coin+lootBack; P.kills++; sfx('kill'); sfx('coin');
  floaters.push({x:m.x,y:m.y-T.r-26,t:'+'+(T.coin+lootBack)+' 🪙',c:'#FFD34A',life:1.2,s:15});
  var drop=Math.random()<(T.boss?1:0.08);
  if(drop){P.potions+=T.boss?3:1; floaters.push({x:m.x,y:m.y-T.r-46,t:'+🧪',c:'#FFB3D9',life:1.2,s:16});}
  var q=QUESTS[P.q]; if(q && P.qa && q.type==='kill' && q.target===m.type && P.qp<q.n){ P.qp++; if(P.qp>=q.n) toast('Quest selesai! Kembali ke '+npcName(q.giver)+'.',3000); }
  var sq=SQUESTS[P.sq]; if(sq && P.sqa && sq.target===m.type && P.sqp<sq.n){ P.sqp++; if(P.sqp>=sq.n) toast('Quest selesai! Kembali ke Mbah Darmo.',3000); }
  if(T.boss){ toast(T.name+' tumbang! Para Perantau bersorak!',4000); }
  gainXp(T.xp); dirty=true; hud();
}
function gainXp(x){
  P.xp+=x; var up=false;
  while(P.xp>=xpNeed(P.level)){ P.xp-=xpNeed(P.level); P.level++; up=true; }
  if(up){ var S=stats(); P.hp=S.maxHp; sfx('levelup'); toast('Naik level! Sekarang Lv '+P.level+'.',2600);
    fx.push({k:'pillar',o:P,t:0,d:1.3}); fx.push({k:'ring',x:P.x,y:P.y+10,t:0,d:0.6,r0:10,r1:110,c:'255,215,90',w:7,flat:true});
    for(var i=0;i<30;i++) particles.push({x:P.x+(Math.random()-.5)*30,y:P.y+10,vx:(Math.random()-.5)*1.5,vy:-2-Math.random()*3,life:1,max:1,c:'#FFD34A',r:3}); save(true); }
  hud();
}
function hurtPlayer(d){
  if(invT>0||P.dead) return;
  if(P.shieldT>0 && P.shield>0){ var ab=Math.min(d,P.shield); P.shield-=ab; d-=ab;
    fx.push({k:'ripple',o:P,t:0,d:0.35}); floaters.push({x:P.x+10,y:P.y-56,t:'🛡️-'+ab,c:'#FFE9A0',life:.8,s:13});
    if(P.shield<=0){ P.shieldT=0; fx.push({k:'ring',x:P.x,y:P.y-8,t:0,d:0.35,r0:40,r1:80,c:'255,230,140',w:3}); }
    invT=0.3; if(d<=0) return; }
  P.hp-=d; invT=0.45; hurtT=0.3; shake(3,0.15); sfx('hurt');
  floaters.push({x:P.x,y:P.y-44,t:'-'+d,c:'#FF7A6A',life:.9,s:16});
  if(P.hp<=0){ die(); } dirty=true; hud();
}
function hurtPlayerPvp(d,byName){
  if(P.dead) return;
  if(P.shieldT>0 && P.shield>0){ var ab=Math.min(d,P.shield); P.shield-=ab; d-=ab;
    fx.push({k:'ripple',o:P,t:0,d:0.35}); floaters.push({x:P.x+10,y:P.y-56,t:'\uD83D\uDEE1\uFE0F-'+ab,c:'#FFE9A0',life:.8,s:13});
    if(P.shield<=0){ P.shieldT=0; fx.push({k:'ring',x:P.x,y:P.y-8,t:0,d:0.35,r0:40,r1:80,c:'255,230,140',w:3}); }
    if(d<=0) return; }
  P.hp=Math.max(1,P.hp-d); hurtT=0.3; shake(2,0.12); sfx('hurt');
  floaters.push({x:P.x,y:P.y-44,t:'-'+d,c:'#FF7A6A',life:.9,s:16});
  if(P.hp<=1) toast((byName||'Seseorang')+' hampir menghabiskan darahmu!',1800);
  dirty=true; hud();
}
function die(){
  sfx('die'); P.dead=true; P.hp=0; var lost=Math.floor(P.coins*0.1); P.coins-=lost;
  toast('Kau tumbang'+(lost?' dan kehilangan '+lost+' koin':'')+'. Kembali ke Desa Awal...',3000);
  setTimeout(function(){ P.dead=false; P.hp=stats().maxHp; enterZone('village',null,false); P.x=ZONES.village.start.x; P.y=ZONES.village.start.y; hud(); },1600);
}
function drinkPotion(){
  if(potCd>0||P.dead) return;
  if(P.potions<=0){toast('Ramuan habis. Beli di Pedagang Bram, Desa Awal.');return;}
  var S=stats(); if(P.hp>=S.maxHp){toast('HP-mu sudah penuh.');return;}
  P.potions--; potCd=1.5; var h=Math.round(S.maxHp*0.5); P.hp=Math.min(S.maxHp,P.hp+h); sfx('potion');
  floaters.push({x:P.x,y:P.y-44,t:'+'+h,c:'#7CF08A',life:1,s:17});
  for(var i=0;i<14;i++) particles.push({x:P.x+(Math.random()-.5)*26,y:P.y+8,vx:0,vy:-1.5-Math.random()*2,life:.8,max:.8,c:'#7CF08A',r:3});
  dirty=true; hud();
}

/* ===================== UPDATE ===================== */
var loopErrs=0;
function loop(t){
  var dt=Math.min(0.05,(t-lastT)/1000); lastT=t;
  try{ if(zone && P){ update(dt); draw(); } }
  catch(e){ if(loopErrs++<3) window.__showErr((e&&e.message)+' | '+String((e&&e.stack)||'').split('\n').slice(1,3).join(' ')); }
  requestAnimationFrame(loop);
}
function collide(o,rad){
  var ds=zone.deco;
  for(var i=0;i<ds.length;i++){ var d=ds[i];
    if(d.cr){ var dx=o.x-d.x, dy=o.y-(d.y), l=Math.sqrt(dx*dx+dy*dy), min=d.cr+rad; if(l<min&&l>0.01){o.x=d.x+dx/l*min;o.y=d.y+dy/l*min;} }
    else if(d.rw){ var hx=d.rw/2, top=d.y-d.rh, cx=clamp(o.x,d.x-hx,d.x+hx), cy=clamp(o.y,top,d.y); var ex=o.x-cx, ey=o.y-cy, el=Math.sqrt(ex*ex+ey*ey);
      if(el<rad){ if(el>0.01){o.x=cx+ex/el*rad;o.y=cy+ey/el*rad;} else {o.y=d.y+rad;} } }
  }
  o.x=clamp(o.x,30,zone.w-30); o.y=clamp(o.y,40,zone.h-25);
}
function update(dt){
  var now=performance.now()/1000, S=stats();
  atkCd=Math.max(0,atkCd-dt); comboT=Math.max(0,comboT-dt); flashT=Math.max(0,flashT-dt); shakeT=Math.max(0,shakeT-dt);
  Object.keys(cds).forEach(function(k){ if(cds[k]>0){ cds[k]=Math.max(0,cds[k]-dt); if(cds[k]===0) readyFlag[k]=true; } });
  if(P.spinT>0) P.spinT=Math.max(0,P.spinT-dt); if(P.shieldT>0){ P.shieldT=Math.max(0,P.shieldT-dt); if(!P.shieldT) P.shield=0; } potCd=Math.max(0,potCd-dt); invT=Math.max(0,invT-dt); hurtT=Math.max(0,hurtT-dt); atkT=Math.max(0,atkT-dt); portalCd=Math.max(0,portalCd-dt);
  if(P.dashT>0 && !P.dead){
    P.dashT-=dt; var ds=15*60*dt; P.x+=Math.cos(P.dashA)*ds; P.y+=Math.sin(P.dashA)*ds; collide(P,14);
    ghosts.push({x:P.x,y:P.y,f:P.dashA,life:0.3,max:0.3,c:elDef().c});
    (monsters[zoneId]||[]).forEach(function(m){ if(m.dead||P.dashHit[m.id]) return; if(dist(P.x,P.y,m.x,m.y)<46+MON[m.type].r){ P.dashHit[m.id]=1;
      var S=stats(),crit=Math.random()<S.crit; hurtMonster(m,Math.round(skDmg('dash')*(0.9+Math.random()*0.2)*(crit?1.8:1)),crit,P.dashA,MON[m.type].boss?0:10); impact(m.x,m.y-8,crit); shake(3,0.1);} });
    dirty=true;
  } else if(!P.dead && !sheetOpen){
    var kv=keyVec(), mx=kv?kv.x:input.jx, my=kv?kv.y:input.jy, mag=Math.sqrt(mx*mx+my*my);
    if(mag>0.05){ P.x+=mx*S.spd*60*dt; P.y+=my*S.spd*60*dt; P.f=Math.atan2(my,mx); walkT+=dt*mag; P.walking=true; dirty=true; }
    else P.walking=false;
    collide(P,14);
  }
  if(S.regen && !P.dead && P.hp<S.maxHp){ regenAcc+=S.regen*dt; if(regenAcc>=1){var a=Math.floor(regenAcc);regenAcc-=a;P.hp=Math.min(S.maxHp,P.hp+a);} }
  if(zone.safe && !P.dead && P.hp<S.maxHp){ regenAcc+=6*dt; if(regenAcc>=1){var b=Math.floor(regenAcc);regenAcc-=b;P.hp=Math.min(S.maxHp,P.hp+b);} }

  // portals
  if(portalCd<=0 && !P.dead) zone.portals.forEach(function(p){
    if(portalCd<=0 && dist(P.x,P.y,p.x,p.y)<42){
      var dz=ZONES[p.to];
      if(P.level<dz.minLv){ toast(dz.label+' butuh Lv '+dz.minLv+'. Kuatkan dirimu dulu.',2400); portalCd=1.5;
        var ax=zone.w/2-p.x, ay=zone.h/2-p.y, al=Math.sqrt(ax*ax+ay*ay)||1; P.x=p.x+ax/al*80; P.y=p.y+ay/al*80; }
      else enterZone(p.to,zoneId,false);
    }
  });
  // chests
  zone.chests.forEach(function(c){
    if(P.chests.indexOf(c.id)<0 && dist(P.x,P.y,c.x,c.y)<40){
      P.chests.push(c.id); P.coins+=c.coin; P.potions+=(c.pot||0); sfx('chest');
      toast('Peti harta! +'+c.coin+' koin'+(c.pot?' dan '+c.pot+' ramuan':''),2600);
      for(var i=0;i<24;i++) particles.push({x:c.x,y:c.y-10,vx:(Math.random()-.5)*4,vy:-2-Math.random()*3,life:.9,max:.9,c:'#FFD34A',r:3});
      dirty=true; save(true); hud();
    }
  });
  // monsters
  (monsters[zoneId]||[]).forEach(function(m){ updMonster(m,dt,now); });
  (bots[zoneId]||[]).forEach(function(b){ updBot(b,dt); });
  // hazards (dragon fire)
  hazards.forEach(function(h){ h.t-=dt; if(h.t<=0 && !h.done){ h.done=true; sfx('boom',clamp(1-dist(P.x,P.y,h.x,h.y)/600,0.1,0.7));
      for(var i=0;i<20;i++){var a=Math.random()*6.28,s=Math.random()*h.r;particles.push({x:h.x+Math.cos(a)*s,y:h.y+Math.sin(a)*s*0.6,vx:0,vy:-2-Math.random()*2,life:.6,max:.6,c:i%2?'#FF6A1E':'#FFC24A',r:6});}
      if(dist(P.x,P.y,h.x,h.y)<h.r) hurtPlayer(h.dmg); }
    if(h.done) h.fade-=dt; });
  hazards=hazards.filter(function(h){return !h.done||h.fade>0;});
  // peers smoothing
  Object.keys(peers).forEach(function(k){ var o=peers[k]; var dx=o.tx-o.x, dy=o.ty-o.y; var l=Math.sqrt(dx*dx+dy*dy);
    if(l>300){o.x=o.tx;o.y=o.ty;} else { o.x+=dx*Math.min(1,dt*10); o.y+=dy*Math.min(1,dt*10); }
    o.walk+= (l>1.5?dt:0); o.atkT=Math.max(0,o.atkT-dt); o.eT=Math.max(0,o.eT-dt); o.moving=l>1.5;
    if(o.spinT>0) o.spinT=Math.max(0,o.spinT-dt); if(o.shieldT>0) o.shieldT=Math.max(0,o.shieldT-dt); });
  timers.forEach(function(tm){tm.t-=dt; if(tm.t<=0 && !tm.done){tm.done=true; tm.f();}}); timers=timers.filter(function(tm){return !tm.done;});
  fx.forEach(function(e){e.t+=dt;}); fx=fx.filter(function(e){return e.t<e.d;});
  ground.forEach(function(e){e.t+=dt;}); ground=ground.filter(function(e){return e.t<e.d;});
  ghosts.forEach(function(g){g.life-=dt;}); ghosts=ghosts.filter(function(g){return g.life>0;});
  projs.forEach(function(pr){ pr.life-=dt; pr.x+=pr.vx*dt*60; pr.y+=pr.vy*dt*60; pr.spin+=dt*14;
    for(var i=0;i<2;i++) particles.push({x:pr.x+(Math.random()-.5)*8,y:pr.y+(Math.random()-.5)*8,vx:-pr.vx*0.15+(Math.random()-.5),vy:-pr.vy*0.15+(Math.random()-.5)-0.4,life:.35,max:.35,c:Math.random()<.5?'#FF8A1E':'#FFD34A',r:3+Math.random()*3});
    var hitM=(monsters[zoneId]||[]).some(function(m){return !m.dead && dist(pr.x,pr.y+12,m.x,m.y)<MON[m.type].r+12;});
    if(hitM||pr.life<=0){ pr.dead=true; sfx('boom',pr.real?0.8:0.35);
      fx.push({k:'boom',x:pr.x,y:pr.y+12,t:0,d:0.45,r:pr.r}); ground.push({k:'scorch',x:pr.x,y:pr.y+12,t:0,d:2.5,r:40});
      for(var j=0;j<22;j++){var a=Math.random()*6.28,v=2+Math.random()*6;particles.push({x:pr.x,y:pr.y+8,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,life:.55,max:.55,c:j%2?'#FF7A1E':'#FFD34A',r:3+Math.random()*3});}
      if(pr.real){ shake(5,0.2); areaDamage(pr.x,pr.y+12,pr.r,skDmg('fire'),9); } }
  }); projs=projs.filter(function(pr){return !pr.dead;});
  particles.forEach(function(p){p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;p.vx*=0.92;p.vy*=0.92;p.life-=dt;});
  particles=particles.filter(function(p){return p.life>0;});
  if(particles.length>400) particles.splice(0,particles.length-400);
  floaters.forEach(function(f){f.y-=dt*38;f.life-=dt;}); floaters=floaters.filter(function(f){return f.life>0;});
  emoteT=Math.max(0,emoteT-dt);
  // camera
  var tx=P.x-W/2, ty=P.y-H/2;
  cam.x = zone.w>W ? clamp(tx,0,zone.w-W) : (zone.w-W)/2;
  cam.y = zone.h>H ? clamp(ty,0,zone.h-H) : (zone.h-H)/2;
  // periodic
  presT-=dt; if(presT<=0){presT=0.12; sendPresence();}
  save(false);
  hudT-=dt; if(hudT<=0){hudT=0.1; hud(); actionUi();}
}
function nearestMonsterTo(x,y,range){
  var best=null,bd=range; (monsters[zoneId]||[]).forEach(function(m){ if(m.dead) return; var d=dist(x,y,m.x,m.y)-MON[m.type].r; if(d<bd){bd=d;best=m;} }); return best;
}
function updBot(b,dt){
  if(b.atkCd>0) b.atkCd-=dt;
  var tgt=nearestMonsterTo(b.x,b.y,170);
  if(tgt){
    var T=MON[tgt.type], d=dist(b.x,b.y,tgt.x,tgt.y), reach=50;
    b.f=Math.atan2(tgt.y-b.y,tgt.x-b.x);
    if(d>reach+T.r){ b.x+=Math.cos(b.f)*70*dt; b.y+=Math.sin(b.f)*70*dt; b.walk+=dt; b.moving=true; collide(b,13); }
    else {
      b.moving=false;
      if(!(b.atkCd>0)){
        b.atkCd=0.9+Math.random()*0.5;
        var dmg=Math.round((b.atk||6)*(0.85+Math.random()*0.3));
        hurtMonster(tgt,dmg,false,b.f,4);
        impact(tgt.x-Math.cos(b.f)*T.r*0.6,tgt.y-8-Math.sin(b.f)*T.r*0.6,false);
      }
    }
    if(b.eT>0) b.eT-=dt;
    return;
  }
  b.wt-=dt;
  if(b.wt<=0){ b.wt=1.5+Math.random()*3; b.tx=clamp(b.hx+(Math.random()-.5)*220,40,zone.w-40); b.ty=clamp(b.hy+(Math.random()-.5)*220,40,zone.h-40); }
  var dx=b.tx-b.x, dy=b.ty-b.y, l=Math.sqrt(dx*dx+dy*dy);
  if(l>6){ b.x+=dx/l*70*dt; b.y+=dy/l*70*dt; b.f=Math.atan2(dy,dx); b.walk+=dt; b.moving=true; collide(b,13); }
  else b.moving=false;
  if(b.eT>0) b.eT-=dt;
}
function updMonster(m,dt,now){
  var T=MON[m.type];
  if(m.dead){ if(now>=m.respawn){ m.dead=false; m.hp=m.maxHp; m.x=m.hx; m.y=m.hy; m.state='idle'; } return; }
  m.anim+=dt; m.hitT=Math.max(0,m.hitT-dt); m.lunge=Math.max(0,m.lunge-dt);
  if(m.stopT>0){ m.stopT-=dt; return; }
  if(m.stun>0){ m.stun-=dt; if(Math.random()<0.3) particles.push({x:m.x+(Math.random()-.5)*20,y:m.y-MON[m.type].r-6,vx:0,vy:-0.5,life:.25,max:.25,c:'#BFE6FF',r:2}); return; }
  m.x+=m.kbx*dt*60; m.y+=m.kby*dt*60; m.kbx*=0.8; m.kby*=0.8;
  var d=dist(m.x,m.y,P.x,P.y), sp=T.spd*60*dt, leash=T.boss?520:480;
  if(T.hop) sp*=0.1+Math.abs(Math.sin(m.anim*4))*1.7;
  if(P.dead && m.state==='chase') m.state='return';
  if(m.state==='idle'){
    if(d<T.aggro && !P.dead){ m.state='chase'; monAggro(m,d); }
    else { m.wt-=dt; if(m.wt<=0){ m.wt=2+Math.random()*3; m.tx=m.hx+(Math.random()-.5)*160; m.ty=m.hy+(Math.random()-.5)*160; }
      var wx=m.tx-m.x, wy=m.ty-m.y, wl=Math.sqrt(wx*wx+wy*wy); if(wl>4){ m.x+=wx/wl*sp*0.45; m.y+=wy/wl*sp*0.45; m.f=Math.atan2(wy,wx); } }
  } else if(m.state==='chase'){
    if(d>T.aggro*1.9 || dist(m.x,m.y,m.hx,m.hy)>leash){ m.state='return'; }
    else {
      m.f=Math.atan2(P.y-m.y,P.x-m.x);
      if(d>T.r+20){ m.x+=Math.cos(m.f)*sp; m.y+=Math.sin(m.f)*sp; }
      m.cd-=dt;
      if(d<T.r+30 && m.cd<=0){ m.cd=T.acd; m.lunge=0.2; var canHit=invT<=0&&!P.dead; hurtPlayer(Math.round(T.atk*(0.85+Math.random()*0.3)));
        if(T.steal&&canHit&&P.coins>0){ var stl=Math.min(P.coins,T.steal); P.coins-=stl; m.loot=(m.loot||0)+stl; floaters.push({x:P.x,y:P.y-60,t:'-'+stl+' 🪙',c:'#FFB0A0',life:1,s:14}); dirty=true; hud(); } }
      if(T.wail){ m.wt2=(m.wt2===undefined?T.wail*0.6:m.wt2)-dt; if(m.wt2<=0){ m.wt2=T.wail; hazards.push({x:P.x,y:P.y,r:52,t:1.0,max:1.0,dmg:Math.round(T.atk*0.9),fade:0.3}); sfx('wail',clamp(1-d/520,0.2,1)); } }
      if(T.boss){ dragonSkillT-=dt; if(dragonSkillT<=0){ dragonSkillT=5.5;
        var pts=[[P.x,P.y]]; for(var i=0;i<3;i++){var a=Math.random()*6.28,r=60+Math.random()*120; pts.push([P.x+Math.cos(a)*r,P.y+Math.sin(a)*r]);}
        pts.forEach(function(p){hazards.push({x:p[0],y:p[1],r:60,t:1.2,max:1.2,dmg:Math.round(T.atk*1.3),fade:0.3});});
      } }
    }
  } else {
    var rx=m.hx-m.x, ry=m.hy-m.y, rl=Math.sqrt(rx*rx+ry*ry);
    if(rl<8){ m.state='idle'; m.hp=Math.min(m.maxHp,m.hp+m.maxHp*0.5); } else { m.x+=rx/rl*sp*1.3; m.y+=ry/rl*sp*1.3; m.f=Math.atan2(ry,rx); }
  }
  if(m.type!=='bat' && !T.fly) collide(m,T.r*0.8);
}

/* ===================== DRAW ===================== */
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function shadow(x,y,rx){ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x,y,rx,rx*0.38,0,0,6.3);ctx.fill();}
function monColor(t){return {slime:'#6CCB5F',wolf:'#8D8C88',skeleton:'#EDE7D6',bat:'#6E58C9',spider:'#3FC7A8',golem:'#7FA7D6',dragon:'#C23B2C',tuyul:'#9CB597',pocong:'#E9E6DA',kuntilanak:'#F1EFE6',genderuwo:'#3B2E27',ent:'#3F6B2E',boneking:'#D8CFAE',crystalking:'#9FD9F0',banaspati:'#FF6A2E'}[t];}

function draw(){
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.fillStyle={ghost:'#1c2438',village:'#4a6d34',forest:'#2f5a2f',castle:'#5b574c',cave:'#1c1930',lair:'#2e150e'}[zone.kind];
  ctx.fillRect(0,0,W,H);
  var sk=shakeT>0?shakeM*(shakeT/shakeD):0, sxo=(Math.random()-.5)*2*sk, syo=(Math.random()-.5)*2*sk;
  ctx.save(); ctx.translate(-Math.round(cam.x)+sxo,-Math.round(cam.y)+syo);
  ctx.drawImage(zone.bg,0,0);
  ground.forEach(drawGround);
  var t=performance.now()/1000;
  hazards.forEach(function(h){ var p=h.done?0:1-h.t/h.max;
    ctx.fillStyle=h.done?'rgba(255,140,40,'+(h.fade*2)+')':'rgba(226,60,40,'+(0.18+p*0.25)+')';
    ctx.beginPath();ctx.ellipse(h.x,h.y,h.r,h.r*0.6,0,0,6.3);ctx.fill();
    if(!h.done){ctx.strokeStyle='#FF4A2A';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(h.x,h.y,h.r*p,h.r*0.6*p,0,0,6.3);ctx.stroke();}
  });
  zone.portals.forEach(function(p){drawPortal(p,t);});
  var list=[], x0=cam.x-120, x1=cam.x+W+120, y0=cam.y-160, y1=cam.y+H+160;
  function vis(o){return o.x>x0&&o.x<x1&&o.y>y0&&o.y<y1;}
  zone.deco.forEach(function(d){ if(vis(d)) list.push({y:d.y,f:function(){drawDeco(d,t);}}); });
  zone.chests.forEach(function(c){ if(vis(c)) list.push({y:c.y,f:function(){drawChest(c);}}); });
  zone.npcs.forEach(function(n){ if(vis(n)) list.push({y:n.y,f:function(){drawNpc(n,t);}}); });
  (monsters[zoneId]||[]).forEach(function(m){ if(!m.dead&&vis(m)) list.push({y:m.y,f:function(){drawMonster(m,t);}}); });
  (bots[zoneId]||[]).forEach(function(b){ if(vis(b)) list.push({y:b.y,f:function(){
    drawHero(b.x,b.y,b.f,b.moving?b.walk:0,0,colorFor(b.name),false,b.name,0,b.hp,b.maxHp,0,false,{gender:genderFor(b.name),design:designFor(b.name)});
    if(b.eT>0) bubble(b.x,b.y-78,'👋',b.eT); }}); });
  Object.keys(peers).forEach(function(k){ var o=peers[k]; if(vis(o)) list.push({y:o.y,f:function(){
    drawHero(o.x,o.y,o.f,o.moving?o.walk:0,o.atkT,(o.el&&ELM[o.el])?ELM[o.el].c:colorFor(o.n),false,o.n,o.lv,o.hp,o.mh,0,o.hero,{kind:o.ak||0,spin:o.spinT>0?o.spinA+(1-o.spinT/0.5)*12.56:null,shield:o.shieldT,gender:o.g,design:o.ds});
    if(o.eT>0) bubble(o.x,o.y-78,o.e,o.eT); }}); });
  if(!P.dead) list.push({y:P.y,f:function(){ var S=stats(); drawHero(P.x,P.y,P.f,P.walking?walkT:0,atkT,elDef().c,true,P.name,P.level,P.hp,S.maxHp,hurtT,P.hero,{kind:atkKind,spin:P.spinT>0?P.spinA+(1-P.spinT/0.5)*12.56:null,shield:P.shieldT,dash:P.dashT>0,gender:P.gender,design:P.design}); if(emoteT>0) bubble(P.x,P.y-78,P.e,emoteT); }});
  ghosts.forEach(function(g){ ctx.globalAlpha=Math.max(0,g.life/g.max)*0.45; drawHero(g.x,g.y,g.f,0,0,g.c,false,'',0,1,1,0,false,{ghost:true}); }); ctx.globalAlpha=1;
  list.sort(function(a,b){return a.y-b.y;}); list.forEach(function(o){o.f();});
  projs.forEach(drawProj);
  fx.forEach(drawFx);
  particles.forEach(function(p){ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.3);ctx.fill();});
  ctx.globalAlpha=1;
  floaters.forEach(function(f){ctx.globalAlpha=Math.min(1,f.life*2);ctx.font='600 '+f.s+'px Fredoka, sans-serif';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.65)';ctx.strokeText(f.t,f.x,f.y);ctx.fillStyle=f.c;ctx.fillText(f.t,f.x,f.y);});
  ctx.globalAlpha=1;
  ctx.restore();
  if(zone.kind==='cave'){ var g=ctx.createRadialGradient(P.x-cam.x,P.y-cam.y,90,P.x-cam.x,P.y-cam.y,Math.max(W,H)*0.75); g.addColorStop(0,'rgba(10,6,25,0)'); g.addColorStop(1,'rgba(10,6,25,.55)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); }
  if(zone.kind==='ghost'){
    var tg=performance.now()/1000;
    ctx.fillStyle='rgba(8,12,40,.22)'; ctx.fillRect(0,0,W,H);
    ctx.globalCompositeOperation='lighter';
    for(var oi=0;oi<16;oi++){ var ox=((oi*397)%zone.w)+Math.sin(tg*0.6+oi)*40-cam.x, oy=((oi*233)%zone.h)+Math.cos(tg*0.5+oi*1.7)*30-cam.y-20; if(ox<-40||ox>W+40||oy<-40||oy>H+40) continue;
      var orad=16+Math.sin(tg*2+oi)*4, og=ctx.createRadialGradient(ox,oy,1,ox,oy,orad); og.addColorStop(0,'rgba(140,255,230,.55)'); og.addColorStop(1,'rgba(140,255,230,0)'); ctx.fillStyle=og; ctx.beginPath(); ctx.arc(ox,oy,orad,0,6.3); ctx.fill(); }
    ctx.globalCompositeOperation='source-over';
    for(var fi2=0;fi2<5;fi2++){ var fx0=((tg*12*(1+fi2*0.3)+fi2*260)%(W+400))-200, fy0=H*(0.18+fi2*0.17), fr=200+fi2*30, fg=ctx.createRadialGradient(fx0,fy0,10,fx0,fy0,fr); fg.addColorStop(0,'rgba(170,190,230,.10)'); fg.addColorStop(1,'rgba(170,190,230,0)'); ctx.fillStyle=fg; ctx.fillRect(fx0-fr,fy0-fr,fr*2,fr*2); }
    var vg=ctx.createRadialGradient(P.x-cam.x,P.y-cam.y,120,P.x-cam.x,P.y-cam.y,Math.max(W,H)*0.8); vg.addColorStop(0,'rgba(5,8,25,0)'); vg.addColorStop(1,'rgba(5,8,25,.5)'); ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);
  }
  if(hurtT>0){ ctx.fillStyle='rgba(220,40,30,'+(hurtT*0.6)+')'; ctx.fillRect(0,0,W,H); }
  if(flashT>0){ ctx.fillStyle='rgba(235,245,255,'+(flashT*1.6)+')'; ctx.fillRect(0,0,W,H); }
  if(joy){ ctx.globalAlpha=0.5; ctx.fillStyle='#1a1a1a'; ctx.beginPath(); ctx.arc(joy.ox,joy.oy,52,0,6.3); ctx.fill();
    ctx.strokeStyle='#F4E7C8'; ctx.lineWidth=3; ctx.stroke(); ctx.globalAlpha=0.9; ctx.fillStyle='#F0B541';
    ctx.beginPath(); ctx.arc(joy.ox+input.jx*50,joy.oy+input.jy*50,24,0,6.3); ctx.fill(); ctx.globalAlpha=1; }
}

function bubble(x,y,e,life){
  ctx.globalAlpha=Math.min(1,life*2); ctx.fillStyle='#fff'; rr(ctx,x-20,y-18,40,34,12); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x-6,y+15); ctx.lineTo(x,y+23); ctx.lineTo(x+6,y+15); ctx.fill();
  ctx.font='22px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(e,x,y); ctx.textBaseline='alphabetic'; ctx.globalAlpha=1;
}
function label(x,y,text,lv,col){
  ctx.font='500 12px Fredoka, sans-serif'; ctx.textAlign='center';
  var s=lv?text+'  Lv'+lv:text, w=ctx.measureText(s).width+12;
  ctx.fillStyle='rgba(20,14,8,.62)'; rr(ctx,x-w/2,y-13,w,17,8); ctx.fill();
  ctx.fillStyle=col||'#fff'; ctx.fillText(s,x,y);
}
function drawHero(x,y,f,wt,at,tunic,isMe,name,lv,hp,mh,hurt,hero,opt){
  opt=opt||{};
  var moving=wt>0, bob=moving?Math.abs(Math.sin(wt*11))*2.5:0, leg=moving?Math.sin(wt*11)*5:0;
  var fx=Math.cos(f), fy=Math.sin(f), up=fy<-0.45;
  if(!opt.ghost) shadow(x,y+14,15);
  ctx.save(); ctx.translate(x,y-bob);
  if(isMe && hurt>0 && Math.floor(hurt*30)%2) ctx.globalAlpha=0.5;
  if(opt.dash){ ctx.rotate(Math.cos(f)*0.25); }
  var BUILDS={0:{sx:1,sy:1},1:{sx:0.88,sy:1.02},2:{sx:1.16,sy:0.9},3:{sx:0.9,sy:1.14},4:{sx:1.14,sy:1.1}}, bs=BUILDS[opt.design]||BUILDS[0];
  ctx.scale(bs.sx,bs.sy);
  if(opt.design===4){
    ctx.fillStyle='#7A1F1F'; ctx.beginPath(); ctx.moveTo(-10,-9); ctx.quadraticCurveTo(-18,10,-14,22); ctx.lineTo(14,22); ctx.quadraticCurveTo(18,10,10,-9); ctx.closePath(); ctx.fill();
  }
  var drawSword=function(){
    ctx.save();
    if(opt.spin!=null){ var sa=opt.spin;
      for(var k=1;k<=4;k++){ ctx.strokeStyle='rgba(200,235,255,'+(0.5-k*0.1)+')'; ctx.lineWidth=12-k*2; ctx.lineCap='round'; ctx.beginPath(); ctx.arc(0,-6,34,sa-k*0.45,sa-(k-1)*0.45); ctx.stroke(); }
      ctx.translate(Math.cos(sa)*8,-6+Math.sin(sa)*8); ctx.rotate(sa);
    } else if(at>0){ var p=1-at/0.25, e=1-Math.pow(1-p,3), kind=opt.kind||0;
      if(kind===2){
        var reach=Math.sin(p*Math.PI)*18;
        ctx.fillStyle='rgba(255,245,200,'+(0.6*(1-p))+')'; ctx.beginPath(); ctx.moveTo(Math.cos(f-0.25)*20,-6+Math.sin(f-0.25)*20); ctx.lineTo(Math.cos(f)*(60+reach),-6+Math.sin(f)*(60+reach)); ctx.lineTo(Math.cos(f+0.25)*20,-6+Math.sin(f+0.25)*20); ctx.closePath(); ctx.fill();
        ctx.translate(Math.cos(f)*(8+reach),-6+Math.sin(f)*(8+reach)); ctx.rotate(f);
      } else {
        var a0=kind===0?f-1.5:f+1.5, a1=kind===0?f+1.5:f-1.5, ang=a0+(a1-a0)*e;
        ctx.fillStyle='rgba(255,255,255,'+(0.55*(1-p*0.6))+')'; ctx.beginPath();
        ctx.arc(0,-6,40,Math.min(a0,ang),Math.max(a0,ang)); ctx.arc(0,-6,22,Math.max(a0,ang),Math.min(a0,ang),true); ctx.closePath(); ctx.fill();
        ctx.strokeStyle='rgba(180,225,255,'+(0.7*(1-p))+')'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(0,-6,42,Math.min(a0,ang),Math.max(a0,ang)); ctx.stroke();
        ctx.translate(Math.cos(ang)*8,-6+Math.sin(ang)*8); ctx.rotate(ang);
      }
    } else { ctx.translate(fx>=0?12:-12,0); ctx.rotate(fx>=0?-0.5:-2.64); }
    ctx.fillStyle='#6B4A2A'; rr(ctx,-2,-3,8,6,2); ctx.fill();
    ctx.fillStyle='#3A2612'; ctx.beginPath(); ctx.arc(-2,0,2.2,0,6.3); ctx.fill();
    ctx.fillStyle='#D6A93A'; ctx.fillRect(5,-6,4,12);
    ctx.fillStyle='#E6EEF2'; ctx.strokeStyle='#8093A0'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(9,-3); ctx.lineTo(30,-2); ctx.lineTo(34,0); ctx.lineTo(30,2); ctx.lineTo(9,3); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.65)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(10,-0.5); ctx.lineTo(30,-0.2); ctx.stroke();
    ctx.restore();
  };
  if(up) drawSword();
  ctx.fillStyle='#4A3526'; rr(ctx,-8,2+leg*0.35,6,11,3); ctx.fill(); rr(ctx,2,2-leg*0.35,6,11,3); ctx.fill();
  ctx.fillStyle='#2B1D12'; rr(ctx,-8,10+leg*0.35,6,6,2); ctx.fill(); rr(ctx,2,10-leg*0.35,6,6,2); ctx.fill();
  if(hero){ ctx.fillStyle='#C23B2C'; ctx.beginPath(); ctx.moveTo(-11,-10); ctx.lineTo(11,-10); ctx.lineTo(14+Math.sin(wt*8)*2,12); ctx.lineTo(-14,12); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle=tunic; ctx.strokeStyle='rgba(0,0,0,.3)'; ctx.lineWidth=1.5;
  rr(ctx,-16,-7-leg*0.25,6,12,3); ctx.fill(); ctx.stroke(); rr(ctx,10,-7+leg*0.25,6,12,3); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#F2C9A0'; ctx.beginPath(); ctx.arc(-13,6-leg*0.25,3.4,0,6.3); ctx.fill(); ctx.beginPath(); ctx.arc(13,6+leg*0.25,3.4,0,6.3); ctx.fill();
  ctx.fillStyle=tunic; ctx.strokeStyle='rgba(0,0,0,.35)'; ctx.lineWidth=2; rr(ctx,-11,-10,22,19,7); ctx.fill(); ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.16)'; rr(ctx,-8,-8,7,5,3); ctx.fill();
  if(opt.design===1){ ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(-9,-9); ctx.lineTo(8,8); ctx.stroke(); }
  else if(opt.design===2){ ctx.fillStyle=tunic; ctx.strokeStyle='rgba(0,0,0,.35)'; ctx.lineWidth=2; rr(ctx,-16,-9,6,8,2); ctx.fill(); ctx.stroke(); rr(ctx,10,-9,6,8,2); ctx.fill(); ctx.stroke(); }
  else if(opt.design===3){ ctx.fillStyle='#C9A227'; ctx.strokeStyle='rgba(0,0,0,.3)'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(-11,-9); ctx.lineTo(-3,-9); ctx.lineTo(6,8); ctx.lineTo(-2,8); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.25)'; ctx.beginPath(); ctx.moveTo(-9,-8); ctx.lineTo(-6,-8); ctx.lineTo(2,7); ctx.lineTo(-1,7); ctx.closePath(); ctx.fill(); }
  else if(opt.design===4){ ctx.fillStyle='#E8C34A'; rr(ctx,-14,-10,5,5,2); ctx.fill(); rr(ctx,9,-10,5,5,2); ctx.fill(); }
  ctx.fillStyle='#5A3A20'; ctx.fillRect(-11,1,22,4); ctx.fillStyle='#E8C34A'; ctx.fillRect(-2,1,4,4);
  ctx.fillStyle='#F2C9A0'; ctx.beginPath(); ctx.arc(0,-20,11,0,6.3); ctx.fill(); ctx.stroke();
  var isF=opt.gender==='f', hairC=isMe?'#5B3A1E':'#2F2A26';
  if(isF){
    ctx.fillStyle=hairC;
    ctx.beginPath(); ctx.moveTo(-11,-24); ctx.quadraticCurveTo(-15,-8,-9,6); ctx.quadraticCurveTo(-13,-8,-11.5,-24); ctx.fill();
    ctx.beginPath(); ctx.moveTo(11,-24); ctx.quadraticCurveTo(15,-8,9,6); ctx.quadraticCurveTo(13,-8,11.5,-24); ctx.fill();
    ctx.beginPath(); ctx.arc(0,-23,11.8,Math.PI*1.02,Math.PI*1.98); ctx.fill();
    ctx.fillStyle='#E85D8A'; ctx.beginPath(); ctx.arc(-8,-27,2.4,0,6.3); ctx.fill();
  } else {
    ctx.fillStyle=hairC; ctx.beginPath(); ctx.arc(0,-22,11.5,Math.PI*1.05,Math.PI*1.95); ctx.fill();
  }
  if(opt.design===1){
    ctx.strokeStyle='#C23B2C'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(0,-21,11.5,Math.PI*1.08,Math.PI*1.92); ctx.stroke();
    ctx.fillStyle='#C23B2C'; ctx.fillRect(8,-26,5,3); ctx.fillRect(8,-21,5,3);
  } else if(opt.design===2){
    ctx.fillStyle='#D9B463'; ctx.strokeStyle='#8a6a30'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(-19,-27); ctx.quadraticCurveTo(0,-42,19,-27); ctx.quadraticCurveTo(0,-33,-19,-27); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#5a3a10'; ctx.beginPath(); ctx.arc(0,-30,2.2,0,6.3); ctx.fill();
  } else if(opt.design===3){
    ctx.fillStyle='#1C1C1C'; rr(ctx,-9,-33,18,10,3); ctx.fill();
  } else if(opt.design===4){
    ctx.fillStyle='#E8C34A';
    ctx.beginPath(); ctx.moveTo(-10,-29); ctx.lineTo(-10,-23); ctx.lineTo(-4,-30); ctx.lineTo(0,-23); ctx.lineTo(4,-30); ctx.lineTo(10,-23); ctx.lineTo(10,-29); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#C23B2C'; ctx.beginPath(); ctx.arc(0,-27,2,0,6.3); ctx.fill();
  }
  if(!up){ ctx.fillStyle='#2B1D12'; var ex=fx*3.5; ctx.beginPath(); ctx.arc(-4+ex,-19,1.8,0,6.3); ctx.arc(4+ex,-19,1.8,0,6.3); ctx.fill();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(-4.7+ex,-19.7,0.65,0,6.3); ctx.arc(3.3+ex,-19.7,0.65,0,6.3); ctx.fill();
    ctx.strokeStyle='#2B1D12'; ctx.lineWidth=1.2; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(-6.2+ex,-22.6); ctx.lineTo(-2.4+ex,-23); ctx.moveTo(2.4+ex,-23); ctx.lineTo(6.2+ex,-22.6); ctx.stroke();
    ctx.fillStyle='rgba(230,110,110,.45)'; ctx.beginPath(); ctx.arc(-7+ex,-15,2.2,0,6.3); ctx.arc(7+ex,-15,2.2,0,6.3); ctx.fill(); }
  if(!up) drawSword();
  if(opt.shield>0){ var tt=performance.now()/1000, al=Math.min(1,opt.shield*2);
    ctx.globalAlpha=al*0.22; ctx.fillStyle='#FFE9A0'; ctx.beginPath(); ctx.arc(0,-6,36+Math.sin(tt*6)*2,0,6.3); ctx.fill();
    ctx.globalAlpha=al*0.9; ctx.strokeStyle='#FFE08A'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(0,-6,36+Math.sin(tt*6)*2,0,6.3); ctx.stroke();
    ctx.fillStyle='#FFF6D0'; for(var ri=0;ri<6;ri++){ var ra=tt*2.2+ri*1.047; ctx.save(); ctx.translate(Math.cos(ra)*36,-6+Math.sin(ra)*36*0.9); ctx.rotate(ra); ctx.fillRect(-3,-3,6,6); ctx.restore(); }
    ctx.globalAlpha=1; }
  ctx.restore(); ctx.globalAlpha=1;
  if(opt.ghost) return;
  label(x,y-40-bob,name,lv,isMe?'#FFE08A':'#fff');
  if(!isMe && hp<mh){ ctx.fillStyle='#3a1d15'; ctx.fillRect(x-16,y+20,32,4); ctx.fillStyle='#E0503C'; ctx.fillRect(x-16,y+20,32*clamp(hp/mh,0,1),4); }
}
function drawGround(e){
  var p=e.t/e.d;
  if(e.k==='scorch'){ ctx.globalAlpha=0.45*(1-p); ctx.fillStyle='#1a0e08'; ctx.beginPath(); ctx.ellipse(e.x,e.y,e.r,e.r*0.55,0,0,6.3); ctx.fill();
    ctx.globalAlpha=0.5*(1-p); ctx.fillStyle='#FF7A1E'; ctx.beginPath(); ctx.ellipse(e.x,e.y,e.r*0.35*(1-p),e.r*0.2*(1-p),0,0,6.3); ctx.fill(); ctx.globalAlpha=1; }
  else if(e.k==='tele'){ ctx.fillStyle='rgba(255,70,30,'+(0.12+p*0.2)+')'; ctx.beginPath(); ctx.ellipse(e.x,e.y,e.r,e.r*0.6,0,0,6.3); ctx.fill();
    ctx.strokeStyle='rgba(255,90,40,.9)'; ctx.lineWidth=3; ctx.setLineDash([10,8]); ctx.lineDashOffset=-e.t*60; ctx.beginPath(); ctx.ellipse(e.x,e.y,e.r,e.r*0.6,0,0,6.3); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle='#FFD34A'; ctx.lineWidth=4; ctx.beginPath(); ctx.ellipse(e.x,e.y,e.r*p,e.r*0.6*p,0,0,6.3); ctx.stroke(); }
  else if(e.k==='crack'){ ctx.globalAlpha=0.55*(1-p); ctx.fillStyle='#4A3320'; ctx.beginPath(); ctx.ellipse(e.x,e.y,e.r,e.r*0.5,0,0,6.3); ctx.fill();
    ctx.strokeStyle='rgba(60,40,20,'+(0.8*(1-p))+')'; ctx.lineWidth=2; for(var ci=0;ci<4;ci++){ var ca=ci*1.57+e.r; ctx.beginPath(); ctx.moveTo(e.x,e.y); ctx.lineTo(e.x+Math.cos(ca)*e.r*1.3,e.y+Math.sin(ca)*e.r*0.7); ctx.stroke(); } ctx.globalAlpha=1; }
}
function drawProj(pr){
  var g=ctx.createRadialGradient(pr.x,pr.y,2,pr.x,pr.y,24); g.addColorStop(0,'rgba(255,250,210,1)'); g.addColorStop(0.35,'rgba(255,180,60,.95)'); g.addColorStop(1,'rgba(255,80,20,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(pr.x,pr.y,24,0,6.3); ctx.fill();
  ctx.strokeStyle='rgba(255,230,150,.9)'; ctx.lineWidth=2.5;
  for(var i=0;i<3;i++){ ctx.beginPath(); ctx.arc(pr.x,pr.y,11,pr.spin+i*2.1,pr.spin+i*2.1+1.1); ctx.stroke(); }
  ctx.fillStyle='rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(pr.x,pr.y+26,10,4,0,0,6.3); ctx.fill();
}
function drawFx(e){
  var p=e.t/e.d, i;
  if(e.k==='ring'){ ctx.strokeStyle='rgba('+e.c+','+(1-p)+')'; ctx.lineWidth=e.w*(1-p)+1; var r=e.r0+(e.r1-e.r0)*(1-Math.pow(1-p,2));
    ctx.beginPath(); if(e.flat) ctx.ellipse(e.x,e.y,r,r*0.55,0,0,6.3); else ctx.arc(e.x,e.y,r,0,6.3); ctx.stroke(); }
  else if(e.k==='impact'){ ctx.save(); ctx.translate(e.x,e.y); ctx.rotate(e.x); ctx.strokeStyle='rgba(255,250,220,'+(1-p)+')'; ctx.lineWidth=3*e.s;
    for(i=0;i<6;i++){ var a=i*1.047, r1=6*e.s+p*10*e.s, r2=14*e.s+p*18*e.s; ctx.beginPath(); ctx.moveTo(Math.cos(a)*r1,Math.sin(a)*r1); ctx.lineTo(Math.cos(a)*r2,Math.sin(a)*r2); ctx.stroke(); }
    ctx.fillStyle='rgba(255,255,255,'+(1-p)+')'; ctx.beginPath(); ctx.arc(0,0,8*e.s*(1-p),0,6.3); ctx.fill(); ctx.restore(); }
  else if(e.k==='spin'){ var o=e.o; ctx.save(); ctx.translate(o.x,o.y-6);
    for(i=0;i<3;i++){ var ra=p*12.56+i*2.09; ctx.strokeStyle='rgba(170,220,255,'+(0.55*(1-p))+')'; ctx.lineWidth=6; ctx.beginPath(); ctx.arc(0,0,58+i*14+p*20,ra,ra+1.4); ctx.stroke(); }
    ctx.fillStyle='rgba(200,235,255,'+(0.15*(1-p))+')'; ctx.beginPath(); ctx.ellipse(0,16,100,50,0,0,6.3); ctx.fill(); ctx.restore(); }
  else if(e.k==='wave'){ var ow=e.o, aw=e.ang;
    ctx.save(); ctx.translate(ow.x,ow.y-6); ctx.rotate(aw);
    var reach=40+p*150, wid=70+p*60;
    ctx.fillStyle='rgba(60,150,220,'+(0.5*(1-p))+')';
    ctx.beginPath(); ctx.moveTo(0,-wid*0.15); ctx.quadraticCurveTo(reach*0.6,-wid*0.55,reach,0); ctx.quadraticCurveTo(reach*0.6,wid*0.55,0,wid*0.15); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(210,240,255,'+(0.8*(1-p))+')'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(reach*0.3,-wid*0.4); ctx.quadraticCurveTo(reach*0.9,-wid*0.15,reach,0); ctx.quadraticCurveTo(reach*0.9,wid*0.15,reach*0.3,wid*0.4); ctx.stroke();
    ctx.restore(); }
  else if(e.k==='vortex'){ var ov=e.o;
    ctx.save(); ctx.translate(ov.x,ov.y-6);
    for(i=0;i<4;i++){ var rr=18+i*22*(0.4+p*0.8), ra2=-p*10+i*1.2; ctx.strokeStyle='rgba(120,230,210,'+(0.55*(1-p))+')'; ctx.lineWidth=5-i*0.7;
      ctx.beginPath(); ctx.arc(0,0,rr,ra2,ra2+2.4); ctx.stroke(); }
    ctx.fillStyle='rgba(180,255,240,'+(0.2*(1-p))+')'; ctx.beginPath(); ctx.ellipse(0,16,100+p*40,45+p*15,0,0,6.3); ctx.fill();
    ctx.restore(); }
  else if(e.k==='spike'){ var g4=1-Math.pow(1-Math.min(1,p*2.4),2), fall=p>0.55?(p-0.55)/0.45:0, h=48*g4*(1-fall*0.7);
    ctx.save(); ctx.translate(e.x,e.y);
    ctx.fillStyle='rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0,4,16,6,0,0,6.3); ctx.fill();
    ctx.fillStyle='#6E5A3E'; ctx.beginPath(); ctx.moveTo(-11,4); ctx.lineTo(-3,-h); ctx.lineTo(3,-h*0.9); ctx.lineTo(9,4); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#8C7550'; ctx.beginPath(); ctx.moveTo(-2,4); ctx.lineTo(1,-h*0.85); ctx.lineTo(4,-h*0.7); ctx.lineTo(5,4); ctx.closePath(); ctx.fill();
    ctx.restore(); }
  else if(e.k==='boom'){ var rr2=e.r*(0.3+0.9*(1-Math.pow(1-p,3)));
    var g=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,rr2); g.addColorStop(0,'rgba(255,255,230,'+(1-p)+')'); g.addColorStop(0.4,'rgba(255,170,50,'+(0.9*(1-p))+')'); g.addColorStop(1,'rgba(200,50,20,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(e.x,e.y-10,rr2,rr2*0.8,0,0,6.3); ctx.fill();
    ctx.fillStyle='rgba(90,70,60,'+(0.5*(1-p))+')'; for(i=0;i<5;i++){ var sa=i*1.26+e.x; ctx.beginPath(); ctx.arc(e.x+Math.cos(sa)*rr2*0.6,e.y-10-p*40+Math.sin(sa)*rr2*0.3,10+p*14,0,6.3); ctx.fill(); } }
  else if(e.k==='bolt'){ var top=e.y-480, segs=12, al=p<0.3?1:1-(p-0.3)/0.7;
    var pts=[[e.x+(Math.random()-.5)*30,top]]; for(i=1;i<segs;i++){ pts.push([e.x+(Math.random()-.5)*44*(1-i/segs),top+(e.y-top)*i/segs]); } pts.push([e.x,e.y]);
    [[14,'rgba(120,190,255,'+(0.35*al)+')'],[6,'rgba(190,230,255,'+(0.8*al)+')'],[2.5,'rgba(255,255,255,'+al+')']].forEach(function(L){
      ctx.strokeStyle=L[1]; ctx.lineWidth=L[0]; ctx.lineJoin='round'; ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]); for(var j=1;j<pts.length;j++) ctx.lineTo(pts[j][0],pts[j][1]); ctx.stroke(); });
    ctx.fillStyle='rgba(220,240,255,'+(0.7*al)+')'; ctx.beginPath(); ctx.ellipse(e.x,e.y,30*(1+p),16*(1+p),0,0,6.3); ctx.fill(); }
  else if(e.k==='charge'){ var o2=e.o, c=e.c||'170,220,255'; for(i=0;i<8;i++){ var a2=i*0.785+e.t*6, r3=50*(1-p); ctx.fillStyle='rgba('+c+','+(1-p)+')'; ctx.beginPath(); ctx.arc(o2.x+Math.cos(a2)*r3,o2.y-8+Math.sin(a2)*r3,3,0,6.3); ctx.fill(); }
    ctx.fillStyle='rgba('+c+','+(0.5*p)+')'; ctx.beginPath(); ctx.arc(o2.x,o2.y-8,10*p,0,6.3); ctx.fill(); }
  else if(e.k==='meteor'){ var ep=p*p, sx=e.x+260*(1-ep), sy=e.y-560*(1-ep);
    for(i=6;i>0;i--){ ctx.fillStyle='rgba(255,'+(120+i*18)+',40,'+(0.18*i/6+0.08)+')'; ctx.beginPath(); ctx.arc(sx+i*14,sy-i*30,26-i*2.5,0,6.3); ctx.fill(); }
    var g2=ctx.createRadialGradient(sx,sy,4,sx,sy,40); g2.addColorStop(0,'rgba(255,240,180,1)'); g2.addColorStop(0.5,'rgba(255,120,30,.9)'); g2.addColorStop(1,'rgba(255,60,20,0)'); ctx.fillStyle=g2; ctx.beginPath(); ctx.arc(sx,sy,40,0,6.3); ctx.fill();
    ctx.fillStyle='#4A2E22'; ctx.beginPath(); ctx.arc(sx,sy,18,0,6.3); ctx.fill(); ctx.fillStyle='#FF8A1E'; ctx.beginPath(); ctx.arc(sx-5,sy+4,6,0,6.3); ctx.arc(sx+6,sy-5,4,0,6.3); ctx.fill(); }
  else if(e.k==='pillar'){ var o3=e.o, al2=p<0.2?p/0.2:1-(p-0.2)/0.8, w2=46*(1-p*0.5);
    var g3=ctx.createLinearGradient(0,o3.y-260,0,o3.y+10); g3.addColorStop(0,'rgba(255,220,100,0)'); g3.addColorStop(1,'rgba(255,220,100,'+(0.6*al2)+')');
    ctx.fillStyle=g3; ctx.fillRect(o3.x-w2/2,o3.y-260,w2,270);
    for(i=0;i<4;i++){ var yy=o3.y-((e.t*160+i*60)%240); ctx.strokeStyle='rgba(255,240,170,'+(0.7*al2)+')'; ctx.lineWidth=2; ctx.beginPath(); ctx.ellipse(o3.x,yy,w2*0.7,8,0,0,6.3); ctx.stroke(); } }
  else if(e.k==='rise'){ var o4=e.o; for(i=0;i<3;i++){ var q=(p+i/3)%1; ctx.strokeStyle='rgba(255,230,140,'+(1-q)+')'; ctx.lineWidth=3; ctx.beginPath(); ctx.ellipse(o4.x,o4.y+12-q*60,30,9,0,0,6.3); ctx.stroke(); } }
  else if(e.k==='ripple'){ var o5=e.o; ctx.strokeStyle='rgba(255,240,180,'+(1-p)+')'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(o5.x,o5.y-6,36+p*14,0,6.3); ctx.stroke(); }
  else if(e.k==='death'){ var m=e.m, sc=1+p*0.3; ctx.save(); ctx.globalAlpha=1-p; ctx.translate(m.x,m.y); ctx.scale(sc,1-p*0.7); ctx.translate(-m.x,-m.y); m.hitT=p<0.3?1:0; drawMonster(m,0); ctx.restore(); ctx.globalAlpha=1; }
  else if(e.k==='soul'){ ctx.globalAlpha=1-p; ctx.fillStyle='#E8F6FF'; var yy2=e.y-p*60; ctx.beginPath(); ctx.arc(e.x+Math.sin(p*12)*6,yy2,6,0,6.3); ctx.fill();
    ctx.beginPath(); ctx.moveTo(e.x-5,yy2); ctx.quadraticCurveTo(e.x+Math.sin(p*12+2)*8,yy2+14,e.x,yy2+20); ctx.lineTo(e.x+5,yy2); ctx.fill(); ctx.globalAlpha=1; }
}
function drawNpc(n,t){
  var bob=Math.sin(t*2+n.x)*1.5;
  shadow(n.x,n.y+14,15);
  ctx.save(); ctx.translate(n.x,n.y-bob);
  ctx.fillStyle=n.robe; ctx.strokeStyle='rgba(0,0,0,.35)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(-10,-10); ctx.lineTo(10,-10); ctx.lineTo(15,15); ctx.lineTo(-15,15); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#F2C9A0'; ctx.beginPath(); ctx.arc(0,-20,10.5,0,6.3); ctx.fill(); ctx.stroke();
  if(n.hat){ ctx.fillStyle=n.robe; ctx.beginPath(); ctx.moveTo(-15,-24); ctx.lineTo(15,-24); ctx.lineTo(4,-52); ctx.lineTo(-2,-44); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#F0B541'; ctx.beginPath(); ctx.arc(1,-36,2.5,0,6.3); ctx.fill();
    ctx.fillStyle='#E8E4D8'; ctx.beginPath(); ctx.moveTo(-7,-15); ctx.quadraticCurveTo(0,4,7,-15); ctx.fill(); }
  else if(n.blangkon){ ctx.fillStyle='#4A2E1C'; ctx.beginPath(); ctx.arc(0,-24,11,Math.PI,0); ctx.fill(); ctx.fillStyle='#8B5E34'; ctx.fillRect(-11,-25,22,3);
    ctx.fillStyle='#4A2E1C'; ctx.beginPath(); ctx.arc(-10,-22,4,0,6.3); ctx.fill(); ctx.fillStyle='#E8E4D8'; ctx.beginPath(); ctx.moveTo(-6,-15); ctx.quadraticCurveTo(0,2,6,-15); ctx.fill(); }
  else { ctx.fillStyle='#6B4A2A'; ctx.beginPath(); ctx.ellipse(0,-27,15,5,0,0,6.3); ctx.fill(); rr(ctx,-8,-38,16,11,4); ctx.fill(); }
  ctx.fillStyle='#2B1D12'; ctx.beginPath(); ctx.arc(-3.5,-20,1.7,0,6.3); ctx.arc(3.5,-20,1.7,0,6.3); ctx.fill();
  ctx.restore();
  label(n.x,n.y-(n.hat?64:50),n.name,0,'#CFE8FF');
  var mk=npcMarker(n.id);
  if(mk){ var yy=n.y-(n.hat?86:72)+Math.sin(t*4)*3; ctx.font='600 22px Fredoka, sans-serif'; ctx.textAlign='center'; ctx.lineWidth=4; ctx.strokeStyle='#3a2400'; ctx.strokeText(mk,n.x,yy); ctx.fillStyle='#FFD34A'; ctx.fillText(mk,n.x,yy); }
}
function drawMonster(m,t){
  var T=MON[m.type], x=m.x, y=m.y, a=m.anim, c=monColor(m.type), fl=m.hitT>0;
  var lx=m.lunge>0?Math.cos(m.f)*8:0, ly=m.lunge>0?Math.sin(m.f)*8:0;
  ctx.save(); ctx.translate(lx,ly);
  var face=Math.cos(m.f)>=0?1:-1;
  if(T.boss && m.hp>0){
    var br=T.r+18+Math.sin(a*2)*4, bgy=y+T.r*0.35;
    ctx.globalAlpha=0.16; ctx.fillStyle='#FFD34A'; ctx.beginPath(); ctx.ellipse(x,bgy,br*0.9,br*0.38,0,0,6.3); ctx.fill();
    ctx.globalAlpha=0.4; ctx.strokeStyle='#FFD34A'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.ellipse(x,bgy,br,br*0.42,0,0,6.3); ctx.stroke();
    ctx.globalAlpha=1;
    for(var bi=0;bi<4;bi++){ var ba=a*1.2+bi*1.57; ctx.fillStyle='rgba(255,211,74,.85)'; ctx.beginPath(); ctx.arc(x+Math.cos(ba)*br*0.9,bgy+Math.sin(ba)*br*0.38,2.4,0,6.3); ctx.fill(); }
  }
  if(m.type==='slime'){
    var sq=Math.sin(a*6)*0.12; shadow(x,y+12,16);
    ctx.fillStyle=fl?'#fff':c; ctx.strokeStyle='#2F7A2A'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.ellipse(x,y,16*(1+sq),13*(1-sq),0,Math.PI,0); ctx.lineTo(x+16*(1+sq),y+10); ctx.quadraticCurveTo(x,y+14,x-16*(1+sq),y+10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.55)'; ctx.beginPath(); ctx.ellipse(x-6,y-6,4,3,-.5,0,6.3); ctx.fill();
    ctx.fillStyle='#173d14'; ctx.beginPath(); ctx.arc(x-5+face*2,y,2.2,0,6.3); ctx.arc(x+5+face*2,y,2.2,0,6.3); ctx.fill();
  } else if(m.type==='wolf'){
    shadow(x,y+13,20); var st=Math.sin(a*12)*3;
    ctx.fillStyle=fl?'#fff':'#6E6D69'; ctx.fillRect(x-12,y+2+st*0.3,5,11); ctx.fillRect(x+7,y+2-st*0.3,5,11);
    ctx.fillStyle=fl?'#fff':c; ctx.strokeStyle='#4A4945'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.ellipse(x,y,18,11,0,0,6.3); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-face*16,y-3); ctx.lineTo(x-face*30,y-12+Math.sin(a*8)*3); ctx.lineTo(x-face*17,y+3); ctx.fill();
    var hx=x+face*16, hy=y-8; ctx.beginPath(); ctx.arc(hx,hy,10,0,6.3); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx-6,hy-6); ctx.lineTo(hx-4,hy-18); ctx.lineTo(hx+1,hy-8); ctx.moveTo(hx+2,hy-8); ctx.lineTo(hx+6,hy-18); ctx.lineTo(hx+8,hy-5); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx+face*8,hy+3,6,4,0,0,6.3); ctx.fill();
    ctx.fillStyle='#FF4A3A'; ctx.beginPath(); ctx.arc(hx+face*3,hy-2,2,0,6.3); ctx.fill();
  } else if(m.type==='bat'){
    var fy=y-16+Math.sin(a*5)*4, w=Math.sin(a*18); shadow(x,y+12,10);
    ctx.fillStyle=fl?'#fff':'#4B3A96';
    ctx.beginPath(); ctx.moveTo(x-6,fy); ctx.lineTo(x-26,fy-10*w-4); ctx.lineTo(x-20,fy+4); ctx.lineTo(x-12,fy+2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x+6,fy); ctx.lineTo(x+26,fy-10*w-4); ctx.lineTo(x+20,fy+4); ctx.lineTo(x+12,fy+2); ctx.closePath(); ctx.fill();
    ctx.fillStyle=fl?'#fff':c; ctx.beginPath(); ctx.arc(x,fy,9,0,6.3); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x-6,fy-6); ctx.lineTo(x-5,fy-15); ctx.lineTo(x-1,fy-8); ctx.moveTo(x+1,fy-8); ctx.lineTo(x+5,fy-15); ctx.lineTo(x+6,fy-6); ctx.fill();
    ctx.fillStyle='#FF5A5A'; ctx.beginPath(); ctx.arc(x-3,fy-1,1.8,0,6.3); ctx.arc(x+3,fy-1,1.8,0,6.3); ctx.fill();
    y=fy+6;
  } else if(m.type==='skeleton'){
    shadow(x,y+14,14); var st2=Math.sin(a*9)*3;
    ctx.strokeStyle=fl?'#fff':'#D8D1BE'; ctx.lineWidth=4; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x-4,y+2); ctx.lineTo(x-6,y+14+st2*0.3); ctx.moveTo(x+4,y+2); ctx.lineTo(x+6,y+14-st2*0.3); ctx.stroke();
    ctx.fillStyle=fl?'#fff':c; rr(ctx,x-9,y-12,18,16,5); ctx.fill();
    ctx.strokeStyle='#8E8674'; ctx.lineWidth=2; ctx.beginPath(); for(var i=0;i<3;i++){ctx.moveTo(x-7,y-8+i*4);ctx.lineTo(x+7,y-8+i*4);} ctx.stroke();
    ctx.fillStyle=fl?'#fff':c; ctx.strokeStyle='#8E8674'; ctx.beginPath(); ctx.arc(x,y-22,11,0,6.3); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#2B1D12'; ctx.beginPath(); ctx.arc(x-4+face,y-23,3,0,6.3); ctx.arc(x+4+face,y-23,3,0,6.3); ctx.fill(); ctx.fillRect(x-3,y-15,6,2);
    ctx.strokeStyle='#9AA3A8'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(x+face*10,y-2); ctx.lineTo(x+face*24,y-18); ctx.stroke();
  } else if(m.type==='spider'){
    shadow(x,y+12,20); ctx.strokeStyle=fl?'#fff':'#1E6B5A'; ctx.lineWidth=2.5;
    for(var j=0;j<4;j++){ var k=Math.sin(a*14+j)*3; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-14-j*2,y-8+j*6+k); ctx.lineTo(x-22-j*2,y+4+j*4); ctx.moveTo(x,y); ctx.lineTo(x+14+j*2,y-8+j*6-k); ctx.lineTo(x+22+j*2,y+4+j*4); ctx.stroke(); }
    ctx.fillStyle=fl?'#fff':c; ctx.strokeStyle='#1E6B5A';
    ctx.beginPath(); ctx.moveTo(x,y-16); ctx.lineTo(x+13,y-2); ctx.lineTo(x,y+10); ctx.lineTo(x-13,y-2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.6)'; ctx.beginPath(); ctx.moveTo(x,y-12); ctx.lineTo(x+5,y-3); ctx.lineTo(x,y-1); ctx.fill();
    ctx.fillStyle='#FF3A6A'; ctx.beginPath(); ctx.arc(x-3,y+4,1.8,0,6.3); ctx.arc(x+3,y+4,1.8,0,6.3); ctx.fill();
  } else if(m.type==='golem'){
    shadow(x,y+16,26); var st3=Math.sin(a*5)*2;
    ctx.fillStyle=fl?'#fff':'#5F7FA8'; rr(ctx,x-18,y+2+st3,12,14,4); ctx.fill(); rr(ctx,x+6,y+2-st3,12,14,4); ctx.fill();
    ctx.fillStyle=fl?'#fff':c; ctx.strokeStyle='#3E5A80'; ctx.lineWidth=2.5; rr(ctx,x-22,y-30,44,36,10); ctx.fill(); ctx.stroke();
    rr(ctx,x-32,y-22+st3,12,26,5); ctx.fill(); ctx.stroke(); rr(ctx,x+20,y-22-st3,12,26,5); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#A8E8FF'; ctx.beginPath(); ctx.moveTo(x-18,y-30); ctx.lineTo(x-12,y-44); ctx.lineTo(x-6,y-30); ctx.moveTo(x+4,y-30); ctx.lineTo(x+12,y-48); ctx.lineTo(x+18,y-30); ctx.fill();
    ctx.fillStyle='#E8FBFF'; ctx.fillRect(x-11+face*2,y-20,6,4); ctx.fillRect(x+5+face*2,y-20,6,4);
  } else if(m.type==='tuyul'){
    var run=Math.sin(a*14)*3; shadow(x,y+11,12);
    ctx.fillStyle=fl?'#fff':'#8FA88A'; ctx.strokeStyle='#4E6A4A'; ctx.lineWidth=2;
    ctx.fillRect(x-6,y+4+run*0.3,4,8); ctx.fillRect(x+2,y+4-run*0.3,4,8);
    ctx.beginPath(); ctx.ellipse(x,y-2,8,9,0,0,6.3); ctx.fill(); ctx.stroke();
    ctx.fillStyle=fl?'#fff':'#B8452E'; ctx.fillRect(x-7,y+2,14,5);
    ctx.strokeStyle=fl?'#fff':'#8FA88A'; ctx.lineWidth=3; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(x-7,y-4); ctx.lineTo(x-12-run*0.4,y+2); ctx.moveTo(x+7,y-4); ctx.lineTo(x+12+run*0.4,y+2); ctx.stroke();
    ctx.fillStyle=fl?'#fff':'#9CB597'; ctx.strokeStyle='#4E6A4A'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(x,y-16,10,0,6.3); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x-11,y-17,4,6,0.2,0,6.3); ctx.ellipse(x+11,y-17,4,6,-0.2,0,6.3); ctx.fill();
    ctx.fillStyle='#FF4A3A'; ctx.beginPath(); ctx.arc(x-4+face*1.5,y-17,2.3,0,6.3); ctx.arc(x+4+face*1.5,y-17,2.3,0,6.3); ctx.fill();
    ctx.fillStyle='#2B1D12'; ctx.beginPath(); ctx.arc(x-4+face*1.5,y-17,1,0,6.3); ctx.arc(x+4+face*1.5,y-17,1,0,6.3); ctx.fill();
    ctx.strokeStyle='#2B1D12'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(x,y-12,4,0.2,Math.PI-0.2); ctx.stroke();
    if(m.loot>0){ ctx.fillStyle='#FFD34A'; ctx.beginPath(); ctx.arc(x+face*10,y+2,3.5,0,6.3); ctx.fill(); }
    y=y-6;
  } else if(m.type==='pocong'){
    var hop=Math.abs(Math.sin(a*4)), hy=y-hop*(m.state==='chase'?14:6);
    ctx.fillStyle='rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(x,y+14,14-hop*4,5-hop*1.5,0,0,6.3); ctx.fill();
    ctx.fillStyle=fl?'#fff':'#E9E6DA'; ctx.strokeStyle='#A8A493'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(x-11,hy+12); ctx.quadraticCurveTo(x-15,hy-8,x-8,hy-24); ctx.quadraticCurveTo(x,hy-32,x+8,hy-24); ctx.quadraticCurveTo(x+15,hy-8,x+11,hy+12); ctx.quadraticCurveTo(x,hy+16,x-11,hy+12); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle='#8A8672'; ctx.lineWidth=2.5;
    [[-22,7],[-3,10],[9,9]].forEach(function(p2){ ctx.beginPath(); ctx.moveTo(x-p2[1],hy+p2[0]); ctx.lineTo(x+p2[1],hy+p2[0]); ctx.stroke(); });
    ctx.fillStyle=fl?'#fff':'#E9E6DA'; ctx.beginPath(); ctx.moveTo(x-3,hy-30); ctx.lineTo(x-6,hy-38); ctx.lineTo(x,hy-32); ctx.lineTo(x+6,hy-38); ctx.lineTo(x+3,hy-30); ctx.closePath(); ctx.fill();
    ctx.fillStyle=fl?'#fff':'#C9C6B5'; ctx.beginPath(); ctx.ellipse(x+face*1.5,hy-18,7,8,0,0,6.3); ctx.fill();
    ctx.fillStyle='#17120F'; ctx.beginPath(); ctx.ellipse(x-3.5+face*1.5,hy-20,2.2,3.4,0,0,6.3); ctx.ellipse(x+3.5+face*1.5,hy-20,2.2,3.4,0,0,6.3); ctx.fill();
    ctx.fillStyle='#FF4A3A'; ctx.beginPath(); ctx.arc(x-3.5+face*1.5,hy-20,0.9,0,6.3); ctx.arc(x+3.5+face*1.5,hy-20,0.9,0,6.3); ctx.fill();
    ctx.strokeStyle='#17120F'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(x-3+face*1.5,hy-13); ctx.lineTo(x+3+face*1.5,hy-13); ctx.stroke();
    ctx.fillStyle='rgba(140,90,74,.55)'; ctx.beginPath(); ctx.ellipse(x+face*5,hy-4,3,7,0.3,0,6.3); ctx.fill();
    y=hy-14;
  } else if(m.type==='kuntilanak'){
    var fh=y-14+Math.sin(a*2.2)*5, sw=Math.sin(a*1.6)*4; ctx.globalAlpha=0.8+Math.sin(a*3)*0.12;
    ctx.fillStyle='rgba(0,0,0,.16)'; ctx.beginPath(); ctx.ellipse(x,y+16,12,4,0,0,6.3); ctx.fill();
    ctx.fillStyle=fl?'#ddd':'#15121A'; ctx.beginPath(); ctx.moveTo(x-10,fh-24); ctx.quadraticCurveTo(x-20+sw,fh+4,x-14+sw*1.5,fh+34); ctx.lineTo(x+14+sw*1.5,fh+34); ctx.quadraticCurveTo(x+20+sw,fh+4,x+10,fh-24); ctx.closePath(); ctx.fill();
    ctx.fillStyle=fl?'#fff':'#F1EFE6'; ctx.strokeStyle='#B9B5A4'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(x-8,fh-14); ctx.lineTo(x+8,fh-14); ctx.quadraticCurveTo(x+16+sw*0.3,fh+8,x+20+sw,fh+30);
    for(var wv=0;wv<5;wv++){ ctx.lineTo(x+20+sw-(wv+1)*8,fh+30+(wv%2?6:-2)); }
    ctx.lineTo(x-20+sw,fh+30); ctx.quadraticCurveTo(x-16+sw*0.3,fh+8,x-8,fh-14); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle='#DAD6C8'; ctx.lineWidth=3; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(x-8,fh-10); ctx.lineTo(x-14+sw,fh+8); ctx.moveTo(x+8,fh-10); ctx.lineTo(x+14+sw,fh+8); ctx.stroke();
    ctx.fillStyle=fl?'#fff':'#DCE6E0'; ctx.beginPath(); ctx.arc(x,fh-20,8.5,0,6.3); ctx.fill();
    ctx.fillStyle=fl?'#ddd':'#15121A'; ctx.beginPath(); ctx.arc(x,fh-22,9.5,Math.PI*0.95,Math.PI*2.05); ctx.fill(); ctx.fillRect(x-9,fh-22,5,16); ctx.fillRect(x+4,fh-22,5,16);
    ctx.fillStyle='#FF3A3A'; ctx.beginPath(); ctx.arc(x-3,fh-20,1.6,0,6.3); ctx.arc(x+3,fh-20,1.6,0,6.3); ctx.fill();
    ctx.fillStyle='#1A0F14'; ctx.beginPath(); ctx.ellipse(x,fh-14,2.2,3.2,0,0,6.3); ctx.fill();
    ctx.globalAlpha=1; y=fh-12;
  } else if(m.type==='genderuwo'){
    shadow(x,y+22,28); var st4=Math.sin(a*4)*2;
    ctx.fillStyle=fl?'#fff':'#2A211C'; rr(ctx,x-18,y+6+st4,14,18,5); ctx.fill(); rr(ctx,x+4,y+6-st4,14,18,5); ctx.fill();
    ctx.fillStyle=fl?'#fff':'#332822'; ctx.strokeStyle='#1A120E'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(x-24,y+10); ctx.quadraticCurveTo(x-34,y-14,x-18,y-34); ctx.quadraticCurveTo(x,y-42,x+18,y-34); ctx.quadraticCurveTo(x+34,y-14,x+24,y+10); ctx.quadraticCurveTo(x,y+18,x-24,y+10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle=fl?'#fff':'#4A3B32'; ctx.lineWidth=2; for(var fi=0;fi<9;fi++){ var fx2=x-24+fi*6, fy2=y-24+((fi*13)%22); ctx.beginPath(); ctx.moveTo(fx2,fy2); ctx.lineTo(fx2-2,fy2+8); ctx.stroke(); }
    ctx.strokeStyle=fl?'#fff':'#2A211C'; ctx.lineWidth=9; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(x-22,y-24); ctx.lineTo(x-38,y+2+st4); ctx.moveTo(x+22,y-24); ctx.lineTo(x+38,y+2-st4); ctx.stroke();
    ctx.fillStyle='#1E1612'; ctx.beginPath(); ctx.arc(x-38,y+4+st4,6,0,6.3); ctx.arc(x+38,y+4-st4,6,0,6.3); ctx.fill();
    ctx.strokeStyle='#D8D2C0'; ctx.lineWidth=2; for(var cl=-1;cl<=1;cl++){ ctx.beginPath(); ctx.moveTo(x-38+cl*3,y+8+st4); ctx.lineTo(x-38+cl*4,y+15+st4); ctx.moveTo(x+38+cl*3,y+8-st4); ctx.lineTo(x+38+cl*4,y+15-st4); ctx.stroke(); }
    ctx.fillStyle=fl?'#fff':'#3B2E27'; ctx.strokeStyle='#1A120E'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(x,y-38,15,0,6.3); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#2A211C'; ctx.beginPath(); ctx.moveTo(x-13,y-46); ctx.lineTo(x-20,y-58); ctx.lineTo(x-6,y-50); ctx.moveTo(x+13,y-46); ctx.lineTo(x+20,y-58); ctx.lineTo(x+6,y-50); ctx.fill();
    ctx.fillStyle='#FF3B2A'; ctx.beginPath(); ctx.ellipse(x-6,y-40,3.6,2.6,0,0,6.3); ctx.ellipse(x+6,y-40,3.6,2.6,0,0,6.3); ctx.fill();
    ctx.fillStyle='#FFE08A'; ctx.beginPath(); ctx.arc(x-6,y-40,1,0,6.3); ctx.arc(x+6,y-40,1,0,6.3); ctx.fill();
    ctx.fillStyle='#120C0A'; rr(ctx,x-8,y-33,16,8,3); ctx.fill();
    ctx.fillStyle='#EFEADA'; ctx.beginPath(); ctx.moveTo(x-6,y-33); ctx.lineTo(x-4,y-27); ctx.lineTo(x-2,y-33); ctx.moveTo(x+2,y-33); ctx.lineTo(x+4,y-27); ctx.lineTo(x+6,y-33); ctx.fill();
    y=y-16;
  } else if(m.type==='dragon'){
    var wf=Math.sin(a*3); shadow(x,y+30,70);
    ctx.fillStyle=fl?'#fff':'#8A2419';
    ctx.beginPath(); ctx.moveTo(x-20,y-20); ctx.lineTo(x-110,y-70-wf*25); ctx.lineTo(x-90,y-10); ctx.lineTo(x-60,y+5); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x+20,y-20); ctx.lineTo(x+110,y-70-wf*25); ctx.lineTo(x+90,y-10); ctx.lineTo(x+60,y+5); ctx.closePath(); ctx.fill();
    ctx.fillStyle=fl?'#fff':c; ctx.strokeStyle='#5E140C'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(x-face*40,y+10); ctx.quadraticCurveTo(x-face*90,y+30,x-face*100,y+5+Math.sin(a*2)*8); ctx.lineTo(x-face*38,y+20); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x,y,50,34,0,0,6.3); ctx.fill(); ctx.stroke();
    ctx.fillStyle=fl?'#fff':'#F2A65A'; ctx.beginPath(); ctx.ellipse(x,y+10,30,18,0,0,6.3); ctx.fill();
    var hx2=x+face*46, hy2=y-34;
    ctx.fillStyle=fl?'#fff':c; ctx.beginPath(); ctx.moveTo(x+face*20,y-20); ctx.lineTo(hx2,hy2+8); ctx.lineTo(x+face*30,y); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx2,hy2,24,18,0,0,6.3); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(hx2+face*18,hy2+6,14,10,0,0,6.3); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#EFE3C8'; ctx.beginPath(); ctx.moveTo(hx2-10,hy2-14); ctx.lineTo(hx2-face*20-6,hy2-38); ctx.lineTo(hx2-2,hy2-16); ctx.moveTo(hx2+4,hy2-16); ctx.lineTo(hx2-face*6+4,hy2-40); ctx.lineTo(hx2+12,hy2-12); ctx.fill();
    ctx.fillStyle='#FFD34A'; ctx.beginPath(); ctx.ellipse(hx2+face*6,hy2-4,5,3.5,0,0,6.3); ctx.fill();
    ctx.fillStyle='#2B1D12'; ctx.fillRect(hx2+face*6-1,hy2-7,2,6);
    if(dragonSkillT<1.2){ ctx.fillStyle='rgba(255,140,40,'+(1.2-dragonSkillT)+')'; ctx.beginPath(); ctx.arc(hx2+face*30,hy2+8,6+(1.2-dragonSkillT)*8,0,6.3); ctx.fill(); }
    y=y-40;
  } else if(m.type==='ent'){
    shadow(x,y+34,38); var sw2=Math.sin(a*1.6)*3;
    ctx.strokeStyle=fl?'#fff':'#2E4A1E'; ctx.lineWidth=10; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x-face*20,y-10); ctx.lineTo(x-face*44+sw2,y-40); ctx.moveTo(x+face*20,y-10); ctx.lineTo(x+face*44-sw2,y-40); ctx.stroke();
    ctx.fillStyle=fl?'#fff':c; ctx.strokeStyle='#2E4A1E'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(x-24,y+16); ctx.quadraticCurveTo(x-30,y-24,x-14,y-50); ctx.quadraticCurveTo(x,y-58,x+14,y-50); ctx.quadraticCurveTo(x+30,y-24,x+24,y+16); ctx.quadraticCurveTo(x,y+24,x-24,y+16); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle='#1E320F'; ctx.lineWidth=2; for(var ei=0;ei<4;ei++){ ctx.beginPath(); ctx.moveTo(x-16+ei*10,y-40); ctx.lineTo(x-14+ei*10,y+8); ctx.stroke(); }
    ctx.fillStyle='#3E7A2E'; for(var lf=0;lf<7;lf++){ var la=lf/7*6.3+a*0.5; ctx.beginPath(); ctx.ellipse(x+Math.cos(la)*20,y-56+Math.sin(la)*10,9,6,la,0,6.3); ctx.fill(); }
    ctx.fillStyle='#FFD34A'; ctx.beginPath(); ctx.arc(x-6,y-30,2.6,0,6.3); ctx.arc(x+6,y-30,2.6,0,6.3); ctx.fill();
    y=y-20;
  } else if(m.type==='boneking'){
    shadow(x,y+16,22); var st5=Math.sin(a*7)*3;
    ctx.strokeStyle=fl?'#fff':'#B8B09A'; ctx.lineWidth=6; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x-6,y+4); ctx.lineTo(x-9,y+22+st5*0.3); ctx.moveTo(x+6,y+4); ctx.lineTo(x+9,y+22-st5*0.3); ctx.stroke();
    ctx.fillStyle=fl?'#fff':'#2A2622'; rr(ctx,x-20,y-8,40,24,6); ctx.fill();
    ctx.fillStyle=fl?'#fff':c; rr(ctx,x-15,y-24,30,26,7); ctx.fill(); ctx.strokeStyle='#8E8674'; ctx.lineWidth=2.5;
    ctx.beginPath(); for(var bi=0;bi<4;bi++){ctx.moveTo(x-13,y-18+bi*5);ctx.lineTo(x+13,y-18+bi*5);} ctx.stroke();
    ctx.fillStyle=fl?'#fff':c; ctx.strokeStyle='#8E8674'; ctx.beginPath(); ctx.arc(x,y-40,17,0,6.3); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#FFD34A'; ctx.beginPath(); ctx.moveTo(x-14,y-54); ctx.lineTo(x-9,y-70); ctx.lineTo(x-2,y-56); ctx.lineTo(x+2,y-70); ctx.lineTo(x+9,y-56); ctx.lineTo(x+14,y-54); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#FF3B2A'; ctx.beginPath(); ctx.arc(x-6+face,y-41,3.4,0,6.3); ctx.arc(x+6+face,y-41,3.4,0,6.3); ctx.fill();
    ctx.strokeStyle='#9AA3A8'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(x+face*16,y-6); ctx.lineTo(x+face*40,y-30); ctx.stroke();
    y=y-16;
  } else if(m.type==='crystalking'){
    shadow(x,y+24,40); var st6=Math.sin(a*4)*3;
    ctx.fillStyle=fl?'#fff':'#6A8FBF'; rr(ctx,x-30,y+4+st6,20,24,6); ctx.fill(); rr(ctx,x+10,y+4-st6,20,24,6); ctx.fill();
    ctx.fillStyle=fl?'#fff':c; ctx.strokeStyle='#2E5A80'; ctx.lineWidth=3; rr(ctx,x-36,y-48,72,58,14); ctx.fill(); ctx.stroke();
    rr(ctx,x-52,y-36+st6,20,42,7); ctx.fill(); ctx.stroke(); rr(ctx,x+32,y-36-st6,20,42,7); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#D8F4FF'; ctx.beginPath(); ctx.moveTo(x-30,y-48); ctx.lineTo(x-20,y-72); ctx.lineTo(x-8,y-48); ctx.moveTo(x+6,y-48); ctx.lineTo(x+18,y-76); ctx.lineTo(x+30,y-48); ctx.fill();
    var glow=0.55+Math.sin(a*3)*0.25; ctx.fillStyle='rgba(200,240,255,'+glow+')'; ctx.beginPath(); ctx.arc(x,y-20,12,0,6.3); ctx.fill();
    ctx.fillStyle='#E8FBFF'; ctx.fillRect(x-18+face*2,y-32,10,6); ctx.fillRect(x+8+face*2,y-32,10,6);
    y=y-24;
  } else if(m.type==='banaspati'){
    var bf=y-16+Math.sin(a*3)*6, flick=Math.sin(a*10)*4, flick2=Math.sin(a*13+1)*3;
    ctx.globalAlpha=0.9+Math.sin(a*4)*0.1;
    ctx.fillStyle='rgba(30,8,0,.28)'; ctx.beginPath(); ctx.ellipse(x,y+18,18,5,0,0,6.3); ctx.fill();
    ctx.fillStyle=fl?'#fff':'#A8220C'; ctx.beginPath();
    ctx.moveTo(x,bf-40-flick); ctx.quadraticCurveTo(x+21,bf-20,x+15+flick2,bf-2);
    ctx.quadraticCurveTo(x+23,bf+10,x+13,bf+24); ctx.quadraticCurveTo(x+19,bf+32,x+6,bf+40);
    ctx.quadraticCurveTo(x+2,bf+32,x,bf+42); ctx.quadraticCurveTo(x-2,bf+32,x-6,bf+40);
    ctx.quadraticCurveTo(x-19,bf+32,x-13,bf+24); ctx.quadraticCurveTo(x-23,bf+10,x-15-flick2,bf-2);
    ctx.quadraticCurveTo(x-21,bf-20,x,bf-40-flick); ctx.closePath(); ctx.fill();
    ctx.fillStyle=fl?'#fff':'#FF8A3A'; ctx.beginPath();
    ctx.moveTo(x,bf-28-flick*0.6); ctx.quadraticCurveTo(x+14,bf-10,x+10,bf+10); ctx.quadraticCurveTo(x+14,bf+22,x,bf+30);
    ctx.quadraticCurveTo(x-14,bf+22,x-10,bf+10); ctx.quadraticCurveTo(x-14,bf-10,x,bf-28-flick*0.6); ctx.closePath(); ctx.fill();
    ctx.fillStyle=fl?'#fff':'#FFE08A'; ctx.beginPath(); ctx.ellipse(x,bf+6,8,12,0,0,6.3); ctx.fill();
    ctx.fillStyle='#FFF3D0'; ctx.beginPath(); ctx.arc(x-4,bf-2,2.6,0,6.3); ctx.arc(x+4,bf-2,2.6,0,6.3); ctx.fill();
    ctx.fillStyle='#FF2A1A'; ctx.beginPath(); ctx.arc(x-4,bf-2,1.3,0,6.3); ctx.arc(x+4,bf-2,1.3,0,6.3); ctx.fill();
    ctx.fillStyle='#7A1E0C'; ctx.beginPath(); ctx.moveTo(x-3,bf+6); ctx.lineTo(x-1,bf+10); ctx.lineTo(x+1,bf+6); ctx.moveTo(x+1,bf+6); ctx.lineTo(x+3,bf+10); ctx.lineTo(x+5,bf+6); ctx.fill();
    for(var ei=0;ei<3;ei++){ var ph=(a*1.5+ei*0.9)%3, ex=x+Math.sin(a*3+ei*2)*10, ey=bf-26-ph*22;
      ctx.globalAlpha=Math.max(0,1-ph/3); ctx.fillStyle=ei%2?'#FFD34A':'#FF8A3A'; ctx.beginPath(); ctx.arc(ex,ey,2-ph*0.3,0,6.3); ctx.fill(); }
    ctx.globalAlpha=1; y=bf-24;
  }
  ctx.restore();
  if(!T.boss && m.hp>0){
    if(m.hp<m.maxHp){ var bw=Math.max(30,T.r*2); ctx.fillStyle='#2a120c'; ctx.fillRect(x-bw/2,y-T.r-16,bw,5); ctx.fillStyle='#E0503C'; ctx.fillRect(x-bw/2,y-T.r-16,bw*clamp(m.hp/m.maxHp,0,1),5); }
    if(m.state==='chase'){ ctx.font='600 14px Fredoka, sans-serif'; ctx.textAlign='center'; ctx.fillStyle='#FF6A4A'; ctx.fillText('!',x,y-T.r-20); }
  }
}
function drawDeco(d,t){
  var x=d.x,y=d.y,s=d.s;
  if(d.t==='tree'){
    shadow(x,y+2,24*s);
    var behind=P.y<d.y-4 && P.y>d.y-95*s && Math.abs(P.x-d.x)<34*s; if(behind) ctx.globalAlpha=0.5;
    ctx.fillStyle='#6B4526'; rr(ctx,x-5*s,y-22*s,10*s,24*s,3); ctx.fill();
    var g1=d.col===2?'#2F6B35':'#4E9A3E', g2=d.col===2?'#3C8043':'#62B14C', g3=d.col===2?'#4D9651':'#7AC45C';
    if(d.col===20){g1='#2F6B35';g2='#3C8043';g3='#4D9651';}
    var sw=Math.sin(t*1.3+d.v*10)*1.5;
    ctx.fillStyle=g1; ctx.beginPath(); ctx.arc(x+sw,y-40*s,26*s,0,6.3); ctx.fill();
    ctx.fillStyle=g2; ctx.beginPath(); ctx.arc(x-10*s+sw,y-46*s,17*s,0,6.3); ctx.arc(x+11*s+sw,y-44*s,16*s,0,6.3); ctx.fill();
    ctx.fillStyle=g3; ctx.beginPath(); ctx.arc(x-6*s+sw,y-56*s,11*s,0,6.3); ctx.fill();
    ctx.globalAlpha=1;
  } else if(d.t==='bush'){
    shadow(x,y+2,18*s); ctx.fillStyle='#3F8A3A'; ctx.beginPath(); ctx.arc(x-8*s,y-6*s,10*s,0,6.3); ctx.arc(x+8*s,y-6*s,10*s,0,6.3); ctx.arc(x,y-12*s,11*s,0,6.3); ctx.fill();
    if(d.v>0.5){ctx.fillStyle='#E0503C';ctx.beginPath();ctx.arc(x-4*s,y-12*s,2.5,0,6.3);ctx.arc(x+6*s,y-8*s,2.5,0,6.3);ctx.fill();}
  } else if(d.t==='rock'){
    shadow(x,y+2,20*s);
    var rc={cave:['#4E4870','#625A8A'],lair:['#3E2A22','#56392E']}[zone.kind]||['#7E7A70','#9A958A'];
    ctx.fillStyle=rc[0]; ctx.beginPath(); ctx.moveTo(x-20*s,y); ctx.lineTo(x-16*s,y-18*s); ctx.lineTo(x-2*s,y-26*s); ctx.lineTo(x+16*s,y-18*s); ctx.lineTo(x+20*s,y); ctx.closePath(); ctx.fill();
    ctx.fillStyle=rc[1]; ctx.beginPath(); ctx.moveTo(x-14*s,y-16*s); ctx.lineTo(x-2*s,y-24*s); ctx.lineTo(x+10*s,y-17*s); ctx.lineTo(x-2*s,y-12*s); ctx.closePath(); ctx.fill();
  } else if(d.t==='house'){
    shadow(x,y+2,70);
    ctx.fillStyle='#EAD9B5'; ctx.strokeStyle='#8B5E34'; ctx.lineWidth=3; ctx.fillRect(x-58,y-62,116,62); ctx.strokeRect(x-58,y-62,116,62);
    ctx.fillStyle='#8B5E34'; ctx.fillRect(x-58,y-62,5,62); ctx.fillRect(x+53,y-62,5,62);
    ctx.fillStyle=d.col; ctx.beginPath(); ctx.moveTo(x-70,y-60); ctx.lineTo(x,y-110); ctx.lineTo(x+70,y-60); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.25)'; ctx.stroke();
    ctx.fillStyle='#6B4526'; rr(ctx,x-12,y-36,24,36,6); ctx.fill(); ctx.fillStyle='#E8C34A'; ctx.beginPath(); ctx.arc(x+6,y-18,2,0,6.3); ctx.fill();
    ctx.fillStyle='#8FD3F0'; ctx.fillRect(x-45,y-48,20,16); ctx.fillRect(x+25,y-48,20,16);
    ctx.strokeStyle='#8B5E34'; ctx.lineWidth=2; ctx.strokeRect(x-45,y-48,20,16); ctx.strokeRect(x+25,y-48,20,16);
    ctx.fillStyle='#7A5A3A'; ctx.fillRect(x+30,y-104,10,22);
  } else if(d.t==='well'){
    shadow(x,y+4,30); ctx.fillStyle='#8E8A80'; ctx.beginPath(); ctx.ellipse(x,y-8,26,12,0,0,6.3); ctx.fill();
    ctx.fillStyle='#9E998E'; ctx.fillRect(x-26,y-8,52,14); ctx.fillStyle='#2E6FA8'; ctx.beginPath(); ctx.ellipse(x,y-8,18,7,0,0,6.3); ctx.fill();
    ctx.fillStyle='#6B4526'; ctx.fillRect(x-24,y-50,5,42); ctx.fillRect(x+19,y-50,5,42);
    ctx.fillStyle='#B8452E'; ctx.beginPath(); ctx.moveTo(x-32,y-46); ctx.lineTo(x,y-64); ctx.lineTo(x+32,y-46); ctx.closePath(); ctx.fill();
  } else if(d.t==='wall'){
    ctx.fillStyle='#7C766A'; ctx.fillRect(x-31,y-44,62,44); ctx.fillStyle='#8E887B';
    ctx.fillRect(x-31,y-44,62,10); ctx.strokeStyle='rgba(0,0,0,.2)'; ctx.lineWidth=2;
    ctx.strokeRect(x-31,y-34,31,17); ctx.strokeRect(x,y-34,31,17); ctx.strokeRect(x-15,y-17,31,17);
    if(d.v>0.6){ctx.fillStyle='#8E887B';ctx.fillRect(x-31,y-56,16,12);ctx.fillRect(x+15,y-56,16,12);}
  } else if(d.t==='pillar'){
    shadow(x,y+2,18); ctx.fillStyle='#CFC7B3'; ctx.fillRect(x-14,y-8,28,10);
    var ph=40+d.v*40; ctx.fillStyle='#BDB5A0'; ctx.fillRect(x-10,y-8-ph,20,ph);
    ctx.fillStyle='rgba(0,0,0,.12)'; ctx.fillRect(x-4,y-8-ph,3,ph); ctx.fillRect(x+4,y-8-ph,3,ph);
    ctx.fillStyle='#CFC7B3'; ctx.beginPath(); ctx.moveTo(x-13,y-8-ph); ctx.lineTo(x-6,y-14-ph); ctx.lineTo(x+2,y-8-ph-3); ctx.lineTo(x+13,y-12-ph); ctx.lineTo(x+13,y-4-ph); ctx.lineTo(x-13,y-4-ph); ctx.fill();
    if(d.v<0.35){ctx.fillStyle='#5E8A3A';ctx.beginPath();ctx.arc(x-8,y-20,5,0,6.3);ctx.arc(x-4,y-30,4,0,6.3);ctx.fill();}
  } else if(d.t==='banner'){
    ctx.fillStyle='#5A4030'; ctx.fillRect(x-2,y-70,4,70);
    var bw=Math.sin(t*2+d.v*9)*3; ctx.fillStyle='#8E2C2C'; ctx.beginPath(); ctx.moveTo(x+2,y-68); ctx.lineTo(x+26+bw,y-66); ctx.lineTo(x+24+bw,y-36); ctx.lineTo(x+14,y-42); ctx.lineTo(x+2,y-36); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#F0B541'; ctx.beginPath(); ctx.arc(x+13,y-54,4,0,6.3); ctx.fill();
  } else if(d.t==='crystal'){
    var cc=d.v>0.5?['#6FE3D0','#B6FFF2','#2E9C8C']:['#A58BF0','#DCCEFF','#6A4FC0'];
    ctx.fillStyle='rgba(120,255,230,.10)'; ctx.beginPath(); ctx.arc(x,y-14*s,30*s+Math.sin(t*2+d.v*9)*3,0,6.3); ctx.fill();
    ctx.fillStyle=cc[2]; ctx.beginPath(); ctx.moveTo(x-14*s,y); ctx.lineTo(x-10*s,y-22*s); ctx.lineTo(x-4*s,y); ctx.fill();
    ctx.fillStyle=cc[0]; ctx.beginPath(); ctx.moveTo(x-7*s,y); ctx.lineTo(x-2*s,y-38*s); ctx.lineTo(x+4*s,y-44*s); ctx.lineTo(x+8*s,y); ctx.closePath(); ctx.fill();
    ctx.fillStyle=cc[1]; ctx.beginPath(); ctx.moveTo(x-2*s,y-38*s); ctx.lineTo(x+4*s,y-44*s); ctx.lineTo(x+2*s,y-10*s); ctx.closePath(); ctx.fill();
    ctx.fillStyle=cc[2]; ctx.beginPath(); ctx.moveTo(x+6*s,y); ctx.lineTo(x+14*s,y-20*s); ctx.lineTo(x+16*s,y); ctx.fill();
  } else if(d.t==='beringin'){
    shadow(x,y+4,46*s);
    ctx.fillStyle='#4A3A34'; ctx.beginPath(); ctx.moveTo(x-22*s,y+2); ctx.quadraticCurveTo(x-14*s,y-40*s,x-10*s,y-70*s); ctx.lineTo(x+10*s,y-70*s); ctx.quadraticCurveTo(x+14*s,y-40*s,x+22*s,y+2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#3A2C28'; ctx.lineWidth=3*s; for(var bi=-3;bi<=3;bi++){ ctx.beginPath(); ctx.moveTo(x+bi*10*s,y-64*s); ctx.quadraticCurveTo(x+bi*16*s+Math.sin(t+bi)*3,y-30*s,x+bi*14*s,y+2); ctx.stroke(); }
    ctx.fillStyle='#173A31'; ctx.beginPath(); ctx.arc(x,y-92*s,50*s,0,6.3); ctx.arc(x-38*s,y-78*s,34*s,0,6.3); ctx.arc(x+38*s,y-78*s,34*s,0,6.3); ctx.fill();
    ctx.fillStyle='#21503F'; ctx.beginPath(); ctx.arc(x-12*s,y-104*s,30*s,0,6.3); ctx.arc(x+22*s,y-98*s,26*s,0,6.3); ctx.fill();
    ctx.strokeStyle='#2C4A3C'; ctx.lineWidth=2; for(bi=0;bi<9;bi++){ var rx=x-44*s+bi*11*s, sw2=Math.sin(t*1.4+bi)*3; ctx.beginPath(); ctx.moveTo(rx,y-70*s); ctx.quadraticCurveTo(rx+sw2,y-50*s,rx+sw2*1.5,y-(24+(bi%3)*10)*s); ctx.stroke(); }
    if(d.v>0.55){ var gl=ctx.createRadialGradient(x+30*s,y-4,1,x+30*s,y-4,26); gl.addColorStop(0,'rgba(255,200,90,.55)'); gl.addColorStop(1,'rgba(255,200,90,0)'); ctx.fillStyle=gl; ctx.beginPath(); ctx.arc(x+30*s,y-4,26,0,6.3); ctx.fill();
      ctx.fillStyle='#F2D35B'; ctx.beginPath(); ctx.arc(x+30*s,y-6,3,0,6.3); ctx.fill(); ctx.fillStyle='#B8452E'; ctx.fillRect(x+27*s,y-3,6,5); }
  } else if(d.t==='bamboo'){
    shadow(x,y+2,16*s);
    for(var k=0;k<5;k++){ var ox=(k-2)*6*s, hh=(46+((k*37)%30))*s, sway=Math.sin(t*1.2+d.v*9+k)*3;
      ctx.strokeStyle=k%2?'#4E8A4C':'#3F7A44'; ctx.lineWidth=4*s; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(x+ox,y); ctx.quadraticCurveTo(x+ox+sway*0.4,y-hh*0.6,x+ox+sway,y-hh); ctx.stroke();
      ctx.strokeStyle='rgba(0,0,0,.25)'; ctx.lineWidth=1.5; for(var nn=1;nn<4;nn++){ var py2=y-hh*nn/4; ctx.beginPath(); ctx.moveTo(x+ox-3*s+sway*nn/4,py2); ctx.lineTo(x+ox+3*s+sway*nn/4,py2); ctx.stroke(); }
      ctx.fillStyle='#5DA05A'; ctx.beginPath(); ctx.ellipse(x+ox+sway+5*s,y-hh+4,9*s,3*s,0.6,0,6.3); ctx.fill(); }
  } else if(d.t==='nisan'){
    shadow(x,y+2,12*s); ctx.fillStyle='#7C8298'; rr(ctx,x-9*s,y-30*s,18*s,32*s,7*s); ctx.fill(); ctx.fillStyle='#9AA0B6'; rr(ctx,x-9*s,y-30*s,8*s,32*s,4*s); ctx.fill();
    ctx.strokeStyle='#5A6078'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x-3*s,y-22*s); ctx.lineTo(x+3*s,y-22*s); ctx.moveTo(x,y-26*s); ctx.lineTo(x,y-14*s); ctx.stroke();
    ctx.fillStyle='#5E8A55'; ctx.beginPath(); ctx.ellipse(x+3*s,y+1,9*s,3*s,0,0,6.3); ctx.fill();
    if(d.v>0.6){ ctx.fillStyle='#FFF7D6'; ctx.beginPath(); ctx.arc(x+12*s,y-2,3,0,6.3); ctx.fill(); ctx.fillStyle='#F2B84B'; ctx.beginPath(); ctx.arc(x+12*s,y-2,1.3,0,6.3); ctx.fill(); }
  } else if(d.t==='joglo'){
    shadow(x,y+2,80);
    ctx.fillStyle='#3A2A22'; ctx.fillRect(x-62,y-52,124,52);
    ctx.fillStyle='#4E382C'; ctx.fillRect(x-62,y-52,6,52); ctx.fillRect(x+56,y-52,6,52); ctx.fillRect(x-20,y-52,6,52); ctx.fillRect(x+14,y-52,6,52);
    var fl2=0.65+Math.sin(t*3+d.v*9)*0.15; ctx.fillStyle='rgba(255,196,90,'+fl2+')'; ctx.fillRect(x-50,y-40,26,22); ctx.fillRect(x+24,y-40,26,22);
    ctx.strokeStyle='#2A1C16'; ctx.lineWidth=2; ctx.strokeRect(x-50,y-40,26,22); ctx.strokeRect(x+24,y-40,26,22);
    ctx.fillStyle='#2A1C16'; rr(ctx,x-8,y-34,16,34,4); ctx.fill();
    ctx.fillStyle='#6A3B2C'; ctx.beginPath(); ctx.moveTo(x-84,y-50); ctx.lineTo(x-40,y-84); ctx.lineTo(x+40,y-84); ctx.lineTo(x+84,y-50); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#7C4838'; ctx.beginPath(); ctx.moveTo(x-52,y-82); ctx.lineTo(x-22,y-108); ctx.lineTo(x+22,y-108); ctx.lineTo(x+52,y-82); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#8A5443'; ctx.fillRect(x-4,y-118,8,12);
    ctx.strokeStyle='rgba(0,0,0,.25)'; ctx.lineWidth=2; for(var ti=-3;ti<=3;ti++){ ctx.beginPath(); ctx.moveTo(x+ti*20,y-84); ctx.lineTo(x+ti*26,y-50); ctx.stroke(); }
  } else if(d.t==='lantern'){
    ctx.fillStyle='#4A3A2C'; ctx.fillRect(x-2,y-64,4,64); ctx.fillRect(x-2,y-64,18,3);
    var fl3=0.75+Math.sin(t*5+d.v*20)*0.15, gl2=ctx.createRadialGradient(x+14,y-56,1,x+14,y-56,44); gl2.addColorStop(0,'rgba(255,200,100,'+(0.6*fl3)+')'); gl2.addColorStop(1,'rgba(255,200,100,0)');
    ctx.fillStyle=gl2; ctx.beginPath(); ctx.arc(x+14,y-56,44,0,6.3); ctx.fill();
    ctx.fillStyle='#D8452E'; rr(ctx,x+9,y-61,10,14,3); ctx.fill(); ctx.fillStyle='#FFD27A'; ctx.fillRect(x+12,y-58,4,8);
  } else if(d.t==='stalag'){
    shadow(x,y+2,14*s); ctx.fillStyle='#5A5280'; ctx.beginPath(); ctx.moveTo(x-12*s,y); ctx.lineTo(x-2*s,y-40*s); ctx.lineTo(x+12*s,y); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#6E6598'; ctx.beginPath(); ctx.moveTo(x-2*s,y-40*s); ctx.lineTo(x+4*s,y-6*s); ctx.lineTo(x-6*s,y-4*s); ctx.closePath(); ctx.fill();
  }
}
function drawChest(c){
  var open=P.chests.indexOf(c.id)>=0; shadow(c.x,c.y+2,18);
  ctx.fillStyle='#8B5E34'; ctx.strokeStyle='#4A2E15'; ctx.lineWidth=2; rr(ctx,c.x-16,c.y-18,32,20,4); ctx.fill(); ctx.stroke();
  if(open){ ctx.fillStyle='#5A3A1E'; rr(ctx,c.x-16,c.y-30,32,10,4); ctx.fill(); ctx.stroke(); }
  else { ctx.fillStyle='#A06C3A'; rr(ctx,c.x-17,c.y-26,34,12,5); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#F0B541'; ctx.fillRect(c.x-3,c.y-18,6,7);
    var gl=0.4+Math.sin(performance.now()/300)*0.3; ctx.fillStyle='rgba(255,220,100,'+gl+')'; ctx.beginPath(); ctx.arc(c.x+12,c.y-30,2.5,0,6.3); ctx.arc(c.x-14,c.y-24,2,0,6.3); ctx.fill(); }
}
function drawPortal(p,t){
  var dz=ZONES[p.to], ok=P.level>=dz.minLv, col=ok?{village:'#8DE08A',forest:'#6CCB5F',castle:'#D8D0BA',cave:'#8F7CF0',lair:'#FF6A3A',ghost:'#9B8CFF'}[p.to]:'#8A8A8A';
  ctx.save(); ctx.translate(p.x,p.y);
  ctx.fillStyle='rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0,24,34,10,0,0,6.3); ctx.fill();
  ctx.fillStyle='#6F6A60'; rr(ctx,-36,-50,12,74,4); ctx.fill(); rr(ctx,24,-50,12,74,4); ctx.fill(); rr(ctx,-40,-58,80,12,5); ctx.fill();
  ctx.globalAlpha=0.85; ctx.fillStyle=col; ctx.beginPath(); ctx.ellipse(0,-10,22,32,0,0,6.3); ctx.fill();
  ctx.globalAlpha=1; ctx.strokeStyle='rgba(255,255,255,.7)'; ctx.lineWidth=2.5;
  for(var i=0;i<3;i++){ ctx.beginPath(); ctx.ellipse(0,-10,20-i*6,30-i*9,0,t*2+i,t*2+i+2.2); ctx.stroke(); }
  ctx.restore();
  label(p.x,p.y-66,(ok?'':'🔒 ')+dz.label+(dz.minLv>1?' (Lv '+dz.minLv+')':''),0,ok?'#FFE08A':'#ccc');
}

/* ===================== HUD ===================== */
function hud(){
  if(!P) return; var S=stats();
  $('hName').textContent=P.name+(P.hero?' 🐉':''); $('hLv').textContent='Lv '+P.level;
  $('hHp').style.width=clamp(P.hp/S.maxHp*100,0,100)+'%'; $('hHpT').textContent=Math.max(0,Math.round(P.hp))+' / '+S.maxHp;
  $('hXp').style.width=clamp(P.xp/xpNeed(P.level)*100,0,100)+'%';
  $('hCoin').textContent='🪙 '+P.coins+' koin';
  $('potN').textContent=P.potions;
  var q=QUESTS[P.q], qe=$('quest');
  if(!q){ qe.innerHTML='<b>Pahlawan Elyndor</b>Semua quest utama selesai. Terus berburu dan bantu Perantau lain.'; }
  else if(q.type==='talk'){ qe.innerHTML='<b>'+esc(q.title)+'</b>'+esc(q.desc); }
  else if(!P.qa){ qe.innerHTML='<b>Quest baru</b>Bicara dengan '+esc(npcName(q.giver))+' ('+esc(zoneOfNpc(q.giver))+').'; }
  else if(P.qp>=q.n){ qe.innerHTML='<b>'+esc(q.title)+' ✓</b>Kembali ke '+esc(npcName(q.giver))+' untuk hadiah.'; }
  else { qe.innerHTML='<b>'+esc(q.title)+'</b>'+esc(MON[q.target].name)+': '+P.qp+' / '+q.n; }
  var sqh=SQUESTS[P.sq];
  if(sqh && P.sqa){ qe.innerHTML+='<div style="margin-top:5px;padding-top:4px;border-top:1px solid #c9b48a"><b>👻 '+esc(sqh.title)+(P.sqp>=sqh.n?' ✓':'')+'</b>'+(P.sqp>=sqh.n?'Lapor ke Mbah Darmo.':esc(MON[sqh.target].name)+': '+P.sqp+' / '+sqh.n)+'</div>'; }
  var bt=zoneBossType(zone);
  if(bt){ var dm=(monsters[zoneId]||[]).filter(function(m){return m.type===bt;})[0]; $('bossHp').style.width=dm?(dm.dead?0:clamp(dm.hp/dm.maxHp*100,0,100))+'%':'0'; }
}
function actionUi(){
  var n=npcAt(P.x,P.y,85), talk=n&&!nearestMonster(60);
  $('atkIc').textContent=talk?'💬':'🗡️'; $('atkLb').textContent=talk?'Bicara':'Serang';
  $('potCd').style.height=(potCd/1.5*100)+'%';
  var id=P.element;
  if(id){ var def=elDef(), l=P.skills[id]||1, c=cds[id]||0, mx=def.cd[Math.min(2,l-1)];
    $('skCd').style.height=(c/mx*100)+'%'; $('skCdn').textContent=c>0?(c<1?c.toFixed(1):Math.ceil(c)):'';
    if(readyFlag[id]){ readyFlag[id]=false; var el=$('bSkill'); el.classList.remove('ready'); void el.offsetWidth; el.classList.add('ready'); } }
  [0,1].forEach(function(i){ var sid=P.slots[i], se=$('sup'+i); if(!sid) return; var sdef=SUP[sid], sl=P.skills[sid]||1, sc=cds[sid]||0, smx=sdef.cd[Math.min(2,sl-1)];
    se.querySelector('.cd').style.height=(sc/smx*100)+'%'; se.querySelector('.cdn').textContent=sc>0?(sc<1?sc.toFixed(1):Math.ceil(sc)):'';
    if(readyFlag[sid]){ readyFlag[sid]=false; se.classList.remove('ready'); void se.offsetWidth; se.classList.add('ready'); } });
}
function applyElementUi(){
  var def=elDef(); if(!def) return;
  document.documentElement.style.setProperty('--elcol',def.c);
  document.documentElement.style.setProperty('--elcold',def.cdk);
  $('skIc').textContent=def.ic;
}
function ensureSlots(){
  if(!Array.isArray(P.slots)) P.slots=[];
  P.slots=P.slots.filter(function(id,i,a){return SUP[id] && P.skills[id] && a.indexOf(id)===i;}).slice(0,2);
  SUPPORT.forEach(function(a){ if(P.slots.length<2 && P.skills[a.id] && P.slots.indexOf(a.id)<0) P.slots.push(a.id); });
}
function renderSlots(){
  [0,1].forEach(function(i){ var el=$('sup'+i), id=P.slots[i];
    if(id){ el.className='abtn sup'; el.innerHTML='<span>'+SUP[id].ic+'</span><div class="cd"></div><div class="cdn"></div>'; }
    else { el.className='abtn sup empty'; el.innerHTML='+<div class="cd"></div><div class="cdn"></div>'; } });
}
function npcName(id){ for(var k in ZONES){var z=ZONES[k];for(var i=0;i<z.npcs.length;i++) if(z.npcs[i].id===id) return z.npcs[i].name;} return id; }
function zoneOfNpc(id){ for(var k in ZONES){var z=ZONES[k];for(var i=0;i<z.npcs.length;i++) if(z.npcs[i].id===id) return z.label;} return ''; }
function npcMarker(id){
  if(id==='bram') return '';
  if(id==='darmo'){ var sm=SQUESTS[P.sq]; if(!sm) return ''; if(!P.sqa) return '!'; if(P.sqp>=sm.n) return '?'; return ''; }
  var q=QUESTS[P.q]; if(!q) return '';
  if(q.type==='talk' && q.target===id) return '?';
  if(q.giver===id && q.type==='kill'){ if(!P.qa) return '!'; if(P.qp>=q.n) return '?'; }
  return '';
}
var toastH=null;
function toast(m,ms){ var t=$('toast'); t.textContent=m; t.style.opacity='1'; clearTimeout(toastH); toastH=setTimeout(function(){t.style.opacity='0';},ms||2000); }

/* ===================== SHEETS ===================== */
var sheetOpenedAt=0;
function openSheet(title,html){ sheetOpenedAt=performance.now(); HOLDCLR.forEach(function(f){f();}); sfx('ui'); $('sTitle').textContent=title; $('sBody').innerHTML=html; $('sheet').classList.add('open'); sheetOpen=true; joy=null; input.jx=input.jy=0; }
function closeSheet(){ $('sheet').classList.remove('open'); sheetOpen=false; }
$('sClose').addEventListener('click',closeSheet);
$('sheet').addEventListener('click',function(e){ if(performance.now()-sheetOpenedAt<450){ e.stopPropagation(); e.preventDefault(); } },true);
$('sheet').addEventListener('click',function(e){ if(e.target.id==='sheet') closeSheet(); });

function setupMenus(){
  $('mSkill').addEventListener('click',showSkills);
  $('mQuest').addEventListener('click',showQuest);
  $('mMap').addEventListener('click',showMap);
  $('mRank').addEventListener('click',showRank);
  $('mPeople').addEventListener('click',showPeople);
  $('mBot').addEventListener('click',showBotPanel);
  $('mSnd').addEventListener('click',function(){ audInit(); audSetMuted(!AUD.muted); toast(AUD.muted?'Suara dimatikan':'Suara dinyalakan',1200); });
  $('mSet').addEventListener('click',showSettings);
}
function showSettings(){
  var st=AUD.ctx?AUD.ctx.state:'belum aktif';
  var h='<div class="note">Game selalu tampil mendatar (landscape). Atur suara dan arah layar di sini.</div>'+
   '<div class="sechead">Suara</div>'+
   '<div class="item"><div class="ic">🎵</div><div class="tx"><b>Volume musik</b><input type="range" id="volM" min="0" max="100" value="'+Math.round(AUD.vm*100)+'"></div></div>'+
   '<div class="item"><div class="ic">💥</div><div class="tx"><b>Volume efek suara</b><input type="range" id="volS" min="0" max="100" value="'+Math.round(AUD.vs*100)+'"></div></div>'+
   '<div class="botrow"><button class="gbtn" id="sndTest">🔔 Tes suara</button><button class="gbtn" id="sndMute">'+(AUD.muted?'🔊 Nyalakan suara':'🔇 Matikan suara')+'</button></div>'+
   '<div class="note" id="sndStat" style="margin-top:8px">Status audio: '+st+'. Kalau tidak ada suara, tekan "Tes suara" sekali.</div>'+
   '<div class="sechead">Layar</div>'+
   '<div class="item"><div class="ic">🔄</div><div class="tx"><b>Arah layar</b>Kalau tampilan terbalik, balik arahnya.<div class="dots">'+(LAND.forced?'Diputar otomatis (HP terkunci tegak)':'Layar HP sudah mendatar')+'</div></div><button class="gbtn" id="flipBtn"'+(LAND.forced?'':' disabled')+'>Balik 180°</button></div>';
  openSheet('Pengaturan',h);
  $('volM').addEventListener('input',function(){ audInit(); audSetVol('m',this.value/100); });
  $('volS').addEventListener('input',function(){ audInit(); audSetVol('s',this.value/100); });
  $('sndMute').addEventListener('click',function(){ audInit(); audSetMuted(!AUD.muted); showSettings(); });
  $('sndTest').addEventListener('click',function(){
    audInit(); var c=AUD.ctx; if(!c){ toast('Perangkat ini tidak mendukung audio.',2500); return; }
    if(AUD.muted) audSetMuted(false);
    c.resume().then(function(){ sfx('levelup'); var e=$('sndStat'); if(e) e.textContent='Status audio: '+c.state+'. Kalau masih tidak terdengar, cek volume media HP-mu.'; }).catch(function(){ toast('Audio ditolak oleh browser. Coba tekan layar lalu ulangi.',3000); });
  });
  $('flipBtn').addEventListener('click',function(){ LAND.flip=!LAND.flip; try{localStorage.setItem('elyndor_flip',LAND.flip?'1':'0');}catch(e){} applyLayout(); resize(); });
}
function parseBotNames(raw){
  return raw.split(/[\n,]/).map(function(s){ return s.trim().replace(/^@/,'').replace(/[^A-Za-z0-9._ ]/g,'').slice(0,18); })
    .filter(function(s){ return s.length>=2; }).slice(0,60);
}
function totalBots(){ var n=0; Object.keys(bots).forEach(function(k){ n+=bots[k].length; }); return n; }
function spawnBots(names){
  ensureBots(zoneId);
  var room=64, added=0, cap=80;
  names.forEach(function(n){
    if(totalBots()>=cap) return;
    var a=Math.random()*6.28, r=30+Math.random()*room;
    var x=clamp(P.x+Math.cos(a)*r,40,zone.w-40), y=clamp(P.y+Math.sin(a)*r,40,zone.h-40);
    bots[zoneId].push({name:n,x:x,y:y,hx:x,hy:y,tx:x,ty:y,wt:0,walk:0,f:0,moving:false,eT:1.2,hp:220,maxHp:220,atk:14+Math.floor(Math.random()*6),atkCd:0});
    added++;
  });
  return added;
}
function ensureBots(id){ if(!bots[id]) bots[id]=[]; }
function showBotPanel(){
  var n=(bots[zoneId]||[]).length;
  var h='<div class="note">Satu nama per baris/koma. Bot ikut nyerang monster & bisa kamu bunuh (dapat koin).</div>'+
    '<textarea id="botTa" placeholder="contoh:\nbudi_87\nsiti.aminah\n@rafi_ganteng"></textarea>'+
    '<div class="botrow"><button class="gbtn" id="botAdd">Munculkan</button><button class="gbtn off" id="botClear" style="background:#d68a8a;color:#3a1010">Hapus bot di zona ini</button></div>'+
    '<div class="note">Bot di zona ini sekarang: '+n+' · Total semua zona: '+totalBots()+' (maks 80)</div>';
  openSheet('Panel Bot Penonton',h);
  $('botAdd').addEventListener('click',function(){
    var names=parseBotNames($('botTa').value);
    if(!names.length){ toast('Tulis dulu minimal satu nama.'); return; }
    var added=spawnBots(names);
    toast(added+' bot penonton muncul di '+zone.label+'!',2600);
    showBotPanel();
  });
  $('botClear').addEventListener('click',function(){ bots[zoneId]=[]; toast('Bot di zona ini dihapus.'); showBotPanel(); });
}
function showSkills(){
  var S=stats(), def=elDef(), l=P.skills[P.element]||1, max=l>=3, cost=40+l*40, can=!max&&P.coins>=cost;
  var h='<div class="note">Koinmu: 🪙 '+P.coins+' · Serangan '+S.atk+' · HP maks '+S.maxHp+'</div>'+
    '<div class="sechead">Skill Utama (elemenmu)</div>'+
    '<div class="item" style="border-color:'+def.c+'"><div class="ic" style="font-size:30px">'+def.ic+'</div><div class="tx"><b style="color:'+def.c+'">'+def.skillName+' ('+def.name+')</b>'+def.desc+
    '<div class="dots">'+'●'.repeat(l)+'○'.repeat(3-l)+' &nbsp;⏱ '+def.cd[Math.min(2,l-1)]+' dtk</div></div>'+
    '<button class="gbtn'+(can?'':' off')+'" data-el="1">'+(max?'Maks':'Naik 🪙'+cost)+'</button></div>';
  h+='<div class="sechead">Skill Pendukung</div><div class="note">Pasang sampai 2 skill pendukung ke tombol kecil di layar, mendampingi skill utamamu.</div>';
  SUPPORT.forEach(function(s){ var sl=P.skills[s.id]||0, smax=sl>=s.max, scost=skillCost(s,sl), lock=P.level<s.unlock, scan=!smax&&!lock&&P.coins>=scost;
    var slot=P.slots.indexOf(s.id);
    h+='<div class="item"><div class="ic">'+s.ic+'</div><div class="tx"><b>'+s.name+'</b>'+s.desc+
      '<div class="dots">'+'●'.repeat(sl)+'○'.repeat(s.max-sl)+' &nbsp;⏱ '+s.cd[Math.max(0,sl-1)]+' dtk</div>'+
      (sl?'<div class="slotpick">'+[0,1].map(function(i){return '<button data-slot="'+s.id+':'+i+'" class="'+(slot===i?'on':'')+'">'+(i+1)+'</button>';}).join('')+'</div>':'')+
      '</div><button class="gbtn'+(scan?'':' off')+'" data-sup="'+s.id+'">'+(smax?'Maks':lock?'Lv '+s.unlock:(sl?'Naik ':'Buka ')+'🪙'+scost)+'</button></div>'; });
  h+='<div class="sechead">Latihan tubuh</div>';
  SKILLS.forEach(function(s){ var pl=P.skills[s.id]||0, pmax=pl>=s.max, pcost=skillCost(s,pl), pcan=!pmax&&P.coins>=pcost;
    h+='<div class="item"><div class="ic">'+s.ic+'</div><div class="tx"><b>'+s.name+'</b>'+s.desc+'<div class="dots">'+'●'.repeat(pl)+'○'.repeat(s.max-pl)+'</div></div>'+
      '<button class="gbtn'+(pcan?'':' off')+'" data-sk="'+s.id+'">'+(pmax?'Maks':'🪙 '+pcost)+'</button></div>'; });
  var top=$('sBody').scrollTop;
  openSheet('Skill',h); $('sBody').scrollTop=top;
  $('sBody').querySelectorAll('[data-el]').forEach(function(b){ b.addEventListener('click',function(){
    var lv=P.skills[P.element]||1, c=40+lv*40; if(lv>=3) return;
    if(P.coins<c){ toast('Koin belum cukup. Butuh '+c+' koin.'); return; }
    P.coins-=c; P.skills[P.element]=lv+1; toast(def.skillName+' naik ke level '+(lv+1)+'!'); dirty=true; save(true); hud(); showSkills(); }); });
  $('sBody').querySelectorAll('[data-sup]').forEach(function(b){ b.addEventListener('click',function(){
    var s=SUP[b.getAttribute('data-sup')], sl=P.skills[s.id]||0, scost=skillCost(s,sl);
    if(sl>=s.max) return; if(P.level<s.unlock){ toast('Butuh Lv '+s.unlock+' untuk membuka skill ini.'); return; }
    if(P.coins<scost){ toast('Koin belum cukup. Butuh '+scost+' koin.'); return; }
    P.coins-=scost; P.skills[s.id]=sl+1; ensureSlots(); renderSlots();
    toast(s.name+(sl?' naik ke level '+(sl+1):' terbuka')+'!'); dirty=true; save(true); hud(); showSkills(); }); });
  $('sBody').querySelectorAll('[data-sk]').forEach(function(b){ b.addEventListener('click',function(){
    var s=SKILLS.filter(function(x){return x.id===b.getAttribute('data-sk');})[0], pl=P.skills[s.id]||0, pcost=skillCost(s,pl);
    if(pl>=s.max) return; if(P.coins<pcost){ toast('Koin belum cukup. Butuh '+pcost+' koin.'); return; }
    var before=stats().maxHp; P.coins-=pcost; P.skills[s.id]=pl+1; var after=stats().maxHp; P.hp+=Math.max(0,after-before);
    toast(s.name+' naik ke level '+(pl+1)+'!'); dirty=true; save(true); hud(); showSkills(); }); });
  $('sBody').querySelectorAll('[data-slot]').forEach(function(b){ b.addEventListener('click',function(){
    var v=b.getAttribute('data-slot').split(':'), id=v[0], i=+v[1], old=P.slots.indexOf(id), prev=P.slots[i];
    while(P.slots.length<2) P.slots.push(null);
    P.slots[i]=id; if(old>=0 && old!==i) P.slots[old]=prev||null;
    P.slots=P.slots.map(function(x){return x||null;});
    while(P.slots.length && !P.slots[P.slots.length-1]) P.slots.pop();
    renderSlots(); dirty=true; save(true); showSkills(); }); });
}
function showQuest(){
  var h='', q=QUESTS[P.q];
  QUESTS.forEach(function(x,i){
    var st=i<P.q?'✅':i===P.q?(x.type==='talk'||P.qa?'📍':'❔'):'🔒';
    var extra=i===P.q&&x.type==='kill'&&P.qa?'<div class="dots">'+P.qp+' / '+x.n+'</div>':'';
    var desc=i<=P.q?esc(x.desc):'Selesaikan quest sebelumnya untuk membuka.';
    h+='<div class="item"><div class="ic">'+st+'</div><div class="tx"><b>'+esc(i<=P.q?x.title:'???')+'</b>'+desc+extra+'</div></div>';
  });
  h+='<div class="sechead">Quest sampingan: Desa Angker</div>';
  SQUESTS.forEach(function(x,i){
    var st=i<P.sq?'✅':i===P.sq?(P.sqa?'📍':'❔'):'🔒';
    var extra=i===P.sq&&P.sqa?'<div class="dots">'+P.sqp+' / '+x.n+'</div>':'';
    var desc=i<=P.sq?esc(x.desc):'Selesaikan quest sebelumnya untuk membuka.';
    h+='<div class="item"><div class="ic">'+st+'</div><div class="tx"><b>'+esc(i<=P.sq?x.title:'???')+'</b>'+desc+extra+'</div></div>';
  });
  openSheet('Catatan quest',h);
}
function showMap(){
  var h='<div class="note">Pindah cepat ke wilayah yang pernah kau datangi. Gerbang di tepi peta juga membawamu ke wilayah berikutnya.</div>';
  ORDER.forEach(function(id){ var z=ZONES[id], seen=P.visited.indexOf(id)>=0, here=id===zoneId;
    h+='<div class="item"><div class="ic">'+({village:'🏡',forest:'🌲',castle:'🏰',cave:'💎',lair:'🐉',ghost:'👻'}[id])+'</div><div class="tx"><b>'+z.label+'</b>'+(seen?z.sub:'Belum dijelajahi')+' · Lv '+z.minLv+'+</div>'+
      '<button class="gbtn'+(seen&&!here?'':' off')+'" data-z="'+id+'">'+(here?'Di sini':seen?'Pergi':'🔒')+'</button></div>'; });
  openSheet('Peta Elyndor',h);
  $('sBody').querySelectorAll('[data-z]').forEach(function(b){ b.addEventListener('click',function(){ var id=b.getAttribute('data-z');
    if(id===zoneId||P.visited.indexOf(id)<0) return; closeSheet(); enterZone(id,null,false); }); });
}
function showRank(){
  openSheet('Papan peringkat','<div class="note">Memuat...</div>');
  if(!db){ $('sBody').innerHTML='<div class="note">Peringkat butuh koneksi ke dunia bersama.</div>'; return; }
  db.collection('players').orderBy('level','desc').limit(15).get().then(function(snap){
    var h='', i=0; snap.docs.forEach(function(d){ var p=d.data()||{}; i++;
      h+='<div class="item"><div class="ic">'+(i===1?'🥇':i===2?'🥈':i===3?'🥉':i)+'</div><div class="tx"><b>'+esc(String(p.name||'?').slice(0,16))+(p.hero?' 🐉':'')+'</b>Lv '+(+p.level||1)+' · '+(+p.kills||0)+' monster dikalahkan</div></div>'; });
    $('sBody').innerHTML=h||'<div class="note">Belum ada Perantau lain. Ajak temanmu bergabung.</div>';
  }).catch(function(){ $('sBody').innerHTML='<div class="note">Gagal memuat peringkat. Coba lagi sebentar lagi.</div>'; });
}
function showPeople(){
  var h='<div class="item"><div class="ic">⭐</div><div class="tx"><b>'+esc(P.name)+' (kamu)</b>Lv '+P.level+' · '+zone.label+'</div></div>';
  var ks=Object.keys(allPeers);
  ks.forEach(function(k){ var o=allPeers[k]; h+='<div class="item"><div class="ic">🧭</div><div class="tx"><b>'+esc(o.n)+'</b>Lv '+o.lv+' · '+esc(ZONES[o.z]?ZONES[o.z].label:'?')+'</div></div>'; });
  if(!ks.length) h+='<div class="note">Belum ada Perantau lain yang online saat ini.</div>';
  if(!room) h+='<div class="note">Fitur lihat pemain real-time tidak aktif di tampilan ini.</div>';
  openSheet('Pemain online',h);
}
function openEmotes(){
  var h='<div class="emos">'+ALLOWED_EMO.map(function(e){return '<button data-e="'+e+'">'+e+'</button>';}).join('')+'</div>';
  openSheet('Emote',h);
  $('sBody').querySelectorAll('[data-e]').forEach(function(b){ b.addEventListener('click',function(){ P.e=b.getAttribute('data-e'); P.et=Date.now(); emoteT=2.6; sendPresence(true); closeSheet(); }); });
}

/* ===================== NPC DIALOG ===================== */
function openNpc(n){
  if(n.id==='bram') return shop();
  if(n.id==='darmo') return openDarmo(n);
  var q=QUESTS[P.q], lines=[], choices=[];
  var say=function(t){ lines.push(t); };
  if(q && q.type==='talk' && q.target===n.id){
    say(q.done); choices.push({l:'Terima hadiah (🪙 '+q.coin+', '+q.xp+' xp)',f:function(){ reward(q); openNpc(n); }});
  } else if(q && q.giver===n.id && q.type==='kill'){
    if(!P.qa){ say(q.offer); choices.push({l:'Aku akan melakukannya. (Terima quest)',f:function(){ P.qa=true; P.qp=0; sfx('quest'); dirty=true; save(true); hud(); toast('Quest diterima: '+q.title); closeSheet(); }});
      choices.push({l:'Aku belum siap.',f:closeSheet}); }
    else if(P.qp>=q.n){ say(q.done); choices.push({l:'Terima hadiah (🪙 '+q.coin+', '+q.xp+' xp'+(q.pot?', '+q.pot+' 🧪':'')+')',f:function(){ reward(q); openNpc(n); }}); }
    else { say('Bagaimana perburuanmu? Aku masih menunggu. ('+MON[q.target].name+' '+P.qp+' / '+q.n+')'); }
  } else {
    say(greet(n.id));
  }
  (LORE[n.id]||[]).forEach(function(o){ choices.push({l:o.q,f:function(){ openSheet(n.name,'<div class="say">'+esc(o.a)+'</div><button class="choice" id="backNpc">Tanya hal lain</button><button class="choice" id="byeNpc">Sampai jumpa</button>');
    $('backNpc').addEventListener('click',function(){openNpc(n);}); $('byeNpc').addEventListener('click',closeSheet); }}); });
  choices.push({l:'Sampai jumpa.',f:closeSheet});
  var h='<div class="say">'+lines.map(esc).join('<br><br>')+'</div>'+choices.map(function(c,i){return '<button class="choice" data-c="'+i+'">'+esc(c.l)+'</button>';}).join('');
  openSheet(n.name,h);
  $('sBody').querySelectorAll('[data-c]').forEach(function(b){ b.addEventListener('click',function(){ choices[+b.getAttribute('data-c')].f(); }); });
}
function openDarmo(n){
  var q=SQUESTS[P.sq], lines=[], choices=[];
  if(!q){ lines.push('Terima kasih atas semua bantuanmu, Pahlawan. Desa ini berutang budi padamu.'); }
  else if(!P.sqa){ lines.push(q.offer);
    choices.push({l:'Aku akan membantu. (Terima quest)',f:function(){ P.sqa=true; P.sqp=0; sfx('quest'); dirty=true; save(true); hud(); toast('Quest diterima: '+q.title); closeSheet(); }});
    choices.push({l:'Nanti dulu, Mbah.',f:closeSheet}); }
  else if(P.sqp>=q.n){ lines.push(q.done); choices.push({l:'Terima hadiah (🪙 '+q.coin+', '+q.xp+' xp'+(q.pot?', '+q.pot+' 🧪':'')+')',f:function(){ rewardSide(q); openDarmo(n); }}); }
  else { lines.push('Bagaimana perburuanmu, Nak? ('+MON[q.target].name+' '+P.sqp+' / '+q.n+')'); }
  LORE.darmo.forEach(function(o){ choices.push({l:o.q,f:function(){ openSheet(n.name,'<div class="say">'+esc(o.a)+'</div><button class="choice" id="backNpc">Tanya hal lain</button><button class="choice" id="byeNpc">Sampai jumpa</button>');
    $('backNpc').addEventListener('click',function(){openDarmo(n);}); $('byeNpc').addEventListener('click',closeSheet); }}); });
  choices.push({l:'Sampai jumpa.',f:closeSheet});
  var h='<div class="say">'+lines.map(esc).join('<br><br>')+'</div>'+choices.map(function(c,i){return '<button class="choice" data-c="'+i+'">'+esc(c.l)+'</button>';}).join('');
  openSheet(n.name,h);
  $('sBody').querySelectorAll('[data-c]').forEach(function(b){ b.addEventListener('click',function(){ choices[+b.getAttribute('data-c')].f(); }); });
}
function greet(id){
  var g={ilra:'Angin membawa kabar baik tentangmu, Perantau.',toran:'Tetap waspada di antara pepohonan.',maren:'Batu-batu kastil ini masih mengingat masa jayanya.',sael:'Kristal-kristal ini berbisik tentang keberanianmu.'};
  if(P.hero) return 'Pahlawan Elyndor! Kehadiranmu membuat dunia ini terasa lebih utuh.';
  return g[id]||'Salam, Perantau.';
}
function reward(q){
  sfx('questdone'); P.coins+=q.coin; P.potions+=(q.pot||0); if(q.target==='dragon') P.hero=true;
  P.q++; P.qa=false; P.qp=0;
  var nq=QUESTS[P.q]; if(nq && nq.type==='talk'){ P.qa=true; }
  toast('Hadiah diterima: +'+q.coin+' koin, +'+q.xp+' xp'+(q.pot?', +'+q.pot+' ramuan':''),2800);
  gainXp(q.xp); dirty=true; save(true); hud();
}
function rewardSide(q){
  P.coins+=q.coin; P.potions+=(q.pot||0); P.sq++; P.sqa=false; P.sqp=0; sfx('questdone');
  toast('Hadiah diterima: +'+q.coin+' koin, +'+q.xp+' xp'+(q.pot?', +'+q.pot+' ramuan':''),2800);
  gainXp(q.xp); dirty=true; save(true); hud();
}
function shop(){
  var h='<div class="say">Selamat datang di lapak Bram! Ramuan segar, dijamin bikin semangat. Masing-masing memulihkan setengah HP-mu.</div>'+
   '<div class="note">Koinmu: 🪙 '+P.coins+' · Ramuan: 🧪 '+P.potions+'</div>'+
   '<div class="item"><div class="ic">🧪</div><div class="tx"><b>1 ramuan</b>Pulihkan 50% HP</div><button class="gbtn'+(P.coins>=15?'':' off')+'" data-b="1">🪙 15</button></div>'+
   '<div class="item"><div class="ic">🧪</div><div class="tx"><b>5 ramuan</b>Hemat 10 koin</div><button class="gbtn'+(P.coins>=65?'':' off')+'" data-b="5">🪙 65</button></div>';
  openSheet('Pedagang Bram',h);
  $('sBody').querySelectorAll('[data-b]').forEach(function(b){ b.addEventListener('click',function(){
    var n=+b.getAttribute('data-b'), c=n===5?65:15;
    if(P.coins<c){toast('Koinmu kurang.');return;} P.coins-=c; P.potions+=n; toast('+'+n+' ramuan'); dirty=true; save(true); hud(); shop(); }); });
}

})();

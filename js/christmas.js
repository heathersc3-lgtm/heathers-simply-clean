/* Christmas add-on for Heather's Simply Clean Co.: active ONLY when the America/Los_Angeles
   calendar date is Dec 1, 2026 through Jan 1, 2027 inclusive.
   Outside those dates this script does nothing and the site looks as it otherwise would.
   Preview (testing only): ?preview=christmas  or  ?test_date=YYYY-MM-DD */
(function(){
  'use strict';
  function pacificYMD(d){var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d),o={};for(var i=0;i<p.length;i++)o[p[i].type]=p[i].value;return o.year+'-'+o.month+'-'+o.day;}
  function previewYMD(){
    if(/[?&]preview=christmas(?:&|$)/i.test(location.search))return '2026-12-01';
    var t=/[?&](?:(?:hlk|hsc)_)?test_date=(\d{4})-(\d{1,2})-(\d{1,2})/.exec(location.search);
    if(t)return t[1]+'-'+('0'+t[2]).slice(-2)+'-'+('0'+t[3]).slice(-2);
    return pacificYMD(new Date());
  }
  var ymd=previewYMD();
  if(ymd<'2026-12-01'||ymd>'2027-01-01')return;
  var root=document.documentElement;root.classList.add('xmas');
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)root.classList.add('xmas-static');
  function flakeSVG(sz,color){return '<svg viewBox="0 0 32 32" width="'+sz+'" height="'+sz+'" aria-hidden="true"><g fill="none" stroke="'+color+'" stroke-width="2" stroke-linecap="round"><path d="M16 2v28M4.4 9l23.2 14M4.4 23 27.6 9"/><path d="M16 6l-3-3M16 6l3-3M16 26l-3 3M16 26l3 3M7.5 10.8l-4 .2M7.5 10.8l-1.5-3.7M24.5 21.2l4-.2M24.5 21.2l1.5 3.7M7.5 21.2l-4-.2M7.5 21.2l-1.5 3.7M24.5 10.8l4 .2M24.5 10.8l1.5-3.7"/></g></svg>';}
  function lightsHTML(){
    var colors=['#e8c56b','#c41e3a','#2e8a4a','#f7f1d0','#e8c56b','#c41e3a'];
    var n=28,w=1120,h=[],wire='M0 8';
    for(var i=0;i<=n;i++){var x=(i/n)*w,y=8+((i%2)?10:-2);wire+=(i?' Q ':'')+(x-(w/n)/2)+' '+(i%2?20:2)+' '+x+' '+y;}
    for(var i=1;i<n;i++){
      var x=(i/n)*w,y=8+((i%2)?10:-2),c=colors[i%colors.length],dl=(-(i%5)*0.55).toFixed(2);
      h.push('<g class="xm-b" style="animation-delay:'+dl+'s" transform="translate('+x.toFixed(1)+' '+y+')"><path d="M0 0c-3.2 0-5.6 2.6-5.2 5.8L-4 14h8l1.2-8.2C5.6 2.6 3.2 0 0 0Z" fill="'+c+'" stroke="rgba(0,0,0,.15)" stroke-width=".6"/><rect x="-1.1" y="-3.2" width="2.2" height="3.4" rx=".4" fill="#6a5a2a"/></g>');
    }
    return '<svg class="xm-lights-svg" viewBox="0 0 '+w+' 36" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><path d="'+wire+'" fill="none" stroke="#2a2416" stroke-width="1.4" stroke-linecap="round"/>'+h.join('')+'</svg>';
  }
  function startSnow(canvas){
    if(!canvas)return;
    var ctx,dpr,W,H,flakes=[],extras=[],running=true,last=0,caneImg=[],giftImg=[];
    function makeCane(flip){
      var c=document.createElement('canvas');c.width=36;c.height=64;var g=c.getContext('2d');
      g.translate(18,2);if(flip)g.scale(-1,1);g.lineCap='round';g.lineJoin='round';g.lineWidth=12;
      g.strokeStyle='#f7f7f7';g.beginPath();g.moveTo(0,58);g.lineTo(0,20);g.quadraticCurveTo(0,4,16,4);g.quadraticCurveTo(28,4,28,18);g.stroke();
      g.strokeStyle='#c41e3a';g.setLineDash([5,6]);g.lineWidth=12;g.beginPath();g.moveTo(0,58);g.lineTo(0,20);g.quadraticCurveTo(0,4,16,4);g.quadraticCurveTo(28,4,28,18);g.stroke();
      return c;
    }
    function makeGift(box,rib,lid){
      var c=document.createElement('canvas');c.width=44;c.height=44;var g=c.getContext('2d');
      g.fillStyle=box;g.fillRect(8,16,28,22);g.strokeStyle='rgba(0,0,0,.12)';g.strokeRect(8,16,28,22);
      g.fillStyle=lid;g.fillRect(6,12,32,8);
      g.fillStyle=rib;g.fillRect(19,12,6,26);g.fillRect(8,23,28,5);
      g.beginPath();g.moveTo(22,16);g.bezierCurveTo(10,2,8,16,22,16);g.bezierCurveTo(36,2,38,16,22,16);g.fillStyle=rib;g.fill();
      return c;
    }
    caneImg=[makeCane(0),makeCane(1)];
    giftImg=[makeGift('#1e6b3c','#d4a017','#258a4a'),makeGift('#b71c2c','#e8c56b','#d32f2f'),makeGift('#c9a227','#b71c2c','#e0b93a')];
    function reset(){
      dpr=Math.min(window.devicePixelRatio||1,2);
      W=canvas.clientWidth||window.innerWidth;H=canvas.clientHeight||window.innerHeight;
      canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
      ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);
      var mobile=W<700,nf=mobile?22:48,nc=mobile?2:5,ng=mobile?2:4;
      flakes=[];extras=[];
      for(var i=0;i<nf;i++)flakes.push({x:Math.random()*W,y:Math.random()*H,r:1.4+Math.random()*2.8,vy:12+Math.random()*28,amp:8+Math.random()*22,per:2+Math.random()*3,ph:Math.random()*6.28,a:.55+Math.random()*.4});
      for(var i=0;i<nc;i++)extras.push({x:Math.random()*W,y:Math.random()*H,vy:18+Math.random()*22,vx:(Math.random()-.5)*16,rot:Math.random()*6.28,vr:(Math.random()-.5)*.4,img:caneImg[i%caneImg.length],s:.85+Math.random()*.4});
      for(var i=0;i<ng;i++)extras.push({x:Math.random()*W,y:Math.random()*H,vy:16+Math.random()*20,vx:(Math.random()-.5)*12,rot:Math.random()*6.28,vr:(Math.random()-.5)*.3,img:giftImg[i%giftImg.length],s:.8+Math.random()*.4});
    }
    function frame(ts){
      if(!running)return;
      if(!last)last=ts;
      var dt=Math.min(.05,(ts-last)/1000);last=ts;
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<flakes.length;i++){
        var f=flakes[i];f.y+=f.vy*dt;f.ph+=dt*f.per;var x=f.x+Math.sin(f.ph)*f.amp;
        if(f.y>H+6){f.y=-6;f.x=Math.random()*W;}
        ctx.beginPath();ctx.fillStyle='rgba(255,255,255,'+f.a+')';ctx.arc(x,f.y,f.r,0,6.28);ctx.fill();
      }
      for(var i=0;i<extras.length;i++){
        var e=extras[i];e.y+=e.vy*dt;e.x+=e.vx*dt;e.rot+=e.vr*dt;
        if(e.y>H+40){e.y=-40;e.x=Math.random()*W;}
        if(e.x<-40)e.x=W+40;if(e.x>W+40)e.x=-40;
        ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.rot);ctx.scale(e.s,e.s);ctx.globalAlpha=.8;ctx.drawImage(e.img,-e.img.width/2,-e.img.height/2);ctx.restore();
      }
      requestAnimationFrame(frame);
    }
    window.addEventListener('resize',reset,{passive:true});
    document.addEventListener('visibilitychange',function(){
      if(document.hidden){running=false;last=0;}
      else{running=true;requestAnimationFrame(frame);}
    });
    reset();requestAnimationFrame(frame);
  }
  var SNOWCAP='<div class="xm-cap" aria-hidden="true"></div>';
  var DRIFT="<svg class=\"xm-drift-svg\" viewBox=\"0 0 1200 80\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><path fill=\"#E4EEF7\" d=\"M0 80V38C90 18 170 58 270 36C390 12 480 52 600 30C740 6 840 50 960 26C1060 10 1140 34 1200 20V80Z\"/><path fill=\"#F8FBFF\" d=\"M0 80V54C110 36 210 66 330 50C470 30 580 68 720 52C860 34 980 66 1200 42V80Z\"/></svg>";
  var HERO_SNOW="<svg class=\"xm-hero-snow\" viewBox=\"0 0 1200 90\" preserveAspectRatio=\"none\" aria-hidden=\"true\"><path fill=\"#EEF5FB\" d=\"M0 90V44C140 20 240 62 380 40C520 16 640 58 780 36C920 14 1060 48 1200 28V90Z\"/><path fill=\"#F8FBFF\" d=\"M0 90V62C130 46 250 76 400 58C560 36 700 78 860 60C1000 44 1100 70 1200 54V90Z\"/></svg>";
  var HOLLY_L="<svg class=\"xm-holly l\" viewBox=\"0 0 120 110\" aria-hidden=\"true\"><path fill=\"#1a6b3c\" d=\"M22 48c-8-22 10-40 28-22 2-24 28-28 24 0 18-16 40-2 22 18 22 2 22 28 0 22 14 18-8 36-22 14-6 22-30 18-20-4-18 16-36-2-22-16-22 4-26-18-10-12z\"/><path fill=\"#0e4a28\" d=\"M38 44l12 10-2 8-10-8 6-10zm28-8l10 12 8-2-6 12-12-8zm18 22l-2 12 8 6-14-4-4-10zm-20 20l-12 6 2 10 12-8-2-8z\"/><circle cx=\"58\" cy=\"58\" r=\"7.5\" fill=\"#b71c2c\"/><circle cx=\"71\" cy=\"52\" r=\"6.2\" fill=\"#9B1B2E\"/><circle cx=\"66\" cy=\"68\" r=\"6\" fill=\"#c41e3a\"/><circle cx=\"58\" cy=\"55\" r=\"2\" fill=\"#f3d0d4\" opacity=\".55\"/></svg>";
  var HOLLY_R="<svg class=\"xm-holly r\" viewBox=\"0 0 120 110\" aria-hidden=\"true\"><path fill=\"#1a6b3c\" d=\"M22 48c-8-22 10-40 28-22 2-24 28-28 24 0 18-16 40-2 22 18 22 2 22 28 0 22 14 18-8 36-22 14-6 22-30 18-20-4-18 16-36-2-22-16-22 4-26-18-10-12z\"/><path fill=\"#0e4a28\" d=\"M38 44l12 10-2 8-10-8 6-10zm28-8l10 12 8-2-6 12-12-8zm18 22l-2 12 8 6-14-4-4-10zm-20 20l-12 6 2 10 12-8-2-8z\"/><circle cx=\"58\" cy=\"58\" r=\"7.5\" fill=\"#b71c2c\"/><circle cx=\"71\" cy=\"52\" r=\"6.2\" fill=\"#9B1B2E\"/><circle cx=\"66\" cy=\"68\" r=\"6\" fill=\"#c41e3a\"/><circle cx=\"58\" cy=\"55\" r=\"2\" fill=\"#f3d0d4\" opacity=\".55\"/></svg>";
  function staticFlakes(){
    var L=document.createElement('div');L.className='xm-static-flakes';L.setAttribute('aria-hidden','true');
    var spots=[[8,12],[22,28],[40,10],[58,22],[73,8],[88,26],[15,48],[81,52]];
    var h='';for(var i=0;i<spots.length;i++)h+='<span style="left:'+spots[i][0]+'%;top:'+spots[i][1]+'%">'+flakeSVG(i%3?14:18,'#dce8f2')+'</span>';
    L.innerHTML=h;return L;
  }
  function go(){
    var b=document.createElement('div');b.className='xm-banner';b.setAttribute('role','note');
    b.innerHTML=flakeSVG(16,'#E8C56B')+'<span>Merry Christmas<span class="xm-from"> from Heather&#39;s Simply Clean Co.</span></span>'+flakeSVG(16,'#E8C56B')+SNOWCAP;
    document.body.insertBefore(b,document.body.firstChild);
    var nav=document.querySelector('.nav');
    if(nav){
      var cap=document.createElement('div');cap.className='xm-nav-cap';cap.setAttribute('aria-hidden','true');cap.innerHTML=SNOWCAP;
      nav.insertBefore(cap,nav.firstChild);
      var L=document.createElement('div');L.className='xm-lights';L.setAttribute('aria-hidden','true');L.innerHTML=lightsHTML();
      nav.appendChild(L);
    }
    var hero=document.querySelector('.hero');
    if(hero){
      var d=document.createElement('div');d.className='xm-deco';d.setAttribute('aria-hidden','true');
      d.innerHTML=HOLLY_L+HOLLY_R+HERO_SNOW;
      hero.insertBefore(d,hero.firstChild);
    }
    var foot=document.querySelector('.footer');
    if(foot){
      var fs=document.createElement('div');fs.className='xm-foot-snow';fs.setAttribute('aria-hidden','true');fs.innerHTML=SNOWCAP;
      foot.insertBefore(fs,foot.firstChild);
    }
    var fx=document.createElement('div');fx.className='xm-fx';fx.setAttribute('aria-hidden','true');
    fx.innerHTML='<div class="xm-drift">'+DRIFT+'</div>'+(reduce?'':'<canvas class="xm-canvas"></canvas>');
    document.body.appendChild(fx);
    if(reduce)document.body.appendChild(staticFlakes());
    else startSnow(fx.querySelector('.xm-canvas'));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

/* Christmas add-on: active ONLY when the America/Los_Angeles
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
  function ornament(){return '<svg class="xm-orn-svg" viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M12 2.2 14 9.8 21.8 12 14 14.2 12 21.8 10 14.2 2.2 12 10 9.8Z" fill="none" stroke="#D4AF6A" stroke-width="1.15" stroke-linejoin="round"/></svg>';}
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
  function startSnow(canvas,stat){
    if(!canvas)return;
    var ctx,dpr,W,H,flakes=[],extras=[],running=!stat,last=0,caneImg=[],giftImg=[];
    function rr(g,x,y,w,h,r){if(g.roundRect){g.beginPath();g.roundRect(x,y,w,h,r);g.fill();}else g.fillRect(x,y,w,h);}
    function makeCane(flip){
      var c=document.createElement('canvas');c.width=48;c.height=88;var g=c.getContext('2d');
      g.translate(16,4);if(flip)g.scale(-1,1);
      g.lineCap='round';g.lineJoin='round';
      g.shadowColor='rgba(40,24,16,.16)';g.shadowBlur=3;g.shadowOffsetY=1;
      g.lineWidth=8;
      g.strokeStyle='#F4EDE0';
      g.beginPath();g.moveTo(0,76);g.lineTo(0,24);g.quadraticCurveTo(0,6,16,6);g.quadraticCurveTo(28,6,28,22);g.stroke();
      g.shadowColor='transparent';
      g.strokeStyle='#7A1E2B';g.setLineDash([4,5]);g.lineWidth=8;
      g.beginPath();g.moveTo(0,76);g.lineTo(0,24);g.quadraticCurveTo(0,6,16,6);g.quadraticCurveTo(28,6,28,22);g.stroke();
      return c;
    }
    function makeGift(box,lid){
      var gold='#C9A24A',c=document.createElement('canvas');c.width=64;c.height=64;var g=c.getContext('2d');
      g.shadowColor='rgba(40,24,16,.18)';g.shadowBlur=4;g.shadowOffsetY=1;
      g.fillStyle=box;rr(g,12,22,40,30,4);
      g.shadowColor='transparent';
      g.fillStyle=lid;rr(g,10,17,44,10,3);
      g.fillStyle=gold;g.fillRect(29,17,6,35);g.fillRect(12,32,40,5);
      g.beginPath();g.moveTo(32,20);g.bezierCurveTo(16,4,14,22,32,20);g.bezierCurveTo(50,4,52,22,32,20);g.fill();
      g.beginPath();g.arc(32,20,3.2,0,6.28);g.fill();
      return c;
    }
    caneImg=[makeCane(0),makeCane(1)];
    giftImg=[makeGift('#1A3D2C','#234A36'),makeGift('#7A1E2B','#8C2A38'),makeGift('#F3E6C8','#F7F0DE')];
    function driftY(){return H-(W<700?22:34)-6;}
    function safeX(){return W<700?(18+Math.random()*Math.max(30,W-150)):(48+Math.random()*(W-96));}
    function reset(){
      dpr=Math.min(window.devicePixelRatio||1,2);
      W=canvas.clientWidth||window.innerWidth;H=canvas.clientHeight||window.innerHeight;
      canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
      ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);
      var mobile=W<700,nf=mobile?14:28,nc=mobile?1:3,ng=mobile?2:3;
      flakes=[];extras=[];
      for(var i=0;i<nf;i++){
        flakes.push({x:Math.random()*W,y:Math.random()*H,r:.7+Math.random()*2.6,vy:6+Math.random()*10,amp:6+Math.random()*16,per:1.2+Math.random()*2,ph:Math.random()*6.28,a:.22+Math.random()*.3,kind:Math.random()>.62?'star':'dot'});
      }
      function extra(img,s,rest){
        extras.push({x:safeX(),y:rest?driftY():(-24-Math.random()*90),vy:rest?0:(5.5+Math.random()*6.5),vx:rest?0:((Math.random()-.5)*5),rot:(Math.random()-.5)*.35,vr:rest?0:((Math.random()-.5)*.06),img:img,s:s,resting:!!rest});
      }
      for(var i=0;i<nc;i++)extra(caneImg[i%caneImg.length],.72+Math.random()*.18,stat||i===0);
      for(var i=0;i<ng;i++)extra(giftImg[i%giftImg.length],.62+Math.random()*.16,stat||i===0);
      var resters=[],i;for(i=0;i<extras.length;i++)if(extras[i].resting)resters.push(extras[i]);
      var n=resters.length,margin=W<700?28:90,avoid=W<700?130:0,usable=Math.max(80,W-margin*2-avoid);
      for(i=0;i<n;i++)resters[i].x=margin+usable*(i+.5)/Math.max(1,n);
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<flakes.length;i++){
        var f=flakes[i],x=f.x+Math.sin(f.ph)*f.amp;
        ctx.save();ctx.translate(x,f.y);ctx.globalAlpha=f.a;
        if(f.kind==='star'){
          ctx.rotate(f.ph*.12);ctx.beginPath();
          for(var k=0;k<6;k++){var a=k*Math.PI/3;ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*f.r*2.1,Math.sin(a)*f.r*2.1);}
          ctx.strokeStyle='rgba(255,255,255,'+Math.min(1,f.a+ .15)+')';ctx.lineWidth=.7;ctx.lineCap='round';ctx.stroke();
        }else{
          ctx.beginPath();ctx.fillStyle='rgba(255,255,255,1)';ctx.arc(0,0,f.r,0,6.28);ctx.fill();
        }
        ctx.restore();
      }
      for(var i=0;i<extras.length;i++){
        var e=extras[i];
        ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.rot);ctx.scale(e.s,e.s);ctx.globalAlpha=.9;ctx.drawImage(e.img,-e.img.width/2,-e.img.height/2);ctx.restore();
      }
    }
    function frame(ts){
      if(!running)return;
      if(!last)last=ts;
      var dt=Math.min(.05,(ts-last)/1000);last=ts;
      var lim=driftY();
      for(var i=0;i<flakes.length;i++){
        var f=flakes[i];f.y+=f.vy*dt;f.ph+=dt*f.per;
        if(f.y>H+8){f.y=-8;f.x=Math.random()*W;}
      }
      for(var i=0;i<extras.length;i++){
        var e=extras[i];
        if(e.resting)continue;
        e.y+=e.vy*dt;e.x+=e.vx*dt;e.rot+=e.vr*dt;
        if(e.x<16){e.x=16;e.vx=Math.abs(e.vx)*.4;}
        if(e.x>W-16){e.x=W-16;e.vx=-Math.abs(e.vx)*.4;}
        if(e.y>=lim){e.y=lim;e.vy=0;e.vx=0;e.vr=0;e.resting=true;}
      }
      draw();
      requestAnimationFrame(frame);
    }
    window.addEventListener('resize',function(){reset();if(stat)draw();},{passive:true});
    document.addEventListener('visibilitychange',function(){
      if(stat)return;
      if(document.hidden){running=false;last=0;}
      else{running=true;requestAnimationFrame(frame);}
    });
    reset();
    if(stat)draw();
    else requestAnimationFrame(frame);
  }
  var SNOWCAP='<div class="xm-cap" aria-hidden="true"></div>';
  var DRIFT='<svg class="xm-drift-svg" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true"><path fill="#EEF2F6" fill-opacity=".65" d="M0 60V30C160 16 300 42 450 28C620 12 780 40 940 26C1060 16 1140 26 1200 20V60Z"/><path fill="#F7F9FB" fill-opacity=".8" d="M0 60V40C200 28 360 50 540 38C740 24 940 50 1200 34V60Z"/></svg>';
  var HERO_SNOW='<svg class="xm-hero-snow" viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden="true"><path fill="#EEF3F7" fill-opacity=".55" d="M0 70V36C180 18 340 50 520 32C720 12 920 44 1200 26V70Z"/><path fill="#F8FAFC" fill-opacity=".75" d="M0 70V48C200 36 400 60 620 46C860 30 1040 56 1200 44V70Z"/></svg>';
  var HOLLY_L='<svg class="xm-holly l" viewBox="0 0 120 110" aria-hidden="true"><path fill="#1A3D2C" d="M22 48c-8-22 10-40 28-22 2-24 28-28 24 0 18-16 40-2 22 18 22 2 22 28 0 22 14 18-8 36-22 14-6 22-30 18-20-4-18 16-36-2-22-16-22 4-26-18-10-12z"/><circle cx="58" cy="58" r="5.5" fill="#7A1E2B"/><circle cx="70" cy="53" r="4.5" fill="#6B1826"/><circle cx="65" cy="66" r="4.2" fill="#8C2A38"/></svg>';
  var HOLLY_R=HOLLY_L.replace('xm-holly l','xm-holly r');
  function go(){
    var b=document.createElement('div');b.className='xm-banner';b.setAttribute('role','note');
    b.innerHTML='<span class="xm-orn" aria-hidden="true">'+ornament()+'</span><span class="xm-banner-text"><span class="xm-title">Merry Christmas</span><span class="xm-from">from Heather&#39;s Simply Clean Co.</span></span><span class="xm-orn" aria-hidden="true">'+ornament()+'</span>'+SNOWCAP;
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
    fx.innerHTML='<div class="xm-drift">'+DRIFT+'</div><canvas class="xm-canvas"></canvas>';
    document.body.appendChild(fx);
    startSnow(fx.querySelector('.xm-canvas'),reduce);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

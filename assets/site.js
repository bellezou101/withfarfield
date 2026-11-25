/* Farfield site scripts: menu, reveal on scroll, ripple field, pinned steps, release check. */
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
  // mobile menu
  var mb=document.querySelector('.menu-btn'), mn=document.getElementById('mnav');
  if(mb&&mn){
    mb.addEventListener('click',function(){ var open=mn.hidden; mn.hidden=!open; mb.setAttribute('aria-expanded',open?'true':'false'); });
    mn.addEventListener('click',function(e){ if(e.target.closest('a')){ mn.hidden=true; mb.setAttribute('aria-expanded','false'); } });
  }
  // reveal on scroll; .live switches on in-view animations
  var els=[].slice.call(document.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in','live'); io.unobserve(e.target); } });},{threshold:.14,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(el){ io.observe(el); });
  } else { els.forEach(function(el){ el.classList.add('in','live'); }); }
  // instruction change / engineering ticket toggle
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-route]'); if(!b) return;
    var box=b.closest('.fv'); if(!box) return;
    var k=+b.getAttribute('data-route');
    [].forEach.call(box.querySelectorAll('[data-route]'),function(x){ x.setAttribute('aria-selected',(+x.getAttribute('data-route')===k)?'true':'false'); });
    [].forEach.call(box.querySelectorAll('.route'),function(r){ r.hidden=(+r.getAttribute('data-r')!==k); });
    var host=box.closest('.plate')||box; host.classList.remove('live'); void host.offsetWidth; host.classList.add('live');
  });
  // left rail: where you are
  var rail=document.querySelector('.rail');
  if(rail&&'IntersectionObserver' in window){
    var links=[].slice.call(rail.querySelectorAll('a')), map={};
    links.forEach(function(a){ map[a.getAttribute('href').slice(1)]=a; });
    var ro=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ links.forEach(function(a){ a.classList.remove('on'); }); var a=map[e.target.id]; if(a) a.classList.add('on'); } }); },{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(map).forEach(function(id){ var s=document.getElementById(id); if(s) ro.observe(s); });
  }
})();

/* ===== Signal field: thousands of short marks that follow a field around a center, like iron filings.
   The pointer bends them, a click sends a wave, rings drift outward on their own, and `order` scrambles them. ===== */
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TAU=6.283185307;
  function hash(i,j){ var h=Math.sin(i*127.1+j*311.7)*43758.5453; return h-Math.floor(h); }

  function Field(cv,o){
    var ctx=cv.getContext('2d'); if(!ctx) return null;
    var host=o.host||cv.parentElement;
    var W=0,H=0,dpr=1,gap=o.gap,cols=0,rows=0,cx=0,cy=0,maxR=1,len=o.len;
    var t=0,prev=0,raf=0,visible=true,orderT=0,order=0,nextAmbient=2.5;
    var P={x:0,y:0,s:0,target:0}, rip=[];
    var rgb=o.rgb||'42,75,208';

    function size(){
      var r=cv.getBoundingClientRect(); W=r.width; H=r.height; if(!W||!H) return;
      dpr=Math.min(2,window.devicePixelRatio||1);
      cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
      var small=W<700; gap=small?(o.gapS||o.gap):o.gap; len=small?(o.lenS||o.len):o.len;
      cols=Math.ceil(W/gap)+1; rows=Math.ceil(H/gap)+1;
      var c=o.center(W,H); cx=c[0]; cy=c[1]; maxR=o.maxR?o.maxR(W,H):Math.hypot(W,H)*.7;
      draw();
    }
    function ripple(x,y,s){ rip.push({x:x,y:y,t0:t,s:s}); if(rip.length>6) rip.shift(); }
    function draw(){
      ctx.clearRect(0,0,W,H);
      var B=[[],[],[],[],[]], X=[], lam=o.lambda, sp=o.speed;
      // ripples: expand, fade
      for(var k=rip.length-1;k>=0;k--){ var q=rip[k]; q.R=(t-q.t0)*560; q.a=q.s*Math.exp(-(t-q.t0)*1.35); if(q.a<.02) rip.splice(k,1); }
      for(var j=0;j<rows;j++){
        for(var i=0;i<cols;i++){
          var x=i*gap+(j&1?gap*.5:0), y=j*gap, dx=x-cx, dy=y-cy, r=Math.sqrt(dx*dx+dy*dy)+.001;
          var vx=-dy/r, vy=dx/r, glow=0, pw=0;
          if(P.s>.01){ var px=x-P.x, py=y-P.y, pd=Math.sqrt(px*px+py*py)+1; pw=Math.exp(-pd/(o.reach||150))*P.s; vx+=-py/pd*pw*2.6; vy+=px/pd*pw*2.6; }
          for(var m=0;m<rip.length;m++){ var rp=rip[m], rx=x-rp.x, ry=y-rp.y, rd=Math.sqrt(rx*rx+ry*ry)+1, u=rd-rp.R, env=Math.exp(-(u*u)/2312)*rp.a; vx+=rx/rd*env*2.8; vy+=ry/rd*env*2.8; glow+=env; }
          if(order>.001){ var n=hash(i,j)*TAU+t*.4*(hash(j,i)-.5); vx+=Math.cos(n)*order*2.8; vy+=Math.sin(n)*order*2.8; }
          var ang=Math.atan2(vy,vx);
          var ph=r/lam*TAU-t*sp, ring=.5+.5*Math.cos(ph); ring*=ring;
          var fall=1-Math.min(1,r/maxR); fall=Math.pow(fall,o.fallPow||.55);
          var a=(o.base+ring*o.ring)*fall+glow*.75+pw*.5;
          if(a<.045) continue;
          var L=len*(.72+.55*ring+.7*glow+.5*pw), ca=Math.cos(ang)*L*.5, sa=Math.sin(ang)*L*.5;
          var b=Math.min(4,Math.floor(a*5)); B[b].push(x-ca,y-sa,x+ca,y+sa);
          if(order>.3&&hash(i+7,j+3)<order*.06) X.push(x,y,hash(i,j+9)*TAU);
        }
      }
      ctx.lineCap='round';
      for(var bi=0;bi<5;bi++){ var S=B[bi]; if(!S.length) continue; ctx.strokeStyle='rgba('+rgb+','+((.16+bi*.18)*.78).toFixed(2)+')'; ctx.lineWidth=1+bi*.14; ctx.beginPath(); for(var s=0;s<S.length;s+=4){ ctx.moveTo(S[s],S[s+1]); ctx.lineTo(S[s+2],S[s+3]); } ctx.stroke(); }
      if(X.length){ ctx.strokeStyle='rgba(11,14,20,.6)'; ctx.lineWidth=1.4; ctx.beginPath(); for(var z=0;z<X.length;z+=3){ var a2=X[z+2], l2=4.5; ctx.moveTo(X[z]-Math.cos(a2)*l2,X[z+1]-Math.sin(a2)*l2); ctx.lineTo(X[z]+Math.cos(a2)*l2,X[z+1]+Math.sin(a2)*l2); } ctx.stroke(); }
    }
    function loop(ts){
      raf=0; if(!prev) prev=ts; var dt=Math.min(.05,(ts-prev)/1000); prev=ts; t+=dt;
      P.s+=(P.target-P.s)*.1; order+=(orderT-order)*.09;
      if(t>nextAmbient){ ripple(cx,cy,o.ambient||.5); nextAmbient=t+8; }
      draw(); if(visible&&!document.hidden) raf=requestAnimationFrame(loop); else prev=0;
    }
    function start(){ if(!raf&&!reduce&&visible&&!document.hidden){ prev=0; raf=requestAnimationFrame(loop); } }
    function local(e){ var r=cv.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; }
    size(); window.addEventListener('resize',size);
    if(!reduce){
      host.addEventListener('pointermove',function(e){ var p=local(e); P.x=p.x; P.y=p.y; P.target=1; },{passive:true});
      host.addEventListener('pointerleave',function(){ P.target=0; },{passive:true});
      host.addEventListener('pointerdown',function(e){ var p=local(e); P.x=p.x; P.y=p.y; P.target=1; ripple(p.x,p.y,1); },{passive:true});
      host.addEventListener('pointerup',function(e){ if(e.pointerType!=='mouse') setTimeout(function(){ P.target=0; },500); },{passive:true});
      if('IntersectionObserver' in window){ new IntersectionObserver(function(es){ visible=es[0].isIntersecting; if(visible) start(); },{threshold:0}).observe(host); }
      document.addEventListener('visibilitychange',function(){ if(!document.hidden) start(); });
      setTimeout(function(){ ripple(cx,cy,.9); },500);
      start();
    }
    return { setOrder:function(v){ orderT=v; if(reduce){ order=v; draw(); } }, draw:draw };
  }

  var hero=document.getElementById('heroField');
  if(hero) Field(hero,{host:hero.parentElement,gap:22,gapS:20,len:11,lenS:9,base:.12,ring:.62,lambda:84,speed:1.15,
    center:function(W,H){ return W<960?[W*.62,H*.28]:[W*.74,H*.46]; }, maxR:function(W,H){ return Math.hypot(W,H)*.62; }, ambient:.55});
  var cta=document.getElementById('ctaField');
  if(cta) Field(cta,{host:cta.parentElement,gap:22,gapS:20,len:11,lenS:9,base:.1,ring:.55,lambda:84,speed:1.1,
    center:function(W,H){ return W<960?[W*.5,H*.3]:[W*.8,H*.5]; }, maxR:function(W,H){ return Math.hypot(W,H)*.55; }});
  var ph=document.getElementById('pField');
  if(ph) Field(ph,{host:ph.parentElement,gap:24,gapS:22,len:11,lenS:9,base:.1,ring:.5,lambda:84,speed:1.1,
    center:function(W,H){ return W<960?[W*.6,H*.3]:[W*.8,H*.5]; }, maxR:function(W,H){ return Math.hypot(W,H)*.5; }});

})();

/* ---- How it works: pinned, scroll-linked steps ---- */
(function(){
  var wrap=document.getElementById('steps'); if(!wrap) return;
  var steps=[].slice.call(wrap.querySelectorAll('.step'));
  var vis=[].slice.call(wrap.querySelectorAll('.steps-vis .vis'));
  var list=wrap.querySelector('.steps-list'), track=list.querySelector('.track'), fill=list.querySelector('.fill');
  var stick=wrap.querySelector('.steps-stick');
  var n=steps.length, mq=window.matchMedia('(min-width: 961px)');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  vis.forEach(function(v,i){ var c=v.cloneNode(true); c.className='vis-m'; steps[i].appendChild(c); });   // phones: each step carries its picture
  var PER=[8500,5200,5800,5200], timers=new WeakMap();
  function stop(v){ var t=timers.get(v); if(t){ clearInterval(t); timers.delete(v); } }
  function replay(v){
    v.classList.add('rs'); [].forEach.call(v.querySelectorAll('.live'),function(x){ x.classList.remove('live'); }); v.classList.remove('live'); void v.offsetWidth; v.classList.remove('rs');
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ v.classList.add('live'); }); });
  }
  function loop(v,period){ stop(v); if(reduce) return; timers.set(v,setInterval(function(){ if(!document.hidden) replay(v); },period)); }
  var D=[], cur=-1;
  function layout(){ D=steps.map(function(s){ return s.offsetTop+32; }); track.style.setProperty('--t',D[0]+'px'); track.style.setProperty('--h',(D[n-1]-D[0])+'px'); }
  function setOn(i){
    steps.forEach(function(el,k){ el.classList.toggle('on',k===i); el.classList.toggle('done',k<i); });
    vis.forEach(function(el,k){ var on=(k===i);
      if(on&&!el.classList.contains('on')){ el.classList.remove('live'); void el.offsetWidth; el.classList.add('on','live'); loop(el,PER[k]); }
      else if(!on&&el.classList.contains('on')){ el.classList.remove('on','live'); stop(el); } });
  }
  function update(){
    if(!mq.matches) return;
    var r=wrap.getBoundingClientRect(), total=r.height-stick.offsetHeight, topOff=84;
    var p=Math.min(1,Math.max(0,(topOff-r.top)/total)), x=p*n, i=Math.min(n-1,Math.floor(x)), frac=x-i;
    if(i!==cur){ cur=i; setOn(i); }
    var y=(D[i]-D[0])+(i<n-1?(D[i+1]-D[i])*frac:0);
    fill.style.setProperty('--f',y.toFixed(1)+'px');
  }
  function all(){ layout(); update(); }
  window.addEventListener('scroll',function(){ requestAnimationFrame(update); },{passive:true});
  window.addEventListener('resize',all); window.addEventListener('load',all);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(all);
  if(mq.addEventListener) mq.addEventListener('change',function(){ cur=-1; all(); });
  all();
  if(reduce){ vis.forEach(function(v){ v.classList.add('live'); }); }
  if('IntersectionObserver' in window){
    var so=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('m-on'); }); },{threshold:.4,rootMargin:'0px 0px -20% 0px'});
    steps.forEach(function(s){ so.observe(s); });
    var vo=new IntersectionObserver(function(es){ es.forEach(function(e){ var v=e.target, k=Math.max(0,steps.indexOf(v.closest('.step')));
      if(e.isIntersecting){ if(!v.classList.contains('live')) v.classList.add('live'); loop(v,PER[k]); } else { stop(v); } }); },{threshold:.2});
    [].forEach.call(wrap.querySelectorAll('.vis-m'),function(v){ vo.observe(v); });
  } else { [].forEach.call(wrap.querySelectorAll('.vis-m'),function(v){ v.classList.add('live'); }); }
})();



/* ---- release check (simulated against past corrections) ---- */
(function(){
  var out=document.getElementById('rc-out'); if(!out) return;
  var btns=[].slice.call(document.querySelectorAll('[data-rc]'));
  var empty=out.querySelector('.rc-empty'), run=out.querySelector('.rc-run'), res=out.querySelector('.rc-res'), timer=null;
  var R={
    safe:{cls:'ok',html:'<b>Release approved</b>All 17 past corrections still pass.'},
    risky:{cls:'bad',html:'<b>Release blocked</b>3 of 17 past corrections would come back, including:<ul><li>Required disclosure line left out</li><li>Source attribution dropped</li></ul>'}
  };
  btns.forEach(function(b){ b.addEventListener('click',function(){
    var k=b.getAttribute('data-rc'); clearTimeout(timer);
    btns.forEach(function(x){ x.setAttribute('aria-pressed',x===b?'true':'false'); });
    empty.hidden=true; res.hidden=true; out.className='rc-out'; run.hidden=false;
    timer=setTimeout(function(){ run.hidden=true; res.innerHTML=R[k].html; res.className='rc-res '+R[k].cls; res.hidden=false; out.className='rc-out '+R[k].cls; },700);
  }); });
})();


/* ---- fix ticket tabs: arrow keys move between them ---- */
(function(){
  [].forEach.call(document.querySelectorAll('.fv'),function(box){
    var tabs=[].slice.call(box.querySelectorAll('[role="tab"]'));
    function sync(){ tabs.forEach(function(t){ t.tabIndex=t.getAttribute('aria-selected')==='true'?0:-1; }); }
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){ setTimeout(sync,0); });
      t.addEventListener('keydown',function(e){
        if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft') return; e.preventDefault();
        var n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length]; n.click(); n.focus();
      });
    });
    sync();
  });
})();

/* ---- Why Farfield: a small version of the original ring diagram (solid near the center, broken farther out) ---- */
(function(){
  var el=document.getElementById('rings-mini'); if(!el) return;
  function col(k){ var u=k/7; return 'rgb('+Math.round(77+(104-77)*u)+','+Math.round(124+(112-124)*u)+','+Math.round(255+(226-255)*u)+')'; }
  var C=[290,290], rings=[{r:34,t:'solid'},{r:72,t:'ring',w:13},{r:110,t:'dash',w:9,d:'48 16'},{r:148,t:'dash',w:6,d:'20 14'},{r:184,t:'sq',n:34,s:4.6},{r:216,t:'plus',n:44,s:4.4},{r:246,t:'circ',n:56,s:3.1},{r:274,t:'dot',n:76,s:1.5}];
  var s='<svg viewBox="0 0 580 580" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
  rings.forEach(function(g,k){ var c=k<2?'#0B0E14':col(k), o='<g class="rg" style="--i:'+k+'">';
    if(g.t==='solid') o+='<circle cx="'+C[0]+'" cy="'+C[1]+'" r="'+g.r+'" fill="'+c+'"/>';
    if(g.t==='ring') o+='<circle cx="'+C[0]+'" cy="'+C[1]+'" r="'+g.r+'" fill="none" stroke="'+c+'" stroke-width="'+g.w+'"/>';
    if(g.t==='dash') o+='<circle cx="'+C[0]+'" cy="'+C[1]+'" r="'+g.r+'" fill="none" stroke="'+c+'" stroke-width="'+g.w+'" stroke-dasharray="'+g.d+'"/>';
    if(g.n){ for(var i=0;i<g.n;i++){ var a=i/g.n*6.28318,x=(C[0]+Math.cos(a)*g.r).toFixed(1),y=(C[1]+Math.sin(a)*g.r).toFixed(1),z=g.s;
      if(g.t==='sq') o+='<rect x="'+(x-z/2)+'" y="'+(y-z/2)+'" width="'+z+'" height="'+z+'" fill="'+c+'"/>';
      if(g.t==='plus') o+='<path d="M'+(x-z)+' '+y+'H'+(+x+z)+'M'+x+' '+(y-z)+'V'+(+y+z)+'" stroke="'+c+'" stroke-width="2.4" fill="none"/>';
      if(g.t==='circ') o+='<circle cx="'+x+'" cy="'+y+'" r="'+z+'" fill="none" stroke="'+c+'" stroke-width="2"/>';
      if(g.t==='dot') o+='<circle cx="'+x+'" cy="'+y+'" r="'+(z*1.6)+'" fill="'+c+'"/>'; } }
    s+=o+'</g>'; });
  el.innerHTML=s+'</svg>';
})();

(function(){
  // Mobile menu
  var mb=document.querySelector('.menu-btn'), mn=document.getElementById('mnav');
  if(mb&&mn){
    mb.addEventListener('click',function(){ var open=mn.hidden; mn.hidden=!open; mb.setAttribute('aria-expanded',open?'true':'false'); });
    mn.addEventListener('click',function(e){ if(e.target.closest('a')){ mn.hidden=true; mb.setAttribute('aria-expanded','false'); } });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!mn.hidden){ mn.hidden=true; mb.setAttribute('aria-expanded','false'); mb.focus(); } });
  }

  // Fix ticket: instruction change / engineering ticket tabs (click + arrow keys)
  [].forEach.call(document.querySelectorAll('.fv'),function(box){
    var tabs=[].slice.call(box.querySelectorAll('[role="tab"]'));
    function pick(k,focus){
      tabs.forEach(function(t,i){ t.setAttribute('aria-selected',i===k?'true':'false'); t.tabIndex=i===k?0:-1; });
      [].forEach.call(box.querySelectorAll('.route'),function(r){ r.hidden=(+r.getAttribute('data-r')!==k); });
      if(focus) tabs[k].focus();
    }
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){ pick(i); });
      t.addEventListener('keydown',function(e){
        if(e.key==='ArrowRight'||e.key==='ArrowLeft'){ e.preventDefault(); pick((i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length,true); }
      });
    });
    pick(0);
  });

  // Release check, simulated against past corrections (sample data)
  var out=document.getElementById('rc-out');
  if(out){
    var btns=[].slice.call(document.querySelectorAll('[data-rc]'));
    var empty=out.querySelector('.rc-empty'), run=out.querySelector('.rc-run'), res=out.querySelector('.rc-res'), timer=null;
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var R={
      safe:{cls:'ok',html:'<b>Release approved</b>This change keeps every past correction in place.<ul><li>17 of 17 past corrections hold</li><li>No corrected error comes back</li></ul>'},
      risky:{cls:'bad',html:'<b>Release blocked</b>This change would bring back errors that were already corrected.<ul><li>Required disclosure line omitted</li><li>Source attribution dropped</li><li>3 of 17 past corrections would recur</li></ul>'}
    };
    btns.forEach(function(b){ b.addEventListener('click',function(){
      var k=b.getAttribute('data-rc'); clearTimeout(timer);
      btns.forEach(function(x){ x.setAttribute('aria-pressed',x===b?'true':'false'); });
      empty.hidden=true; res.hidden=true; out.className='rc-out'; run.hidden=false;
      timer=setTimeout(function(){ run.hidden=true; res.innerHTML=R[k].html; res.className='rc-res '+R[k].cls; res.hidden=false; out.className='rc-out '+R[k].cls; },reduce?0:700);
    }); });
  }
})();

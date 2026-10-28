/* LEXULAT · intro animada */
(function(){
  var root=document.documentElement, intro=document.getElementById('intro');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function finish(){root.classList.remove('intro-on');intro.remove();}
  if(location.hash==='#terminos'){finish();return;}
  root.classList.add('intro-on');

  /* ---- Terreno de puntos ---- */
  var cv=document.getElementById('terrain'), ctx=cv.getContext('2d'), W=0,H=0,DPR=1;
  function size(){DPR=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0)}
  size(); addEventListener('resize',size);
  var COLS=W<700?90:150, ROWS=W<700?70:110, SX=14, SZ=12, DEPTH=ROWS*SZ;
  function height(x,z){
    var h=Math.sin(x*.012+z*.004)*14+Math.sin(z*.021-x*.006)*10+Math.sin((x+z)*.035)*3;
    var px=x+120, pz=((z%2600)+2600)%2600-1300; // cumbre principal recurrente
    h+=210*Math.exp(-(px*px)/(2*150*150)-(pz*pz)/(2*260*260));
    var qx=x-640; h+=120*Math.exp(-(qx*qx)/(2*220*220)-((pz+500)*(pz+500))/(2*300*300));
    return h;
  }
  var camZ=0, camTarget=0, vel=0, warp=0, mx=0, my=0, smx=0, smy=0, t0=performance.now();
  addEventListener('pointermove',function(e){mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)});
  function lerpC(a,b,k){return a+(b-a)*k}
  function frame(now){
    if(!intro.isConnected)return;
    var t=(now-t0)/1000;
    camZ+= (camTarget-camZ)*.035 + (reduce?0:.35) + warp; warp*=1;
    smx+=(mx-smx)*.04; smy+=(my-smy)*.04;
    ctx.clearRect(0,0,W,H);
    var f=Math.max(W,H)*.62, hor=H*.6+smy*-18, camY=88, camX=smx*60;
    var half=COLS*SX/2;
    for(var r=ROWS-1;r>=0;r--){
      var zw=r*SZ+(-camZ%SZ+SZ)%SZ, wz=zw+camZ; // posición en mundo
      var d=zw+40; if(d<20)continue;
      var fade=Math.min(1,(DEPTH-zw)/(DEPTH*.55))*Math.min(1,d/220);
      if(fade<=0)continue;
      var s=f/d, sz=Math.max(.6,Math.min(2.6,s*2.2));
      for(var c=0;c<COLS;c++){
        var x=c*SX-half+((r+Math.floor(camZ/SZ))&1?SX/2:0), y=height(x,wz);
        var sx=W/2+(x-camX)*s, sy=hor+(camY-y)*s;
        if(sx<-4||sx>W+4||sy<-4||sy>H+4)continue;
        var u=c/COLS, a=fade*(.35+.65*Math.min(1,y/140+.3));
        var R=lerpC(255,30,u)|0, G=lerpC(79,139,u)|0, B=lerpC(200,255,u)|0;
        ctx.fillStyle='rgba('+R+','+G+','+B+','+(a*.85).toFixed(3)+')';
        ctx.fillRect(sx,sy,sz,sz);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---- Precargador ---- */
  var prog=document.getElementById('prog'), count=document.getElementById('count');
  var start=performance.now(), DUR=reduce?400:2400, fontsOk=false;
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){fontsOk=true});
  setTimeout(function(){fontsOk=true},4000);
  function load(now){
    var p=Math.min(1,(now-start)/DUR); p=1-Math.pow(1-p,3);
    if(!fontsOk)p=Math.min(p,.9);
    var v=Math.round(p*100); count.textContent=v; prog.setAttribute('stroke-dasharray',v+' 100');
    if(v<100)requestAnimationFrame(load); else setTimeout(begin,350);
  }
  requestAnimationFrame(load);

  /* ---- Diapositivas ---- */
  var slides=[].slice.call(intro.querySelectorAll('.slide')), dots=[].slice.call(intro.querySelectorAll('.dots li')), idx=-1, lock=0;
  function go(i){
    if(i<0||i>=slides.length||i===idx)return;
    slides.forEach(function(s,k){s.classList.toggle('on',k===i);s.classList.toggle('past',k<i)});
    dots.forEach(function(d,k){d.classList.toggle('on',k===i)});
    camTarget+= (i>idx?1:-1)*(reduce?0:340)*Math.abs(i-idx);
    idx=i; intro.classList.toggle('last',i===slides.length-1);
    lock=performance.now()+1100;
  }
  function step(dir){if(idx<0||performance.now()<lock)return;go(idx+dir)}
  function begin(){intro.classList.add('loaded');go(0)}
  var acc=0;
  intro.addEventListener('wheel',function(e){e.preventDefault();acc+=e.deltaY;if(Math.abs(acc)>40){step(acc>0?1:-1);acc=0}},{passive:false});
  var ty=null;
  intro.addEventListener('touchstart',function(e){ty=e.touches[0].clientY},{passive:true});
  intro.addEventListener('touchmove',function(e){if(ty===null)return;var dy=ty-e.touches[0].clientY;if(Math.abs(dy)>40){step(dy>0?1:-1);ty=null}},{passive:true});
  document.addEventListener('keydown',function(e){
    if(!intro.isConnected)return;
    if(['ArrowDown','PageDown',' ','Enter'].indexOf(e.key)>-1&&!(e.key==='Enter'&&document.activeElement&&document.activeElement.tagName==='BUTTON')){e.preventDefault();idx===slides.length-1&&e.key==='Enter'?enter():step(1)}
    else if(['ArrowUp','PageUp'].indexOf(e.key)>-1){e.preventDefault();step(-1)}
  });
  document.getElementById('next').addEventListener('click',function(){step(1)});

  /* ---- Entrar ---- */
  var leaving=false;
  function enter(){
    if(leaving)return; leaving=true;
    intro.classList.add('leaving');
    if(!reduce){var k=0,iv=setInterval(function(){warp=Math.min(warp+1.6,26);if(++k>40)clearInterval(iv)},30)}
    setTimeout(function(){root.classList.remove('intro-on');intro.classList.add('out')},reduce?200:900);
    setTimeout(function(){intro.remove();var t=document.querySelector('.brand');t&&t.focus({preventScroll:true})},reduce?600:2200);
  }
  document.getElementById('enter').addEventListener('click',enter);
  document.getElementById('skip').addEventListener('click',enter);
})();

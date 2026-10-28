/* LEXULAT · menú y términos */
(function(){
  var root=document.documentElement; root.classList.add('js');
  // Menú móvil
  var btn=document.getElementById('menu-btn'), links=document.getElementById('links');
  function setMenu(open){links.classList.toggle('open',open);btn.setAttribute('aria-expanded',open?'true':'false')}
  btn.addEventListener('click',function(){setMenu(!links.classList.contains('open'))});
  links.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
  var drop=document.getElementById('drop'), dbtn=document.getElementById('drop-btn');
  function setDrop(o){drop.classList.toggle('open',o);dbtn.setAttribute('aria-expanded',o?'true':'false')}
  dbtn.addEventListener('click',function(e){e.stopPropagation();setDrop(!drop.classList.contains('open'))});
  document.addEventListener('click',function(e){if(!drop.contains(e.target))setDrop(false)});
  drop.addEventListener('focusout',function(e){if(!drop.contains(e.relatedTarget))setDrop(false)});

  // Términos y condiciones (ruta #terminos)
  var panel=document.getElementById('terminos-panel'), closeBtn=document.getElementById('terms-close'), sheet=panel.querySelector('.sheet'), lastFocus=null;
  function openTerms(){if(panel.classList.contains('open'))return;lastFocus=document.activeElement;panel.classList.add('open');panel.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';sheet.scrollTop=0;setTimeout(function(){closeBtn.focus()},60)}
  function closeTerms(){if(!panel.classList.contains('open'))return;panel.classList.remove('open');panel.setAttribute('aria-hidden','true');document.body.style.overflow='';if(location.hash==='#terminos'){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){location.hash=''}}if(lastFocus&&lastFocus.focus)lastFocus.focus()}
  function route(){location.hash==='#terminos'?openTerms():closeTerms()}
  document.querySelectorAll('[data-terms]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();if(location.hash!=='#terminos')location.hash='terminos';else openTerms()})});
  closeBtn.addEventListener('click',closeTerms);
  panel.addEventListener('click',function(e){if(e.target===panel)closeTerms()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeTerms();setMenu(false);setDrop(false)}});
  window.addEventListener('hashchange',route);
  route();
})();

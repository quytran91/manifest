(function(){
  document.getElementById('printBtn').addEventListener('click',function(){window.print();});
  var totop=document.getElementById('totop');
  window.addEventListener('scroll',function(){totop.classList.toggle('show',window.scrollY>600);},{passive:true});
  totop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards=[].slice.call(document.querySelectorAll('.reveal'));
  if(reduce||!('IntersectionObserver' in window)){cards.forEach(function(c){c.classList.add('in');});}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
    });},{threshold:.06,rootMargin:'0px 0px -6% 0px'});
    cards.forEach(function(c,i){c.style.transitionDelay=Math.min((i%3)*.07,0.2)+'s';io.observe(c);});
  }
})();

(function(){
  /* Robust in-page navigation: works even where native anchor jumps or
     IntersectionObserver are unreliable (sandboxed viewers). */
  document.addEventListener('click', function(ev){
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href^="#"]') : null;
    if(!a) return;
    var id = a.getAttribute('href').slice(1);
    if(!id) return;
    var t = document.getElementById(id);
    if(!t) return;
    ev.preventDefault();
    t.classList.add('in');
    t.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
    try{ t.scrollIntoView({behavior:'smooth', block:'start'}); }
    catch(e){ t.scrollIntoView(); }
    try{ history.replaceState(null, '', '#' + id); }catch(e){}
  });
})();

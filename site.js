function chooseWorkView(view,remember=false){
  const selected=view==='tiles'?'tiles':'large';
  document.body.dataset.workView=selected;
  document.querySelectorAll('[data-work-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.workView===selected)));
  if(remember){
    try{localStorage.setItem('portfolio-work-view',selected)}catch{}
    const url=new URL(location.href);
    url.searchParams.delete('direction');
    url.searchParams.set('view',selected);
    history.replaceState(null,'',url);
  }
}
let savedWorkView='large';
try{savedWorkView=localStorage.getItem('portfolio-work-view')||'large'}catch{}
chooseWorkView(new URLSearchParams(location.search).get('view')||savedWorkView);
document.querySelectorAll('[data-work-view]').forEach(button=>button.addEventListener('click',()=>chooseWorkView(button.dataset.workView,true)));

const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const videos=[...document.querySelectorAll('video')];
const videoObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting&&!reducedMotion.matches)e.target.play().catch(()=>{});else e.target.pause();
}),{threshold:.1});
videos.forEach(v=>{v.autoplay=!reducedMotion.matches;videoObserver.observe(v)});
reducedMotion.addEventListener('change',()=>videos.forEach(v=>{if(reducedMotion.matches)v.pause();else if(v.getBoundingClientRect().top<innerHeight&&v.getBoundingClientRect().bottom>0)v.play().catch(()=>{})}));

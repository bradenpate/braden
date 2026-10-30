(() => {
  const railMarkup=({root='./',active='work',home=false}={})=>{
    const workHref=home?'#work':`${root}index.html`;
    const brandTitle='I’m Braden Pate, a creative director and designer who cares about work with a point of view.';
    return `<div class="intro-copy"><div class="rail-brand"><a class="identity" href="${root}index.html" aria-label="Braden Pate homepage"><img src="${root}images/bradenpate.svg" alt="Braden Pate illustrated portrait" width="46" height="46"></a><nav aria-label="Main navigation"><a href="${workHref}" ${active==='work'?'aria-current="page"':''}>Work</a><a href="${root}about.html" ${active==='about'?'aria-current="page"':''}>About</a></nav></div><div class="rail-summary">${home?`<h1 id="intro-title">${brandTitle}</h1>`:`<p class="rail-title">${brandTitle}</p>`} <p class="bio" ${home?'id="intro-bio"':''}>Based in Boston. Currently leading brand creative at Coveo.</p></div><div class="rail-contact"><a href="mailto:braden@bradenpate.com">Say hello</a></div><div class="rail-meta"><nav class="rail-socials" aria-label="Social profiles"><a href="https://www.linkedin.com/in/braden-pate-90ab6257/">LinkedIn ↗</a><a href="https://x.com/bpdesgn">X ↗</a></nav><p class="rail-copyright">Site content © Braden Pate<br>All rights reserved</p></div></div>`;
  };
  window.PortfolioShell={railMarkup};
  const rail=document.querySelector('[data-portfolio-rail]');
  if(rail){
    const root=document.body.dataset.root||'./';
    if(!rail.children.length)rail.innerHTML=railMarkup({root,active:document.body.dataset.active,home:rail.dataset.home==='true'});
    if(document.body.classList.contains('content-page')){
      const copy=rail.querySelector('.intro-copy');
      const details=[...copy.querySelectorAll('.rail-summary,.rail-contact,.rail-meta')];
      const footer=document.createElement('aside');
      footer.className='stacked-rail-footer';
      footer.setAttribute('aria-label','About Braden Pate');
      footer.hidden=true;
      rail.parentElement.append(footer);
      const stacked=matchMedia('(max-width:700px)');
      const arrangeDetails=()=>{
        details.forEach(detail=>(stacked.matches?footer:copy).append(detail));
        footer.hidden=!stacked.matches;
        rail.setAttribute('aria-label',stacked.matches?'Site navigation':'About Braden Pate');
      };
      arrangeDetails();
      stacked.addEventListener('change',arrangeDetails);
    }
  }
  const videos=[...document.querySelectorAll('[data-motion-preview]')];
  if(videos.length){
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting&&!reduced.matches)e.target.play().catch(()=>{});else e.target.pause();
    }),{threshold:.1});
    videos.forEach(v=>observer.observe(v));
    reduced.addEventListener('change',()=>videos.forEach(v=>{if(reduced.matches)v.pause()}));
  }
})();

(() => {
  const backdrop = document.querySelector('.interest-backdrop');
  const displayImage = backdrop.querySelector('img');
  const triggers = [...document.querySelectorAll('.interest-trigger')];
  const cache = new Map();
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let sources;
  let active;
  let pinned;
  let version = 0;
  const data = fetch('./images/about/interests/sources.json').then(response => {
    if (!response.ok) throw new Error('Image sources unavailable');
    return response.json();
  }).then(value => { sources = value; }).catch(() => {});
  const load = src => {
    if (!cache.has(src)) cache.set(src, new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(src);
      image.onerror = reject;
      image.src = src;
    }));
    return cache.get(src);
  };
  const clear = () => {
    version++;
    active = undefined;
    pinned = undefined;
    backdrop.classList.remove('is-visible');
    triggers.forEach(button => button.setAttribute('aria-pressed', 'false'));
  };
  const show = async button => {
    if (active === button) return;
    const current = ++version;
    active = button;
    // Remove the previous picture while a new one loads; never show the wrong favorite.
    backdrop.classList.remove('is-visible');
    triggers.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    await data;
    const source = sources?.[Number(button.dataset.interest)]?.local_image;
    if (!source || current !== version) return;
    try {
      await load(source);
      if (current !== version) return;
      const id = Number(button.dataset.interest);
      const rotations = [-6, 4, -3, 7, -5, 3, -7, 5];
      displayImage.style.setProperty('--art-rotation', `${rotations[id % rotations.length]}deg`);
      displayImage.style.setProperty('--art-x', `${[-12, 10, -5, 14][id % 4]}px`);
      displayImage.style.setProperty('--art-y', `${[8, -10, 5, -4][id % 4]}px`);
      displayImage.src = source;
      backdrop.classList.add('is-visible');
    } catch { if (current === version) clear(); }
  };
  triggers.forEach(button => {
    button.addEventListener('pointermove', event => { if (event.pointerType === 'mouse' && hover.matches && !pinned) show(button); });
    button.addEventListener('pointerleave', () => {
      if (hover.matches && !pinned && document.activeElement !== button && active === button) clear();
    });
    button.addEventListener('focus', () => { if (hover.matches) { pinned = undefined; show(button); } });
    button.addEventListener('blur', () => { if (!pinned && active === button) clear(); });
    button.addEventListener('click', event => {
      if (event.pointerType !== 'touch' && hover.matches) { pinned = undefined; show(button); return; }
      if (pinned === button) { clear(); return; }
      pinned = button;
      show(button);
    });
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') clear(); });
  document.addEventListener('pointerdown', event => { if (!event.target.closest('.interest-trigger')) clear(); });
  // A tap preview ends once the selected item has scrolled out of view.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (!entry.isIntersecting && active === entry.target) clear(); });
    });
    triggers.forEach(button => observer.observe(button));
  }
})();

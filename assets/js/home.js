(function () {
  'use strict';
  const track = document.getElementById('featured-products');
  if (!track) return;
  const S = window.Studio, reduced = matchMedia('(prefers-reduced-motion: reduce)');
  track.innerHTML = window.STUDIO_DATA.products.map(S.productCard).join('');
  const cards = [...track.children];
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const unit = cards[0].getBoundingClientRect().width + gap;
    const count = Math.max(1, Math.floor((track.clientWidth + gap) / unit));
    track.scrollBy({left:(event.key === 'ArrowRight' ? 1 : -1) * unit * count, behavior:reduced.matches ? 'instant' : 'smooth'});
  });

  const hero = document.querySelector('.campaign-hero');
  const discovery = document.querySelector('.home-discovery');
  if (!hero || !discovery) return;
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => value * value * (3 - 2 * value);
  let frame = 0;

  function renderScroll() {
    frame = 0;
    if (reduced.matches) {
      hero.style.removeProperty('--hero-blur');
      hero.style.removeProperty('--hero-opacity');
      discovery.style.removeProperty('--discovery-blur');
      discovery.style.removeProperty('--discovery-opacity');
      hero.classList.remove('is-scroll-transitioning');
      discovery.classList.remove('is-scroll-transitioning');
      return;
    }
    const heroBounds = hero.getBoundingClientRect();
    const exit = ease(clamp(-heroBounds.top / (heroBounds.height * .85)));
    const entry = ease(clamp((innerHeight - discovery.getBoundingClientRect().top) / (innerHeight * .55)));
    hero.style.setProperty('--hero-blur', (exit * 3).toFixed(2) + 'px');
    hero.style.setProperty('--hero-opacity', (1 - exit * .4).toFixed(3));
    discovery.style.setProperty('--discovery-blur', ((1 - entry) * 5).toFixed(2) + 'px');
    discovery.style.setProperty('--discovery-opacity', (.55 + entry * .45).toFixed(3));
    hero.classList.toggle('is-scroll-transitioning', exit > 0 && exit < 1);
    discovery.classList.toggle('is-scroll-transitioning', entry > 0 && entry < 1);
  }
  function scheduleScroll() {
    if (!frame) frame = requestAnimationFrame(renderScroll);
  }
  addEventListener('scroll', scheduleScroll, {passive:true});
  addEventListener('resize', scheduleScroll, {passive:true});
  addEventListener('pageshow', scheduleScroll);
  reduced.addEventListener('change', scheduleScroll);
  renderScroll();
})();

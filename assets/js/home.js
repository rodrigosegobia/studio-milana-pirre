(function () {
  'use strict';
  const track = document.getElementById('featured-products');
  if (!track) return;
  const S = window.Studio, reduced = matchMedia('(prefers-reduced-motion: reduce)');
  track.innerHTML = window.STUDIO_DATA.products.map(S.productCard).join('');
  const previous = document.getElementById('perfume-prev'), next = document.getElementById('perfume-next');
  previous.innerHTML = S.icon('chevron-left'); next.innerHTML = S.icon('chevron-right');
  const cards = [...track.children];
  function update() {
    previous.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    const bounds = track.getBoundingClientRect();
    const visible = cards.map((card,i) => ({i,r:card.getBoundingClientRect()})).filter(({r}) => r.left >= bounds.left - 4 && r.right <= bounds.right + 4);
    if (visible.length) document.getElementById('shelf-position').textContent = `${visible[0].i + 1}–${visible.at(-1).i + 1} / ${cards.length}`;
  }
  function step(direction) {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const unit = cards[0].getBoundingClientRect().width + gap;
    const count = Math.max(1, Math.floor((track.clientWidth + gap) / unit));
    track.scrollBy({ left:direction * unit * count, behavior:reduced.matches ? 'instant' : 'smooth' });
  }
  previous.addEventListener('click', () => step(-1)); next.addEventListener('click', () => step(1));
  track.addEventListener('keydown', event => { if (['ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); } });
  track.addEventListener('scroll', update, { passive:true });
  new ResizeObserver(update).observe(track);
  update();
})();

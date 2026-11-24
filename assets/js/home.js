(function () {
  'use strict';
  const track = document.getElementById('featured-products');
  if (!track) return;
  const S = window.Studio, preference = matchMedia('(prefers-reduced-motion: reduce)');
  track.innerHTML = `<div class="perfume-loop-group">${window.STUDIO_DATA.products.map(S.productCard).join('')}</div>`;
  const original = track.firstElementChild, copy = original.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.querySelectorAll('a,button').forEach(el => el.tabIndex = -1);
  track.append(copy);
  const pause = document.getElementById('perfume-pause');
  const previous = document.getElementById('perfume-prev'), next = document.getElementById('perfume-next');
  previous.innerHTML = S.icon('chevron-left'); next.innerHTML = S.icon('chevron-right');
  let paused = preference.matches, visible = false, hovering = false, focused = false;
  let frame = 0, last = 0, position = 0;
  const span = () => copy.offsetLeft - original.offsetLeft;
  const running = () => !paused && !preference.matches && visible && !hovering && !focused && !document.hidden;
  function tick(time) {
    frame = 0;
    if (!running()) return;
    const width = span();
    if (last && width) { position = (position + Math.min(time - last, 50) * .018) % width; track.scrollLeft = position; }
    last = time; frame = requestAnimationFrame(tick);
  }
  function sync() {
    pause.textContent = preference.matches ? 'Movimento reduzido' : paused ? 'Retomar movimento' : 'Pausar movimento';
    pause.disabled = preference.matches;
    if (running() && !frame) { position = track.scrollLeft; last = 0; frame = requestAnimationFrame(tick); }
    else if (!running() && frame) { cancelAnimationFrame(frame); frame = 0; last = 0; }
  }
  pause.addEventListener('click', () => { paused = !paused; sync(); });
  track.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovering = true; sync(); } });
  track.addEventListener('pointerleave', () => { hovering = false; sync(); });
  track.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') { paused = true; sync(); } });
  track.addEventListener('focusin', () => { focused = true; sync(); });
  track.addEventListener('focusout', () => { queueMicrotask(() => { focused = track.contains(document.activeElement); sync(); }); });
  function step(direction) {
    paused = true; sync();
    const width = span(), distance = original.firstElementChild.getBoundingClientRect().width + 24;
    if (width) track.scrollLeft = (track.scrollLeft + direction * distance + width) % width;
  }
  previous.addEventListener('click', () => step(-1)); next.addEventListener('click', () => step(1));
  track.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); } });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .05 }).observe(track);
  preference.addEventListener('change', () => { paused = preference.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  sync();
})();

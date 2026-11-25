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
  // Two decoded layers crossfade; the outgoing photo stays opaque until covered.
  // Load just the next photo, and suspend autoplay offscreen or in another tab.
  const media = document.getElementById('hero-slides');
  if (media) {
    const photos = [{image:'assets/images/milana.jpg', portrait:true}, {image:'assets/images/servico1.jpeg', service:true}]
      .concat(window.STUDIO_DATA.products.filter(product => product.hero));
    const slides = [media.firstElementChild];
    let current = 0, timer = 0, settleTimer = 0, pending = false;
    let inView = true, focused = false, disposed = false;
    const delay = 7500, fade = 2000;
    const canPlay = () => !disposed && !focused && !reduced.matches && !document.hidden && inView;
    function loadSlide(index) {
      if (slides[index]) return slides[index];
      const slide = document.createElement('div'), img = document.createElement('img');
      slide.className = 'hero-slide' + (photos[index].service ? ' is-service' : '');
      img.alt = ''; img.decoding = 'async'; img.fetchPriority = 'low';
      img.width = photos[index].service ? 1175 : 1080;
      img.height = photos[index].service ? 1200 : 1920;
      img.src = photos[index].image;
      slide.append(img); media.append(slide); slides[index] = slide;
      return slide;
    }
    function settle() {
      clearTimeout(settleTimer);
      slides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index === current);
        slide.classList.remove('is-entering');
      });
    }
    function schedule() {
      clearTimeout(timer);
      if (!canPlay() || pending || photos.length < 2) return;
      loadSlide((current + 1) % photos.length);
      timer = setTimeout(advance, delay);
    }
    async function advance() {
      if (!canPlay() || pending) return;
      pending = true;
      const next = (current + 1) % photos.length;
      const slide = loadSlide(next);
      try {
        await slide.firstElementChild.decode();
        if (canPlay()) {
          settle();
          // Ensure the zero-opacity state has painted before fading in.
          slide.getBoundingClientRect();
          slide.classList.add('is-entering', 'is-active');
          current = next;
          settleTimer = setTimeout(settle, fade + 50);
        }
      } catch (_) {
        // Keep the last loaded photograph when an image cannot be fetched.
        photos.splice(next, 1); slides.splice(next, 1); slide.remove();
        if (next < current) current -= 1;
      }
      pending = false;
      schedule();
    }
    hero.addEventListener('focusin', () => { focused = true; schedule(); });
    hero.addEventListener('focusout', event => {
      focused = hero.contains(event.relatedTarget);
      schedule();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) settle(); schedule(); });
    reduced.addEventListener('change', () => { settle(); schedule(); });
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (!inView) settle();
      schedule();
    }, {threshold:0});
    observer.observe(hero);
    addEventListener('pagehide', () => { disposed = true; clearTimeout(timer); settle(); });
    addEventListener('pageshow', () => { disposed = false; schedule(); });
    schedule();
  }
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

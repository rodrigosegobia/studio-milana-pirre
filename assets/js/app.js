(function () {
  'use strict';
  const data = window.STUDIO_DATA;
  const config = window.STUDIO_CONFIG;
  function usePhotoFallback(image) {
    if (!(image instanceof HTMLImageElement)) return;
    const fallback = window.STUDIO_IMAGE_FALLBACKS?.[image.getAttribute('src')];
    if (fallback) image.src = fallback;
  }
  document.addEventListener('error', event => usePhotoFallback(event.target), true);
  document.querySelectorAll('img').forEach(image => {
    if (image.complete && !image.naturalWidth) usePhotoFallback(image);
  });
  const money = value => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(value);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paths = {
    search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
    bag:'<path d="M5 7.5h14l1 13H4l1-13Z"/><path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2"/>',
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    'chevron-left':'<path d="m14 5-7 7 7 7"/>',
    'chevron-right':'<path d="m10 5 7 7-7 7"/>',
    plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3M7 17h3"/>',
    instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    whatsapp:'<path d="M20 11.5A8 8 0 0 1 8.2 18.6L3 20l1.4-5.1A8 8 0 1 1 20 11.5Z"/><path d="M8 7.5c.5 4 2.5 6 6.5 7l1-2-2-1-1 1c-1.5-.7-2.3-1.5-3-3l1-1-1-2-1.5 1Z"/>',
    heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    home:'<path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9"/>',
    filter:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="currentColor"/><circle cx="15" cy="17" r="2" fill="currentColor"/>',
    arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
    bottle:'<path d="M9 3h6v4H9zM7 10h10a2 2 0 0 1 2 2v9H5v-9a2 2 0 0 1 2-2ZM9 7v3m6-3v3M9 15h6"/>'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.bag}</svg>`;
  const key = 'milana-demo-cart-v1';
  let cart = [], storageMode = 'memory';
  function normalize(value) {
    if (!Array.isArray(value)) return [];
    const clean = new Map();
    value.forEach(item => {
      if (item && data.products.some(p => p.id === item.id) && Number.isFinite(Number(item.qty)) && Number(item.qty) > 0) {
        clean.set(item.id, Math.min(10, Math.max(1, Math.floor(Number(item.qty)))));
      }
    });
    return Array.from(clean, ([id, qty]) => ({ id, qty }));
  }
  function windowCart() {
    try { return window.name.startsWith(key + ':') ? JSON.parse(window.name.slice(key.length + 1)) : null; } catch (_) { return null; }
  }
  function readCart() {
    if (location.protocol === 'file:') {
      const localFileCart = windowCart();
      if (localFileCart) { cart = normalize(localFileCart); storageMode = 'window'; return; }
    }
    for (const name of ['localStorage', 'sessionStorage']) {
      try {
        const storage = window[name];
        storage.setItem(key + '-test', '1'); storage.removeItem(key + '-test');
        cart = normalize(JSON.parse(storage.getItem(key) || 'null') || windowCart() || []);
        storageMode = name; return;
      } catch (_) { /* A próxima alternativa mantém a demonstração utilizável. */ }
    }
    cart = normalize(windowCart() || []); storageMode = 'window';
  }
  function saveCart() {
    const serialized = JSON.stringify(cart);
    let saved = false;
    for (const name of ['localStorage', 'sessionStorage']) {
      try { window[name].setItem(key, serialized); if (!saved) storageMode = name; saved = true; } catch (_) {}
    }
    // Mantém a navegação em file:// e o fallback quando armazenamento é bloqueado.
    if (location.protocol === 'file:' || !saved) {
      try { window.name = key + ':' + serialized; if (!saved) storageMode = 'window'; } catch (_) {}
    }
    updateBadge(); document.dispatchEvent(new CustomEvent('cart:change'));
  }
  readCart();
  function getCart() { return cart.map(item => ({ ...item })); }
  function addToCart(id, quantity = 1) {
    if (!data.products.some(p => p.id === id)) return;
    const existing = cart.find(item => item.id === id);
    const qty = Math.min(10, Math.max(1, Math.floor(Number(quantity) || 1)));
    if (existing) existing.qty = Math.min(10, existing.qty + qty); else cart.push({ id, qty });
    saveCart(); toast('Perfume adicionado à sacola.');
  }
  function setQuantity(id, quantity) {
    const qty = Math.floor(Number(quantity) || 0);
    if (qty <= 0) cart = cart.filter(item => item.id !== id);
    else { const item = cart.find(item => item.id === id); if (item) item.qty = Math.min(10, qty); }
    saveCart();
  }
  function removeFromCart(id) { cart = cart.filter(item => item.id !== id); saveCart(); }
  function clearCart() { cart = []; saveCart(); }
  function cartDetails() { return cart.map(item => { const product = data.products.find(p => p.id === item.id); return { product, qty:item.qty, total:product.price * item.qty }; }); }
  function cartTotal() { return cartDetails().reduce((sum, item) => sum + item.total, 0); }
  function updateBadge() {
    const quantity = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = quantity; });
    document.querySelectorAll('[data-cart-link]').forEach(el => el.setAttribute('aria-label', `Sacola, ${quantity} ${quantity === 1 ? 'item' : 'itens'}`));
  }
  let toastTimer;
  function toast(message) {
    const element = document.getElementById('toast'); if (!element) return;
    element.textContent = message; element.classList.add('is-visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => element.classList.remove('is-visible'), 3600);
  }
  function productCard(product) {
    return `<article class="product-card"><a class="product-photo" href="produto.html?id=${escape(product.id)}" aria-label="Conhecer ${escape(product.name)}"><img src="${escape(product.image)}" alt="Frasco ilustrativo de ${escape(product.name)}" width="640" height="800" loading="lazy">${product.compareAt > product.price ? '<span class="product-ribbon">Promoção</span>' : ''}</a><div class="product-card-info"><p class="product-family"><span>${escape(product.family)}</span><span class="card-volume">${product.volume} ml</span></p><h3><a href="produto.html?id=${escape(product.id)}">${escape(product.name)}</a></h3><div class="product-card-bottom"><span class="product-price">${product.compareAt > product.price ? `<del class="product-old-price"><span class="visually-hidden">De </span>${money(product.compareAt)}</del><span class="visually-hidden"> por </span>` : '<span class="product-old-price price-spacer" aria-hidden="true">&nbsp;</span>'}${money(product.price)}<small>Valor demonstrativo</small></span><button class="icon-button add-product" data-add-product="${escape(product.id)}" aria-label="Adicionar ${escape(product.name)} à sacola">${icon('plus')}</button></div></div></article>`;
  }
  function contact(kind = 'whatsapp', message = '') {
    const dialog = document.getElementById('contact-dialog');
    const phone = String(config.whatsapp || '').replace(/\D/g, '');
    const isWhatsApp = kind !== 'instagram';
    let url = '';
    if (isWhatsApp && /^\d{10,15}$/.test(phone)) url = `https://wa.me/${phone}?text=${encodeURIComponent(message || 'Olá! Gostaria de conhecer o Studio Milana Pirre.')}`;
    if (!isWhatsApp && config.instagram) {
      try { const parsed = new URL(config.instagram); if (parsed.protocol === 'https:' && /^(www\.)?instagram\.com$/.test(parsed.hostname)) url = parsed.href; } catch (_) {}
    }
    dialog.querySelector('h2').textContent = isWhatsApp ? 'Vamos conversar?' : 'Encontre o studio';
    dialog.querySelector('[data-contact-description]').textContent = url ? (isWhatsApp ? 'Revise sua mensagem. Ela só será enviada quando você confirmar no WhatsApp.' : 'Abra o perfil oficial do studio em uma nova aba.') : 'Esta é uma prévia. O contato oficial ainda será informado pelo studio.';
    const textarea = dialog.querySelector('textarea');
    textarea.value = message || (isWhatsApp ? 'Olá! Gostaria de conhecer o Studio Milana Pirre.' : 'O perfil oficial do Instagram será disponibilizado aqui.');
    textarea.closest('.field').hidden = !isWhatsApp;
    const link = dialog.querySelector('[data-contact-link]');
    link.hidden = !url; if (url) link.href = url; else link.removeAttribute('href');
    link.textContent = isWhatsApp ? 'Abrir WhatsApp' : 'Abrir Instagram';
    dialog.querySelector('[data-copy-message]').hidden = !isWhatsApp;
    dialog.querySelector('[data-copy-status]').textContent = '';
    dialog.showModal();
  }
  window.Studio = { money, escape, icon, productCard, toast, getCart, addToCart, setQuantity, removeFromCart, clearCart, cartDetails, cartTotal, contact, get storageMode() { return storageMode; } };

  const page = document.body.dataset.page || 'inicio';
  const active = name => page === name ? ' aria-current="page"' : ((name === 'perfumaria' && page === 'produto') || (name === 'carrinho' && page === 'checkout')) ? ' aria-current="true"' : '';
  const logo = '<span class="brand-logo"><img src="assets/images/logo.png" alt="Studio Milana Pirre" width="1122" height="1402"></span>';
  const header = document.getElementById('site-header');
  if (header) header.innerHTML = `<a class="skip-link" href="#main">Pular para o conteúdo</a><div class="announcement"><span>Perfumaria &amp; Nail Design</span><span class="announcement-demo">Prévia demonstrativa</span></div><header class="site-header"><div class="header-main container"><div class="header-left"><button class="icon-button mobile-menu-button" data-open-menu aria-label="Abrir menu">${icon('menu')}</button><button class="header-search" data-open-search>${icon('search')}<span>Encontre seu perfume</span></button></div><a class="brand" href="index.html" aria-label="Studio Milana Pirre, início">${logo}</a><div class="header-right"><button class="studio-contact" data-contact="whatsapp">Fale com o studio</button><a class="cart-link" href="carrinho.html" data-cart-link>${icon('bag')}<span class="cart-label">Sacola</span><span data-cart-count>0</span></a></div></div><nav class="desktop-nav" aria-label="Navegação principal"><a href="index.html"${active('inicio')}>Início</a><a href="perfumaria.html"${active('perfumaria')}>Perfumaria</a><a href="nail-design.html"${active('nail-design')}>Nail Design</a><a href="index.html#studio">O studio</a></nav></header>`;
  const footer = document.getElementById('site-footer');
  if (footer) footer.innerHTML = `<footer class="site-footer"><div class="container footer-main"><div class="footer-intro"><a class="brand" href="index.html" aria-label="Studio Milana Pirre, início">${logo}</a><p>Perfumaria e Nail Design.<br>Duas formas de ser você.</p></div><div class="footer-column"><h2>Explore</h2><a href="perfumaria.html">Perfumaria</a><a href="nail-design.html">Nail Design</a><a href="nail-design.html#perfil">A profissional</a></div><div class="footer-column"><h2>Seu momento</h2><a href="carrinho.html">Minha sacola</a><button data-contact="whatsapp">${icon('whatsapp')} WhatsApp</button><button data-contact="instagram">${icon('instagram')} Instagram</button></div><div class="footer-note"><p>Uma prévia do studio.</p><span>Produtos, valores e fotografias ilustrativos. Nenhuma compra real é realizada.</span></div></div><div class="container footer-bottom"><span>Studio Milana Pirre</span><span>Experiência demonstrativa · 2026</span></div></footer><nav class="mobile-bottom-nav" aria-label="Atalhos principais"><a href="index.html"${active('inicio')}>${icon('home')}<span>Início</span></a><a href="perfumaria.html"${active('perfumaria')}>${icon('bottle')}<span>Perfumes</span></a><a href="nail-design.html"${active('nail-design')}>${icon('heart')}<span>Nail Design</span></a><a href="carrinho.html" data-cart-link>${icon('bag')}<span>Sacola <span data-cart-count>0</span></span></a></nav>`;
  document.body.insertAdjacentHTML('beforeend', `<div id="toast" class="toast" role="status" aria-live="polite"></div><dialog id="menu-dialog" class="menu-dialog" aria-labelledby="menu-title"><div class="dialog-top"><span class="dialog-label" id="menu-title">Explore o studio</span><button class="icon-button" data-close-dialog aria-label="Fechar menu">${icon('close')}</button></div><nav aria-label="Menu mobile"><a href="index.html">Início</a><a href="perfumaria.html">Perfumaria</a><a href="nail-design.html">Nail Design</a><a href="nail-design.html#perfil">A profissional</a><a href="carrinho.html">Minha sacola</a></nav><div class="menu-categories">${data.categories.map(category => `<a href="perfumaria.html?categoria=${encodeURIComponent(category)}">${escape(category)}</a>`).join('')}</div><p class="demo-note">Conheça a experiência. Todos os dados são demonstrativos.</p></dialog><dialog id="search-dialog" class="search-dialog" aria-labelledby="search-title"><div class="dialog-top"><h2 id="search-title">Qual será sua assinatura?</h2><button class="icon-button" data-close-dialog aria-label="Fechar busca">${icon('close')}</button></div><form action="perfumaria.html" method="get"><label for="global-search">Buscar perfume, nota ou família olfativa</label><div class="search-input-group"><input id="global-search" name="q" type="search" placeholder="Experimente âmbar, floral, oud…" autocomplete="off"><button class="btn" type="submit">Buscar</button></div></form><p class="muted">Ou explore: <a href="perfumaria.html?categoria=Nicho">Nicho</a>, <a href="perfumaria.html?categoria=Árabes">Árabes</a>, <a href="perfumaria.html?categoria=Importados">Importados</a></p></dialog><dialog id="contact-dialog" class="contact-dialog" aria-labelledby="contact-title"><div class="dialog-top"><h2 id="contact-title">Vamos conversar?</h2><button class="icon-button" data-close-dialog aria-label="Fechar contato">${icon('close')}</button></div><p data-contact-description></p><div class="field"><label for="contact-message">Sua mensagem</label><textarea id="contact-message" readonly rows="7"></textarea></div><div class="dialog-actions"><button class="btn btn-outline" data-copy-message>Copiar mensagem</button><a class="btn" data-contact-link target="_blank" rel="noopener noreferrer" hidden>Abrir WhatsApp</a></div><p data-copy-status role="status" class="muted"></p></dialog>`);
  document.querySelectorAll('[data-cart-link]').forEach(link => { if (page === 'carrinho' || page === 'checkout') link.setAttribute('aria-current', page === 'carrinho' ? 'page' : 'true'); });
  updateBadge();
  document.addEventListener('click', event => {
    const button = event.target.closest('button, a'); if (!button) return;
    if (button.matches('[data-open-menu]')) document.getElementById('menu-dialog').showModal();
    if (button.matches('[data-open-search]')) { document.getElementById('search-dialog').showModal(); document.getElementById('global-search').focus(); }
    if (button.matches('[data-close-dialog]')) button.closest('dialog').close();
    if (button.matches('[data-add-product]')) addToCart(button.dataset.addProduct, 1);
    if (button.matches('[data-contact]')) { event.preventDefault(); contact(button.dataset.contact); }
    if (button.matches('[data-copy-message]')) {
      const textarea = document.getElementById('contact-message');
      const status = document.querySelector('[data-copy-status]');
      const copyFallback = () => { textarea.select(); try { status.textContent = document.execCommand('copy') ? 'Mensagem copiada.' : 'Selecione e copie o texto acima.'; } catch (_) { status.textContent = 'Selecione e copie o texto acima.'; } };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(textarea.value).then(() => { status.textContent = 'Mensagem copiada.'; }).catch(copyFallback); else copyFallback();
    }
  });
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } }));
  window.addEventListener('storage', event => { if (event.key === key) { try { cart = normalize(JSON.parse(event.newValue || '[]')); updateBadge(); document.dispatchEvent(new CustomEvent('cart:change')); } catch (_) {} } });
  const featured = document.getElementById('featured-products');
  if (featured && !document.querySelector('script[src="assets/js/home.js"]')) featured.innerHTML = data.products.slice(0, 3).map(productCard).join('');
})();

document.addEventListener('DOMContentLoaded', () => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
  }), { threshold: .06 });
  document.querySelectorAll('[data-reveal]').forEach(element => {
    if (element.getBoundingClientRect().top > innerHeight) { element.classList.add('reveal-ready'); observer.observe(element); }
  });
  preference.addEventListener('change', () => {
    if (preference.matches) { observer.disconnect(); document.querySelectorAll('.reveal-ready').forEach(el => el.classList.add('is-revealed')); }
  });
});

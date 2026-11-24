(function () {
  'use strict';
  var S = window.Studio;
  var products = window.STUDIO_DATA.products;
  var page = document.body.dataset.page;
  var e = S.escape;
  var money = S.money;
  var qs = function (selector, scope) { return (scope || document).querySelector(selector); };
  var normalize = function (value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); };
  var params = new URLSearchParams(window.location.search);
  var summaryMessage = function (items, total) {
    return 'Olá! Gostaria de conversar sobre esta seleção demonstrativa de perfumes:\n' + items.map(function (item) { return item.qty + ' × ' + item.product.name + ' (' + item.product.volume + ' ml) — ' + money(item.total); }).join('\n') + '\nSubtotal demonstrativo: ' + money(total) + '.\nOs produtos e valores desta prévia são fictícios. Gostaria de conhecer o catálogo real.';
  };
  function emptyCartHTML(checkout) {
    var heading = checkout ? 'h1' : 'h2';
    return '<section class="cart-empty">' + S.icon('bag') + '<' + heading + '>' + (checkout ? 'Sua seleção começa na perfumaria.' : 'Uma nova descoberta espera por você.') + '</' + heading + '><p>Sua sacola ainda está vazia. Explore a coleção demonstrativa e escolha uma fragrância para experimentar a jornada de compra.</p><a class="btn" href="perfumaria.html">Explorar perfumaria</a></section>';
  }
  function setupCatalog() {
    var category = params.get('categoria') || params.get('category') || '';
    if (window.STUDIO_DATA.categories.indexOf(category) === -1) category = '';
    var selectedFamilies = new Set();
    var search = qs('#product-search');
    search.value = params.get('q') || '';
    var families = Array.from(new Set(products.map(function (product) { return product.family; })));
    qs('#category-tabs').innerHTML = ['Todos'].concat(window.STUDIO_DATA.categories).map(function (name) {
      var key = name === 'Todos' ? '' : name;
      return '<button type="button" data-category="' + e(key) + '" aria-pressed="' + (category === key) + '">' + e(name) + '</button>';
    }).join('');
    qs('#family-filters').innerHTML = families.map(function (family, index) { return '<label class="filter-check" for="family-' + index + '"><input type="checkbox" id="family-' + index + '" name="family" value="' + e(family) + '"><span>' + e(family) + '</span></label>'; }).join('');
    qs('#catalog-search-button').innerHTML = S.icon('search');
    qs('#filter-symbol').innerHTML = S.icon('filter');
    var filters = qs('#catalog-filters');
    var desktop = window.matchMedia('(min-width: 960px)');
    function adjustFilters() { filters.open = desktop.matches; }
    adjustFilters();
    if (desktop.addEventListener) desktop.addEventListener('change', adjustFilters);
    else if (desktop.addListener) desktop.addListener(adjustFilters);
    function updateURL() {
      try {
        var url = new URL(window.location.href);
        ['category', 'categoria', 'q'].forEach(function (key) { url.searchParams.delete(key); });
        if (category) url.searchParams.set('categoria', category);
        if (search.value.trim()) url.searchParams.set('q', search.value.trim());
        window.history.replaceState({}, '', url.href);
      } catch (_) { /* file:// browsers may restrict history changes. */ }
    }
    function render() {
      var query = normalize(search.value.trim());
      var max = qs('#price-filter').value;
      var filtered = products.filter(function (product) {
        return (!category || product.categories.indexOf(category) !== -1) && (!selectedFamilies.size || selectedFamilies.has(product.family)) && (max === 'all' || product.price <= Number(max)) && (!query || normalize([product.name, product.family].concat(product.notes, product.categories).join(' ')).indexOf(query) !== -1);
      });
      var sort = qs('#product-sort').value;
      if (sort === 'price-asc') filtered.sort(function (a, b) { return a.price - b.price; });
      if (sort === 'price-desc') filtered.sort(function (a, b) { return b.price - a.price; });
      if (sort === 'name') filtered.sort(function (a, b) { return a.name.localeCompare(b.name, 'pt-BR'); });
      qs('#catalog-grid').innerHTML = filtered.map(S.productCard).join('');
      qs('#catalog-grid').hidden = !filtered.length;
      qs('#catalog-empty').hidden = !!filtered.length;
      qs('#results-count').textContent = filtered.length + (filtered.length === 1 ? ' fragrância' : ' fragrâncias');
      document.querySelectorAll('[data-category]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.category === category)); });
      updateURL();
    }
    qs('#category-tabs').addEventListener('click', function (event) { var button = event.target.closest('[data-category]'); if (button) { category = button.dataset.category; render(); } });
    qs('#catalog-search').addEventListener('submit', function (event) { event.preventDefault(); render(); });
    search.addEventListener('input', render);
    qs('#family-filters').addEventListener('change', function (event) { if (event.target.checked) selectedFamilies.add(event.target.value); else selectedFamilies.delete(event.target.value); render(); });
    qs('#price-filter').addEventListener('change', render);
    qs('#product-sort').addEventListener('change', render);
    function reset() { category = ''; search.value = ''; selectedFamilies.clear(); document.querySelectorAll('[name=family]').forEach(function (checkbox) { checkbox.checked = false; }); qs('#price-filter').value = 'all'; qs('#product-sort').value = 'featured'; render(); }
    qs('#reset-filters').addEventListener('click', reset);
    qs('#reset-empty').addEventListener('click', function () { reset(); search.focus(); });
    render();
  }
  function setupProduct() {
    var id = params.get('id') || products[0].id;
    var product = products.find(function (item) { return item.id === id; });
    var container = qs('#product-content');
    if (!product) {
      container.innerHTML = '<section class="container commerce-missing"><h1>Esta fragrância não foi encontrada.</h1><p>Explore os produtos disponíveis na coleção demonstrativa.</p><a class="btn" href="perfumaria.html">Voltar à perfumaria</a></section>';
      return;
    }
    document.title = product.name + ' — Studio Milana Pirre';
    qs('#product-breadcrumb').textContent = product.name;
    var gallery = product.gallery || [product.image];
    var related = products.filter(function (item) { return item.id !== product.id; }).slice(0, 4);
    container.innerHTML = '<section class="container product-layout" aria-label="Detalhes de ' + e(product.name) + '"><div class="product-gallery"><div class="gallery-track" id="gallery-track" tabindex="0" role="region" aria-roledescription="carrossel" aria-label="Galeria de imagens; use as setas ou deslize">' + gallery.map(function (src, index) { return '<div class="gallery-slide" role="group" aria-label="Imagem ' + (index + 1) + ' de ' + gallery.length + '"><img src="' + e(src) + '" alt="' + (index === 0 ? 'Frasco ilustrativo da fragrância fictícia ' + e(product.name) : 'Composição editorial de perfumaria, imagem ilustrativa de ambiente') + '" width="900" height="1000" ' + (index ? 'loading="lazy"' : 'fetchpriority="high"') + '></div>'; }).join('') + '</div><div class="gallery-controls"><div class="gallery-thumbs">' + gallery.map(function (src, index) { return '<button class="gallery-thumb" type="button" data-gallery-index="' + index + '" aria-pressed="' + (index === 0) + '" aria-label="Ver imagem ' + (index + 1) + '"><img src="' + e(src) + '" alt="" width="60" height="70"></button>'; }).join('') + '</div><div class="gallery-arrows"><span id="gallery-count">1 / ' + gallery.length + '</span><button type="button" id="gallery-prev" aria-label="Imagem anterior">' + S.icon('chevron-left') + '</button><button type="button" id="gallery-next" aria-label="Próxima imagem">' + S.icon('chevron-right') + '</button></div></div><p class="gallery-caption">Fotografias reais de referência. O perfume apresentado é fictício.</p></div><div class="product-info"><h1>' + e(product.name) + '</h1><p class="product-family">' + e(product.family) + ' · ' + e(product.concentration) + '</p><div class="product-specs"><span>' + product.volume + ' ml</span><span>' + e(product.intensity) + '</span></div><p class="product-price">' + money(product.price) + '</p><p class="product-price-note">Preço fictício para demonstração</p><p class="product-description">' + e(product.description) + '</p><form id="product-add-form"><label class="visually-hidden" for="product-qty">Quantidade</label><div class="product-buy"><div class="product-quantity"><button type="button" id="product-minus" aria-label="Diminuir quantidade">' + S.icon('minus') + '</button><input id="product-qty" name="quantity" type="number" min="1" max="10" step="1" value="1" inputmode="numeric" aria-label="Quantidade"><button type="button" id="product-plus" aria-label="Aumentar quantidade">' + S.icon('plus') + '</button></div><button type="submit" class="btn" id="product-add">Adicionar à sacola</button></div></form><button type="button" class="btn btn-outline product-contact" id="product-whatsapp">' + S.icon('whatsapp') + 'Conversar sobre este perfume</button><div id="product-added" class="product-added" role="status" hidden><span id="product-added-message"></span><br><a href="carrinho.html">Ver minha sacola</a></div><div class="product-accordion"><details open><summary>As notas desta composição</summary><ul class="notes-list">' + product.notes.map(function (note, index) { return '<li><span>' + ['Saída', 'Coração', 'Fundo'][index] + '</span><strong>' + e(note) + '</strong></li>'; }).join('') + '</ul></details><details><summary>Sobre esta demonstração</summary><p>Este perfume, suas notas e preço são fictícios. As fotografias reais são referências visuais. A seleção permite experimentar o site e será substituída pelo catálogo real. Nenhuma compra ou cobrança será realizada.</p></details></div></div></section><section class="container product-related" aria-labelledby="related-title"><div class="product-related-heading"><h2 id="related-title">Outras descobertas</h2><a class="text-link" href="perfumaria.html">Ver coleção</a></div><div class="product-grid">' + related.map(S.productCard).join('') + '</div></section>';
    var quantityInput = qs('#product-qty');
    function clampQuantity() { var n = Math.round(Number(quantityInput.value)); quantityInput.value = Number.isFinite(n) ? Math.max(1, Math.min(10, n)) : 1; qs('#product-minus').disabled = Number(quantityInput.value) <= 1; qs('#product-plus').disabled = Number(quantityInput.value) >= 10; }
    qs('#product-minus').addEventListener('click', function () { quantityInput.value = Number(quantityInput.value) - 1; clampQuantity(); });
    qs('#product-plus').addEventListener('click', function () { quantityInput.value = Number(quantityInput.value) + 1; clampQuantity(); });
    quantityInput.addEventListener('change', clampQuantity);
    clampQuantity();
    qs('#product-add-form').addEventListener('submit', function (event) {
      event.preventDefault(); clampQuantity();
      var previous = S.getCart().find(function (item) { return item.id === product.id; });
      var previousQuantity = previous ? previous.qty : 0;
      if (previousQuantity >= 10) { S.toast('Limite de 10 unidades deste perfume na demonstração.'); return; }
      var added = Math.min(Number(quantityInput.value), 10 - previousQuantity);
      S.addToCart(product.id, added);
      qs('#product-added-message').textContent = added + (added === 1 ? ' unidade adicionada' : ' unidades adicionadas') + ' à sua sacola.';
      qs('#product-added').hidden = false;
    });
    qs('#product-whatsapp').addEventListener('click', function () { S.contact('whatsapp', summaryMessage([{ product: product, qty: Number(quantityInput.value), total: product.price * Number(quantityInput.value) }], product.price * Number(quantityInput.value))); });
    var track = qs('#gallery-track');
    var index = 0;
    function setGallery(number) { index = (number + gallery.length) % gallery.length; track.scrollTo({ left: track.clientWidth * index, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); syncGallery(); }
    function syncGallery() { document.querySelectorAll('[data-gallery-index]').forEach(function (button) { button.setAttribute('aria-pressed', String(Number(button.dataset.galleryIndex) === index)); }); qs('#gallery-count').textContent = (index + 1) + ' / ' + gallery.length; }
    document.querySelectorAll('[data-gallery-index]').forEach(function (button) { button.addEventListener('click', function () { setGallery(Number(button.dataset.galleryIndex)); }); });
    qs('#gallery-prev').addEventListener('click', function () { setGallery(index - 1); });
    qs('#gallery-next').addEventListener('click', function () { setGallery(index + 1); });
    track.addEventListener('scroll', function () { index = Math.max(0, Math.min(gallery.length - 1, Math.round(track.scrollLeft / track.clientWidth))); syncGallery(); }, { passive: true });
    track.addEventListener('keydown', function (event) { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); setGallery(index + (event.key === 'ArrowRight' ? 1 : -1)); } });
  }
  function setupCart() {
    var container = qs('#cart-content');
    function render() {
      var items = S.cartDetails();
      if (!items.length) { container.innerHTML = emptyCartHTML(false); return; }
      var count = items.reduce(function (n, item) { return n + item.qty; }, 0);
      container.innerHTML = '<div class="cart-layout"><section class="cart-list" aria-label="Produtos na sacola"><div class="cart-table-heading"><span>Produto</span><span>Subtotal</span></div>' + items.map(function (item) { var product = item.product; return '<article class="cart-item" data-cart-item="' + e(product.id) + '"><a class="cart-item-image" href="produto.html?id=' + encodeURIComponent(product.id) + '"><img src="' + e(product.image) + '" alt="Frasco ilustrativo de ' + e(product.name) + '" width="100" height="130"></a><div class="cart-item-info"><h2><a href="produto.html?id=' + encodeURIComponent(product.id) + '">' + e(product.name) + '</a></h2><p>' + e(product.concentration) + ' · ' + product.volume + ' ml</p><p>' + money(product.price) + ' por unidade</p><div class="cart-item-controls"><div class="cart-quantity" role="group" aria-label="Quantidade de ' + e(product.name) + '"><button type="button" data-cart-action="minus" data-id="' + e(product.id) + '" aria-label="Diminuir quantidade de ' + e(product.name) + '"' + (item.qty <= 1 ? ' disabled' : '') + '>' + S.icon('minus') + '</button><span aria-live="polite">' + item.qty + '</span><button type="button" data-cart-action="plus" data-id="' + e(product.id) + '" aria-label="Aumentar quantidade de ' + e(product.name) + '"' + (item.qty >= 10 ? ' disabled' : '') + '>' + S.icon('plus') + '</button></div><button type="button" class="cart-remove" data-cart-action="remove" data-id="' + e(product.id) + '" aria-label="Remover ' + e(product.name) + ' da sacola">Remover</button></div></div><p class="cart-item-total">' + money(item.total) + '</p></article>'; }).join('') + '<p class="cart-footnote">Sua seleção fica salva neste navegador. Produtos, quantidades e valores fazem parte de uma demonstração.</p></section><aside class="commerce-summary" aria-labelledby="cart-summary-title"><h2 id="cart-summary-title">Resumo da sacola</h2><div class="summary-line"><span>Subtotal (' + count + (count === 1 ? ' item' : ' itens') + ')</span><span>' + money(S.cartTotal()) + '</span></div><div class="summary-line"><span>Entrega</span><span>A combinar</span></div><div class="summary-line summary-total"><span>Total demonstrativo</span><span id="cart-total" aria-live="polite">' + money(S.cartTotal()) + '</span></div><a href="checkout.html" class="btn">Continuar para o checkout</a><button type="button" class="btn btn-outline" id="cart-whatsapp">Conversar pelo WhatsApp</button><p class="demo-note">Frete não calculado. Nenhuma cobrança é feita nesta prévia.</p></aside></div>';
      qs('#cart-whatsapp').addEventListener('click', function () { S.contact('whatsapp', summaryMessage(S.cartDetails(), S.cartTotal())); });
    }
    container.addEventListener('click', function (event) {
      var button = event.target.closest('[data-cart-action]'); if (!button) return;
      var id = button.dataset.id;
      var action = button.dataset.cartAction;
      var item = S.getCart().find(function (entry) { return entry.id === id; }); if (!item) return;
      if (action === 'remove') { S.removeFromCart(id); S.toast('Perfume removido da sacola.'); }
      else S.setQuantity(id, Math.max(1, Math.min(10, item.qty + (action === 'plus' ? 1 : -1))));
      var next = container.querySelector('[data-id="' + id + '"][data-cart-action="' + action + '"]:not(:disabled)') || container.querySelector('[data-id="' + id + '"][data-cart-action]:not(:disabled)') || container.querySelector('button, a');
      if (next) next.focus({ preventScroll: true });
    });
    document.addEventListener('cart:change', render);
    render();
  }
  function setupCheckout() {
    var container = qs('#checkout-content');
    var completed = false;
    function render() {
      if (completed) return;
      var items = S.cartDetails();
      if (!items.length) { container.innerHTML = emptyCartHTML(true); return; }
      container.innerHTML = '<div class="checkout-heading"><h1>O último detalhe<br>da sua escolha.</h1><p>Experimente a finalização da compra. Esta etapa é demonstrativa: nenhum pagamento ou pedido real será realizado.</p></div><div class="checkout-layout"><form id="checkout-form" class="checkout-form"><fieldset class="checkout-fieldset"><legend>Como podemos chamar você?</legend><div class="field"><label for="checkout-name">Nome ou apelido <span class="muted">(opcional)</span></label><input id="checkout-name" name="name" type="text" maxlength="40" autocomplete="off" placeholder="Use um nome de demonstração"><p class="field-help">Não precisamos de documentos, endereço ou dados de cartão.</p></div></fieldset><fieldset class="checkout-fieldset"><legend>Recebimento</legend><label class="checkout-choice"><input type="radio" name="delivery" value="Entrega" checked><span><strong>Entrega — simulação</strong><small>Disponibilidade e condições serão definidas no atendimento real.</small></span></label><label class="checkout-choice"><input type="radio" name="delivery" value="Retirada"><span><strong>Retirada — simulação</strong><small>Nenhum local ou horário de retirada está confirmado nesta prévia.</small></span></label></fieldset><fieldset class="checkout-fieldset"><legend>Forma de pagamento</legend><label class="checkout-choice"><input type="radio" name="payment" value="Pix demonstrativo" checked><span><strong>Pix — simulação</strong><small>Sem código de pagamento, transferência ou cobrança.</small></span></label><label class="checkout-choice"><input type="radio" name="payment" value="A combinar no atendimento"><span><strong>Combinar no atendimento</strong><small>Conheça as condições reais diretamente com o studio.</small></span></label></fieldset><label class="checkout-acknowledgement"><input type="checkbox" id="checkout-acknowledge" required><span>Entendo que estou testando uma demonstração e que nenhum pedido será enviado.</span></label><p class="checkout-error" id="checkout-error" role="alert" hidden></p><button type="submit" class="btn checkout-submit">Concluir simulação</button></form><aside class="commerce-summary" aria-labelledby="checkout-summary-title"><h2 id="checkout-summary-title">Sua seleção</h2>' + items.map(function (item) { return '<div class="checkout-summary-item"><img src="' + e(item.product.image) + '" alt="" width="50" height="62"><div><h3>' + e(item.product.name) + '</h3><p>' + item.product.volume + ' ml · Quantidade: ' + item.qty + '</p></div><span>' + money(item.total) + '</span></div>'; }).join('') + '<div class="summary-line"><span>Subtotal</span><span>' + money(S.cartTotal()) + '</span></div><div class="summary-line"><span>Entrega</span><span>A combinar</span></div><div class="summary-line summary-total"><span>Total demonstrativo</span><span>' + money(S.cartTotal()) + '</span></div><a class="text-link" href="carrinho.html">Editar sacola</a><p class="demo-note">Valores fictícios. Frete não calculado. As informações do formulário não são enviadas a um servidor.</p></aside></div>';
      qs('#checkout-form').addEventListener('submit', function (event) {
        event.preventDefault();
        var form = event.currentTarget;
        if (!form.reportValidity()) return;
        var snapshot = S.cartDetails();
        if (!snapshot.length) { render(); return; }
        var total = S.cartTotal();
        var name = qs('#checkout-name').value.trim();
        var delivery = qs('input[name=delivery]:checked').value;
        var payment = qs('input[name=payment]:checked').value;
        completed = true;
        S.clearCart();
        document.title = 'Simulação concluída — Studio Milana Pirre';
        container.innerHTML = '<section class="checkout-confirmation" aria-labelledby="confirmation-title"><div class="confirmation-symbol">' + S.icon('check') + '</div><h1 id="confirmation-title" tabindex="-1">Simulação concluída.</h1><p>' + (name ? e(name) + ', sua' : 'Sua') + ' experiência de compra chegou ao fim. Nenhum pedido foi enviado, nenhum pagamento foi processado e nenhum estoque foi alterado.</p><div class="confirmation-details"><h2>O resumo da sua escolha</h2><ul>' + snapshot.map(function (item) { return '<li><span>' + item.qty + ' × ' + e(item.product.name) + '</span><span>' + money(item.total) + '</span></li>'; }).join('') + '</ul><div class="summary-line summary-total"><span>Total demonstrativo</span><span>' + money(total) + '</span></div><div class="summary-line"><span>Recebimento</span><span>' + e(delivery) + ' (simulação)</span></div><div class="summary-line"><span>Pagamento</span><span>' + e(payment) + '</span></div></div><p class="confirmation-notice">Quer conhecer a seleção real? Você pode preparar uma conversa com o resumo acima. O envio da mensagem depende de você no WhatsApp.</p><div class="confirmation-actions"><button class="btn" id="confirmation-whatsapp" type="button">Conversar pelo WhatsApp</button><a class="btn btn-outline" href="perfumaria.html">Voltar à perfumaria</a></div></section>';
        qs('#confirmation-whatsapp').addEventListener('click', function () { S.contact('whatsapp', summaryMessage(snapshot, total)); });
        qs('#confirmation-title').focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }
    document.addEventListener('cart:change', function () { if (!completed) render(); });
    render();
  }
  if (page === 'perfumaria') setupCatalog();
  if (page === 'produto') setupProduct();
  if (page === 'carrinho') setupCart();
  if (page === 'checkout') setupCheckout();
}());

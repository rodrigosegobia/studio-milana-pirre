(function () {
  'use strict';
  const S = window.Studio, content = window.STUDIO_DATA.nail, profile = content.profile;
  if (profile.name) document.getElementById('profile-title').textContent = profile.name;
  if (profile.bio) document.getElementById('profile-bio').textContent = profile.bio;
  if (profile.photo) {
    const picture = document.createElement('img');
    const holder = document.getElementById('profile-picture'), placeholder = holder.innerHTML;
    picture.addEventListener('error', () => {
      holder.innerHTML = placeholder;
      document.getElementById('profile-image-note').hidden = false;
      document.getElementById('profile-preview-note').hidden = false;
    }, { once:true });
    picture.src = profile.photo; picture.alt = profile.name || 'Profissional do studio'; picture.loading = 'lazy';
    holder.replaceChildren(picture);
    document.getElementById('profile-image-note').hidden = true;
  }
  if (profile.name && profile.bio && profile.photo) document.getElementById('profile-preview-note').hidden = true;
  document.getElementById('nail-services-list').innerHTML = window.STUDIO_DATA.services.map(service => `<article class="nail-service" aria-labelledby="service-${S.escape(service.id)}"><h3 id="service-${S.escape(service.id)}">${S.escape(service.name)}</h3><p class="nail-service-description">${S.escape(service.description)}</p><details class="service-details"><summary>Sobre o procedimento<span aria-hidden="true">${S.icon('plus')}</span></summary><p>${S.escape(service.detail)}</p></details></article>`).join('');
  document.getElementById('portfolio-grid').innerHTML = content.portfolio.map((item, index) => `<figure class="portfolio-work"><button class="portfolio-photo" type="button" data-photo="${index}" aria-label="Ampliar: ${S.escape(item.title)}"><img src="${S.escape(item.image)}" alt="${S.escape(item.alt)}" width="1200" height="1600" loading="lazy"><span class="portfolio-enlarge" aria-hidden="true">${S.icon('plus')}</span></button><figcaption><h3>${S.escape(item.title)}</h3><p>${S.escape(item.description)}</p></figcaption></figure>`).join('');
  const dialog = document.getElementById('portfolio-dialog');
  dialog.querySelector('[data-close-dialog]').innerHTML = S.icon('close');
  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
    const item = content.portfolio[Number(button.dataset.photo)];
    document.getElementById('portfolio-photo-title').textContent = item.title;
    const photo = document.getElementById('portfolio-full-photo'); photo.src = item.image; photo.alt = item.alt;
    document.getElementById('portfolio-photo-description').textContent = item.description;
    dialog.showModal();
  }));
})();

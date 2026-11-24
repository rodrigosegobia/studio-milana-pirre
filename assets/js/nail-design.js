(function () {
  'use strict';
  const S = window.Studio, content = window.STUDIO_DATA.nail, profile = content.profile;
  if (profile.name) document.getElementById('profile-title').textContent = profile.name;
  if (profile.bio) document.getElementById('profile-bio').textContent = profile.bio;
  if (profile.photo) {
    const picture = document.createElement('img');
    picture.src = profile.photo; picture.alt = profile.name || 'Profissional do studio'; picture.loading = 'lazy';
    document.getElementById('profile-picture').replaceChildren(picture);
  }
  document.getElementById('nail-services-list').innerHTML = window.STUDIO_DATA.services.map(service => `<article class="nail-service"><h3>${S.escape(service.name)}</h3><div><p>${S.escape(service.description)}</p><p class="muted">${S.escape(service.detail)}</p></div></article>`).join('');
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

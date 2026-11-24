/* Agenda local demonstrativa. A integração real deve validar disponibilidade no servidor.
 * blockedSlots aceita 'AAAA-MM-DDTHH:mm' (slotMinutes) ou { date, start, end }.
 * Datas, períodos, folgas e antecedência vêm exclusivamente de STUDIO_CONFIG.schedule.
 */
(function () {
  'use strict';
  const S = window.Studio;
  const services = window.STUDIO_DATA.services;
  const cfg = window.STUDIO_CONFIG;
  const schedule = cfg.schedule;
  const esc = S.escape;
  const page = document.body.dataset.page;
  const durationLabel = minutes => minutes % 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}min` : `${minutes / 60}h`;

  if (page === 'nail-design') {
    document.getElementById('nail-services-list').innerHTML = services.map(service => `<article class="nail-service"><h3>${esc(service.name)}</h3><p>${esc(service.description)}</p><a class="text-link" href="agendamento.html?servico=${encodeURIComponent(service.id)}">Escolher serviço</a></article>`).join('');
    document.querySelectorAll('[data-nail-contact]').forEach(button => button.addEventListener('click', () => S.contact(button.dataset.nailContact, 'Olá! Gostaria de saber mais sobre os serviços de Nail Design do Studio Milana Pirre.')));
    const gallery = document.getElementById('nail-gallery');
    const previous = document.querySelector('[data-gallery-prev]');
    const next = document.querySelector('[data-gallery-next]');
    previous.innerHTML = S.icon('chevron-left');
    next.innerHTML = S.icon('chevron-right');
    const updateGallery = () => {
      previous.disabled = gallery.scrollLeft < 5;
      next.disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 5;
    };
    const scrollGallery = direction => gallery.scrollBy({ left: direction * gallery.clientWidth * .9, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    previous.addEventListener('click', () => scrollGallery(-1));
    next.addEventListener('click', () => scrollGallery(1));
    gallery.addEventListener('scroll', updateGallery, { passive: true });
    window.addEventListener('resize', updateGallery);
    gallery.addEventListener('keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); scrollGallery(event.key === 'ArrowRight' ? 1 : -1); } });
    updateGallery();
    return;
  }
  if (page !== 'agendamento') return;

  const tz = cfg.timezone || 'America/Sao_Paulo';
  const dateFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' });
  const fullDateFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const monthFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', month: 'long', year: 'numeric' });
  const zoneFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  function zoneParts(instant) {
    const parts = {};
    zoneFormatter.formatToParts(instant).forEach(part => { if (part.type !== 'literal') parts[part.type] = Number(part.value); });
    return parts;
  }
  function dateKey(date) { return date.toISOString().slice(0, 10); }
  function utcDate(key) { return new Date(`${key}T00:00:00Z`); }
  function addDays(key, amount) { const date = utcDate(key); date.setUTCDate(date.getUTCDate() + amount); return dateKey(date); }
  function todayKey() { const p = zoneParts(new Date()); return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`; }
  function minutes(value) { const [h, m] = value.split(':').map(Number); return h * 60 + m; }
  function timeLabel(value) { return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`; }
  function instantAt(date, time) {
    const wallTime = Date.parse(`${date}T${time}:00Z`);
    let instant = wallTime;
    for (let index = 0; index < 3; index++) {
      const p = zoneParts(new Date(instant));
      const represented = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
      instant += wallTime - represented;
    }
    return instant;
  }
  function overlaps(start, end, otherStart, otherEnd) { return start < otherEnd && end > otherStart; }
  function availableSlots(date, service, now = Date.now()) {
    const today = todayKey();
    if (!service || date < today || date > addDays(today, schedule.horizonDays)) return [];
    if (!schedule.weekdays.includes(utcDate(date).getUTCDay()) || schedule.daysOff.includes(date)) return [];
    const blocked = (schedule.blockedSlots || []).filter(item => typeof item === 'string' ? item.slice(0, 10) === date : item.date === date).map(item => typeof item === 'string' ? { start: minutes(item.slice(11, 16)), end: minutes(item.slice(11, 16)) + schedule.slotMinutes } : { start: minutes(item.start), end: minutes(item.end) });
    const breaks = (schedule.breaks || []).map(item => ({ start: minutes(item.start), end: minutes(item.end) }));
    const result = [];
    const interval = Math.max(5, Number(schedule.slotMinutes) || 30);
    for (let start = minutes(schedule.open); start + service.duration <= minutes(schedule.close); start += interval) {
      const end = start + service.duration;
      if (breaks.concat(blocked).some(item => overlaps(start, end, item.start, item.end))) continue;
      const label = timeLabel(start);
      if (instantAt(date, label) < now + (Number(schedule.leadHours) || 0) * 3600000) continue;
      result.push(label);
    }
    return result;
  }

  // Exposed pure scheduling helpers support independent validation without remote APIs.
  window.StudioBooking = { availableSlots, instantAt, addDays, todayKey };
  const initialService = services.find(service => service.id === new URLSearchParams(location.search).get('servico')) || null;
  const state = { step: initialService ? 2 : 1, service: initialService, date: '', time: '', month: todayKey().slice(0, 7), confirmed: false };
  const workspace = document.getElementById('booking-workspace');
  const progress = document.getElementById('booking-progress');
  const summary = document.getElementById('booking-summary');
  const announcement = document.getElementById('booking-announcement');
  function announce(message) { announcement.textContent = message; }
  function focusHeading() { const heading = workspace.querySelector('h2'); if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); } }
  function earliestAvailable() {
    for (let offset = 0; offset <= schedule.horizonDays; offset++) {
      const date = addDays(todayKey(), offset);
      if (availableSlots(date, state.service).length) return date;
    }
    return '';
  }
  function goStep(step) {
    if (step === 2 && !state.service) return;
    if (step === 3 && (!state.date || !state.time)) return;
    state.step = step;
    if (step === 2 && !state.date) state.month = (earliestAvailable() || todayKey()).slice(0, 7);
    render();
    focusHeading();
    if (window.innerWidth < 960) workspace.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  function renderProgress() {
    const names = ['Serviço', 'Data e horário', 'Revisão'];
    progress.innerHTML = names.map((name, index) => {
      const number = index + 1;
      return `<li ${!state.confirmed && number === state.step ? 'aria-current="step"' : ''} class="${number < state.step || state.confirmed ? 'is-complete' : ''}"><button type="button" data-step="${number}" ${number > state.step || state.confirmed ? 'disabled' : ''}><span class="booking-step-number">${number < state.step || state.confirmed ? S.icon('check') : number}</span>${name}</button></li>`;
    }).join('');
    progress.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => goStep(Number(button.dataset.step))));
  }
  function renderSummary() {
    summary.innerHTML = `<img class="booking-summary-picture" src="https://images.pexels.com/photos/13038494/pexels-photo-13038494.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Referência ilustrativa de acabamento em Nail Design" width="1536" height="1024"><h2>Sua escolha</h2><dl><div><dt>Serviço</dt><dd>${state.service ? esc(state.service.name) : 'A escolher'}</dd></div><div><dt>Duração estimada</dt><dd>${state.service ? durationLabel(state.service.duration) : '—'}</dd></div><div><dt>Data</dt><dd>${state.date ? esc(dateFormatter.format(utcDate(state.date))) : 'A escolher'}</dd></div><div><dt>Horário</dt><dd>${state.time || 'A escolher'}</dd></div><div><dt>Valor</dt><dd>A consultar</dd></div></dl><p class="booking-summary-help">O procedimento e o valor serão definidos com a profissional. Não é necessário informar dados pessoais nesta prévia.</p><p class="demo-note">Disponibilidade e durações ilustrativas.<br>Horário de Brasília (${esc(tz)}).</p>`;
  }
  function renderServiceStep() {
    workspace.innerHTML = `<h2>Qual cuidado combina com você?</h2><p class="booking-step-description">Selecione um serviço para explorar a agenda. As durações são estimativas de demonstração.</p><fieldset class="booking-services"><legend class="visually-hidden">Escolha um serviço</legend>${services.map(service => `<label class="booking-service-option"><input type="radio" name="service" value="${esc(service.id)}" ${state.service && state.service.id === service.id ? 'checked' : ''}><span class="booking-service-name">${esc(service.name)}</span><span class="booking-service-duration">${durationLabel(service.duration)}</span><span class="booking-service-description">${esc(service.description)}</span><span class="booking-service-selected" aria-hidden="true">${S.icon('check')}</span></label>`).join('')}</fieldset><div class="booking-actions"><a href="nail-design.html" class="text-link">Ver os serviços</a><button type="button" class="btn" id="booking-next" ${state.service ? '' : 'disabled'}>Escolher data e horário</button></div>`;
    workspace.querySelectorAll('input[name=service]').forEach(input => input.addEventListener('change', () => {
      state.service = services.find(service => service.id === input.value);
      state.date = ''; state.time = '';
      document.getElementById('booking-next').disabled = false;
      renderSummary();
      announce(`${state.service.name} selecionado. Duração demonstrativa de ${durationLabel(state.service.duration)}.`);
    }));
    document.getElementById('booking-next').addEventListener('click', () => goStep(2));
  }
  function calendarMarkup() {
    const monthStart = utcDate(`${state.month}-01`);
    const month = monthStart.getUTCMonth();
    const year = monthStart.getUTCFullYear();
    const lastDate = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const offset = (monthStart.getUTCDay() + 6) % 7;
    const today = todayKey();
    const lastMonth = addDays(today, schedule.horizonDays).slice(0, 7);
    let days = '<span aria-hidden="true"></span>'.repeat(offset);
    for (let day = 1; day <= lastDate; day++) {
      const date = `${state.month}-${String(day).padStart(2, '0')}`;
      const available = availableSlots(date, state.service).length > 0;
      days += `<button type="button" data-date="${date}" aria-label="${esc(fullDateFormatter.format(utcDate(date)))}${available ? '' : ', indisponível'}" aria-pressed="${state.date === date}" ${date === today ? 'aria-current="date"' : ''} ${available ? '' : 'disabled'}>${day}</button>`;
    }
    return `<div class="calendar-toolbar"><button type="button" data-month="-1" aria-label="Mês anterior" ${state.month <= today.slice(0, 7) ? 'disabled' : ''}>${S.icon('chevron-left')}</button><h3 id="calendar-month" aria-live="polite">${esc(monthFormatter.format(monthStart))}</h3><button type="button" data-month="1" aria-label="Próximo mês" ${state.month >= lastMonth ? 'disabled' : ''}>${S.icon('chevron-right')}</button></div><div class="calendar-weekdays" aria-hidden="true">${['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => `<span>${day}</span>`).join('')}</div><div class="calendar-days" role="group" aria-labelledby="calendar-month">${days}</div>`;
  }
  function bindCalendar() {
    workspace.querySelectorAll('[data-month]').forEach(button => button.addEventListener('click', () => {
      const direction = Number(button.dataset.month);
      const date = utcDate(`${state.month}-01`);
      date.setUTCMonth(date.getUTCMonth() + direction);
      state.month = dateKey(date).slice(0, 7);
      renderCalendar();
      const replacement = workspace.querySelector(`[data-month="${direction}"]`);
      if (replacement && !replacement.disabled) replacement.focus();
      else workspace.querySelector(`[data-month="${-direction}"]`).focus();
    }));
    workspace.querySelectorAll('[data-date]:not(:disabled)').forEach(button => button.addEventListener('click', () => {
      state.date = button.dataset.date; state.time = '';
      workspace.querySelectorAll('[data-date]').forEach(day => day.setAttribute('aria-pressed', String(day.dataset.date === state.date)));
      renderTimes(); renderSummary(); updateNext();
      announce(`${dateFormatter.format(utcDate(state.date))}. Escolha um horário demonstrativo.`);
    }));
    workspace.querySelector('.calendar-days').addEventListener('keydown', event => {
      const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[event.key];
      if (!delta || !event.target.dataset.date) return;
      event.preventDefault();
      let key = event.target.dataset.date;
      for (let count = 0; count < 32; count++) {
        key = addDays(key, delta);
        const button = workspace.querySelector(`[data-date="${key}"]`);
        if (!button) break;
        if (!button.disabled) { button.focus(); break; }
      }
    });
  }
  function renderCalendar() { document.getElementById('booking-calendar').innerHTML = calendarMarkup(); bindCalendar(); }
  function updateNext() { document.getElementById('booking-next').disabled = !state.date || !state.time; }
  function renderTimes() {
    const times = document.getElementById('booking-times');
    if (!state.date) {
      times.innerHTML = `<p class="booking-step-description">Selecione uma data para ver os horários.</p>`;
      return;
    }
    const slots = availableSlots(state.date, state.service);
    if (!slots.length) {
      state.time = '';
      times.innerHTML = `<div class="booking-availability"><p>Não há horários para este serviço nesta data.</p><button type="button" class="text-link" id="booking-find-date">Ver próxima data disponível</button></div>`;
      document.getElementById('booking-find-date').addEventListener('click', findNextDate);
      updateNext();
      return;
    }
    times.innerHTML = `<h3>Horários para ${esc(new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', day: 'numeric', month: 'long' }).format(utcDate(state.date)))}</h3><div class="booking-time-grid" role="group" aria-label="Escolha um horário demonstrativo">${slots.map(time => `<button type="button" data-time="${time}" aria-pressed="${state.time === time}">${time}</button>`).join('')}</div><p class="calendar-footnote">Horário de Brasília. Disponibilidade de demonstração.</p>`;
    times.querySelectorAll('[data-time]').forEach(button => button.addEventListener('click', () => {
      state.time = button.dataset.time;
      times.querySelectorAll('[data-time]').forEach(time => time.setAttribute('aria-pressed', String(time.dataset.time === state.time)));
      renderSummary(); updateNext();
      announce(`Horário ${state.time} selecionado. Continue para revisar sua escolha.`);
    }));
  }
  function findNextDate() {
    const date = earliestAvailable();
    if (!date) return;
    state.date = date; state.time = ''; state.month = date.slice(0, 7);
    renderCalendar(); renderTimes(); renderSummary(); updateNext();
    workspace.querySelector(`[data-date="${date}"]`).focus();
  }
  function renderDateStep() {
    const hasAnyDate = Boolean(earliestAvailable());
    workspace.innerHTML = `<h2>Quando é o seu momento?</h2><p class="booking-step-description">Escolha uma data e um horário para ${esc(state.service.name.toLowerCase())}. Duração estimada: ${durationLabel(state.service.duration)}.</p>${hasAnyDate ? '' : '<div class="booking-availability"><p>Não há horários demonstrativos para este serviço no período disponível.</p><button type="button" class="text-link" data-edit-service>Escolher outro serviço</button></div>'}<div class="booking-calendar" id="booking-calendar"></div><p class="calendar-footnote">Datas indisponíveis aparecem desabilitadas. Antecedência mínima: ${schedule.leadHours}h.</p><div class="booking-times" id="booking-times"></div><div class="booking-actions"><button type="button" class="btn btn-outline" id="booking-back">Voltar</button><button type="button" class="btn" id="booking-next" ${state.time && state.date ? '' : 'disabled'}>Revisar agendamento</button></div>`;
    renderCalendar(); renderTimes();
    document.getElementById('booking-back').addEventListener('click', () => goStep(1));
    document.getElementById('booking-next').addEventListener('click', () => goStep(3));
    const edit = workspace.querySelector('[data-edit-service]'); if (edit) edit.addEventListener('click', () => goStep(1));
  }
  function renderReviewStep() {
    workspace.innerHTML = `<h2>Vamos conferir?</h2><p class="booking-step-description">Revise sua escolha antes de concluir a simulação.</p><dl class="booking-review-list"><div><dt>Seu cuidado</dt><dd>${esc(state.service.name)}</dd><button type="button" class="text-link" data-edit="1">Alterar serviço</button></div><div><dt>Data e horário</dt><dd>${esc(fullDateFormatter.format(utcDate(state.date)))}<br>Às ${state.time} · ${durationLabel(state.service.duration)}</dd><button type="button" class="text-link" data-edit="2">Alterar data</button></div></dl><p class="booking-consent">Ao concluir, você verá apenas uma confirmação demonstrativa. Nenhum horário será bloqueado e nenhum dado será enviado à profissional.</p><div class="booking-actions"><button type="button" class="btn btn-outline" id="booking-back">Voltar</button><button type="button" class="btn" id="booking-confirm">Concluir simulação</button></div>`;
    workspace.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => goStep(Number(button.dataset.edit))));
    document.getElementById('booking-back').addEventListener('click', () => goStep(2));
    document.getElementById('booking-confirm').addEventListener('click', () => {
      if (!availableSlots(state.date, state.service).includes(state.time)) {
        state.time = ''; goStep(2);
        S.toast('Este horário não está mais no período da demonstração. Escolha outro horário.');
        return;
      }
      state.confirmed = true;
      render(); focusHeading();
      announcement.textContent = 'Simulação concluída. Nenhum horário real foi reservado.';
    });
  }
  function bookingMessage() {
    return `Olá! Gostaria de conversar sobre um atendimento de Nail Design no Studio Milana Pirre.\nServiço: ${state.service.name}\nData desejada: ${dateFormatter.format(utcDate(state.date))}\nHorário desejado: ${state.time} (Brasília)\nDuração ilustrativa: ${durationLabel(state.service.duration)}\n\nSeleção feita em uma agenda demonstrativa. Poderiam confirmar a disponibilidade real e o valor?`;
  }
  function renderConfirmation() {
    workspace.innerHTML = `<section class="booking-confirmation"><div class="booking-success-mark" aria-hidden="true">${S.icon('check')}</div><h2>Seu momento,<br>imaginado nos detalhes.</h2><p>Simulação concluída. Esta é uma prévia da experiência de agendamento: nenhum horário real foi reservado.</p><dl><div><dt>Serviço</dt><dd>${esc(state.service.name)}</dd></div><div><dt>Data</dt><dd>${esc(dateFormatter.format(utcDate(state.date)))}</dd></div><div><dt>Horário</dt><dd>${state.time} · Brasília</dd></div><div><dt>Duração estimada</dt><dd>${durationLabel(state.service.duration)}</dd></div></dl><p>Você pode preparar uma mensagem com sua escolha. A disponibilidade e o valor precisam ser confirmados com a profissional.</p><div class="booking-confirmation-actions"><button type="button" class="btn" id="booking-whatsapp">Conversar pelo WhatsApp</button><button type="button" class="text-link" id="booking-restart">Fazer outra simulação</button><a class="text-link" href="nail-design.html">Voltar ao Nail Design</a></div></section>`;
    document.getElementById('booking-whatsapp').addEventListener('click', () => S.contact('whatsapp', bookingMessage()));
    document.getElementById('booking-restart').addEventListener('click', () => {
      state.step = 1; state.service = null; state.date = ''; state.time = ''; state.confirmed = false; state.month = todayKey().slice(0, 7);
      render(); focusHeading();
    });
  }
  function render() {
    document.getElementById('booking-layout').classList.toggle('is-confirmed', state.confirmed);
    renderProgress(); renderSummary();
    if (state.confirmed) renderConfirmation();
    else if (state.step === 1) renderServiceStep();
    else if (state.step === 2) renderDateStep();
    else renderReviewStep();
  }
  if (state.service) state.month = (earliestAvailable() || todayKey()).slice(0, 7);
  render();
}());

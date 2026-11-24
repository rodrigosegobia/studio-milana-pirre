/* Edite apenas dados confirmados pelo cliente. Nenhum contato fictício é utilizado. */
window.STUDIO_CONFIG = {
  name: 'Studio Milana Pirre',
  whatsapp: '', // DDI + DDD + número, somente dígitos. Ex.: informe o contato real.
  instagram: '', // URL oficial completa, quando confirmada.
  timezone: 'America/Sao_Paulo',
  demo: true,
  schedule: {
    weekdays: [1, 2, 3, 4, 5, 6],
    open: '09:00', close: '18:00', slotMinutes: 30,
    breaks: [{ start: '12:00', end: '13:00' }],
    daysOff: [], blockedSlots: [], leadHours: 24, horizonDays: 60,
    cancellation: { enabled: false, minimumHours: 24 },
    rescheduling: { enabled: false, minimumHours: 24 }
  },
  integrations: { catalog: null, payments: null, orders: null, calendar: null }
};

import { timeLabel, temp } from './weather.js';

const $ = id => document.getElementById(id);
const activityInfo = {
  walk: { name: 'Спокойная прогулка', level: 1, pace: 'slow', legacy: 'walk' },
  run: { name: 'Пробежка', level: 5, pace: 'fast', legacy: 'run' },
  bike: { name: 'Велопрогулка', level: 4, pace: 'fast', legacy: 'brisk' },
  pet: { name: 'Прогулка с питомцем', level: 1, pace: 'slow', legacy: 'walk' },
  training: { name: 'Тренировка на улице', level: 5, pace: 'fast', legacy: 'run' },
  long: { name: 'Долгий маршрут', level: 2, pace: 'medium', legacy: 'brisk' }
};
let selectedActivity = 'walk';
let forecast = null;
let selectedDuration = 1;
let selectedClock = null;

function localClock(epoch, zone) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(epoch * 1000));
}
function fillTimes() {
  const select = $('planDeparture');
  if (!select || select.options.length) return;
  for (let m = 0; m < 1440; m += 30) {
    const h = String(Math.floor(m / 60)).padStart(2, '0');
    const min = String(m % 60).padStart(2, '0');
    select.add(new Option(`${h}:${min}`, `${h}:${min}`));
  }
}
function findHour(clock) {
  if (!forecast?.hours?.length) return null;
  const target = Number(clock.slice(0, 2)) * 60 + Number(clock.slice(3));
  return forecast.hours.reduce((best, hour) => {
    const [h, m] = localClock(hour.time, forecast.timezone).split(':').map(Number);
    const diff = Math.min(Math.abs(h * 60 + m - target), 1440 - Math.abs(h * 60 + m - target));
    return !best || diff < best.diff ? { hour, diff } : best;
  }, null)?.hour || null;
}
function syncLegacy() {
  if (!forecast) return;
  const hour = findHour(selectedClock || localClock(forecast.hours[0]?.time || Date.now()/1000, forecast.timezone));
  if (hour) {
    $('departure').value = String(hour.now ? 'now' : hour.time);
    $('departure').dispatchEvent(new Event('change', { bubbles: true }));
  }
  const durationValue = selectedDuration >= 24 ? 24 : selectedDuration;
  const standard = ['0.5', '1', '2'].includes(String(durationValue));
  $('duration').value = standard ? String(durationValue) : 'custom';
  if (!standard) {
    $('customDuration').value = String(durationValue);
    $('customDurationLabel').hidden = false;
  }
  $('duration').dispatchEvent(new Event('change', { bubbles: true }));
  const legacyActivity = activityInfo[selectedActivity].legacy;
  $('activity').value = legacyActivity;
  $('activity').dispatchEvent(new Event('change', { bubbles: true }));
}
function intervalText() {
  if (!selectedClock) return 'Выберите время';
  const [h, m] = selectedClock.split(':').map(Number);
  const start = h * 60 + m;
  const end = (start + selectedDuration * 60) % 1440;
  const fmt = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
  return `${fmt(start)} — ${fmt(end)}${selectedDuration >= 24 ? ' · весь день' : ''}`;
}
function updateThermal(weather) {
  if (!weather) return;
  const info = activityInfo[selectedActivity];
  const feels = Number(weather.feels) || 0;
  const activeFeels = feels + info.level * 1.35;
  const marker = Math.max(3, Math.min(97, (activeFeels + 10) / 45 * 100));
  $('thermalMarker').style.left = `${marker}%`;
  let feeling = activeFeels < 3 ? 'Прохладно даже в движении' : activeFeels < 12 ? 'Ощущается свежо' : activeFeels < 22 ? 'Комфортно для активности' : 'Быстро станет тепло';
  $('thermalFeeling').textContent = feeling;
  const wet = weather.prob >= 45 || weather.precip > .2 || [51,53,55,61,63,65,80,81,82,95,96,99].includes(weather.code);
  const windy = weather.wind >= 7;
  const cold = feels < 12;
  const hotActivity = info.level >= 4;
  const layers = {
    base: { needed: true, hint: 'Дышащая футболка или функциональный базовый слой' },
    mid: { needed: cold && !hotActivity, hint: cold ? 'Добавьте тонкий утепляющий слой' : 'Для активного темпа обычно достаточно базового слоя' },
    shell: { needed: wet || windy || feels < 5, hint: wet ? 'Выберите защиту от дождя' : windy ? 'Лёгкая ветровка защитит от порывов' : 'Защитный слой пригодится в холод' }
  };
  document.querySelectorAll('.layer-card').forEach(card => {
    const item = layers[card.dataset.layer];
    card.classList.toggle('is-needed', item.needed);
    card.classList.toggle('is-extra', !item.needed);
    card.querySelector('b').textContent = item.needed ? 'НУЖЕН' : 'ЛИШНИЙ';
    card.querySelector('small').textContent = item.hint;
  });
  $('thermalAdvice').textContent = `${feeling}. ${wet ? 'Учитывайте осадки: верхний слой должен защищать от влаги.' : windy ? 'На открытом маршруте пригодится защита от ветра.' : 'Ориентируйтесь на комфорт и возможность снять один слой.'}`;
}
function updateCore() {
  const info = activityInfo[selectedActivity];
  $('coreActivity').textContent = info.name;
  $('coreInterval').textContent = intervalText();
  $('orbitCore').style.setProperty('--pulse-speed', info.pace === 'fast' ? '1.15s' : info.pace === 'medium' ? '2s' : '3s');
  document.querySelectorAll('.orbit-item').forEach(b => {
    const active = b.dataset.activity === selectedActivity;
    b.classList.toggle('is-active', active);
    b.setAttribute('aria-pressed', String(active));
  });
  updateThermal(forecast?.hours?.find(x => localClock(x.time, forecast.timezone) === selectedClock) || forecast?.hours?.[0]);
}
fillTimes();
$('planDeparture')?.addEventListener('change', e => { selectedClock = e.target.value; syncLegacy(); updateCore(); });
$('planDuration')?.addEventListener('change', e => { selectedDuration = Number(e.target.value); syncLegacy(); updateCore(); });
document.querySelectorAll('.orbit-item').forEach(button => button.addEventListener('click', () => {
  selectedActivity = button.dataset.activity;
  updateCore(); syncLegacy();
}));
$('sensitivity')?.addEventListener('change', () => { syncLegacy(); updateCore(); });
window.addEventListener('pp-forecast-rendered', e => {
  forecast = e.detail;
  const first = forecast.hours?.[0];
  if (!first) return;
  if (!selectedClock) selectedClock = localClock(first.time, forecast.timezone);
  $('planDeparture').value = selectedClock;
  updateCore();
});
window.addEventListener('pp-weather-update', e => {
  if (!forecast) forecast = { hours: [e.detail.weather], timezone: e.detail.timezone };
  updateThermal(e.detail.weather);
});

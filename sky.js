// Живое небо для «По погоде»: время суток, светило, погодные эффекты, 3D-наклон карточек.
// app.js передаёт сюда время восхода/заката и текущую погоду через window.PPSky.update().
const body = document.body;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const state = { sun: null, kind: 'sun', wind: 0, selectedTime: null, timezone: 'UTC' };
const rnd = (a, b) => a + Math.random() * (b - a);

function el(cls, tag = 'div') {
  const node = document.createElement(tag);
  node.className = cls;
  node.setAttribute('aria-hidden', 'true');
  return node;
}

function group(cls, count, make) {
  const g = el(cls);
  if (!reduceMotion) for (let i = 0; i < count; i++) g.append(make());
  return g;
}

// Снежинка: падает, покачивается, часть размыта для глубины
function flake() {
  const f = el('flake');
  const s = rnd(3, 8);
  f.style.left = rnd(0, 100) + '%';
  f.style.width = s + 'px';
  f.style.height = s + 'px';
  f.style.animationDuration = rnd(10, 20) + 's';
  f.style.animationDelay = rnd(-20, 0) + 's';
  if (Math.random() < 0.35) f.classList.add('soft');
  const core = el('flake-core', 'i');
  core.style.animationDuration = rnd(3, 6) + 's';
  f.append(core);
  return f;
}

// Капля дождя: косая, быстрая, с разной прозрачностью
function drop() {
  const d = el('drop');
  d.style.left = rnd(-10, 110) + '%';
  d.style.animationDuration = rnd(0.8, 1.5) + 's';
  d.style.animationDelay = rnd(-2, 0) + 's';
  d.style.opacity = rnd(0.3, 0.75).toFixed(2);
  return d;
}

// Порыв ветра: тонкая полоса, пролетает по диагонали
function gust() {
  const g = el('gust');
  g.style.top = rnd(4, 92) + '%';
  g.style.width = rnd(120, 340) + 'px';
  g.style.animationDuration = rnd(3, 6) + 's';
  g.style.animationDelay = rnd(-6, 0) + 's';
  return g;
}

// Слои фона
const sky = el('sky');
sky.append(el('horizon-light'), el('celestial-body'), el('moon'));
const fluted = el('fluted');
const grain = el('grain');
const fx = el('weather-fx');
fx.append(group('fx-snow', 38, flake), group('fx-rain', 45, drop), group('fx-wind', 15, gust));
body.prepend(sky, fluted, fx, grain);

// Фаза суток: по восходу и закату, если они известны, иначе по часам
function currentPhase(now = Date.now()) {
  const selected = state.selectedTime ? state.selectedTime * 1000 : now;
  const s = state.sun;
  if (!s || !Number.isFinite(s.sunrise) || !Number.isFinite(s.sunset)) {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: state.timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(selected));
    const h = Number(parts.find(x => x.type === 'hour')?.value || 0) + Number(parts.find(x => x.type === 'minute')?.value || 0) / 60;
    if (h >= 5 && h < 9) return 'dawn';
    if (h >= 9 && h < 17) return 'day';
    if (h >= 17 && h < 21) return 'sunset';
    return 'night';
  }
  const t = selected / 1000;
  if (t >= s.sunrise - 2700 && t < s.sunrise + 7200) return 'dawn';
  if (t >= s.sunset - 3600 && t < s.sunset + 2700) return 'sunset';
  if (t >= s.sunrise + 7200 && t < s.sunset - 3600) return 'day';
  return 'night';
}

// Погода: из кода Open-Meteo (через kind) или ветра
function currentWeather() {
  if (state.kind === 'snow') return 'snow';
  if (state.kind === 'rain' || state.kind === 'storm') return 'rain';
  if (state.wind >= 7) return 'wind';
  return 'clear';
}

function apply() {
  body.dataset.time = currentPhase();
  body.dataset.weather = currentWeather();
}

// 3D-наклон карточек и блик за курсором (только мышь, не на сенсорном экране)
if (!reduceMotion) {
  document.querySelectorAll('.weather-side, .outfit-side, .walk-section, .forecast-section').forEach((card) => {
    card.classList.add('tilt');
    card.append(el('glint'));
    card.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mouse-x', (x * 100).toFixed(1) + '%');
      card.style.setProperty('--mouse-y', (y * 100).toFixed(1) + '%');
      const rx = Math.max(-7, Math.min(7, (0.5 - y) * 14));
      const ry = Math.max(-7, Math.min(7, (x - 0.5) * 14));
      card.style.transform = `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      card.classList.add('moving');
    });
    const reset = () => {
      card.style.transform = '';
      card.classList.remove('moving');
    };
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
  });
}

// Пульсирующая точка рядом со временем обновления
const updated = document.getElementById('updated');
if (updated) updated.before(el('live-dot'));

window.PPSky = {
  update(o) {
    if ('sun' in o) state.sun = o.sun;
    if ('kind' in o) state.kind = o.kind;
    if ('wind' in o) state.wind = o.wind;
    if ('time' in o) state.selectedTime = o.time;
    if ('timezone' in o) state.timezone = o.timezone;
    apply();
  },
};

apply();
setInterval(apply, 60 * 1000);

import {temp,description,outfitFor,normalize,timeLabel,walkWeather,kind} from './weather.js';
import {weatherIcon,garmentArt,sceneArt} from './fashion.js';
const $=id=>document.getElementById(id);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
const cities={moscow:{name:'Москва',latitude:55.7522,longitude:37.6156},spb:{name:'Санкт-Петербург',latitude:59.9386,longitude:30.3141},kazan:{name:'Казань',latitude:55.7887,longitude:49.1221},makhachkala:{name:'Махачкала',latitude:42.9764,longitude:47.5024}};
let city=read('pp-city',cities.moscow),data=null,stale=false,request=0,searchRequest=0,searchAbort;
let prefs={duration:1,activity:'walk',sensitivity:'normal',motion:true,...read('pp-prefs',{})};
let departure='now';
let currentLook=null;
const saveLook=document.createElement('button');
saveLook.className='save-look';saveLook.type='button';saveLook.disabled=true;
saveLook.textContent='Сохранить образ ♡';saveLook.setAttribute('aria-pressed','false');
document.querySelector('.outfit-side').append(saveLook);
saveLook.onclick=()=>{if(!currentLook)return;try{localStorage.setItem('pp-saved-look',JSON.stringify(currentLook));saveLook.textContent='Образ сохранён ♥';saveLook.setAttribute('aria-pressed','true');}catch{saveLook.textContent='Не удалось сохранить в браузере';}};
if(!Number.isFinite(city.latitude)||!Number.isFinite(city.longitude))city=cities.moscow;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key=c=>`pp-weather:${c.latitude.toFixed(3)},${c.longitude.toFixed(3)}`;
const message=(text,retry=false)=>{$('notice').hidden=!text;$('notice').textContent=text;if(retry){const b=document.createElement('button');b.textContent='Повторить';b.onclick=()=>loadWeather();$('notice').append(b);}};
function hoursAvailable(){return data?data.hourly.filter(x=>x.time>=data.current.time&&x.time<data.current.time+24*3600):[];}
function setupDeparture(){const options=hoursAvailable();if(departure!=='now'&&!options.some(h=>String(h.time)===String(departure)))departure='now';$('departure').innerHTML='<option value="now">Сейчас</option>'+options.map(h=>`<option value="${h.time}">${timeLabel(h.time,data.timezone,true)}</option>`).join('');$('departure').value=departure;}
function render(){
 if(!data)return;
 const {weather:w,future}=walkWeather(data,departure,prefs.duration),o=outfitFor(w,future,prefs);window.PPSky?.update({sun:data.sun,kind:kind(w.code),wind:w.wind,time:w.time,timezone:data.timezone});
 window.dispatchEvent(new CustomEvent('pp-weather-update',{detail:{weather:w,timezone:data.timezone,duration:prefs.duration,activity:prefs.activity,sensitivity:prefs.sensitivity}}));
 currentLook={city:city.name,items:o.items,take:o.take,time:w.time};
 const savedLook=read('pp-saved-look',null),sameLook=JSON.stringify(savedLook?.items)===JSON.stringify(o.items);
 saveLook.disabled=false;saveLook.textContent=sameLook?'Образ сохранён ♥':'Сохранить образ ♡';saveLook.setAttribute('aria-pressed',String(sameLook));
 $('cityName').textContent=city.name;
 $('dateLabel').textContent=new Intl.DateTimeFormat('ru-RU',{timeZone:data.timezone,weekday:'long',day:'numeric',month:'long'}).format(new Date(w.time*1000));
 $('periodLabel').textContent=departure==='now'?'Сейчас на улице':`На улице в ${timeLabel(w.time,data.timezone,true)}`;
 $('temperature').textContent=temp(w.temperature);$('feels').textContent=temp(w.feels);$('weatherText').textContent=description(w.code);
 $('weatherIcon').innerHTML=weatherIcon(w.code,w.day);$('wind').textContent=`${Math.round(w.wind)} м/с`;$('rain').textContent=`${Math.round(w.prob)}%`;
 $('scene').innerHTML=sceneArt(w,o);$('scene').setAttribute('aria-label',`${description(w.code)}, ${temp(w.temperature)}. Рекомендованный образ: ${o.items.map(x=>x.name.toLowerCase()).join(', ')}.`);
 $('sceneCaption').textContent=w.day?'Ваш образ для сегодняшней погоды':'Ваш образ для вечерней прогулки';
 $('outfitFor').textContent=prefs.activity==='run'?'Для пробежки':prefs.activity==='brisk'?'Для быстрого шага':'Для прогулки';
 $('advice').textContent=o.advice;
 document.querySelector('h1').textContent=o.storm?'Лучше переждать грозу.':'Погода в вашем стиле.';
 $('garments').innerHTML=o.items.map(x=>`<article class="garment"><div class="garment-art">${garmentArt(x.type)}</div><div><h3>${esc(x.name)}</h3><p>${esc(x.reason)}</p></div></article>`).join('');
 $('takeAlong').innerHTML=o.take.length?`<div class="take-items">${o.take.map(x=>`<div class="take-item">${garmentArt(x.type)}<div>${esc(x.name)}<small>${esc(x.reason)}</small></div></div>`).join('')}</div>`:'Ничего дополнительного — можно идти налегке.';
 const hours=[{...data.current,now:true},...hoursAvailable()].slice(0,24);
 const scroll=$('hourly').scrollLeft;
 $('hourly').innerHTML=hours.map(h=>`<button class="hour" data-time="${h.now?'now':h.time}" aria-pressed="${h.now?departure==='now':String(departure)===String(h.time)}" aria-label="${h.now?'Сейчас':timeLabel(h.time,data.timezone,true)}, ${temp(h.temperature)}, ${description(h.code)}, вероятность осадков ${h.prob}%"><span>${h.now?'Сейчас':timeLabel(h.time,data.timezone)}</span>${weatherIcon(h.code,h.day)}<strong>${temp(h.temperature)}</strong><small>${Math.round(h.prob)}% осадков</small></button>`).join('');
 $('hourly').scrollLeft=scroll;
 window.dispatchEvent(new CustomEvent('pp-forecast-rendered',{detail:{hours,departure,timezone:data.timezone}}));
 const end=w.time+prefs.duration*3600;
 const drop=o.low<=w.feels-4?` К концу прогулки может похолодать до ${temp(o.low)} по ощущениям.`:'';
 $('walkSummary').textContent=`До ${timeLabel(end,data.timezone)}: по ощущениям ${temp(o.low)}${o.high-o.low>=1?`…${temp(o.high)}`:''}. ${o.wet?'Ожидаются осадки.':o.snowy?'Возможен снег.':'Существенных осадков не ожидается.'}${drop}${o.windy?' Выбирайте верх с защитой от ветра.':''}`;
 $('updated').textContent=`${stale?'Сохранено':'Обновлено'} ${timeLabel(data.fetchedAt/1000,data.timezone,stale)}`;
}
async function fetchJSON(url,signal){const r=await fetch(url,{signal:signal||AbortSignal.timeout(15000)});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();}
async function loadWeather(nextCity=city){
 const id=++request;const switching=nextCity.latitude!==city.latitude||nextCity.longitude!==city.longitude;
 if(switching){data=null;departure='now';currentLook=null;saveLook.disabled=true;}
 city=nextCity;$('cityName').textContent=city.name;$('refresh').disabled=true;
 if(!data){data=read(key(city),null);if(data&&(!data.current||!Array.isArray(data.hourly)))data=null;if(data){stale=true;setupDeparture();render();}else resetWeather();}
 message('Обновляем прогноз…');
 try{
 const params=new URLSearchParams({latitude:city.latitude,longitude:city.longitude,current:'temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day',hourly:'temperature_2m,apparent_temperature,precipitation,precipitation_probability,weather_code,wind_speed_10m,is_day',wind_speed_unit:'ms',timezone:'auto',timeformat:'unixtime',forecast_days:'3',daily:'sunrise,sunset'});
 const raw=await fetchJSON(`https://api.open-meteo.com/v1/forecast?${params}`);
 if(id!==request)return;
 data=normalize(raw);data.sun={sunrise:raw.daily?.sunrise?.[0],sunset:raw.daily?.sunset?.[0]};stale=false;save(key(city),data);save('pp-city',city);message('');setupDeparture();render();
 }catch(error){if(id!==request)return;stale=Boolean(data);message(data?'Не удалось обновить погоду. Показан сохранённый прогноз — проверьте время обновления.':'Не удалось загрузить погоду. Проверьте интернет или выберите другой город.',true);if(data)render();else{$('weatherText').textContent='Прогноз пока недоступен';$('garments').innerHTML='<div class="loading-outfit">Для подбора одежды нужен прогноз. Попробуйте обновить страницу или сменить город.</div>';$('updated').textContent='Нет погодных данных';}}
 finally{if(id===request)$('refresh').disabled=false;}
}
function resetWeather(){for(const id of ['temperature','feels','wind','rain'])$(id).textContent='—';$('weatherText').textContent='Узнаём погоду…';$('weatherIcon').innerHTML='';$('scene').innerHTML='';$('scene').setAttribute('aria-label','Ожидаем прогноз');$('hourly').innerHTML='';$('dateLabel').textContent='';$('departure').innerHTML='<option value="now">Сейчас</option>';$('advice').textContent='Собираем комплект с учётом температуры, ветра и осадков.';$('garments').innerHTML='<div class="loading-outfit">Немного терпения — смотрим прогноз.</div>';$('takeAlong').textContent='Здесь появятся полезные мелочи для прогулки.';$('walkSummary').textContent='';$('updated').textContent='Данные загружаются';}
function updatePrefs(){const choice=$('duration').value;$('customDurationLabel').hidden=choice!=='custom';const n=Number($('customDuration').value);prefs.duration=choice==='custom'?Math.min(24,Math.max(.5,Number.isFinite(n)?n:3)):Number(choice);prefs.activity=$('activity').value;prefs.sensitivity=$('sensitivity').value;save('pp-prefs',prefs);render();}
for(const id of ['duration','customDuration','activity','sensitivity'])$(id).addEventListener('change',updatePrefs);
for(const id of ['activity','sensitivity'])$(id).value=prefs[id];
if([.5,1,2].includes(prefs.duration))$('duration').value=String(prefs.duration);else{$('duration').value='custom';$('customDuration').value=prefs.duration;$('customDurationLabel').hidden=false;}
$('departure').onchange=()=>{departure=$('departure').value;render();};
$('hourly').onclick=e=>{const b=e.target.closest('[data-time]');if(!b)return;departure=b.dataset.time;$('departure').value=departure;render();};
$('hourPrev').onclick=()=> $('hourly').scrollBy({left:-360,behavior:'smooth'});
$('hourNext').onclick=()=> $('hourly').scrollBy({left:360,behavior:'smooth'});
$('refresh').onclick=()=>loadWeather();
$('cityButton').onclick=()=>{$('cityDialog').showModal();$('citySearch').focus();};
$('closeCity').onclick=()=>{$('cityDialog').close();searchAbort?.abort();searchRequest++;};
$('cityDialog').addEventListener('click',e=>{if(e.target===$('cityDialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
function choose(c){searchAbort?.abort();searchRequest++;$('cityDialog').close();$('searchResults').textContent='';loadWeather(c);}
document.querySelectorAll('[data-city]').forEach(b=>b.onclick=()=>choose(cities[b.dataset.city]));
async function searchCity(){const q=$('citySearch').value.trim();if(q.length<2)return;searchAbort?.abort();searchAbort=new AbortController();const id=++searchRequest;$('searchResults').textContent='Ищем город…';try{const result=await fetchJSON(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=7&language=ru&format=json`,AbortSignal.any([searchAbort.signal,AbortSignal.timeout(12000)]));if(id!==searchRequest)return;$('searchResults').replaceChildren();if(!result.results?.length){$('searchResults').textContent='Город не найден. Проверьте название или добавьте страну через запятую.';return;}for(const c of result.results){const b=document.createElement('button');b.type='button';b.className='search-result';b.textContent=c.name;const detail=document.createElement('small');detail.textContent=[c.admin1,c.country].filter(Boolean).join(', ');b.append(detail);b.onclick=()=>choose({name:c.name,latitude:c.latitude,longitude:c.longitude});$('searchResults').append(b);}}catch(e){if(id===searchRequest&&e.name!=='AbortError')$('searchResults').textContent='Поиск недоступен. Попробуйте ещё раз или выберите город ниже.';}}
$('cityForm').onsubmit=e=>{e.preventDefault();searchCity();};
$('citySearch').oninput=()=>{searchAbort?.abort();searchRequest++;$('searchResults').textContent='';};
$('locate').onclick=()=>{if(!navigator.geolocation){$('searchResults').textContent='Геолокация недоступна. Введите город вручную.';return;}$('locate').disabled=true;$('searchResults').textContent='Определяем местоположение…';navigator.geolocation.getCurrentPosition(p=>{$('locate').disabled=false;choose({name:'Моё местоположение',latitude:p.coords.latitude,longitude:p.coords.longitude});},()=>{$('locate').disabled=false;$('searchResults').textContent='Не удалось определить местоположение. Разрешите доступ или выберите город вручную.';},{timeout:12000,maximumAge:300000});};
setInterval(()=>{if(!document.hidden)loadWeather();},15*60*1000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&(!data||Date.now()-data.fetchedAt>15*60*1000))loadWeather();});
loadWeather();

const litPanels = document.querySelectorAll('.weather-side, .outfit-side, .walk-section, .forecast-section');
for (const panel of litPanels) {
  panel.classList.add('cursor-panel');
  panel.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const bounds = panel.getBoundingClientRect();
    panel.style.setProperty('--light-x', (event.clientX - bounds.left) + 'px');
    panel.style.setProperty('--light-y', (event.clientY - bounds.top) + 'px');
    panel.classList.add('cursor-lit');
  });
  const fadeLight = () => panel.classList.remove('cursor-lit');
  panel.addEventListener('pointerleave', fadeLight);
  panel.addEventListener('pointercancel', fadeLight);
}

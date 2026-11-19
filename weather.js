export const temp = n => Number.isFinite(n) ? `${Math.round(n)>0?'+':''}${Math.round(n)}°` : '—';
export function kind(code){if(code>=95)return 'storm';if([71,73,75,77,85,86].includes(code))return 'snow';if(code>=51)return 'rain';if(code>=45)return 'fog';if(code>=2)return 'cloud';return 'sun';}
export function description(code){return ({0:'Ясно',1:'Преимущественно ясно',2:'Переменная облачность',3:'Пасмурно',45:'Туман',48:'Изморозь',51:'Лёгкая морось',53:'Морось',55:'Сильная морось',56:'Ледяная морось',57:'Ледяная морось',61:'Небольшой дождь',63:'Дождь',65:'Сильный дождь',66:'Ледяной дождь',67:'Ледяной дождь',71:'Небольшой снег',73:'Снег',75:'Сильный снег',77:'Снежная крупа',80:'Небольшой ливень',81:'Ливень',82:'Сильный ливень',85:'Снегопад',86:'Сильный снегопад',95:'Гроза',96:'Гроза с градом',99:'Гроза с градом'})[code]||'Переменная облачность';}
export function outfitFor(weather, future=[], prefs={}){
 const hours=[weather,...future];
 const low=Math.min(...hours.map(x=>x.feels));
 const high=Math.max(...hours.map(x=>x.feels));
 const effective=weather.feels+(prefs.sensitivity==='cold'?-3:prefs.sensitivity==='warm'?3:0)+(prefs.activity==='run'?7:prefs.activity==='brisk'?3:0);
 const band=effective>=25?0:effective>=18?1:effective>=10?2:effective>=3?3:effective>=-5?4:5;
 const wet=hours.some(x=>['rain','storm'].includes(kind(x.code))||x.precip>0.2||x.prob>=50);
 const snowy=hours.some(x=>kind(x.code)==='snow');
 const windy=hours.some(x=>x.wind>=7);
 const storm=hours.some(x=>kind(x.code)==='storm');
 const items=[];const take=[];
 const add=(type,name,reason)=>items.push({type,name,reason});
 const runner=prefs.activity==='run';
 if(band===0)add('tee',runner?'Лёгкая спортивная футболка':'Лёгкая футболка','Дышащая ткань, свободная посадка');
 else if(band===1)add('tee',runner?'Спортивная футболка':'Футболка или лонгслив','Лёгкий слой для комфортной прогулки');
 else add('sweater',band>=4?'Тёплый свитер и базовый слой':runner?'Спортивный лонгслив':'Лонгслив или свитер',band>=4?'Два слоя сохранят тепло':runner?'Отводит влагу во время бега':'Мягкий слой под верхнюю одежду');
 let outer=band>=4?'winter':band>=3?'jacket':band>=2?'light':null;
 if(!outer&&(wet||windy))outer='light';
 if(outer)add('jacket',outer==='winter'?'Тёплая зимняя куртка':wet?'Куртка с защитой от дождя':outer==='jacket'?'Утеплённая куртка':'Лёгкая ветровка',wet?'Непромокаемый верх и капюшон':windy?'Плотный верх защитит от ветра':outer==='winter'?'Утеплитель и высокий воротник':'Сохранит тепло на улице');
 add(band===0?'shorts':'pants',band===0?'Шорты или лёгкие брюки':band===5?'Утеплённые брюки':runner?'Спортивные брюки':'Брюки',band===0?'Лёгкая ткань, чтобы не перегреться':band===5?'Можно добавить термобельё':runner?'Свободное движение на пробежке':'Закрытые ноги — комфортнее в прохладу');
 const boots=band>=4||wet||snowy;
 add(boots?'boots':'shoes',band>=4?'Тёплые ботинки':wet||snowy?'Непромокаемые ботинки':runner?'Беговые кроссовки':'Кроссовки',wet||snowy?'Цепкая подошва и защита от влаги':band>=4?'Утеплённая подкладка и плотная подошва':'Удобная обувь для вашего темпа');
 if(band>=4)add('hat','Шапка и перчатки',band===5?'Дополните комплект тёплым шарфом':'Закройте уши и согрейте руки');
 if(wet&&!snowy&&!runner)take.push({type:windy?'hood':'umbrella',name:windy?'Капюшон или дождевик':'Зонт',reason:windy?'Ветер может выворачивать зонт':'Возможны осадки'});
 if(low<=weather.feels-4&&band<4)take.push({type:'sweater',name:'Дополнительный слой',reason:`Позже ощущается как ${temp(low)}`});
 if(weather.day&&weather.code<=1)take.push({type:'glasses',name:'Солнечные очки',reason:'Если будете на солнце'});
 if(band===0||runner)take.push({type:'water',name:'Вода',reason:runner?'Для пробежки':'На тёплую прогулку'});
 let advice=band>=4?'Лучше одеться в несколько слоёв. Закройте шею и не забудьте тёплую обувь.':band>=2?'На улице прохладно. Добавьте верхний слой и выбирайте закрытую обувь.':'Лёгкой одежды будет достаточно. Выбирайте свободные вещи, в которых удобно двигаться.';
 if(wet)advice+=' Пригодится защита от осадков.';
 if(storm)advice='Ожидается гроза. Лучше перенести прогулку и дождаться улучшения погоды.';
 return {band,outer,wet,snowy,windy,boots,items,take,advice,low,high,storm};
}
export function normalize(data){
 const h=data.hourly;
 if(!data.current||!h?.time?.length)throw new Error('Неполный прогноз');
 const row=(i)=>({time:h.time[i],temperature:h.temperature_2m[i],feels:h.apparent_temperature[i],wind:h.wind_speed_10m[i],precip:h.precipitation[i]??0,prob:h.precipitation_probability[i]??0,code:h.weather_code[i],day:h.is_day[i]===1});
 const hourly=h.time.map((_,i)=>row(i));
 const c=data.current;const nearest=hourly.reduce((a,b)=>Math.abs(b.time-c.time)<Math.abs(a.time-c.time)?b:a);
 const current={time:c.time,temperature:c.temperature_2m,feels:c.apparent_temperature,wind:c.wind_speed_10m,precip:c.precipitation??0,prob:nearest.prob,code:c.weather_code,day:c.is_day===1};
 if([current.temperature,current.feels,current.wind,...hourly.flatMap(x=>[x.temperature,x.feels,x.wind])].some(x=>!Number.isFinite(x)))throw new Error('Неполный прогноз');
 return {current,hourly,timezone:data.timezone||'UTC',fetchedAt:Date.now()};
}
export function timeLabel(epoch,timezone,withDate=false){return new Intl.DateTimeFormat('ru-RU',{timeZone:timezone,hour:'2-digit',minute:'2-digit',...(withDate?{day:'numeric',month:'short'}:{})}).format(new Date(epoch*1000));}
export function walkWeather(data,start,duration){const now=start==='now';const weather=now?data.current:data.hourly.find(x=>String(x.time)===String(start))||data.current;const end=weather.time+duration*3600;return {weather,future:data.hourly.filter(x=>x.time>weather.time&&x.time<=end)};}

import {kind} from './weather.js';
const wrap=(body,view='0 0 80 70')=>`<svg viewBox="${view}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
export function weatherIcon(code,day=true){const k=kind(code);return wrap(`${(k==='sun'||code===2)?(day?'<circle cx="26" cy="23" r="12" fill="#e7bb61"/><g stroke="#e7bb61" stroke-width="2.5" stroke-linecap="round"><path d="M26 3v4m0 32v4M6 23h4m32 0h4M12 9l3 3m22 22 3 3M12 37l3-3M37 12l3-3"/></g>':'<path d="M32 6a19 19 0 1 0 20 25A18 18 0 0 1 32 6" fill="#a1b7d0"/>'):''}${k!=='sun'?'<path d="M17 39c-15 0-15-22 0-23 3-14 25-14 30 0 19-3 21 23 4 23Z" fill="#b0c4d3"/>':''}${['rain','storm'].includes(k)?'<g stroke="#6d9bbf" stroke-width="3" stroke-linecap="round"><path d="m22 45-4 8m18-8-4 8m18-8-4 8"/></g>':''}${k==='storm'?'<path d="m38 29-10 18h9l-6 15 18-23H38l7-10" fill="#d6b15f"/>':''}${k==='snow'?'<g fill="#7b9eb9"><circle cx="20" cy="49" r="2.5"/><circle cx="34" cy="53" r="2.5"/><circle cx="48" cy="48" r="2.5"/></g>':''}${k==='fog'?'<path d="M13 47h42m-38 7h35" stroke="#a3b5c4" stroke-width="3" stroke-linecap="round"/>':''}`,'0 0 64 64');}
export function garmentArt(type){const strokes='stroke="#485967" stroke-width="1.1" stroke-linejoin="round"';const shapes={
 tee:`<path d="m26 12 8-4q6 7 12 0l8 4 16 14-10 12-8-7v30H28V31l-8 7-10-12Z" fill="#e5d9c6" ${strokes}/><path d="M34 8q6 14 12 0" fill="none" ${strokes}/>` ,
 sweater:`<path d="m26 13 8-5q6 8 12 0l8 5 13 42-12 4-7-29v31H30V30l-7 29-12-4Z" fill="#b9b7a4" ${strokes}/><path d="M34 8q6 15 12 0M30 55h18M17 50l9 3m27 0 9-3" fill="none" ${strokes}/>` ,
 jacket:`<path d="m27 13 7-5h12l8 5 12 43-12 4-6-27v30H30V33l-7 27-12-4Z" fill="#71806a" ${strokes}/><path d="m34 8 6 12 6-12M40 20v43M30 40h7v10h-7m11-10h7v10h-7M30 28l-3-15m21 15 6-15" fill="none" stroke="#d2d9c5" stroke-width="1.2"/>`,
 pants:`<path d="M24 8h32l3 55H43l-4-35-3 35H20Z" fill="#667784" ${strokes}/><path d="M24 15h32M39 15v13m-11-12-4 9m27-9 5 9M21 57h15m8 0h14" fill="none" stroke="#a2afb8"/>`,
 shorts:`<path d="M23 15h34l4 38H43l-4-21-3 21H19Z" fill="#c8b997" ${strokes}/><path d="M23 23h34M39 23v9" fill="none" ${strokes}/>` ,
 shoes:`<path d="m11 27 12 3 8-7 9 18q18 2 18 11H9q-4-11 2-25" fill="#e8e6df" ${strokes}/><path d="M9 47h47M29 33l9-3m-6 10 9-3" fill="none" ${strokes}/><path d="m37 17 10 3 8-6 8 18q12 2 12 11H60q-5-6-17-9Z" fill="#c9c8c0" ${strokes}/>` ,
 boots:`<path d="M14 12h20l-1 23q8 5 18 7 7 2 7 13H12Z" fill="#6a655c" ${strokes}/><path d="M12 51h46M24 17h9m-9 6h9m-9 6h9m1 8 8-3" fill="none" stroke="#c7bba4" stroke-width="2"/><path d="M43 8h15v24q17 5 18 14H59q-4-8-16-10Z" fill="#8b8476" ${strokes}/>` ,
 hat:`<path d="M15 39V28c0-27 36-27 36 0v11" fill="#a9b2a0" ${strokes}/><path d="M12 33h42v12H12Z" fill="#7e8e77" ${strokes}/><path d="M28 9v23m9-23v23" stroke="#c9d0c2"/><path d="m60 34 5-1 4 8V27q7-4 7 3v24q0 12-13 10l-7-19q-2-6 4-5l5 8" fill="#a9b2a0" ${strokes}/>` ,
 umbrella:`<path d="M9 31c3-34 58-34 62 0q-10-7-20 0-11-8-22 0-10-7-20 0" fill="#819eae" ${strokes}/><path d="M40 8v46q0 13-10 7M40 8Q27 13 29 31m11-23q15 5 11 23" fill="none" ${strokes}/>` ,
 hood:`<path d="M16 58 21 32Q14 3 40 3t19 29l6 26Z" fill="#91a28b" ${strokes}/><ellipse cx="40" cy="24" rx="12" ry="16" fill="#e6ece7" ${strokes}/><path d="M40 41v17" ${strokes}/>` ,
 glasses:`<path d="M8 26h26v18H10Zm38 0h26l-2 18H46Z" fill="#8897a0" ${strokes}/><path d="M34 31q6-6 12 0M8 26 3 14m69 12 5-12" fill="none" ${strokes}/>` ,
 water:`<rect x="30" y="4" width="20" height="10" rx="2" fill="#8c9eaa"/><path d="M30 14h20l6 12v35H24V26Z" fill="#a9c8d6" ${strokes}/><path d="M24 31h32v21H24" fill="#e8eff0"/><path d="M31 36h18" stroke="#779daf"/>`
};return wrap(shapes[type]||shapes.tee);}
function originalSceneArt(w,o){const k=kind(w.code),night=!w.day;const sky=night?'#d6e0ed':k==='sun'?'#eaf2f8':'#e5edf3';const top=o.outer?'#71806a':o.band<=1?'#e5d9c6':'#b9b7a4';const ground=k==='snow'?'#f6fafc':'#dce6ea';
 const clouds=`<g fill="${night?'#b2c2d4':'#f8fbfd'}"><path d="M49 79c-26 0-27-27-7-32 4-27 42-27 50-5 24-7 40 13 31 30-3 5-8 7-16 7Z"/><path d="M395 52c-20 0-23-20-7-27 5-21 34-20 38-3 24-5 29 30 9 30Z"/></g>`;
 const rain=Array.from({length:23},(_,i)=>`<path d="m${24+(i*47)%510} ${65+(i*71)%260}-5 12"/>`).join('');
 const snow=Array.from({length:28},(_,i)=>`<circle cx="${15+(i*43)%520}" cy="${50+(i*61)%290}" r="${i%3+1}"/>`).join('');
 return wrap(`<rect width="560" height="390" fill="${sky}"/>${k==='sun'?(night?'<path d="M104 29a28 28 0 1 0 29 36 27 27 0 0 1-29-36" fill="#f7f4df"/>':'<circle cx="101" cy="72" r="30" fill="#edca83"/>'):clouds}${k==='sun'?'<path d="M379 75h67m-52 8h65" stroke="#cadbe6" stroke-width="2" stroke-linecap="round"/>':''}
 <g stroke="#c4d2dc" stroke-width="1.1" fill="none"><path d="M0 249h560M20 249V137h67v112m-52-97h13v21H35Zm33 0h9v21h-9m-33 19h13v21H35Zm33 0h9v21h-9M96 248V107h70v141m-57-120h15v22h-15Zm29 0h15v22h-15m-29 20h15v22h-15m14-22h15v22h-15M0 223h19m147-38h47v64M472 248V125h61v124m-49-104h12v18h-12Zm25 0h12v18h-12m-37 23h12v18h-12m13-18h12v18h-12"/></g>
 <path d="M0 249h560v141H0Z" fill="${ground}"/><path d="M0 311h560M15 345h92m285-63h132" stroke="#c7d4dc" stroke-width="1"/>
 <g class="${o.windy?'tree-leaves':''}"><path d="M435 265V127m0 70-32-33m32 62 28-35m-28-17 20-33" stroke="#8a9998" stroke-width="4" fill="none" stroke-linecap="round"/><g fill="${o.snowy?'#cad5d9':'#aab9a8'}"><ellipse cx="412" cy="146" rx="26" ry="37" transform="rotate(-26 412 146)"/><ellipse cx="453" cy="125" rx="27" ry="37" transform="rotate(20 453 125)"/><ellipse cx="463" cy="178" rx="22" ry="30" transform="rotate(40 463 178)"/></g></g>
 <g stroke="#8e9eaa" stroke-width="3" fill="none"><path d="M76 269h84m-79-16h72m-67-10h62m-58 28-6 23m61-23 7 23"/></g>
 ${k==='rain'||k==='storm'?'<ellipse cx="171" cy="323" rx="41" ry="5" fill="#c0d5df"/><ellipse cx="390" cy="305" rx="30" ry="4" fill="#c0d5df"/>':''}
 <ellipse cx="280" cy="342" rx="65" ry="8" fill="#b9c9d2" opacity=".6"/>
 <g stroke-linejoin="round" stroke-linecap="round">
 <path d="m246 220 7 106 19 2 8-89 9 89 21-2 4-106" fill="${o.band===0?'#c6b897':'#657785'}" stroke="#4c606e" stroke-width="1.2"/>
 ${o.band===0?'<path d="m250 270 4 57h18l4-57m9 0 5 57h19l2-57" fill="#d9ad91"/>':''}
 <path d="M254 322h19v15l-4 6h-29q-4-5 1-9Zm35 0h20l16 12q5 5 0 9h-31l-5-6Z" fill="${o.boots?'#605c53':'#e7e6dd'}" stroke="#52636c" stroke-width="1.4"/><path d="M240 340h31m22 0h33" stroke="${o.boots?'#a69e8b':'#afbabf'}" stroke-width="3"/>
 <path d="m244 111-17 14-25 79 15 7 26-56 4 69h66l2-70 26 56 15-7-25-79-18-14" fill="${top}" stroke="#596958" stroke-width="1.2"/>
 <path d="m202 203-3 14q-3 11 5 14 8 2 11-9l2-13m123-1 4 16q3 9 11 6 6-3 3-12l-3-15" fill="#d9ad91" stroke="#bd927b" stroke-width="1"/>
 ${!o.outer&&o.band<=1?'<path d="m213 168-11 35 15 7 16-35m97-7 11 35 15-7-11-35" fill="#d9ad91"/>':''}
 <path d="M265 94v20q13 14 27 0V93" fill="#cf9e82"/>
 <path d="M258 66q-2-25 22-25 25 0 23 25v21q-1 21-22 23-21-3-23-23Z" fill="#dfb397" stroke="#bd947d" stroke-width="1.1"/>
 <path d="M257 77q-11-35 12-39 5-10 22-5 20 2 17 25l-5 20-5-24q-18 10-32 2l-5 24" fill="#514b43"/>
 <path d="M269 77h2m18 0h2m-13 12h5m-11 8q8 4 15-1" fill="none" stroke="#8b6759" stroke-width="1.3"/>
 ${o.outer?`<path d="m244 111 19-7 16 19 15-19 19 7-9 24-25-12-24 12Z" fill="#87947a" stroke="#596958" stroke-width="1"/><path d="M280 124v100m-33-51h21v25h-20m45-25h21l-1 25h-20" stroke="#b7c1a4" stroke-width="1.3" fill="none"/><circle cx="285" cy="150" r="1.3" fill="#d5dbc8"/>${o.outer==='winter'?'<path d="M248 149h64m-64 57h64m-78-50 11 4m80-4-10 4" stroke="#53674f" fill="none" opacity=".6"/>':''}`:'<path d="M263 110q15 23 32 0M248 215h64" fill="none" stroke="#9b9d90" stroke-width="2"/>'}
 ${o.band>=4?'<path d="M252 61q-2-34 29-34t29 34Z" fill="#879780"/><path d="M251 55h60v13h-60Z" fill="#697f64"/><path d="M264 107q15 11 31 0l5 12-20 10-20-10Z" fill="#c8b692"/><path d="m284 122 13-4 7 48-17 2Z" fill="#c8b692"/><path d="m202 204-4 15q-2 13 9 13l9-22m125-2 4 17q5 11 13 3l-3-25" fill="#879780"/>':''}
 ${o.wet&&!o.snowy?'<path d="M249 112q-8-32 10-47m49 0q18 18 6 47" fill="none" stroke="#64765c" stroke-width="8"/>':''}
 </g>
 ${k==='rain'||k==='storm'?`<g class="rain-strokes" fill="none" stroke="#8daec5" stroke-width="1.2" opacity=".65">${rain}</g>`:''}${k==='snow'?`<g class="snowflakes" fill="#fff">${snow}</g>`:''}
 ${o.windy?'<g fill="none" stroke="#acbfcd" stroke-width="1.6" stroke-linecap="round"><path d="M53 112h62q12 0 10-10M371 88h51q15 0 13-11M365 96h32"/></g>':''}
 ${k==='fog'?'<path d="M0 160h560v12H0Zm0 45h560v8H0Z" fill="#f3f6f8" opacity=".5"/>':''}`,'0 0 560 390');}

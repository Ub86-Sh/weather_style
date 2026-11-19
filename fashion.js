import {garmentArt as baseGarment,weatherIcon as baseWeather} from './art.js';
import {kind} from './weather.js';
export function garmentArt(type){return baseGarment(type).replace('<svg ', '<svg class="fashion-garment" ').replace(/#71806a|#b9b7a4|#a9b2a0|#91a28b/g,'#c58eaa').replace(/#e5d9c6|#c8b997/g,'#efd0df').replace(/#667784|#6a655c/g,'#443540').replace(/#485967/g,'#956b83').replace(/#d2d9c5|#c9d0c2/g,'#f6cada').replace(/#7e8e77/g,'#b47f99').replace(/#a2afb8/g,'#806579').replace(/#e8e6df/g,'#f0dce5').replace(/#c9c8c0/g,'#c8b1bf').replace(/#8b8476/g,'#806375').replace(/#819eae|#8c9eaa|#a9c8d6/g,'#c58ba6');}
export function weatherIcon(code,day=true){const k=kind(code);if(['cloud','fog','rain','snow','storm'].includes(k)){return `<svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><radialGradient id="cloud-${code}-${day}"><stop stop-color="#ffe6ef"/><stop offset=".55" stop-color="#e7b8cc"/><stop offset="1" stop-color="#9c6d85"/></radialGradient></defs><path d="M18 49C-1 48 1 29 16 26c0-20 29-27 39-9 19-3 33 24 14 33Z" fill="url(#cloud-${code}-${day})"/>${k==='rain'||k==='storm'?'<path d="m24 56-3 6m18-6-3 6m18-6-3 6" stroke="#ebacca" stroke-width="2" stroke-linecap="round"/>':''}${k==='snow'?'<g fill="#f5d8ea"><circle cx="25" cy="59" r="2"/><circle cx="40" cy="62" r="2"/><circle cx="55" cy="58" r="2"/></g>':''}</svg>`;}return baseWeather(code,day).replace(/#a1b7d0/g,'#c4accb');}
const inner=s=>s.slice(s.indexOf('>')+1,s.lastIndexOf('</svg>'));
export function sceneArt(w,o){
 const k=kind(w.code);
 const particles=Array.from({length:18},(_,i)=>`<circle cx="${35+i*29%490}" cy="${22+i*53%310}" r="${i%3===0?1.6:.8}" fill="#ffd3e7" opacity="${i%2?.6:.3}"/>`).join('');
 const lower=o.band===0
  ?`<path d="M243 208h52l-3 38h-19l-4-25-4 25h-19Z" fill="#3c2d38" stroke="#b9899f"/><path d="M251 245h14l-2 66h-16Zm22 0h14l5 66h-16Z" fill="url(#skin)"/>`
  :`<path d="M243 207h52l7 104h-24l-8-72-7 72h-24Z" fill="#342630" stroke="#b9899f" stroke-opacity=".65"/><path d="M244 218h50M269 218v21" fill="none" stroke="#987085"/>`;
 const shoes=o.boots
  ?`<path d="M239 283h26v39h-39c-2-9 3-13 14-14Zm38 0h24v26l17 8c3 2 2 6-2 6h-40Z" fill="#49343f" stroke="#d8a9bd"/><path d="M228 316h38m10 1h39" stroke="#f2cede" stroke-width="3"/>`
  :`<path d="M238 307h29v14h-42c-2-8 3-12 13-14Zm39 0h24l17 9c3 2 2 6-2 6h-40Z" fill="#f4e1e9" stroke="#c98ca6"/><path d="M228 317h39m10 0h38" stroke="#fff8fb" stroke-width="3"/>`;
 const top=o.outer
  ?`<path d="M242 107q27-18 54 0l11 111-76 0Z" fill="url(#coat)" stroke="#f8d1e0" stroke-opacity=".55"/><path d="M243 111 218 207l26 9 18-78m34-27 25 96-26 9-18-78" fill="url(#coat)" stroke="#f8d1e0" stroke-opacity=".55"/><path d="m254 105 15 23 15-23m-15 23v90m-28-42h28v27h-28m30-27h27v27h-27" fill="none" stroke="#ffe3ed" stroke-opacity=".78" stroke-width="2"/><path d="M232 210h74" stroke="#d884a5" stroke-width="5"/>`
  :`<path d="M243 106q26-17 52 0l10 76-72 0Z" fill="#cf89a7" stroke="#f8d1e0" stroke-opacity=".55"/><path d="M244 111 222 187l24 8 17-66m31-18 22 76-24 8-17-66" fill="#cf89a7" stroke="#f8d1e0" stroke-opacity=".55"/><path d="m256 104 13 20 13-20" fill="none" stroke="#ffe3ed" stroke-width="2"/>`;
 const hat=o.band>=4?`<g class="worn-hat"><path d="M243 42c1-24 12-34 26-34s26 10 27 34Z" fill="#d993af" stroke="#f7c8da"/><path d="M239 39h61v13h-61Z" rx="5" fill="#bd7898"/><path d="M269 8V1" stroke="#f4bed3" stroke-width="3" stroke-linecap="round"/></g>`:'';
 const umbrella=o.wet?`<g class="held-umbrella"><path d="M320 121q35-43 70 0Z" fill="#d58ca9" stroke="#f3c2d5"/><path d="M355 120v108q0 15-13 15-10 0-10-10" fill="none" stroke="#e6afc5" stroke-width="3"/></g>`:'';
 const girl=`<g class="brunette" filter="url(#shadow)">
  <path d="M232 81c-9-38 8-62 37-62s47 24 38 63l-7 61-62-1Z" fill="url(#hair)"/>
  ${lower}${shoes}
  <path d="M259 84h20v26h-20Z" fill="url(#skin)"/><ellipse cx="269" cy="62" rx="23" ry="28" fill="url(#skin)"/>
  ${top}
  <path d="M247 58c4-20 17-31 34-26 12 3 20 14 20 29-10-6-16-15-20-24-9 12-20 19-34 21Z" fill="#321e28"/><path class="hair-lock" d="M246 57q-7 42 8 68l-17 16-5-60q-3-34 15-50Zm46-19q17 13 15 48l-7 55-16-17q14-29 8-86Z" fill="#3b2430"/>
  <path d="M258 63h1m19 0h1" stroke="#53313d" stroke-width="2.2" stroke-linecap="round"/><path d="M263 76q6 5 12 0" fill="none" stroke="#a45f74" stroke-width="1.5" stroke-linecap="round"/>
  ${hat}${umbrella}
 </g>`;
 return `<svg viewBox="0 0 560 390" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><radialGradient id="halo"><stop stop-color="#d68ca9" stop-opacity=".45"/><stop offset="1" stop-color="#9b5476" stop-opacity="0"/></radialGradient><linearGradient id="arch" x2="1" y2="1"><stop stop-color="#9a637e" stop-opacity=".65"/><stop offset=".5" stop-color="#9a637e" stop-opacity=".25"/><stop offset="1" stop-color="#9a637e" stop-opacity=".05"/></linearGradient><linearGradient id="silk" x2=".6" y2="1"><stop stop-color="#ffd1e3" stop-opacity=".1"/><stop offset=".5" stop-color="#f09abd" stop-opacity=".5"/><stop offset="1" stop-color="#e4a0bd" stop-opacity="0"/></linearGradient><linearGradient id="hair" x2=".7" y2="1"><stop stop-color="#27171f"/><stop offset=".55" stop-color="#4a2a37"/><stop offset="1" stop-color="#1b1117"/></linearGradient><linearGradient id="skin" x2=".7" y2="1"><stop stop-color="#f6d3ce"/><stop offset="1" stop-color="#dca9aa"/></linearGradient><linearGradient id="coat" x2=".8" y2="1"><stop stop-color="#edb1c8"/><stop offset=".55" stop-color="#bd7898"/><stop offset="1" stop-color="#8c536f"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="9" stdDeviation="6" flood-color="#110b12" flood-opacity=".65"/></filter><filter id="soft"><feGaussianBlur stdDeviation="4"/></filter></defs>
 <ellipse cx="302" cy="205" rx="248" ry="170" fill="url(#halo)"/><path d="M178 327V90a91 91 0 0 1 182 0v237" fill="url(#arch)" stroke="#e8b8ce" stroke-opacity=".3"/><path d="M189 327V91a80 80 0 0 1 160 0v236" fill="none" stroke="#f8cde0" stroke-opacity=".08"/>
 <g class="silk-ribbon"><path d="M-18 286C101 71 160 355 367 229S542 88 591 176" fill="none" stroke="url(#silk)" stroke-width="17" filter="url(#soft)"/><path d="M-18 280C101 65 160 349 367 223S542 82 591 170" fill="none" stroke="#f2afcb" stroke-opacity=".28"/></g>
 <ellipse cx="269" cy="326" rx="145" ry="19" fill="#170f19" opacity=".55"/><ellipse cx="269" cy="322" rx="145" ry="17" fill="#70475d" opacity=".36" stroke="#e7b4cf" stroke-opacity=".3"/>
 ${girl}
 <g class="sparkles">${particles}<path d="m110 143 2-10 2 10 10 2-10 2-2 10-2-10-10-2Zm336-123 1-7 1 7 7 1-7 1-1 7-1-7-7-1" fill="#ffcee2" opacity=".7"/></g>
 ${k==='rain'||k==='storm'?'<g class="rain-strokes" stroke="#ecaccb" opacity=".3"><path d="m68 90-4 16m49 110-4 16m326-172-4 16m45 161-4 16m-20-148-4 16"/></g>':''}${k==='snow'?'<g class="snowflakes" fill="#ffe6f3" opacity=".6"><circle cx="75" cy="115" r="2"/><circle cx="440" cy="210" r="2"/><circle cx="370" cy="80" r="2"/></g>':''}
 </svg>`;
}

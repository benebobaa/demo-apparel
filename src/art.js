// Hand-drawn garment illustrations, generated as inline SVG.
// Every product is a 400x500 still-life: a colour field, a soft floor shadow,
// the garment (with fabric grain + volume shading) and stitched details.
// Swap any of them for a photo by setting `image` on the product.

const W = 400;
const H = 500;
const LINE = 'fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const SHADE = 'fill="#000" fill-opacity=".14"';

const dot = (x, y, r = 4, o = 0.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#000" fill-opacity="${o}"/>`;

function fringe(x1, y1, x2, y2, n, len = 14) {
  let out = '';
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    out += `M${x.toFixed(1)} ${y.toFixed(1)} l${(i % 2 ? 1.5 : -1.5)} ${len}`;
  }
  return out;
}

function cableStitch(xs, y0) {
  const seg = 'q7 10 0 20 t0 20 '.repeat(5);
  return xs.map((x) => `<path d="M${x} ${y0} ${seg}" ${LINE} stroke-opacity=".16"/>`).join('');
}

function ribbing(x1, x2, y1, y2, step = 8) {
  let d = '';
  for (let x = x1 + step / 2; x < x2; x += step) d += `M${x} ${y1} L${x} ${y2}`;
  return `<path d="${d}" ${LINE} stroke-opacity=".2" stroke-width="1.6"/>`;
}

const SHAPES = {
  coat: {
    main: 'M162 78 L200 98 L238 78 L304 104 L328 338 L292 344 L280 176 L284 446 L116 446 L120 176 L108 344 L72 338 L96 104 Z',
    detail: () => `
      <path d="M162 78 L200 98 L238 78 L200 168 Z" ${SHADE}/>
      <path d="M162 78 L200 168 L238 78 M200 168 L200 446" ${LINE}/>
      <path d="M120 176 C112 146 104 124 97 106 M280 176 C288 146 296 124 303 106" ${LINE}/>
      <path d="M75 314 L110 316 M290 316 L325 313" ${LINE}/>
      <rect x="132" y="296" width="52" height="48" rx="2" ${LINE}/>
      <rect x="216" y="296" width="52" height="48" rx="2" ${LINE}/>
      ${dot(188, 230, 4.5)}${dot(188, 282, 4.5)}${dot(188, 334, 4.5)}
      <path d="M118 434 L282 434" ${LINE} stroke-dasharray="2 6"/>`,
  },
  shirt: {
    main: 'M160 84 Q200 112 240 84 L306 116 L332 238 L294 250 L284 192 L286 404 L114 404 L116 192 L106 250 L68 238 L94 116 Z',
    detail: () => `
      <path d="M160 84 L200 124 L178 148 L146 102 Z M240 84 L200 124 L222 148 L254 102 Z" ${SHADE} stroke="#000" stroke-opacity=".25" stroke-width="2" stroke-linejoin="round"/>
      <path d="M200 124 L200 404" ${LINE}/>
      <path d="M116 192 C108 160 100 138 95 118 M284 192 C292 160 300 138 305 118" ${LINE}/>
      ${[164, 204, 244, 284, 324, 364].map((y) => dot(207, y, 3.5)).join('')}
      <rect x="224" y="196" width="40" height="44" rx="2" ${LINE}/>
      <path d="M114 392 L286 392" ${LINE} stroke-dasharray="2 6"/>`,
  },
  sweater: {
    main: 'M156 86 Q200 130 244 86 L308 116 L336 292 L296 302 L286 196 L288 392 L112 392 L114 196 L104 302 L64 292 L92 116 Z',
    detail: () => `
      <path d="M156 86 Q200 130 244 86 L238 82 Q200 116 162 82 Z" ${SHADE}/>
      <path d="M156 86 Q200 130 244 86 M163 80 Q200 118 237 80" ${LINE}/>
      ${cableStitch([164, 182, 200, 218, 236], 150)}
      <path d="M112 362 L288 362" ${LINE}/>
      ${ribbing(112, 288, 362, 392)}
      <path d="M68 272 L103 282 M332 272 L297 282" ${LINE}/>
      <path d="M114 196 C106 164 98 138 93 118 M286 196 C294 164 302 138 307 118" ${LINE}/>`,
  },
  trouser: {
    main: 'M126 70 L274 70 L290 446 L214 446 L200 196 L186 446 L110 446 Z',
    detail: () => `
      <path d="M126 70 L274 70 L275 98 L125 98 Z" ${SHADE} stroke="#000" stroke-opacity=".25" stroke-width="2"/>
      <path d="M200 98 L200 196 M162 98 L156 192 M238 98 L244 192" ${LINE}/>
      <path d="M158 204 L148 446 M242 204 L252 446" ${LINE} stroke-opacity=".14"/>
      <path d="M128 108 L148 152 M272 108 L252 152" ${LINE}/>
      ${dot(200, 84, 4)}
      <path d="M112 432 L186 432 M214 432 L288 432" ${LINE} stroke-dasharray="2 6"/>`,
  },
  tote: {
    back: (c) => `<path d="M148 196 C138 96 262 96 252 196" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round"/>
      <path d="M148 196 C138 96 262 96 252 196" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="11" stroke-linecap="round"/>`,
    main: 'M108 192 L292 192 L308 436 L92 436 Z',
    detail: () => `
      <path d="M108 216 L292 216" ${LINE} stroke-dasharray="3 5"/>
      <rect x="142" y="296" width="116" height="86" rx="3" ${LINE}/>
      <rect x="182" y="330" width="36" height="14" rx="2" fill="#000" fill-opacity=".22"/>
      ${dot(148, 204, 4.5, 0.45)}${dot(252, 204, 4.5, 0.45)}
      <path d="M108 192 L92 436 M292 192 L308 436" ${LINE} stroke-opacity=".12"/>`,
  },
  scarf: {
    main: 'M138 92 Q200 48 262 92 L270 142 Q200 108 130 142 Z M158 128 L212 138 L226 424 L148 416 Z M204 134 L264 126 L282 394 L222 410 Z',
    inside: (bg) => `
      <g transform="rotate(5 200 380)" fill="${bg}" fill-opacity=".92">
        <rect x="120" y="336" width="180" height="12"/>
        <rect x="120" y="360" width="180" height="5"/>
      </g>`,
    detail: () => `
      <path d="${fringe(150, 416, 226, 424, 9)}" ${LINE} stroke-opacity=".4"/>
      <path d="${fringe(222, 410, 282, 394, 7)}" ${LINE} stroke-opacity=".4"/>
      <path d="M130 142 Q200 108 270 142" ${LINE}/>
      <path d="M204 134 L226 424" ${LINE} stroke-opacity=".18"/>`,
  },
  cap: {
    main: 'M108 318 C102 196 298 196 292 318 Q200 340 108 318 Z M246 314 Q330 312 358 340 Q300 356 232 330 Z',
    detail: () => `
      <path d="M200 226 Q166 280 160 326 M200 226 Q234 280 240 326" ${LINE}/>
      ${dot(200, 226, 7, 0.4)}
      <path d="M108 318 Q200 340 292 318" ${LINE}/>
      ${dot(142, 270, 3, 0.35)}${dot(258, 270, 3, 0.35)}
      <path d="M246 326 Q300 338 354 340" ${LINE} stroke-opacity=".18"/>`,
  },
};

let uid = 0;

/**
 * Returns an <svg> string for a product. Uses the shared #grain, #blur and
 * #shade defs declared once in index.html.
 */
export function art(product, { label = true, grain = true } = {}) {
  if (product.image) {
    return `<img src="${product.image}" alt="${label ? product.name : ''}" loading="lazy">`;
  }
  const s = SHAPES[product.type];
  const id = `g${++uid}`;
  const inside = s.inside ? s.inside(product.bg) : '';
  return `
<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label ? product.name : ''}" ${label ? '' : 'aria-hidden="true"'}>
  <defs><clipPath id="${id}"><path d="${s.main}"/></clipPath></defs>
  <rect width="${W}" height="${H}" fill="${product.bg}"/>
  ${grain ? `<rect width="${W}" height="${H}" filter="url(#grain)" opacity=".12"/>` : ''}
  <ellipse cx="200" cy="456" rx="120" ry="9" fill="#000" opacity=".16" filter="url(#blur)"/>
  ${s.back ? s.back(product.color) : ''}
  <path d="${s.main}" fill="${product.color}"/>
  <g clip-path="url(#${id})">
    ${inside}
    <rect width="${W}" height="${H}" fill="url(#shade)"/>
    ${grain ? `<rect width="${W}" height="${H}" filter="url(#grain)" opacity=".3"/>` : ''}
  </g>
  ${s.detail()}
</svg>`;
}

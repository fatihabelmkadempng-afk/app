// Original flat-vector clip art for Mr. Pencil & Co, drawn from simple shapes.
// Every piece keeps a dark outline so it still reads when printed in black and white.
const INK = '#1B2330';
const NAVY = '#1E3A6E';
const RED = '#C62F3B';
const GOLD = '#E3A72F';
const CREAM = '#FFF6E6';

const svg = (vb, body, w, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" ${extra}>${body}</svg>`;

function starPts(cx, cy, R, r) {
  const p = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 ? r : R;
    p.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return p.join(' ');
}
const starShape = (cx, cy, R, fill = GOLD, stroke = '#8A5E00', sw = 1.5) =>
  `<polygon points="${starPts(cx, cy, R, R * 0.45)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;

const star = (w = 28, fill = GOLD) => svg('0 0 64 64', starShape(32, 34, 29, fill), w);

function flag(w = 28) {
  const x = 10, y = 6, fw = 48, fh = 32, n = 7, sh = fh / n;
  let s = `<line x1="8" y1="4" x2="8" y2="62" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  s += `<circle cx="8" cy="4" r="3.5" fill="${GOLD}" stroke="${INK}" stroke-width="1.2"/>`;
  s += `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" fill="#fff"/>`;
  for (let i = 0; i < n; i += 2) s += `<rect x="${x}" y="${y + i * sh}" width="${fw}" height="${sh}" fill="${RED}"/>`;
  s += `<rect x="${x}" y="${y}" width="21" height="${sh * 4}" fill="${NAVY}"/>`;
  [[15, 11], [23, 11], [19, 16.5], [15, 22], [23, 22]].forEach(([cx, cy]) => { s += `<circle cx="${cx}" cy="${cy}" r="1.6" fill="#fff"/>`; });
  s += `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" fill="none" stroke="${INK}" stroke-width="2"/>`;
  return svg('0 0 64 64', s, w);
}

// A plain one-color pennant, used when a problem is about flag colors.
function pennant(color, w = 26) {
  const fill = { red: RED, white: '#fff', blue: NAVY }[color];
  const s = `<line x1="8" y1="4" x2="8" y2="62" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <polygon points="10,6 58,20 10,36" fill="${fill}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
  return svg('0 0 64 64', s, w);
}

function card(w = 28) {
  const s = `<rect x="3" y="7" width="58" height="36" rx="4" fill="${CREAM}" stroke="${NAVY}" stroke-width="2.5"/>
    <path d="M4 9 L32 28 L60 9" fill="none" stroke="${NAVY}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M32 40 C22 33 24 26 29 27 C31 27.5 32 29 32 30 C32 29 33 27.5 35 27 C40 26 42 33 32 40 Z" fill="${RED}" stroke="${INK}" stroke-width="1"/>`;
  return svg('0 0 64 48', s, w);
}

function poppy(w = 28) {
  let s = `<path d="M32 38 C32 48 30 55 31 63" stroke="#3F7D4E" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="41" cy="52" rx="8" ry="3.5" fill="#3F7D4E" transform="rotate(-30 41 52)"/>`;
  [[22, 18], [42, 18], [21, 34], [43, 34]].forEach(([cx, cy]) => { s += `<circle cx="${cx}" cy="${cy}" r="13" fill="${RED}" stroke="#7A1720" stroke-width="1.8"/>`; });
  s += `<circle cx="32" cy="26" r="8" fill="${INK}"/>`;
  [[29, 24], [35, 24], [32, 29]].forEach(([cx, cy]) => { s += `<circle cx="${cx}" cy="${cy}" r="1.3" fill="#fff"/>`; });
  return svg('0 0 64 64', s, w);
}

function sunflower(w = 28) {
  let s = `<path d="M32 44 V63" stroke="#3F7D4E" stroke-width="3.5" stroke-linecap="round"/>`;
  for (let i = 0; i < 14; i++) s += `<ellipse cx="32" cy="11" rx="4.5" ry="10" fill="#F2C230" stroke="#9A6B00" stroke-width="1.2" transform="rotate(${(i * 360) / 14} 32 26)"/>`;
  s += `<circle cx="32" cy="26" r="11" fill="#6B3E1E" stroke="${INK}" stroke-width="1.2"/>`;
  return svg('0 0 64 64', s, w);
}

function daisy(w = 28) {
  let s = `<path d="M32 40 V63" stroke="#3F7D4E" stroke-width="3.5" stroke-linecap="round"/>`;
  for (let i = 0; i < 16; i++) s += `<ellipse cx="32" cy="12" rx="3.2" ry="10" fill="#fff" stroke="#555" stroke-width="1.2" transform="rotate(${(i * 360) / 16} 32 26)"/>`;
  s += `<circle cx="32" cy="26" r="6" fill="#F2C230" stroke="#9A6B00" stroke-width="1.2"/>`;
  return svg('0 0 64 64', s, w);
}

function medal(w = 28) {
  const s = `<polygon points="20,2 44,2 38,28 26,28" fill="${RED}" stroke="${INK}" stroke-width="1.5"/>
    <rect x="29" y="2" width="6" height="26" fill="#fff"/>
    <polygon points="20,2 44,2 38,28 26,28" fill="none" stroke="${INK}" stroke-width="1.5"/>
    <circle cx="32" cy="43" r="17" fill="${GOLD}" stroke="#8A5E00" stroke-width="2"/>
    ${starShape(32, 44, 10, '#fff', '#8A5E00', 1.2)}`;
  return svg('0 0 64 64', s, w);
}

function shield(w = 28) {
  const s = `<path d="M32 3 L57 12 V30 C57 47 45 57 32 61 C19 57 7 47 7 30 V12 Z" fill="${NAVY}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M32 9 L51 16 V30 C51 43 42 51 32 55 C22 51 13 43 13 30 V16 Z" fill="none" stroke="#fff" stroke-width="1.5"/>
    ${starShape(32, 33, 13, '#fff', '#fff', 0.5)}`;
  return svg('0 0 64 64', s, w);
}

function drum(w = 28) {
  const s = `<line x1="14" y1="4" x2="36" y2="22" stroke="#8B5E3C" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="4" x2="28" y2="22" stroke="#8B5E3C" stroke-width="3" stroke-linecap="round"/>
    <path d="M9 26 V52 A23 7 0 0 0 55 52 V26" fill="${RED}" stroke="${INK}" stroke-width="2"/>
    <polyline points="9,30 17,48 25,30 33,48 41,30 49,48 55,34" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
    <ellipse cx="32" cy="26" rx="23" ry="7" fill="${CREAM}" stroke="${INK}" stroke-width="2"/>`;
  return svg('0 0 64 64', s, w);
}

function box10(w = 70) {
  let s = '';
  [[18, RED], [34, '#fff'], [50, NAVY]].forEach(([x, c]) => {
    s += `<line x1="${x}" y1="4" x2="${x}" y2="32" stroke="${INK}" stroke-width="2.5"/>
      <polygon points="${x + 1},5 ${x + 14},10 ${x + 1},16" fill="${c}" stroke="${INK}" stroke-width="1.2"/>`;
  });
  s += `<rect x="4" y="26" width="64" height="40" rx="3" fill="#E2B27A" stroke="${INK}" stroke-width="2"/>
    <line x1="4" y1="34" x2="68" y2="34" stroke="${INK}" stroke-width="1.2"/>
    <rect x="18" y="39" width="36" height="22" rx="4" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
    <text x="36" y="56.5" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="18" fill="${INK}">10</text>`;
  return svg('0 0 72 70', s, w);
}

function book(w = 40) {
  const s = `<path d="M32 14 C24 8 12 8 4 11 V54 C12 51 24 51 32 57 Z" fill="#fff" stroke="${NAVY}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M32 14 C40 8 52 8 60 11 V54 C52 51 40 51 32 57 Z" fill="#fff" stroke="${NAVY}" stroke-width="2.5" stroke-linejoin="round"/>
    <line x1="10" y1="22" x2="26" y2="22" stroke="${RED}" stroke-width="2"/><line x1="10" y1="30" x2="26" y2="30" stroke="${RED}" stroke-width="2"/>
    <line x1="38" y1="22" x2="54" y2="22" stroke="${RED}" stroke-width="2"/><line x1="38" y1="30" x2="54" y2="30" stroke="${RED}" stroke-width="2"/>`;
  return svg('0 0 64 64', s, w);
}

function mathIcon(w = 40) {
  const s = `<rect x="4" y="6" width="56" height="52" rx="10" fill="#fff" stroke="${NAVY}" stroke-width="2.5"/>
    <text x="32" y="42" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="24" fill="${RED}">1+2</text>`;
  return svg('0 0 64 64', s, w);
}

function tagIcon(w = 40) {
  const s = `<path d="M8 6 C2 20 4 40 16 52" fill="none" stroke="#8791A0" stroke-width="4" stroke-dasharray="0 7" stroke-linecap="round"/>
    <rect x="14" y="10" width="44" height="32" rx="12" fill="#E4E8EE" stroke="${INK}" stroke-width="2.5"/>
    <circle cx="23" cy="26" r="3.5" fill="#fff" stroke="${INK}" stroke-width="1.5"/>
    <text x="41" y="31" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="13" fill="${NAVY}">8-5</text>`;
  return svg('0 0 64 52', s, w);
}

function abcIcon(w = 40) {
  let s = '';
  [['C', 4, RED], ['A', 23, NAVY], ['B', 42, RED]].forEach(([l, x, c]) => {
    s += `<rect x="${x}" y="18" width="18" height="22" rx="4" fill="#fff" stroke="${c}" stroke-width="2.5"/>
      <text x="${x + 9}" y="35" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="16" fill="${c}">${l}</text>`;
  });
  return svg('0 0 64 56', s, w);
}

function mailbox(w = 200, open = false) {
  let s = `<ellipse cx="110" cy="208" rx="60" ry="8" fill="#DDE3EA"/>
    <rect x="100" y="126" width="20" height="82" fill="#8B5E3C" stroke="${INK}" stroke-width="2.5"/>
    <path d="M36 132 L36 76 Q36 34 110 34 Q184 34 184 76 L184 132 Z" fill="${NAVY}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M48 124 L48 80 Q48 48 110 48 Q172 48 172 80 L172 124" fill="none" stroke="#fff" stroke-width="2" opacity=".55"/>
    ${starShape(72, 86, 15, '#fff', '#fff', 0.5)}
    <rect x="186" y="58" width="7" height="50" rx="2" fill="${RED}" stroke="${INK}" stroke-width="2"/>
    <rect x="191" y="58" width="24" height="16" rx="2" fill="${RED}" stroke="${INK}" stroke-width="2"/>`;
  if (open) {
    s += `<rect x="78" y="10" width="64" height="42" rx="4" fill="${CREAM}" stroke="${RED}" stroke-width="2.5" transform="rotate(-8 110 30)"/>
      <path d="M110 44 C99 36 101 28 107 29 C109 29.5 110 31 110 32.5 C110 31 111 29.5 113 29 C119 28 121 36 110 44 Z" fill="${RED}" transform="rotate(-8 110 30)"/>`;
  }
  s += `<path d="M122 102 V92 A13 13 0 0 1 148 92 V102" fill="none" stroke="#8791A0" stroke-width="6" stroke-linecap="round"/>
    <rect x="114" y="100" width="42" height="30" rx="5" fill="${GOLD}" stroke="${INK}" stroke-width="2.5"/>`;
  [0, 1, 2, 3].forEach((i) => { s += `<rect x="${119 + i * 8.5}" y="108" width="6.5" height="13" rx="1.2" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`; });
  return svg('0 0 220 220', s, w);
}

function pencilMascot(w = 110) {
  const s = `<rect x="35" y="10" width="50" height="28" rx="11" fill="#F4A6B7" stroke="${INK}" stroke-width="3"/>
    <rect x="33" y="36" width="54" height="18" rx="2" fill="#B9C2CC" stroke="${INK}" stroke-width="3"/>
    <line x1="33" y1="42" x2="87" y2="42" stroke="${INK}" stroke-width="1.5"/><line x1="33" y1="48" x2="87" y2="48" stroke="${INK}" stroke-width="1.5"/>
    <rect x="35" y="54" width="50" height="110" fill="#F2C230" stroke="${INK}" stroke-width="3"/>
    <line x1="52" y1="56" x2="52" y2="162" stroke="#D9A21B" stroke-width="2.5"/><line x1="68" y1="56" x2="68" y2="162" stroke="#D9A21B" stroke-width="2.5"/>
    <polygon points="35,164 85,164 60,210" fill="#F3D9B1" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="51,193 69,193 60,210" fill="${INK}"/>
    <circle cx="50" cy="92" r="6" fill="${INK}"/><circle cx="70" cy="92" r="6" fill="${INK}"/>
    <circle cx="52" cy="90" r="2" fill="#fff"/><circle cx="72" cy="90" r="2" fill="#fff"/>
    <circle cx="43" cy="106" r="5" fill="#F08A9B" opacity=".75"/><circle cx="77" cy="106" r="5" fill="#F08A9B" opacity=".75"/>
    <path d="M48 106 Q60 120 72 106" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M85 118 L102 104" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M35 118 L20 130" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><circle cx="18" cy="132" r="5" fill="#F2C230" stroke="${INK}" stroke-width="2.5"/>
    <line x1="104" y1="62" x2="104" y2="112" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <rect x="105" y="62" width="22" height="15" fill="${RED}" stroke="${INK}" stroke-width="2"/>
    <rect x="105" y="62" width="9" height="8" fill="${NAVY}"/>
    <line x1="105" y1="72" x2="127" y2="72" stroke="#fff" stroke-width="2"/>
    <circle cx="103" cy="104" r="5" fill="#F2C230" stroke="${INK}" stroke-width="2.5"/>`;
  return svg('0 0 132 214', s, w);
}

// A bead chain drawn as a dotted curve, for dog tags.
const chain = (w = 90) => svg('0 0 90 40', `<path d="M4 38 C10 4 60 0 86 30" fill="none" stroke="#8791A0" stroke-width="5" stroke-dasharray="0 9" stroke-linecap="round"/>`, w);

const icons = { flag, card, poppy, star, sunflower, daisy, medal, shield, drum };

module.exports = { INK, NAVY, RED, GOLD, CREAM, star, flag, pennant, card, poppy, sunflower, daisy, medal, shield, drum, box10, book, mathIcon, tagIcon, abcIcon, mailbox, pencilMascot, chain, icons, starShape };

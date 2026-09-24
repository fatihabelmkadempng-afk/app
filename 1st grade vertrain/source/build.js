// Builds every deliverable from content.js.
// Run from this folder:  node check.js && NODE_PATH=$(npm root -g) node build.js
const fs = require('fs');
const path = require('path');
const C = require('./content');
const A = require('./art');
const F = require('./formspec');

const ROOT = path.resolve(__dirname, '..');
const HTML_DIR = path.join(__dirname, 'html');
const IMG_DIR = path.join(ROOT, 'Google Form Images');
const QA_DIR = process.env.QA_DIR || '';
fs.mkdirSync(HTML_DIR, { recursive: true });
fs.mkdirSync(IMG_DIR, { recursive: true });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const L = ['A', 'B', 'C'];
const ordinal = ['first', 'second', 'third', 'fourth'];

// ---------------------------------------------------------------- styles
const CSS = `
@font-face{font-family:'Andika';src:url('../fonts/Andika-400.woff2') format('woff2');font-weight:400}
@font-face{font-family:'Andika';src:url('../fonts/Andika-700.woff2') format('woff2');font-weight:700}
@font-face{font-family:'Fredoka';src:url('../fonts/Fredoka-500.woff2') format('woff2');font-weight:500}
@font-face{font-family:'Fredoka';src:url('../fonts/Fredoka-700.woff2') format('woff2');font-weight:700}
@page{size:8.5in 11in;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#1B2330;--navy:#1E3A6E;--red:#C62F3B;--gold:#E3A72F;--cream:#FFF6E6;--line:#A9B5C7}
html,body{background:#fff;color:var(--ink);font-family:'Andika',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:8.5in;height:11in;padding:.5in;position:relative;overflow:hidden;break-after:page}
.frame{position:relative;height:100%;border:3px solid var(--navy);border-radius:22px;padding:.26in .3in .5in;display:flex;flex-direction:column}
.frame>*{flex-shrink:0}
footer{position:absolute;left:0;right:0;bottom:.1in;text-align:center;font:500 10pt 'Fredoka';color:var(--navy);letter-spacing:.02em}
.keytag{position:absolute;top:-.2in;right:.3in;background:var(--red);color:#fff;font:700 13pt 'Fredoka';padding:4px 14px;border-radius:999px}
.mh{display:flex;align-items:center;gap:12px;border-bottom:3px dashed var(--red);padding-bottom:8px;margin-bottom:8px}
.mh .badge{background:var(--navy);color:#fff;font:700 15pt 'Fredoka';padding:5px 14px;border-radius:999px;white-space:nowrap}
.mh h1{font:700 27pt/1.05 'Fredoka';color:var(--navy);flex:1}
.mh svg{flex:none}
.dir{font:700 24pt/1.2 'Andika';margin:2px 0 10px}
.t{font-size:18pt;line-height:1.4}
.starq{display:inline-block;vertical-align:-4px;margin-right:4px}
/* passage */
.passage p{font-size:18pt;line-height:1.5;margin-bottom:7px}
.sn{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:var(--navy);color:#fff;font:700 12.5pt 'Fredoka';vertical-align:3px;margin:0 3px 0 2px}
.wtk{margin-top:auto;border:3px solid var(--gold);background:var(--cream);border-radius:16px;padding:8px 14px}
.wtk h3{font:700 18pt 'Fredoka';color:var(--navy);margin-bottom:2px}
.wtk .g{display:grid;grid-template-columns:1fr 1fr;gap:2px 18px;font-size:18pt;line-height:1.3}
.wtk b{color:var(--red)}
/* questions */
.q{margin-bottom:6px}
.q .qt{margin-bottom:4px}
.q .qt{font:700 18pt/1.3 'Andika';margin-bottom:6px;display:flex;gap:8px;align-items:flex-start}
.qn{flex:none;position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:36px;height:36px;border-radius:50%;background:var(--red);color:#fff;font:700 18pt 'Fredoka'}
.qn .qs{position:absolute;top:-14px;right:-16px}
.choices{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding-left:40px}
.choices.two{grid-template-columns:repeat(2,1fr);max-width:5in}
.choice{border:2px solid var(--line);border-radius:12px;padding:4px 10px;display:flex;gap:8px;align-items:center;font-size:18pt;line-height:1.2;position:relative}
.bubble{flex:none;width:38px;height:38px;border-radius:50%;border:2.5px solid var(--navy);display:flex;align-items:center;justify-content:center;font:700 18pt 'Fredoka';color:var(--navy)}
.key .choice.ok{border-color:var(--red);border-width:3px}
.key .choice.ok .bubble{background:var(--red);border-color:var(--red);color:#fff}
.pics .choice{flex-direction:column;padding:8px}
.pics .choice .row{display:flex;gap:8px;align-items:center}
/* lock box */
.lock{margin-top:auto;display:flex;align-items:center;gap:14px;background:var(--cream);border:3px solid var(--gold);border-radius:16px;padding:10px 16px}
.lock .t{flex:1;font-weight:700}
.digit{flex:none;width:.95in;height:.95in;border:4px solid var(--navy);border-radius:14px;background:#fff;display:flex;align-items:center;justify-content:center;font:700 40pt 'Fredoka';color:var(--red)}
/* math */
.prob{display:grid;grid-template-columns:1fr auto;gap:6px 14px;border:2px solid var(--line);border-radius:16px;padding:10px 14px;margin-bottom:11px}
.prob .txt{display:flex;gap:8px}
.prob .ask{font-weight:700}
.picrow{grid-column:1;display:flex;align-items:center;flex-wrap:wrap;gap:3px 2px;min-height:40px}
.picrow .br{flex-basis:100%;height:0}
.fill .prob{flex:1;align-content:center}
.picrow .gap{width:12px}
.picrow .op{font:700 24pt 'Fredoka';color:var(--navy);margin:0 8px}
.cmp{display:flex;flex-direction:column;gap:2px}
.cmp .r{display:flex;align-items:center;gap:2px}
.cmp .nm{width:.65in;font:700 18pt 'Andika'}
.three{display:flex;gap:16px}
.three .grp{text-align:center}
.three .grp .lab{font-size:18pt;line-height:1}
.ansc{grid-column:2;grid-row:1/span 2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
.ab{width:1.3in;height:.8in;border:4px solid var(--navy);border-radius:14px;display:flex;align-items:center;justify-content:center;font:700 32pt 'Fredoka';color:var(--red);background:#fff}
.unit{font-size:18pt;font-weight:700}
/* decoder */
.keygrid{display:grid;grid-template-columns:repeat(13,1fr);border:3px solid var(--navy);border-radius:12px;overflow:hidden;margin-bottom:8px}
.keygrid div{text-align:center;padding:3px 0;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
.keygrid div:nth-child(13n){border-right:0}
.keygrid b{display:block;font:700 19pt/1.1 'Fredoka';color:var(--navy)}
.keygrid span{display:block;font:700 18pt/1.1 'Andika';color:var(--red)}
.tags{display:flex;flex-direction:column;margin:4px 0 10px;width:5.6in;align-self:center}
.tagw{position:relative;display:flex;align-items:center;gap:10px;margin-bottom:8px}
.tagw .lbl{flex:none;width:1.05in;font:700 18pt 'Fredoka';color:var(--navy);display:flex;align-items:center;justify-content:flex-end;gap:4px}
.tagw .ch{position:absolute;left:0;top:0}
.tag{position:relative;background:linear-gradient(#F3F5F8,#DCE1E8);border:3px solid var(--ink);border-radius:30px;padding:5px 18px 8px 54px;display:flex;gap:10px;justify-content:flex-start}
.tag::before{content:'';position:absolute;left:18px;top:50%;margin-top:-9px;width:18px;height:18px;border-radius:50%;background:#fff;border:2.5px solid var(--ink)}
.cell{display:flex;flex-direction:column;align-items:center;gap:4px}
.cell .n{font:700 20pt 'Fredoka';color:var(--navy);line-height:1}
.lb{width:.58in;height:.62in;border:3px solid var(--navy);border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center;font:700 24pt 'Fredoka';color:var(--red)}
/* scramble */
.bank{display:flex;justify-content:space-between;border:3px solid var(--gold);background:var(--cream);border-radius:16px;padding:8px 16px;margin-bottom:12px}
.bank .it{display:flex;flex-direction:column;align-items:center;font:700 18pt 'Andika'}
.bank h3{font:700 18pt 'Fredoka';color:var(--navy)}
.scr{display:flex;align-items:center;gap:14px;margin-bottom:16px}
.tiles{flex:none;display:flex;gap:5px;width:2.55in}
.tile{width:.46in;height:.52in;border-radius:8px;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font:700 22pt 'Fredoka'}
.arrow{font:700 24pt 'Fredoka';color:var(--red)}
.boxes{display:flex;gap:5px}
/* finale */
.codes{display:flex;justify-content:center;gap:16px;margin:8px 0 10px}
.codes .c{display:flex;flex-direction:column;align-items:center;gap:4px;font:700 18pt 'Fredoka';color:var(--navy)}
.codes .digit{width:1.15in;height:1.15in;font-size:48pt}
.yay{border:3px dashed var(--red);border-radius:16px;padding:10px 16px;text-align:center;font:700 22pt/1.25 'Fredoka';color:var(--navy);margin-top:auto}
.tip{font-size:18pt;text-align:center;margin:8px 0}
/* card */
.cardf{flex:1;border:3px solid var(--red);border-radius:18px;padding:.22in .3in;display:flex;flex-direction:column;position:relative}
.cardf .corner{position:absolute}
.dear{font:700 22pt 'Andika';color:var(--navy);margin-bottom:8px}
.draw{flex:1;border:3px dashed var(--line);border-radius:14px;display:flex;align-items:flex-end;justify-content:center;font-size:18pt;color:#6B778A;padding-bottom:6px;margin-bottom:12px}
.wl{display:flex;align-items:flex-end;gap:10px;font:700 20pt 'Andika';margin-bottom:6px}
.wl svg{flex:1}
/* cover */
.cover{align-items:center;text-align:center;padding-top:.3in}
.cstars{display:flex;gap:10px;justify-content:center;margin-bottom:6px}
.grade{background:var(--gold);color:var(--ink);font:700 22pt 'Fredoka';padding:6px 26px;border-radius:999px;border:3px solid var(--ink);margin-bottom:14px}
.ctitle{font:700 58pt/1 'Fredoka';color:var(--navy)}
.ctitle em{font-style:normal;color:var(--red)}
.csub{font:700 22pt/1.2 'Andika';margin:12px 0 4px}
.cart{display:flex;align-items:flex-end;justify-content:center;gap:10px;margin:10px 0}
.cname{font:700 24pt 'Andika';margin-top:auto;align-self:flex-start;display:flex;gap:10px;width:70%;align-items:flex-end}
.cname span.line{flex:1;border-bottom:3px solid var(--ink);height:28px}
.mascot{position:absolute;right:.1in;bottom:.3in}
.brand{font:700 14pt 'Fredoka';color:var(--red);margin-top:10px;align-self:flex-start}
/* briefing */
.story{display:flex;gap:18px;align-items:center}
.story ul{list-style:none;flex:1}
.story li{font-size:20pt;line-height:1.35;margin-bottom:4px;padding-left:28px;position:relative}
.story li::before{content:'';position:absolute;left:4px;top:.45em;width:12px;height:12px;border-radius:50%;background:var(--red)}
.map{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:auto}
.map .m{border:3px solid var(--navy);border-radius:16px;padding:10px 6px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:4px}
.map .m .done{margin-top:auto}
.map .m svg{height:56px}
.map .m b{font:700 18pt 'Fredoka';color:var(--navy)}
.map .m span{font-size:18pt;line-height:1.1}
.map .done{display:flex;align-items:center;gap:6px;font-size:18pt;margin-top:4px}
.map .done i{width:26px;height:26px;border:3px solid var(--ink);border-radius:5px;display:inline-block}
.maph{font:700 22pt 'Fredoka';color:var(--navy);margin:10px 0 6px}
/* teacher-facing pages */
.tp{font-family:'Andika';font-size:11pt;line-height:1.38}
.tp.dense{font-size:10.2pt;line-height:1.3}
.tp.dense h2{margin:6px 0 2px}
.tp h2{font:700 16pt 'Fredoka';color:var(--navy);margin:10px 0 4px}
.tp h3{font:700 12.5pt 'Fredoka';color:var(--red);margin:8px 0 2px}
.tp p{margin-bottom:5px}
.tp ul,.tp ol{padding-left:20px;margin-bottom:5px}
.tp li{margin-bottom:2px}
.tp table{width:100%;border-collapse:collapse;font-size:9.6pt;line-height:1.25;margin-bottom:6px}
.tp th{background:var(--navy);color:#fff;text-align:left;padding:4px 6px;font:700 10pt 'Fredoka'}
.tp td{border-bottom:1px solid #D5DCE6;padding:3px 6px;vertical-align:top}
.tp tr.sec td{background:var(--cream);font-weight:700;color:var(--navy);border-top:2px solid var(--gold)}
.tp code{font-family:'DejaVu Sans Mono',monospace;font-size:8.8pt;background:#EEF2F8;padding:0 3px;border-radius:3px;white-space:nowrap}
.tp .cols{display:grid;grid-template-columns:1fr 1fr;gap:0 22px}
.tp .box{border:2px solid var(--gold);background:var(--cream);border-radius:12px;padding:6px 12px;margin:6px 0}
.glance{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.glance .gb{border:2px solid var(--line);border-radius:14px;padding:8px 12px}
.glance .gb h3{margin-top:0}
.bigcode{display:flex;gap:10px;justify-content:center;margin:8px 0}
.bigcode .digit{width:.8in;height:.8in;font-size:34pt}
`;

// ---------------------------------------------------------------- helpers
const doc = (title, pages, key = false) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${CSS}</style></head><body class="${key ? 'key' : ''}">${pages.join('\n')}</body></html>`;

function page(inner, { n, key = false, cls = '', label = '' } = {}) {
  return `<section class="page"><div class="frame ${cls}">${key ? '<div class="keytag">Answer Key</div>' : ''}${inner}
  <footer>&copy; ${esc(C.BRAND)} &nbsp;&bull;&nbsp; ${esc(C.TITLE)}${label ? ` &nbsp;&bull;&nbsp; ${esc(label)}` : ''}${n ? ` &nbsp;&bull;&nbsp; ${n}` : ''}</footer></div></section>`;
}
const mh = (badge, title, art = '') => `<div class="mh"><span class="badge">${esc(badge)}</span><h1>${esc(title)}</h1>${art}</div>`;
const lockBox = (text, digit, key) => `<div class="lock">${A.mailbox(64)}<p class="t">${text}</p><div class="digit">${key ? digit : ''}</div></div>`;
const starMark = (w = 26) => `<span class="starq">${A.star(w)}</span>`;
const lineSvg = () => `<svg height="54" width="100%" preserveAspectRatio="none"><line x1="0" y1="3" x2="100%" y2="3" stroke="#1B2330" stroke-width="2"/><line x1="0" y1="28" x2="100%" y2="28" stroke="#8C97A8" stroke-width="1.6" stroke-dasharray="8 7"/><line x1="0" y1="52" x2="100%" y2="52" stroke="#1B2330" stroke-width="2.5"/></svg>`;

function icons(icon, n, groupOf = 5, size = 34, rowOf = 10) {
  let s = '';
  for (let i = 0; i < n; i++) {
    if (i && i % rowOf === 0) s += '<span class="br"></span>';
    else if (i && i % groupOf === 0) s += '<span class="gap"></span>';
    s += A.icons[icon](size);
  }
  return s;
}

function mathPicture(p) {
  const pic = p.pic;
  if (pic.kind === 'join') return `<div class="picrow">${icons(pic.icon, pic.a)}<span class="br"></span><span class="op" style="margin-left:0">+</span>${icons(pic.icon, pic.b)}</div>`;
  if (pic.kind === 'takeaway') return `<div class="picrow">${icons(pic.icon, pic.a)}</div>`;
  if (pic.kind === 'compare') return `<div class="picrow"><div class="cmp"><div class="r"><span class="nm">${pic.la}</span>${icons(pic.icon, pic.a, 99, 28, 99)}</div><div class="r"><span class="nm">${pic.lb}</span>${icons(pic.icon, pic.b, 99, 28, 99)}</div></div></div>`;
  if (pic.kind === 'tens') return `<div class="picrow">${Array.from({ length: pic.n }, () => A.box10(76)).join('<span class="gap"></span>')}</div>`;
  if (pic.kind === 'three') return `<div class="picrow"><div class="three">${pic.parts.map(([n, c]) => `<div class="grp"><div>${Array.from({ length: n }, () => A.pennant(c, 30)).join('')}</div><div class="lab">${c}</div></div>`).join('')}</div></div>`;
  return '';
}

// ---------------------------------------------------------------- student pages
function coverPage() {
  const inner = `<div class="cstars">${A.star(30)}${A.star(38, '#fff')}${A.star(30)}</div>
    <div class="grade">1st Grade</div>
    <h1 class="ctitle">Mission:<br><em>Thank a Hero!</em></h1>
    <p class="csub">Veterans Day Reading &amp; Math Escape Room</p>
    <div class="cart">${A.flag(90)}${A.mailbox(250)}${A.flag(90)}</div>
    <p class="t" style="font-weight:700">Read. Solve. Decode. Open the mailbox!</p>
    <div class="cname">Name: <span class="line"></span></div>
    <div class="brand">${esc(C.BRAND)}</div>
    <div class="mascot">${A.pencilMascot(118)}</div>`;
  return page(inner, { cls: 'cover' });
}

function briefingPage(n) {
  const missions = [
    [A.book(52), 'Mission 1', 'Read a story'],
    [A.mathIcon(52), 'Mission 2', 'Solve math'],
    [A.tagIcon(56), 'Mission 3', 'Crack dog tags'],
    [A.abcIcon(56), 'Mission 4', 'Fix the words'],
  ];
  const inner = `${mh('Your Mission', 'Open the Thank-You Mailbox', A.pencilMascot(46))}
    <p class="dir">Read the story. Then start Mission 1!</p>
    <div class="story"><ul>${C.story.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><div>${A.mailbox(190)}</div></div>
    <div class="maph">Check off each mission when you finish.</div>
    <div class="map">${missions.map(([ic, t, s]) => `<div class="m">${ic}<b>${t}</b><span>${s}</span><div class="done"><i></i> Done!</div></div>`).join('')}</div>`;
  return page(inner, { n });
}

function passagePage(n) {
  let k = 0;
  const paras = C.passage.map((p) => `<p>${p.map((s) => `<span class="sn">${++k}</span>${esc(s)}`).join(' ')}</p>`).join('');
  const inner = `${mh('Mission 1', C.passageTitle, A.poppy(44) + A.flag(44))}
    <p class="dir">Read the story. Then answer the questions.</p>
    <div class="passage">${paras}</div>
    <div class="wtk"><h3>Words to Know</h3><div class="g">${C.wordsToKnow.map(([w, d]) => `<div><b>${w}</b>: ${esc(d)}</div>`).join('')}</div></div>`;
  return page(inner, { n });
}

function questionsPage(n, key) {
  const qs = C.m1Questions.map((q, i) => {
    const head = `<div class="qt"><span class="qn">${i + 1}</span><span>${q.star ? starMark() : ''}${esc(q.q)}</span></div>`;
    if (q.type === 'tf') {
      return `<div class="q">${head}<div class="choices two">${[['T', 'True'], ['F', 'False']].map(([l, w]) => `<div class="choice ${q.answer === l ? 'ok' : ''}"><span class="bubble">${l}</span>${w}</div>`).join('')}</div></div>`;
    }
    if (q.type === 'pic') {
      return `<div class="q">${head}<div class="choices pics">${q.pictures.map((p, j) => `<div class="choice ${q.answer === L[j] ? 'ok' : ''}">${A[p](58)}<div class="row"><span class="bubble">${L[j]}</span>${esc(q.choices[j])}</div></div>`).join('')}</div></div>`;
    }
    return `<div class="q">${head}<div class="choices">${q.choices.map((c, j) => `<div class="choice ${q.answer === L[j] ? 'ok' : ''}"><span class="bubble">${L[j]}</span>${esc(c).replace(/ (\d)/g, '&nbsp;$1')}</div>`).join('')}</div></div>`;
  }).join('');
  const inner = `${mh('Mission 1', 'Story Questions', A.book(44))}
    <p class="dir">Circle the right answer.</p>
    ${qs}
    ${lockBox(`${starMark(24)}Look at the star question. The number you circled is your <u>Mission 1</u> lock number!`, C.code[0], key)}`;
  return page(inner, { n, key });
}

function mathPage(n, key, probs, startIdx, withLock) {
  const html = probs.map((p, j) => {
    const i = startIdx + j;
    return `<div class="prob"><div><div class="txt"><span class="qn">${i + 1}</span><div><p class="t">${p.star ? starMark() : ''}${esc(p.text.join(' '))}</p><p class="t ask">${esc(p.ask)}</p></div></div></div>
      <div class="ansc"><div class="ab">${key ? p.answer : ''}</div><span class="unit">${esc(p.unit)}</span></div>
      ${mathPicture(p)}</div>`;
  }).join('');
  const lock = withLock ? lockBox(`${starMark(24)}Look back at the star problem. Its answer is your <u>Mission 2</u> lock number!`, C.code[1], key) : '';
  const inner = `${mh('Mission 2', 'Veterans Day Math', A.mathIcon(44))}
    <p class="dir">Solve. Write the answer in the box.</p>${html}${lock}`;
  return page(inner, { n, key, cls: withLock ? '' : 'fill' });
}

function decoderPage(n, key) {
  const keyGrid = Array.from({ length: 26 }, (_, i) => `<div><b>${String.fromCharCode(65 + i)}</b><span>${i + 1}</span></div>`).join('');
  const tags = C.m3Tags.map((t, i) => {
    const cells = C.encode(t.word).map((num, j) => `<div class="cell"><span class="n">${num}</span><div class="lb">${key ? t.word[j] : ''}</div></div>`).join('');
    return `<div class="tagw"><div class="lbl">${t.star ? A.star(26) : ''}Tag ${i + 1}</div><div class="tag">${cells}</div></div>`;
  }).join('');
  const inner = `${mh('Mission 3', 'Dog Tag Decoder', A.tagIcon(50))}
    <p class="dir">Use the key. Write the letter under each number.</p>
    <div class="keygrid">${keyGrid}</div>
    <div class="tags">${tags}</div>
    ${lockBox(`${starMark(24)}Tag 4 is a number word. That number is your <u>Mission 3</u> lock number!`, C.code[2], key)}`;
  return page(inner, { n, key });
}

function scramblePage(n, key) {
  const bank = C.wordBank.map((w) => `<div class="it">${A[C.wordBankPics[w]](62)}${w}</div>`).join('');
  const rows = C.m4Words.map((w, i) => `<div class="scr"><span class="qn">${i + 1}${w.star ? `<span class="qs">${A.star(28)}</span>` : ''}</span>
      <div class="tiles">${w.scrambled.split('').map((c) => `<div class="tile">${c}</div>`).join('')}</div>
      <span class="arrow">&rarr;</span><div class="boxes">${w.word.split('').map((c) => `<div class="lb">${key ? c : ''}</div>`).join('')}</div></div>`).join('');
  const inner = `${mh('Mission 4', 'Word Scramble', A.abcIcon(50))}
    <p class="dir">Fix the mixed-up words. Use the word bank.</p>
    <div class="bank"><h3>Word<br>Bank</h3>${bank}</div>
    ${rows}
    ${lockBox(`${starMark(24)}Count the letters in the star word. That number is your <u>Mission 4</u> lock number!`, C.code[3], key)}`;
  return page(inner, { n, key });
}

function finalePage(n, key) {
  const inner = `${mh('Finale', 'Open the Mailbox!', A.star(40))}
    <p class="dir">Write your 4 lock numbers in order.</p>
    <div style="text-align:center">${A.mailbox(260, key)}</div>
    <div class="codes">${C.code.map((d, i) => `<div class="c"><div class="digit">${key ? d : ''}</div>Mission ${i + 1}</div>`).join('')}</div>
    <p class="tip">Show your teacher. Does the lock open?</p>
    <p class="tip" style="color:#4A5568">Not yet? ${esc(C.finale.hint)}</p>
    <div class="yay">${A.star(26)} ${esc(C.finale.success)} ${A.star(26)}</div>`;
  return page(inner, { n, key });
}

function cardPage(n) {
  const inner = `${mh('Bonus', 'Make a Thank-You Card', A.card(52))}
    <p class="dir">Draw a picture. Then write a note to a veteran.</p>
    <div class="cardf">
      <div class="corner" style="top:-16px;left:-16px">${A.star(34)}</div><div class="corner" style="top:-16px;right:-16px">${A.star(34)}</div>
      <p class="dear">Dear Veteran,</p>
      <div class="draw">Draw your picture here.</div>
      <div class="wl"><span>Thank you for</span>${lineSvg()}</div>
      <div class="wl">${lineSvg()}</div>
      <div class="wl"><span>From,</span>${lineSvg()}</div>
    </div>`;
  return page(inner, { n });
}

function studentPages(key = false) {
  return {
    cover: coverPage(),
    brief: briefingPage(2),
    passage: passagePage(3),
    questions: questionsPage(4, key),
    math1: mathPage(5, key, C.m2Problems.slice(0, 3), 0, false),
    math2: mathPage(6, key, C.m2Problems.slice(3), 3, true),
    decoder: decoderPage(7, key),
    scramble: scramblePage(8, key),
    finale: finalePage(9, key),
    card: cardPage(10),
  };
}

// ---------------------------------------------------------------- answer key (teacher-facing pages)
function glancePage(n) {
  const m1 = C.m1Questions.map((q, i) => `<li>${esc(q.q)} <b>${q.answer}</b>${q.choices ? ` (${esc(q.choices[L.indexOf(q.answer)])})` : q.answer === 'F' ? ' (False)' : ''}${q.star ? ' &#9733;' : ''}</li>`).join('');
  const m2 = C.m2Problems.map((p) => `<li>${esc(p.text.join(' '))} ${esc(p.ask)} <b>${p.answer}</b>${p.star ? ' &#9733;' : ''}</li>`).join('');
  const m3 = C.m3Tags.map((t) => `<li><code>${C.encode(t.word).join('-')}</code> = <b>${t.word}</b>${t.star ? ' &#9733;' : ''}</li>`).join('');
  const m4 = C.m4Words.map((w) => `<li>${w.scrambled} = <b>${w.word}</b>${w.star ? ' &#9733;' : ''}</li>`).join('');
  const inner = `${mh('Answer Key', 'Answers at a Glance', A.pencilMascot(46))}
    <div class="tp">
      <p>The star (&#9733;) item in each mission gives that mission's lock number. The Google Form shows the same number at the start of the next section.</p>
      <div class="bigcode">${C.code.map((d) => `<div class="digit">${d}</div>`).join('')}</div>
      <p style="text-align:center;font:700 14pt 'Fredoka';color:var(--navy)">Mailbox code: ${C.codeString} (Mission 1 = ${C.code[0]}, Mission 2 = ${C.code[1]}, Mission 3 = ${C.code[2]}, Mission 4 = ${C.code[3]})</p>
      <div class="glance">
        <div class="gb"><h3>Mission 1: Reading</h3><ol>${m1}</ol><p>Lock number <b>${C.code[0]}</b>: the flag has 3 colors.</p></div>
        <div class="gb"><h3>Mission 2: Math</h3><ol>${m2}</ol><p>Lock number <b>${C.code[1]}</b>: answer to problem 3.</p></div>
        <div class="gb"><h3>Mission 3: Dog Tags</h3><ol>${m3}</ol><p>Lock number <b>${C.code[2]}</b>: tag 4 spells FIVE.</p></div>
        <div class="gb"><h3>Mission 4: Word Scramble</h3><ol>${m4}</ol><p>Lock number <b>${C.code[3]}</b>: "hero" has 4 letters.</p></div>
      </div>
    </div>`;
  return page(inner, { n, label: 'Answer Key' });
}

function hintsPage(n) {
  const rows = [];
  C.m1Questions.forEach((q, i) => rows.push(['Mission 1', `Q${i + 1}`, q.answer, q.hint]));
  C.m2Problems.forEach((p, i) => rows.push(['Mission 2', `Problem ${i + 1}`, p.answer, p.hint]));
  C.m3Tags.forEach((t, i) => rows.push(['Mission 3', `Tag ${i + 1}`, t.word.toLowerCase(), t.hint]));
  C.m4Words.forEach((w, i) => rows.push(['Mission 4', `Word ${i + 1}`, w.word, w.hint]));
  rows.push(['Finale', 'Code', C.codeString, C.finale.hint]);
  let last = '';
  const body = rows.map(([m, q, a, h]) => {
    const sec = m !== last ? `<tr class="sec"><td colspan="3">${m}</td></tr>` : '';
    last = m;
    return `${sec}<tr><td style="width:18%">${q}</td><td style="width:14%"><b>${esc(a)}</b></td><td>${esc(h)}</td></tr>`;
  }).join('');
  const inner = `${mh('Answer Key', 'Clue Cards', A.star(40))}
    <div class="tp">
      <p>These are the same clues the Google Form shows when a student types a wrong answer. On paper, read the clue aloud when a student is stuck. No clue gives away the answer.</p>
      <table><tr><th>Question</th><th>Answer</th><th>Clue for a wrong answer</th></tr>${body}</table>
    </div>`;
  return page(inner, { n, label: 'Answer Key' });
}

function formSheetPages(startN) {
  // Split the form spec across pages so each table fits.
  const rowsFor = (items) => items.map((it) => {
    if (it.type === 'header' || it.type === 'section') {
      return `<tr class="sec"><td colspan="3">${it.type === 'header' ? 'Form title' : 'Add section'}: ${esc(it.title)}</td></tr><tr><td colspan="3"><b>Description:</b> ${esc(it.description).replace(/\n/g, '<br>')}</td></tr>`;
    }
    const v = it.validation
      ? it.validation.kind === 'regex'
        ? `Regular expression &rarr; Matches &rarr; <code>${esc(it.validation.pattern)}</code>`
        : `Number &rarr; Equal to &rarr; <code>${it.validation.value}</code>`
      : 'None (Required only)';
    return `<tr><td style="width:36%"><b>${esc(it.title)}</b>${it.help ? `<br><span style="color:#4A5568">${esc(it.help).replace(/\n/g, '<br>')}</span>` : ''}</td><td style="width:30%">${v}</td><td>${it.error ? esc(it.error) : ''}</td></tr>`;
  }).join('');
  const head = '<tr><th>Question (Short answer, Required ON)</th><th>Response validation</th><th>Custom error text (the clue)</th></tr>';
  const parts = F.splitForPages();
  return parts.map((items, i) => page(`${mh('Google Form', `Copy-Paste Sheet${parts.length > 1 ? ` (${i + 1} of ${parts.length})` : ''}`, A.mailbox(48))}
    <div class="tp">${i === 0 ? '<p>Paste each line into your form from top to bottom. Every question is a <b>Short answer</b> with <b>Required</b> turned on. The steps are in the Teacher Guide, page 2. The Auto-Builder file makes this whole form for you.</p>' : ''}
    <table>${head}${rowsFor(items)}</table></div>`, { n: startN + i, label: 'Answer Key' }));
}

// ---------------------------------------------------------------- teacher guide
function guidePages() {
  const p1 = `${mh('Teacher Guide', 'Mission: Thank a Hero!', A.pencilMascot(46))}
  <div class="tp dense">
    <p>Thank you for choosing ${esc(C.BRAND)}! In this Veterans Day escape room, first graders help Mr. Pencil open a locked Thank-You Mailbox. Each mission they finish gives them one number of the 4-digit lock. It works as a <b>Google Form</b> or as a <b>no-prep printable</b>.</p>
    <div class="cols">
      <div>
        <h2>What's Inside</h2>
        <ul>
          <li><b>Student Printable</b> (10 pages): cover, mission story, reading passage, story questions, math word problems, dog tag decoder, word scramble, mailbox finale, thank-you card.</li>
          <li><b>Answer Key</b>: answers at a glance, clue cards, Google Form copy-paste sheet, and filled-in student pages.</li>
          <li><b>Google Form Auto-Builder</b> file and optional form pictures.</li>
          <li><b>Terms of Use</b>.</li>
        </ul>
        <h2>The 4 Missions</h2>
        <ol>
          <li><b>Reading:</b> a 137-word passage, "What Is Veterans Day?", with 5 questions.</li>
          <li><b>Math:</b> 6 word problems. Add and subtract within 20, compare, count by tens, add three numbers.</li>
          <li><b>Dog Tag Decoder:</b> 4 tags. A = 1, B = 2, and so on.</li>
          <li><b>Word Scramble:</b> 5 words with a picture word bank.</li>
        </ol>
        <h2>Timing</h2>
        <p>About <b>20 to 30 minutes</b>. Allow up to 40 minutes early in the year or if students read on their own.</p>
      </div>
      <div>
        <h2>Printable Version (no devices)</h2>
        <ol>
          <li>Print pages 1 to 10 in black and white. One-sided works best.</li>
          <li>Read the mission story (page 2) together.</li>
          <li>Students write each lock number in the box at the bottom of each mission.</li>
          <li>On page 9 they write the 4 numbers in order and show you. The code is <b>${C.codeString}</b>.</li>
          <li>Stuck students? Read them a clue from the Clue Cards page. No clue gives the answer away.</li>
        </ol>
        <h2>Digital Version (Google Form)</h2>
        <p>Build the form once (page 2), then share the student link in Google Classroom. Students cannot move to the next mission until every answer is right. A wrong answer shows a friendly clue in red.</p>
        <h2>Ways to Use It</h2>
        <ul>
          <li><b>Whole class:</b> read the passage aloud, then let students solve.</li>
          <li><b>Partners:</b> one reads, one writes. Switch each mission.</li>
          <li><b>Early finishers:</b> page 10, the thank-you card. Mail the cards to a local veterans group.</li>
          <li><b>Centers:</b> one mission per center for the week of November 11.</li>
          <li><b>Support:</b> read the passage and word problems aloud. The math pictures can be counted.</li>
        </ul>
        <h2>Skills (Common Core)</h2>
        <p>RI.1.1, RI.1.4, RF.1.3, RF.1.4, 1.OA.A.1, 1.OA.A.2, 1.NBT.B.2c</p>
      </div>
    </div>
  </div>`;

  const p2 = `${mh('Teacher Guide', 'Build the Google Form', A.mailbox(48))}
  <div class="tp dense">
    <p>You need a free Google account. Pick <b>one</b> way. Both make the same form.</p>
    <div class="box">
      <h2 style="margin-top:0">Way 1: Automatic (about 2 minutes)</h2>
      <ol>
        <li>Go to <b>script.google.com</b> and sign in. Click <b>New project</b>.</li>
        <li>Delete the few lines already in the big white box.</li>
        <li>Open the file <b>Google Form Auto-Builder.txt</b>. Select all of it and copy. Paste it into the white box.</li>
        <li>Click the <b>Save</b> icon (a floppy disk). Then click <b>Run</b>.</li>
        <li>Google asks for permission. Click <b>Review permissions</b>, pick your account, click <b>Advanced</b>, then <b>Go to project</b>, then <b>Allow</b>. You see this warning because you made the script yourself.</li>
        <li>When it says "Execution completed", look in the log at the bottom. Copy the <b>EDIT link</b> (for you) and the <b>STUDENT link</b>.</li>
      </ol>
    </div>
    <h2>Way 2: By Hand (about 15 minutes)</h2>
    <p>Keep the <b>Google Form Copy-Paste Sheet</b> (in the Answer Key) open. Paste every line from top to bottom.</p>
    <ol>
      <li>Go to <b>forms.google.com</b> and click <b>Blank form</b>. Paste the form title and description.</li>
      <li>Click the question. Change the type to <b>Short answer</b>. Paste the name question. Turn <b>Required</b> on.</li>
      <li>To start a new mission, click <b>Add section</b> in the side toolbar. It looks like two stacked bars. Paste the section title and description.</li>
      <li>Add each question with the <b>+</b> button. Set it to <b>Short answer</b>, paste the question, and turn <b>Required</b> on.</li>
      <li>To add the choices line under a question, click the <b>three dots</b> at the bottom right and pick <b>Description</b>.</li>
      <li>Click the three dots again and pick <b>Response validation</b>.
        <ul>
          <li>Letter and word answers: choose <b>Regular expression</b>, then <b>Matches</b>. Paste the pattern.</li>
          <li>Math answers: choose <b>Number</b>, then <b>Equal to</b>. Type the number.</li>
          <li>Paste the clue into <b>Custom error text</b>. This is the hint students see.</li>
        </ul></li>
      <li>After the code question, add the last section, "You did it!".</li>
      <li>Click <b>Settings</b>, then <b>Presentation</b>. Turn on <b>Show progress bar</b>. Paste the celebration line as the <b>Confirmation message</b>.</li>
    </ol>
    <h2>Before Students Use It</h2>
    <ul>
      <li>Click the <b>eye</b> icon to preview. Type a wrong answer and check that the clue shows up.</li>
      <li>Optional: add the pictures from the <b>Google Form Images</b> folder. Click the image icon next to a question.</li>
      <li>To share, click <b>Send</b>, then the <b>link</b> icon, then <b>Copy</b>. Post the link in Google Classroom.</li>
      <li>Keep the edit link private. Students only get the student link.</li>
    </ul>
    <p><b>Why it works:</b> each answer is Required and has response validation. Google Forms will not let students click <b>Next</b> until every answer in a mission is right. The next section then shows their lock number.</p>
  </div>`;
  return [page(p1, { n: 1, label: 'Teacher Guide' }), page(p2, { n: 2, label: 'Teacher Guide' })];
}

// ---------------------------------------------------------------- terms of use
function termsPage() {
  const year = new Date().getFullYear();
  const inner = `${mh('Terms of Use', 'Thank You!', A.pencilMascot(46))}
  <div class="tp" style="font-size:11.5pt">
    <p>Thank you for buying <b>${esc(C.TITLE)} ${esc(C.SUBTITLE)}</b>. I hope your first graders love opening the Thank-You Mailbox. If they do, please leave a review on TPT. Reviews also earn you TPT credits.</p>
    <div class="cols">
      <div class="box"><h2 style="margin-top:0">You May</h2><ul>
        <li>Use this resource with your own students in your own classroom.</li>
        <li>Print as many copies as your class needs.</li>
        <li>Share the Google Form student link with your own students.</li>
        <li>Post it in a password-protected class site, such as Google Classroom or Seesaw.</li>
        <li>Use it with your own tutoring or homeschool students.</li>
      </ul></div>
      <div class="box" style="border-color:var(--red)"><h2 style="margin-top:0">You May Not</h2><ul>
        <li>Share the files or the form edit link with other teachers. Please send them to my store instead.</li>
        <li>Post any part of it on a public website, a shared drive, or a school-wide site.</li>
        <li>Sell, give away, or claim any part of it as your own.</li>
        <li>Use any part of it to make other products, free or paid.</li>
      </ul></div>
    </div>
    <h2>License</h2>
    <p>Your purchase is a <b>single classroom license</b> for one teacher. Buying for a team or school? Please buy additional licenses in your TPT purchases page. They come at a discount.</p>
    <h2>Copyright</h2>
    <p>&copy; ${year} ${esc(C.BRAND)}. All rights reserved. This resource is protected by copyright law, including the Digital Millennium Copyright Act (DMCA).</p>
    <h2>Credits</h2>
    <ul>
      <li><b>Writing, activities, and clip art:</b> original work by ${esc(C.BRAND)}.</li>
      <li><b>Fonts:</b> Andika by SIL International and Fredoka by Milena Brand&atilde;o and Hafontia. Both are used under the SIL Open Font License 1.1.</li>
      <li>Google Forms is a trademark of Google LLC. This resource is not made by or endorsed by Google.</li>
    </ul>
    <h2>Questions?</h2>
    <p>Please use the <b>Ask a Question</b> tab on my TPT store before leaving feedback. I am happy to help!</p>
  </div>`;
  return page(inner, { label: 'Terms of Use' });
}

// ---------------------------------------------------------------- google form images
const imageSnippets = {
  'form-header.png': [1600, 400, `<div style="width:1600px;height:400px;background:#1E3A6E;display:flex;align-items:center;gap:40px;padding:0 70px;color:#fff">
      ${A.flag(170)}<div style="flex:1"><div style="font:700 74px/1 'Fredoka';white-space:nowrap">Mission: <span style="color:#F2C230">Thank a Hero!</span></div><div style="font:700 44px 'Andika';margin-top:14px">Veterans Day Escape Room &bull; 1st Grade</div></div>
      <div style="background:#FFF6E6;border-radius:40px;padding:14px">${A.mailbox(260)}</div></div>`],
  'mission-1-flowers.png': [1200, 460, `<div style="width:1200px;height:460px;background:#fff;display:flex;justify-content:space-around;align-items:center">
      ${C.m1Questions[4].pictures.map((p, j) => `<div style="text-align:center">${A[p](280)}<div style="font:700 64px 'Fredoka';color:#1E3A6E">${L[j]}</div></div>`).join('')}</div>`],
  'mission-3-decoder-key.png': [1600, 300, `<div style="width:1600px;padding:30px;background:#fff"><div class="keygrid" style="transform:scale(2.05);transform-origin:top left;width:753px">${Array.from({ length: 26 }, (_, i) => `<div><b>${String.fromCharCode(65 + i)}</b><span>${i + 1}</span></div>`).join('')}</div></div>`],
  'mission-4-word-bank.png': [1400, 360, `<div style="width:1400px;height:360px;background:#FFF6E6;display:flex;justify-content:space-around;align-items:center">
      ${C.wordBank.map((w) => `<div style="text-align:center">${A[C.wordBankPics[w]](190)}<div style="font:700 60px 'Andika'">${w}</div></div>`).join('')}</div>`],
  'finale-open-mailbox.png': [1200, 600, `<div style="width:1200px;height:600px;background:#fff;display:flex;align-items:center;justify-content:center;gap:50px">${A.mailbox(520, true)}${A.pencilMascot(300)}</div>`],
};

// ---------------------------------------------------------------- render
async function main() {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) {
    console.error('Playwright not found. Run with NODE_PATH=$(npm root -g)'); process.exit(1);
  }
  const S = studentPages(false);
  const K = studentPages(true);
  const guide = guidePages();
  const formSheets = formSheetPages(3);
  const keyPages = [glancePage(1), hintsPage(2), ...formSheets];
  const keyStart = keyPages.length + 1;
  // Answered student pages, renumbered after the key's own pages.
  const answered = ['questions', 'math1', 'math2', 'decoder', 'scramble', 'finale'].map((k, i) => K[k].replace(/(&bull;&nbsp; )\d+(<\/footer>)/, `$1Answer Key &nbsp;&bull;&nbsp; ${keyStart + i}$2`));

  const docs = [
    { file: 'Student Printable - Mission Thank a Hero.pdf', html: 'student.html', title: `${C.TITLE} Student Printable`, pages: Object.values(S), student: true },
    { file: 'Answer Key - Mission Thank a Hero.pdf', html: 'answer-key.html', title: `${C.TITLE} Answer Key`, pages: [...keyPages, ...answered], key: true },
    { file: 'Teacher Guide - Mission Thank a Hero.pdf', html: 'teacher-guide.html', title: `${C.TITLE} Teacher Guide`, pages: guide },
    { file: 'Terms of Use - Mr Pencil and Co.pdf', html: 'terms-of-use.html', title: `${C.BRAND} Terms of Use`, pages: [termsPage()] },
  ];

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  const problems = [];

  for (const d of docs) {
    const htmlPath = path.join(HTML_DIR, d.html);
    fs.writeFileSync(htmlPath, doc(d.title, d.pages, d.key));
    await pg.goto('file://' + htmlPath, { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    const fontsOk = await pg.evaluate(() => ['Andika', 'Fredoka'].every((f) => document.fonts.check(`16px ${f}`)));
    if (!fontsOk) problems.push(`${d.html}: fonts did not load`);
    // Overflow check: nothing may spill outside a page frame.
    const over = await pg.evaluate(() => [...document.querySelectorAll('.frame')].map((f, i) => {
      const fb = f.getBoundingClientRect();
      const foot = f.querySelector('footer').getBoundingClientRect();
      const bad = [...f.querySelectorAll('*')].find((el) => {
        if (el.closest('footer') || el.closest('.mascot') || el.closest('.corner') || el.closest('svg')) return false;
        const r = el.getBoundingClientRect();
        return r.height && (r.bottom > foot.top - 2 || r.right > fb.right - 2);
      });
      if (bad) { const r = bad.getBoundingClientRect(); return `${i + 1} (${bad.tagName.toLowerCase()}.${bad.className} "${bad.textContent.trim().slice(0, 25)}" bottom ${Math.round(r.bottom - foot.top)}px past footer, right ${Math.round(r.right - fb.right)}px)`; }
      return f.scrollHeight > f.clientHeight + 1 ? `${i + 1} (scroll)` : 0;
    }).filter(Boolean));
    if (over.length) problems.push(`${d.html}: content overflows on page(s) ${over.join(', ')}`);
    // Font size check for student pages: all student-facing text must be 18pt (24px) or larger.
    if (d.student) {
      const small = await pg.evaluate(() => {
        const out = [];
        document.querySelectorAll('.frame *').forEach((el) => {
          if (el.closest('footer') || el.closest('svg') || el.closest('.sn') || el.closest('.brand') || el.closest('.badge')) return;
          const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
          if (own && parseFloat(getComputedStyle(el).fontSize) < 23.9) out.push(`${el.tagName}.${el.className}: "${el.textContent.trim().slice(0, 30)}" ${getComputedStyle(el).fontSize}`);
        });
        return out;
      });
      if (small.length) problems.push(`${d.html}: text under 18pt -> ${small.join(' | ')}`);
      const dirs = await pg.evaluate(() => [...document.querySelectorAll('.dir')].map((e) => parseFloat(getComputedStyle(e).fontSize)).filter((s) => s < 31.9));
      if (dirs.length) problems.push(`${d.html}: directions under 24pt`);
    }
    await pg.pdf({ path: path.join(ROOT, d.file), width: '8.5in', height: '11in', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true });
    const nPages = await pg.evaluate(() => document.querySelectorAll('.page').length);
    console.log(`  ${d.file}: ${nPages} page(s)`);
    if (QA_DIR) {
      fs.mkdirSync(QA_DIR, { recursive: true });
      const els = await pg.$$('.page');
      for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(QA_DIR, `${d.html.replace('.html', '')}-${String(i + 1).padStart(2, '0')}.png`) });
    }
  }

  // Google Form images
  const ipg = await (await browser.newContext({ deviceScaleFactor: 1 })).newPage();
  for (const [name, [w, h, snippet]] of Object.entries(imageSnippets)) {
    const p = path.join(HTML_DIR, 'img-' + name.replace('.png', '.html'));
    fs.writeFileSync(p, `<!doctype html><html><head><meta charset="utf-8"><style>${CSS} body{margin:0}</style></head><body>${snippet}</body></html>`);
    await ipg.setViewportSize({ width: w, height: h });
    await ipg.goto('file://' + p, { waitUntil: 'load' });
    await ipg.evaluate(() => document.fonts.ready);
    await ipg.screenshot({ path: path.join(IMG_DIR, name), clip: { x: 0, y: 0, width: w, height: h } });
  }
  console.log(`  Google Form Images: ${Object.keys(imageSnippets).length} PNG files`);
  await browser.close();

  // Apps Script builder + full-content manuscript
  fs.writeFileSync(path.join(ROOT, 'Google Form Auto-Builder.txt'), F.appsScript());
  fs.writeFileSync(path.join(ROOT, '01 Full Content - All Text, Answers, Hints, Build Steps.md'), F.manuscript());
  console.log('  Google Form Auto-Builder.txt and 01 Full Content .md written');

  if (problems.length) { console.log('\nLAYOUT PROBLEMS:'); problems.forEach((p) => console.log('  x ' + p)); process.exit(1); }
  console.log('\nBuild complete. No overflow. All student text is 18pt or larger.');
}

main().catch((e) => { console.error(e); process.exit(1); });

// Builds TPT thumbnails (1500x1500 PNG) and a square preview video (MP4) from the real product pages.
// Run after build.js:  NODE_PATH=$(npm root -g) node marketing.js
// Needs an ffmpeg with libx264 (set FFMPEG=/path/to/ffmpeg, or `pip install imageio-ffmpeg`).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const C = require('./content');
const A = require('./art');

const ROOT = path.resolve(__dirname, '..');
const HTML = path.join(__dirname, 'html');
const SHOTS = path.join(HTML, 'shots');
const FRAMES = path.join(HTML, 'frames');
const OUT = path.join(ROOT, 'Marketing');
[SHOTS, OUT].forEach((d) => fs.mkdirSync(d, { recursive: true }));

function ffmpegPath() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try { return execFileSync('python3', ['-c', 'import imageio_ffmpeg as f; print(f.get_ffmpeg_exe())']).toString().trim(); } catch (e) { return 'ffmpeg'; }
}

const FONTS = `
@font-face{font-family:'Andika';src:url('../fonts/Andika-400.woff2') format('woff2');font-weight:400}
@font-face{font-family:'Andika';src:url('../fonts/Andika-700.woff2') format('woff2');font-weight:700}
@font-face{font-family:'Fredoka';src:url('../fonts/Fredoka-500.woff2') format('woff2');font-weight:500}
@font-face{font-family:'Fredoka';src:url('../fonts/Fredoka-700.woff2') format('woff2');font-weight:700}`;

// Shared look: navy field, scattered stars, cream panel, red bottom band, pencil badge.
const BASE = `${FONTS}
*{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#1B2330;--navy:#1E3A6E;--red:#C62F3B;--gold:#E3A72F;--cream:#FFF6E6}
body{width:1500px;height:1500px;overflow:hidden;font-family:'Andika';color:var(--ink)}
.stage{position:relative;width:1500px;height:1500px;background:radial-gradient(circle at 30% 20%,#2A4C88 0,#1E3A6E 55%,#162C54 100%);overflow:hidden}
.confetti{position:absolute;inset:0}
.band{position:absolute;left:0;right:0;bottom:0;height:230px;background:var(--red);display:flex;align-items:center;justify-content:center;border-top:10px solid var(--gold)}
.band h2{font:700 96px/1 'Fredoka';color:#fff;text-align:center;letter-spacing:.5px}
.band h2.sm{font-size:78px}
.badge{position:absolute;right:40px;bottom:250px;width:230px;height:230px;border-radius:50%;background:#fff;border:10px solid var(--gold);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 12px 30px rgba(0,0,0,.35)}
.badge b{font:700 21px 'Fredoka';color:var(--red);margin-top:4px;white-space:nowrap}
.badge svg{height:140px;width:auto}
.grade{position:absolute;left:60px;top:60px;background:var(--gold);border:6px solid var(--ink);border-radius:999px;font:700 64px 'Fredoka';padding:8px 44px;transform:rotate(-6deg);box-shadow:0 10px 24px rgba(0,0,0,.3)}
.paper{position:absolute;background:#fff;border-radius:14px;box-shadow:0 30px 60px rgba(0,0,0,.45);overflow:hidden}
.paper img{display:block;width:100%}
.clip{position:absolute;background:#6B4A2E;border-radius:34px;padding:70px 34px 34px;box-shadow:0 30px 60px rgba(0,0,0,.45)}
.clip::before{content:'';position:absolute;left:50%;top:18px;width:230px;height:74px;margin-left:-115px;background:linear-gradient(#C9D1DC,#8E99A8);border-radius:14px;border:5px solid #56606E}
.clip img{display:block;width:100%;border-radius:8px}
.tablet{position:absolute;background:#141A24;border-radius:60px;padding:46px;box-shadow:0 30px 70px rgba(0,0,0,.5)}
.tablet .scr{background:#EEF0F6;border-radius:18px;overflow:hidden;height:100%}
.title{position:absolute;left:0;right:0;text-align:center;color:#fff}
.title h1{font:700 150px/.95 'Fredoka';text-shadow:0 8px 0 rgba(0,0,0,.25)}
.title h1 em{font-style:normal;color:#F2C230}
.title p{font:700 58px/1.15 'Andika';margin-top:18px}
/* generic form mock in the product's own theme */
.fhead{height:190px;background:url('../../Google Form Images/form-header.png') center/cover}
.fcard{background:#fff;margin:22px 26px;border-radius:14px;border-left:10px solid var(--navy);padding:26px 30px;box-shadow:0 2px 6px rgba(0,0,0,.12)}
.fcard .sec{font:700 40px 'Fredoka';color:var(--navy)}
.fcard .q{font:700 38px/1.25 'Andika'}
.fcard .h{font:400 30px/1.3 'Andika';color:#4A5568;margin-top:6px}
.fcard .in{margin-top:20px;border-bottom:4px solid var(--red);font:400 38px 'Andika';padding:6px 2px}
.fcard .err{margin-top:12px;color:#C5221F;font:700 32px/1.25 'Andika';display:flex;gap:10px;align-items:flex-start}
.fcard .err i{flex:none;width:36px;height:36px;border-radius:50%;background:#C5221F;color:#fff;font:700 26px/36px 'Fredoka';text-align:center;font-style:normal}
.fcard.ok{border-left-color:#2E7D4F}
.chip{position:absolute;background:#fff;border-radius:999px;padding:14px 34px;font:700 44px 'Fredoka';color:var(--navy);box-shadow:0 12px 26px rgba(0,0,0,.35);display:flex;align-items:center;gap:14px}
`;

function confetti(seed = 7, n = 38) {
  let x = seed; const r = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  let s = '';
  for (let i = 0; i < n; i++) {
    const size = 18 + r() * 34; const left = r() * 1480; const top = r() * 1260; const rot = r() * 60 - 30;
    const white = r() > 0.55;
    s += `<div style="position:absolute;left:${left}px;top:${top}px;opacity:${white ? 0.28 : 0.55};transform:rotate(${rot}deg)">${A.star(size, white ? '#fff' : '#E3A72F')}</div>`;
  }
  return `<div class="confetti">${s}</div>`;
}
const badge = () => `<div class="badge">${A.pencilMascot(90)}<b>Mr. Pencil &amp; Co</b></div>`;
const img = (name) => `shots/${name}.png`;

function formMock({ section, q, help, answer, clue, ok }) {
  return `<div class="scr"><div class="fhead"></div>
    <div class="fcard"><div class="sec">${section}</div></div>
    <div class="fcard ${ok ? 'ok' : ''}"><div class="q">${q}</div><div class="h">${help}</div><div class="in">${answer}</div>
    ${clue ? `<div class="err"><i>!</i><span>${clue}</span></div>` : ''}${ok ? '<div class="err" style="color:#2E7D4F"><i style="background:#2E7D4F">&#10003;</i><span>Great job! Click Next.</span></div>' : ''}</div></div>`;
}

// ---------------------------------------------------------------- thumbnails
const tag3 = C.m3Tags[1];
const thumbs = {
  '01-cover.png': `<div class="stage">${confetti(3)}
    <div class="grade">1st Grade</div>
    <div class="title" style="top:170px"><h1>Veterans Day<br><em>Escape Room</em></h1><p>Reading Passage &amp; Math</p></div>
    <div class="clip" style="left:90px;top:640px;width:520px;transform:rotate(-5deg)"><img src="${img('student-01')}"></div>
    <div class="tablet" style="left:560px;top:650px;width:760px;height:600px;transform:rotate(4deg)"><div style="zoom:.72;height:139%">${formMock({ section: 'Mission 3: Dog Tag Decoder', q: `Dog tag 2: ${C.encode(tag3.word).join(' - ')}`, help: 'Type the word.', answer: 'hreo', clue: tag3.hint })}</div></div>
    ${badge()}
    <div class="band"><h2 class="sm">Google Form + Printable</h2></div></div>`,

  '02-reading-passage.png': `<div class="stage">${confetti(11)}
    <div class="title" style="top:60px"><h1 style="font-size:120px">Mission 1: <em>Read</em></h1></div>
    <div class="clip" style="left:150px;top:260px;width:640px;transform:rotate(-4deg)"><img src="${img('student-03')}"></div>
    <div class="paper" style="left:720px;top:330px;width:620px;transform:rotate(5deg)"><img src="${img('key-08')}"></div>
    <div class="chip" style="left:760px;top:250px">${A.star(48)} 137 words, 5 questions</div>
    ${badge()}
    <div class="band"><h2>Reading Passage + Questions</h2></div></div>`,

  '03-dog-tag-decoder.png': `<div class="stage">${confetti(19)}
    <div class="title" style="top:60px"><h1 style="font-size:120px">Crack the <em>Code!</em></h1></div>
    <div class="clip" style="left:110px;top:270px;width:640px;transform:rotate(-4deg)"><img src="${img('student-07')}"></div>
    <div class="paper" style="left:760px;top:300px;width:600px;transform:rotate(4deg)"><img src="${img('student-08')}"></div>
    ${badge()}
    <div class="band"><h2 class="sm">Dog Tag Decoder + Word Scramble</h2></div></div>`,

  '04-clues-google-form.png': `<div class="stage">${confetti(29)}
    <div class="title" style="top:60px"><h1 style="font-size:112px">Wrong answer?<br><em>Get a clue!</em></h1></div>
    <div class="tablet" style="left:150px;top:420px;width:1200px;height:800px">${formMock({ section: 'Mission 2: Veterans Day Math', q: `3. ${C.m2Problems[2].text.join(' ')} ${C.m2Problems[2].ask}`, help: 'Type the number only.', answer: '17', clue: C.m2Problems[2].hint })}</div>
    <div class="band"><h2 class="sm">Students Can't Skip Ahead</h2></div></div>`,

  '05-answer-key.png': `<div class="stage">${confetti(41)}
    <div class="title" style="top:60px"><h1 style="font-size:120px">Answer Key <em>Included</em></h1></div>
    <div class="paper" style="left:130px;top:280px;width:560px;transform:rotate(-5deg)"><img src="${img('key-01')}"></div>
    <div class="paper" style="left:520px;top:330px;width:520px;transform:rotate(1deg)"><img src="${img('key-11')}"></div>
    <div class="paper" style="left:870px;top:290px;width:500px;transform:rotate(6deg)"><img src="${img('guide-02')}"></div>
    ${badge()}
    <div class="band"><h2 class="sm">+ Teacher Guide &amp; Form Builder</h2></div></div>`,
};

// ---------------------------------------------------------------- video (1080x1080, 30 fps)
const FPS = 30;
const scenes = [
  // [start, end] in seconds
  { id: 's1', t0: 0, t1: 4.5 },
  { id: 's2', t0: 4.5, t1: 9 },
  { id: 's3', t0: 9, t1: 13.5 },
  { id: 's4', t0: 13.5, t1: 18.5 },
  { id: 's5', t0: 18.5, t1: 23 },
  { id: 's6', t0: 23, t1: 28 },
  { id: 's7', t0: 28, t1: 33 },
];
const DURATION = scenes[scenes.length - 1].t1;

function videoHtml() {
  const V = `${BASE}
  body{width:1080px;height:1080px}
  .stage{width:1080px;height:1080px}
  .sc{position:absolute;inset:0;opacity:0}
  .cap{position:absolute;left:0;right:0;top:44px;text-align:center;color:#fff;font:700 84px/1 'Fredoka';text-shadow:0 6px 0 rgba(0,0,0,.25)}
  .cap em{font-style:normal;color:#F2C230}
  .sub{position:absolute;left:0;right:0;bottom:46px;text-align:center}
  .sub span{background:var(--red);color:#fff;font:700 50px 'Fredoka';padding:12px 36px;border-radius:999px;border:6px solid var(--gold)}
  .pg{position:absolute;left:50%;width:600px;margin-left:-300px;top:170px;border-radius:12px;overflow:hidden;box-shadow:0 26px 50px rgba(0,0,0,.45);background:#fff}
  .pg img{display:block;width:100%}
  .digits{position:absolute;left:0;right:0;top:720px;display:flex;justify-content:center;gap:26px}
  .digits div{width:140px;height:140px;border-radius:24px;background:#fff;border:8px solid var(--gold);display:flex;align-items:center;justify-content:center}
  `;
  const bodies = {
    s1: `<div class="cap" style="top:90px">Veterans Day<br><em>Escape Room</em></div>
         <div id="s1mail" style="position:absolute;left:50%;top:330px;margin-left:-230px">${A.mailbox(460)}</div>
         <div class="sub"><span>1st Grade &bull; Reading &amp; Math</span></div>`,
    s2: `<div class="cap">Mission 1: <em>Read</em></div><div class="pg" id="s2pg"><img src="${img('student-03')}"></div>`,
    s3: `<div class="cap">Mission 2: <em>Solve</em></div><div class="pg" id="s3pg"><img id="s3a" src="${img('student-06')}"><img id="s3b" src="${img('key-10')}" style="position:absolute;inset:0;opacity:0"></div>`,
    s4: `<div class="cap">Mission 3: <em>Decode</em></div><div class="pg" id="s4pg"><img src="${img('student-07')}"><img id="s4b" src="${img('key-11')}" style="position:absolute;inset:0;opacity:0"></div>`,
    s5: `<div class="cap">Mission 4: <em>Unscramble</em></div><div class="pg" id="s5pg"><img src="${img('student-08')}"><img id="s5b" src="${img('key-12')}" style="position:absolute;inset:0;opacity:0"></div>`,
    s6: `<div class="cap">Wrong? <em>Get a clue!</em></div>
         <div class="tablet" style="left:90px;top:190px;width:900px;height:720px" id="s6tab">
           <div id="s6a" style="position:absolute;inset:46px;zoom:.8">${formMock({ section: 'Mission 1: What Is Veterans Day?', q: `3. ${C.m1Questions[2].q}`, help: 'A = November 11 &nbsp; B = July 4 &nbsp; C = December 25', answer: 'B', clue: C.m1Questions[2].hint })}</div>
           <div id="s6b" style="position:absolute;inset:46px;opacity:0;zoom:.8">${formMock({ section: 'Mission 1: What Is Veterans Day?', q: `3. ${C.m1Questions[2].q}`, help: 'A = November 11 &nbsp; B = July 4 &nbsp; C = December 25', answer: 'A', ok: true })}</div>
         </div>
         <div class="sub"><span>Google Form or Printable</span></div>`,
    s7: `<div class="cap" id="s7cap">Open the <em>mailbox!</em></div>
         <div style="position:absolute;left:50%;top:170px;margin-left:-250px"><div id="s7closed">${A.mailbox(500)}</div><div id="s7open" style="position:absolute;inset:0;opacity:0">${A.mailbox(500, true)}</div></div>
         <div class="digits">${[0, 1, 2, 3].map((i) => `<div id="d${i}" style="opacity:0">${A.star(90)}</div>`).join('')}</div>
         <div id="s7end" style="position:absolute;inset:0;opacity:0;background:rgba(22,44,84,.97);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;color:#fff;text-align:center">
           ${A.pencilMascot(170)}
           <div style="font:700 72px/1.05 'Fredoka'">Mission: <span style="color:#F2C230">Thank a Hero!</span></div>
           <div style="font:700 42px/1.35 'Andika'">Answer Key &bull; Teacher Guide<br>Google Form + Printable</div>
           <div style="font:700 46px 'Fredoka';color:#F2C230">Mr. Pencil &amp; Co</div>
         </div>`,
  };
  const layers = scenes.map((s) => `<div class="sc" id="${s.id}">${bodies[s.id]}</div>`).join('');
  const script = `
    const S=${JSON.stringify(scenes)};
    const clamp=(v)=>Math.max(0,Math.min(1,v));
    const ease=(v)=>{v=clamp(v);return v<.5?2*v*v:1-Math.pow(-2*v+2,2)/2};
    const back=(v)=>{v=clamp(v);const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(v-1,3)+c1*Math.pow(v-1,2)};
    const $=(id)=>document.getElementById(id);
    window.render=(t)=>{
      S.forEach((s,i)=>{
        const fin=i===0?1:ease((t-s.t0)/0.5), fout=i===S.length-1?1:1-ease((t-(s.t1-0.5))/0.5);
        $(s.id).style.opacity=(t>=s.t0-0.01&&t<=s.t1)?Math.min(fin,fout):0;
      });
      // s1: mailbox bounces in
      $('s1mail').style.transform='scale('+(0.4+0.6*back(t/0.9))+')';
      // pages glide up and zoom gently
      [['s2pg',S[1]],['s3pg',S[2]],['s4pg',S[3]],['s5pg',S[4]]].forEach(([id,s])=>{
        const k=clamp((t-s.t0)/(s.t1-s.t0));
        $(id).style.transform='translateY('+(60*(1-ease(k*3)))+'px) scale('+(1+0.08*k)+')';
      });
      // answers fade in
      $('s3b').style.opacity=ease((t-(S[2].t0+2.2))/0.8);
      $('s4b').style.opacity=ease((t-(S[3].t0+2.4))/0.8);
      $('s5b').style.opacity=ease((t-(S[4].t0+2.2))/0.8);
      // s6: wrong answer with clue, then fixed
      $('s6b').style.opacity=ease((t-(S[5].t0+2.7))/0.5);
      $('s6tab').style.transform='scale('+(0.92+0.08*ease((t-S[5].t0)/0.8))+')';
      // s7: stars drop into the lock, mailbox opens, end card
      for(let i=0;i<4;i++){const k=(t-(S[6].t0+0.3+i*0.35))/0.45;$('d'+i).style.opacity=clamp(k*2);$('d'+i).style.transform='translateY('+(-120*(1-back(k)))+'px)';}
      $('s7open').style.opacity=ease((t-(S[6].t0+2.0))/0.3);
      $('s7closed').style.opacity=1-ease((t-(S[6].t0+2.0))/0.3);
      $('s7end').style.opacity=ease((t-(S[6].t0+3.1))/0.6);
    };`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${V}</style></head><body><div class="stage">${confetti(5, 30).replace(/1480/g, '1060')}${layers}</div><script>${script}</script></body></html>`;
}

// ---------------------------------------------------------------- run
async function main() {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();

  // 1. High-resolution captures of the real product pages.
  const cap = await (await browser.newContext({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 2 })).newPage();
  const sources = [['student.html', 'student'], ['answer-key.html', 'key'], ['teacher-guide.html', 'guide']];
  for (const [file, prefix] of sources) {
    await cap.goto('file://' + path.join(HTML, file));
    await cap.evaluate(() => document.fonts.ready);
    const els = await cap.$$('.page');
    for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(SHOTS, `${prefix}-${String(i + 1).padStart(2, '0')}.png`) });
  }
  console.log('  captured product pages');

  // 2. Thumbnails.
  const tp = await (await browser.newContext({ viewport: { width: 1500, height: 1500 }, deviceScaleFactor: 1 })).newPage();
  for (const [name, body] of Object.entries(thumbs)) {
    const p = path.join(HTML, 'thumb-' + name.replace('.png', '.html'));
    fs.writeFileSync(p, `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}</style></head><body>${body}</body></html>`);
    await tp.goto('file://' + p);
    await tp.evaluate(() => document.fonts.ready);
    await tp.waitForLoadState('networkidle');
    const overflow = await tp.evaluate(() => [...document.querySelectorAll('.title h1, .band h2')].filter((e) => { const r = document.createRange(); r.selectNodeContents(e); const w = r.getBoundingClientRect().width; return w > 1500 - 120; }).map((e) => e.textContent));
    if (overflow.length) console.log(`  ! ${name}: text too wide: ${overflow.join(' | ')}`);
    await tp.screenshot({ path: path.join(OUT, `TPT Thumbnail ${name}`) });
  }
  console.log(`  ${Object.keys(thumbs).length} thumbnails`);

  // 3. Video frames, then encode.
  fs.rmSync(FRAMES, { recursive: true, force: true });
  fs.mkdirSync(FRAMES, { recursive: true });
  const vp = await (await browser.newContext({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 })).newPage();
  const vfile = path.join(HTML, 'video.html');
  fs.writeFileSync(vfile, videoHtml());
  await vp.goto('file://' + vfile);
  await vp.evaluate(() => document.fonts.ready);
  const total = Math.round(DURATION * FPS);
  for (let f = 0; f < total; f++) {
    await vp.evaluate((t) => window.render(t), f / FPS);
    await vp.screenshot({ path: path.join(FRAMES, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
  }
  await browser.close();
  console.log(`  ${total} video frames`);

  const mp4 = path.join(OUT, 'TPT Preview Video - Mission Thank a Hero.mp4');
  execFileSync(ffmpegPath(), ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FRAMES, 'f%05d.jpg'),
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100', '-shortest',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-c:a', 'aac', '-movflags', '+faststart', mp4]);
  // Short poster frame for the video listing.
  fs.copyFileSync(path.join(FRAMES, `f${String(Math.round(1.5 * FPS)).padStart(5, '0')}.jpg`), path.join(OUT, 'TPT Preview Video - poster.jpg'));
  fs.rmSync(FRAMES, { recursive: true, force: true });
  console.log(`  video: ${path.basename(mp4)} (${DURATION}s, 1080x1080, ${FPS} fps)`);
}

main().catch((e) => { console.error(e); process.exit(1); });

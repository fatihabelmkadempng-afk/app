// Quality gate: run `node check.js`. Exits non-zero if any check fails.
const C = require('./content');

const fails = [];
const notes = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };
const words = (s) => s.replace(/[’']/g, '').split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w));
const tokens = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);

// ---- Passage ----
const sentences = C.passage.flat();
const total = sentences.reduce((n, s) => n + words(s).length, 0);
ok(total >= 120 && total <= 150, `Passage has ${total} words (want 120-150)`);
sentences.forEach((s) => {
  const n = words(s).length;
  ok(n >= 6 && n <= 9, `Passage sentence has ${n} words (want 6-9): "${s}"`);
});
notes.push(`Passage: ${total} words in ${sentences.length} sentences`);

// ---- Banned / above-grade words anywhere a student reads ----
const banned = ['armistice', 'commemorate', 'conflict', 'service members', 'war', 'battle', 'weapon', 'died', 'killed'];
const studentText = [
  ...C.story, ...sentences, ...C.wordsToKnow.flat(),
  ...C.m1Questions.flatMap((q) => [q.q, q.hint, ...(q.choices || [])]),
  ...C.m2Problems.flatMap((p) => [...p.text, p.ask, p.hint, p.words]),
  ...C.m3Tags.map((t) => t.hint), ...C.m4Words.map((w) => w.hint), C.finale.success, C.finale.hint,
].join(' ').toLowerCase();
banned.forEach((b) => ok(!new RegExp(`\\b${b}\\b`).test(studentText), `Banned word found: "${b}"`));
const long = [...new Set(tokens(studentText).filter((w) => w.length >= 8))];
notes.push(`Long words to eyeball for grade 1 (topic words are expected): ${long.join(', ')}`);

// ---- Story sentences short ----
C.story.forEach((s) => ok(words(s).length <= 9, `Story sentence too long: "${s}"`));

// ---- Mission 1 ----
const letters = ['A', 'B', 'C'];
ok(C.m1Questions.filter((q) => q.type === 'mc').length === 3, 'Mission 1 needs exactly 3 multiple choice');
ok(C.m1Questions.filter((q) => q.type === 'tf').length === 1, 'Mission 1 needs exactly 1 true/false');
ok(C.m1Questions.filter((q) => q.type === 'pic').length === 1, 'Mission 1 needs exactly 1 picture question');
C.m1Questions.forEach((q, i) => {
  if (q.choices) {
    ok(q.choices.length === 3, `M1 Q${i + 1} needs 3 choices`);
    ok(letters.includes(q.answer), `M1 Q${i + 1} answer must be A, B, or C`);
    const right = q.choices[letters.indexOf(q.answer)].toLowerCase();
    ok(!q.hint.toLowerCase().includes(right), `M1 Q${i + 1} hint gives away the answer "${right}"`);
  } else {
    ok(['T', 'F'].includes(q.answer), `M1 Q${i + 1} answer must be T or F`);
  }
});
const star1 = C.m1Questions.find((q) => q.star);
const star1Value = Number(star1.choices[letters.indexOf(star1.answer)]);
ok(star1Value === star1.starValue && star1Value === C.code[0], `M1 star answer ${star1Value} must equal code digit 1 (${C.code[0]})`);
// Fact check: the passage really says the flag has 3 colors.
ok(/red, white, and blue/.test(sentences.join(' ')), 'Passage must name the 3 flag colors');
ok(/November 11/.test(sentences.join(' ')), 'Passage must say November 11');
ok(/fall/.test(sentences.join(' ')), 'Passage must say fall (true/false question)');
ok(/poppy/.test(sentences.join(' ')), 'Passage must mention the poppy');
// Hint "sentence 1" / "sentence 5" must point at the right sentence.
ok(/veteran is a person/.test(sentences[0]), 'Sentence 1 must define veteran');
ok(/November 11/.test(sentences[4]), 'Sentence 5 must give the date');

// ---- Mission 2 ----
C.m2Problems.forEach((p, i) => {
  const solved = p.check();
  ok(solved === p.answer, `M2 P${i + 1}: answer key says ${p.answer} but it solves to ${solved}`);
  const nums = (p.text.join(' ') + ' ' + p.ask).match(/\d+/g).map(Number);
  const limit = p.skill === 'Count by tens' ? 50 : 20;
  nums.concat(p.answer).forEach((n) => ok(n <= limit, `M2 P${i + 1}: number ${n} is over ${limit}`));
  ok(!tokens(p.hint).includes(String(p.answer)), `M2 P${i + 1} hint gives away ${p.answer}`);
  // picture must show the same numbers as the text
  const pic = p.pic;
  if (pic.kind === 'join' || pic.kind === 'takeaway' || pic.kind === 'compare') ok(nums.includes(pic.a) && nums.includes(pic.b), `M2 P${i + 1} picture numbers do not match text`);
  if (pic.kind === 'three') pic.parts.forEach(([n]) => ok(nums.includes(n), `M2 P${i + 1} picture numbers do not match text`));
  if (pic.kind === 'tens') ok(nums.includes(pic.n), `M2 P${i + 1} picture numbers do not match text`);
});
const skills = C.m2Problems.map((p) => p.skill);
ok(skills.includes('Compare: how many more') && skills.includes('Count by tens'), 'M2 needs a compare and a count-by-tens problem');
ok(C.m2Problems.length === 6, 'M2 needs 6 problems');
const star2 = C.m2Problems.find((p) => p.star);
ok(star2.answer === C.m2StarValue && star2.answer === C.code[1] && star2.answer < 10, 'M2 star answer must equal code digit 2 and be one digit');

// ---- Mission 3 ----
C.m3Tags.forEach((t, i) => {
  const nums = C.encode(t.word);
  const back = nums.map((n) => String.fromCharCode(64 + n)).join('');
  ok(back === t.word, `M3 tag ${i + 1} does not decode back to ${t.word}`);
  ok(t.word.length >= 3 && t.word.length <= 5, `M3 tag ${i + 1} word must be 3-5 letters`);
  ok(!t.hint.toLowerCase().includes(t.word.toLowerCase()), `M3 tag ${i + 1} hint gives away ${t.word}`);
});
const last = C.m3Tags[C.m3Tags.length - 1];
const numberWords = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5, SIX: 6, SEVEN: 7, EIGHT: 8, NINE: 9 };
ok(last.star && numberWords[last.word] === C.m3StarValue && C.m3StarValue === C.code[2], 'M3 last tag must be the number word for code digit 3');
// spot check the example from the brief
ok(C.encode('HERO').join('-') === '8-5-18-15', 'HERO must encode to 8-5-18-15');

// ---- Mission 4 ----
C.m4Words.forEach((w, i) => {
  ok(w.scrambled.split('').sort().join('') === w.word.split('').sort().join(''), `M4 word ${i + 1}: "${w.scrambled}" is not an anagram of "${w.word}"`);
  ok(w.scrambled !== w.word, `M4 word ${i + 1} is not scrambled`);
  ok(w.word.length >= 3 && w.word.length <= 5, `M4 word ${i + 1} must be 3-5 letters`);
  ok(C.wordBank.includes(w.word), `M4 word ${i + 1} is missing from the word bank`);
  ok(!tokens(w.hint).includes(w.word), `M4 word ${i + 1} hint gives away "${w.word}"`);
});
const realWordScrambles = ['rats', 'arts', 'tsar', 'star'];
C.m4Words.forEach((w) => ok(!realWordScrambles.includes(w.scrambled), `Scramble "${w.scrambled}" is a real word; kids may stop there`));
const star4 = C.m4Words.find((w) => w.star);
ok(star4.word.length === C.m4StarValue && C.m4StarValue === C.code[3], 'M4 star word letter count must equal code digit 4');

// ---- All hints ----
const allHints = [
  ...C.m1Questions.map((q) => q.hint), ...C.m2Problems.map((p) => p.hint),
  ...C.m3Tags.map((t) => t.hint), ...C.m4Words.map((w) => w.hint), C.finale.hint,
];
allHints.forEach((h) => ok(words(h).length < 15, `Hint is ${words(h).length} words (want under 15): "${h}"`));
ok(!C.finale.hint.includes(C.codeString), 'Finale hint gives away the code');

// ---- Code ----
ok(C.codeString.length === 4 && /^\d{4}$/.test(C.codeString), 'Code must be 4 digits');
notes.push(`Lock code: ${C.code.join(' - ')} = ${C.codeString}`);
notes.push(`Mission 1 answers: ${C.m1Questions.map((q) => q.answer).join(', ')}`);
notes.push(`Mission 2 answers: ${C.m2Problems.map((p) => p.answer).join(', ')}`);
notes.push(`Mission 3 answers: ${C.m3Tags.map((t) => `${t.word} (${C.encode(t.word).join('-')})`).join(', ')}`);
notes.push(`Mission 4 answers: ${C.m4Words.map((w) => `${w.scrambled}=${w.word}`).join(', ')}`);

notes.forEach((n) => console.log('  ' + n));
if (fails.length) {
  console.log(`\nFAILED ${fails.length} check(s):`);
  fails.forEach((f) => console.log('  x ' + f));
  process.exit(1);
}
console.log('\nAll checks passed.');

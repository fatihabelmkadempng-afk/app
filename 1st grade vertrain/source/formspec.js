// Google Form specification, the Apps Script auto-builder, and the full-content manuscript.
const C = require('./content');

const L = ['A', 'B', 'C'];
const ordinal = ['first', 'second', 'third', 'fourth'];
const cheer = ['Great job!', 'Super!', 'Awesome!', 'Wow!'];

const letterPattern = (x) => `^\\s*[${x.toUpperCase()}${x.toLowerCase()}]\\s*$`;
const wordPattern = (w) => `^\\s*${w.split('').map((c) => `[${c.toUpperCase()}${c.toLowerCase()}]`).join('')}\\s*$`;
const codePattern = (code) => `^\\s*${code.split('').join('\\s*')}\\s*$`;

function numberedPassage() {
  let k = 0;
  return C.passage.map((p) => p.map((s) => `(${++k}) ${s}`).join(' ')).join('\n\n');
}
const reveal = (i) => `${cheer[i]} Your ${ordinal[i]} lock number is ${C.code[i]}. Write it down!`;
const keyLine = () => Array.from({ length: 26 }, (_, i) => `${String.fromCharCode(65 + i)}=${i + 1}`).join('  ');

function spec() {
  const items = [];
  items.push({
    type: 'header',
    title: `${C.TITLE} Veterans Day Escape Room`,
    description: `${C.story.join(' ')}\n\nEach mission gives you 1 lock number. Write each number on paper!`,
    confirmation: C.finale.success,
  });
  items.push({ type: 'text', title: 'What is your first name?', help: '', validation: null, error: '' });

  // Mission 1
  items.push({
    type: 'section', mission: 1,
    title: `Mission 1: ${C.passageTitle}`,
    description: `Read the story. Then answer the questions.\n\n${C.passageTitle}\n\n${numberedPassage()}\n\nWords to Know\n${C.wordsToKnow.map(([w, d]) => `${w}: ${d}`).join('\n')}`,
  });
  C.m1Questions.forEach((q, i) => {
    let help;
    if (q.type === 'tf') help = 'Type T for true or F for false.';
    else if (q.type === 'pic') help = `Look at the pictures.\n${q.formWords.map((w, j) => `${L[j]} = ${w}`).join('\n')}\nType A, B, or C.`;
    else help = `${q.choices.map((c, j) => `${L[j]} = ${c}`).join('\n')}\nType A, B, or C.`;
    items.push({ type: 'text', title: `${i + 1}. ${q.q}`, help, validation: { kind: 'regex', pattern: letterPattern(q.answer) }, error: q.hint });
  });

  // Mission 2
  items.push({ type: 'section', mission: 2, title: 'Mission 2: Veterans Day Math', description: `${reveal(0)}\n\nSolve each problem. Type the number only.` });
  C.m2Problems.forEach((p, i) => {
    items.push({ type: 'text', title: `${i + 1}. ${p.text.join(' ')} ${p.ask}`, help: p.words, validation: { kind: 'number', value: p.answer }, error: p.hint });
  });

  // Mission 3
  items.push({ type: 'section', mission: 3, title: 'Mission 3: Dog Tag Decoder', description: `${reveal(1)}\n\nEach dog tag has a secret word. Each number is a letter. Use the key.\n\n${keyLine()}\n\nType each word in small letters.` });
  C.m3Tags.forEach((t, i) => {
    items.push({ type: 'text', title: `Dog tag ${i + 1}:  ${C.encode(t.word).join(' - ')}`, help: t.star ? 'This one is a number word! Type the word.' : 'Type the word.', validation: { kind: 'regex', pattern: wordPattern(t.word.toLowerCase()) }, error: t.hint });
  });

  // Mission 4
  items.push({ type: 'section', mission: 4, title: 'Mission 4: Word Scramble', description: `${reveal(2)}\n\nFix the mixed-up words. Use the word bank.\n\nWord bank: ${C.wordBank.join(', ')}` });
  C.m4Words.forEach((w, i) => {
    items.push({ type: 'text', title: `${i + 1}.  ${w.scrambled.split('').join(' ')}`, help: 'Type the word in small letters.', validation: { kind: 'regex', pattern: wordPattern(w.word) }, error: w.hint });
  });

  // Finale
  items.push({ type: 'section', mission: 5, title: 'Open the Thank-You Mailbox!', description: `${reveal(3)}\n\nNow you have all 4 lock numbers. Type them in order to open the mailbox.` });
  items.push({ type: 'text', title: 'What is the 4-number code?', help: 'Type your 4 lock numbers.', validation: { kind: 'regex', pattern: codePattern(C.codeString) }, error: C.finale.hint });
  items.push({ type: 'section', mission: 6, title: 'You did it!', description: `${C.finale.success}\n\nClick Submit to send the thank-you card to our heroes.` });
  return items;
}

// Split the spec into printable chunks for the copy-paste sheet.
function splitForPages() {
  const items = spec();
  const idx = (m) => items.findIndex((it) => it.type === 'section' && it.mission === m);
  const firstQ = idx(1) + 1;
  return [items.slice(0, firstQ), items.slice(firstQ, idx(2)), items.slice(idx(2), idx(3)), items.slice(idx(3), idx(4)), items.slice(idx(4))];
}

// ---------------------------------------------------------------- Apps Script
function appsScript() {
  const items = spec();
  return `/**
 * ${C.TITLE} Veterans Day Escape Room
 * Google Form Auto-Builder
 * (c) ${C.BRAND}. For the purchasing teacher's own classroom only.
 *
 * HOW TO USE (about 2 minutes)
 * 1. Go to script.google.com and sign in. Click "New project".
 * 2. Delete the lines already in the editor.
 * 3. Copy EVERYTHING in this file and paste it into the editor.
 * 4. Click Save (the floppy disk icon), then click Run.
 * 5. Allow the permissions Google asks for (Review permissions > your account >
 *    Advanced > Go to project > Allow). The warning appears because you made the script.
 * 6. When it says "Execution completed", open the log at the bottom of the page.
 *    It shows the EDIT link (for you) and the STUDENT link (for your class).
 */

var FORM_SPEC = ${JSON.stringify(items, null, 2)};

function buildThankAHeroForm() {
  var form = null;
  FORM_SPEC.forEach(function (item) {
    if (item.type === 'header') {
      form = FormApp.create(item.title);
      form.setDescription(item.description);
      form.setProgressBar(true);
      form.setConfirmationMessage(item.confirmation);
      form.setShowLinkToRespondAgain(false);
    } else if (item.type === 'section') {
      form.addPageBreakItem().setTitle(item.title).setHelpText(item.description);
    } else {
      var q = form.addTextItem().setTitle(item.title).setRequired(true);
      if (item.help) q.setHelpText(item.help);
      if (item.validation) {
        var rule = FormApp.createTextValidation().setHelpText(item.error);
        if (item.validation.kind === 'regex') {
          rule = rule.requireTextMatchesPattern(item.validation.pattern);
        } else {
          rule = rule.requireNumberEqualTo(item.validation.value);
        }
        q.setValidation(rule.build());
      }
    }
  });
  Logger.log('Done! Your form is ready.');
  Logger.log('EDIT link (keep this for yourself): ' + form.getEditUrl());
  Logger.log('STUDENT link (share this with your class): ' + form.getPublishedUrl());
}
`;
}

// ---------------------------------------------------------------- Manuscript
function manuscript() {
  const out = [];
  const p = (s = '') => out.push(s);
  p(`# ${C.TITLE} ${C.SUBTITLE}`);
  p(`**1st Grade · Veterans Day · Google Form + Printable · © ${C.BRAND}**`);
  p();
  p('This file holds every word of the product: the story, passage, questions, answers, clues, and the Google Form build steps. The PDFs, the answer key, and the Google Form Auto-Builder are all generated from the same source, so they match this file exactly.');
  p();
  p(`**Lock code: ${C.code.join(' - ')} (${C.codeString})**`);
  p();
  p('## The Story (Mission Briefing)');
  p();
  C.story.forEach((s) => p(`- ${s}`));
  p();
  p('## Mission 1: Reading Passage');
  p();
  p(`### ${C.passageTitle}`);
  p();
  let k = 0;
  C.passage.forEach((para) => { p(para.map((s) => `(${++k}) ${s}`).join(' ')); p(); });
  const wc = C.passage.flat().join(' ').split(/\s+/).length;
  p(`*${wc} words, ${k} sentences, 6 to 9 words per sentence.*`);
  p();
  p('**Words to Know**');
  p();
  C.wordsToKnow.forEach(([w, d]) => p(`- **${w}**: ${d}`));
  p();
  p('### Questions');
  p();
  C.m1Questions.forEach((q, i) => {
    p(`${i + 1}. ${q.star ? '★ ' : ''}${q.q}`);
    if (q.type === 'tf') p('   - T. True\n   - F. False');
    else if (q.type === 'pic') q.formWords.forEach((w, j) => p(`   - ${L[j]}. [picture: ${w}] ${q.choices[j]}`));
    else q.choices.forEach((c, j) => p(`   - ${L[j]}. ${c}`));
    const ans = q.choices ? `${q.answer} (${q.choices[L.indexOf(q.answer)]})` : q.answer === 'F' ? 'F (False: Veterans Day is in the fall)' : 'T (True)';
    p(`   - **Answer:** ${ans}`);
    p(`   - **Clue if wrong:** ${q.hint}`);
  });
  p();
  p(`**Lock number 1 = ${C.code[0]}.** It is the answer to the ★ question: our flag has 3 colors. The Google Form shows it after all 5 answers are right.`);
  p();
  p('## Mission 2: Math Word Problems');
  p();
  C.m2Problems.forEach((pr, i) => {
    p(`${i + 1}. ${pr.star ? '★ ' : ''}${pr.text.join(' ')} ${pr.ask}`);
    p(`   - *Skill:* ${pr.skill}`);
    p(`   - *${pr.words}*`);
    p(`   - **Answer:** ${pr.answer} ${pr.unit}`);
    p(`   - **Clue if wrong:** ${pr.hint}`);
  });
  p();
  p(`**Lock number 2 = ${C.code[1]}.** It is the answer to the ★ problem (problem 3).`);
  p();
  p('## Mission 3: Dog Tag Decoder');
  p();
  p('**Decoder key:** ' + Array.from({ length: 26 }, (_, i) => `${String.fromCharCode(65 + i)}=${i + 1}`).join(', '));
  p();
  C.m3Tags.forEach((t, i) => {
    p(`${i + 1}. ${t.star ? '★ ' : ''}Tag ${i + 1}: ${C.encode(t.word).join('-')}`);
    p(`   - **Answer:** ${t.word}`);
    p(`   - **Clue if wrong:** ${t.hint}`);
  });
  p();
  p(`**Lock number 3 = ${C.code[2]}.** Tag 4 spells FIVE.`);
  p();
  p('## Mission 4: Word Scramble');
  p();
  p(`**Word bank (with pictures):** ${C.wordBank.map((w) => `${w} [picture: ${C.wordBankPics[w]}]`).join(', ')}`);
  p();
  C.m4Words.forEach((w, i) => {
    p(`${i + 1}. ${w.star ? '★ ' : ''}${w.scrambled}`);
    p(`   - **Answer:** ${w.word}`);
    p(`   - **Clue if wrong:** ${w.hint}`);
  });
  p();
  p(`**Lock number 4 = ${C.code[3]}.** Count the letters in the ★ word: "hero" has 4 letters.`);
  p();
  p('## Finale: Open the Mailbox');
  p();
  p(`Students type the 4 lock numbers in order: **${C.codeString}**.`);
  p();
  p(`- **Correct:** "${C.finale.success}"`);
  p(`- **Clue if wrong:** ${C.finale.hint}`);
  p('- **Bonus page:** "Make a Thank-You Card". Students draw a picture and finish the sentence "Thank you for ___."');
  p();
  p('## Google Form Build Guide (step by step)');
  p();
  p('You need a free Google account. There are two ways to build the form. Both make the same form.');
  p();
  p('### Way 1: Automatic (about 2 minutes)');
  p();
  p('1. Go to script.google.com and sign in. Click **New project**.');
  p('2. Delete the lines already in the editor.');
  p('3. Open **Google Form Auto-Builder.txt**, copy all of it, and paste it into the editor.');
  p('4. Click **Save** (floppy disk icon), then **Run**.');
  p('5. Allow permissions: **Review permissions** > your account > **Advanced** > **Go to project** > **Allow**. The warning appears because you wrote the script yourself.');
  p('6. When it says "Execution completed", open the log. Copy the **EDIT link** (for you) and the **STUDENT link** (for your class).');
  p();
  p('### Way 2: By hand (about 15 minutes)');
  p();
  p('1. Go to forms.google.com and click **Blank form**. Paste the form title and description from the table below.');
  p('2. Click the first question. Change its type to **Short answer**. Paste the name question and turn **Required** on.');
  p('3. For each mission, click **Add section** in the side toolbar (two stacked bars). Paste the section title and description.');
  p('4. Add each question with the **+** button. Choose **Short answer**, paste the question, and turn **Required** on.');
  p('5. Click the **three dots** at the bottom right of the question and choose **Description**. Paste the help line.');
  p('6. Click the three dots again and choose **Response validation**.');
  p('   - Letter and word answers: choose **Regular expression**, then **Matches**, and paste the pattern.');
  p('   - Math answers: choose **Number**, then **Equal to**, and type the number.');
  p('   - Paste the clue into **Custom error text**. Students see it in red when an answer is wrong.');
  p('7. After the code question, add the last section, "You did it!".');
  p('8. Click **Settings** > **Presentation**. Turn on **Show progress bar**. Paste the celebration line as the **Confirmation message**.');
  p('9. Click the **eye** icon to preview. Type a wrong answer to check the clue. Type the right one to check that **Next** works.');
  p('10. Optional: add pictures from the **Google Form Images** folder with the image icon next to a question.');
  p('11. Share: click **Send** > **link** icon > **Copy**, and post the link in Google Classroom. Keep the edit link private.');
  p();
  p('**Why students cannot skip ahead:** every answer is Required and has response validation. Google Forms will not let a student click **Next** until every answer in the section is right. The next section then shows the lock number.');
  p();
  p('**Where each lock number is revealed:**');
  p();
  p('| Digit | Earned in | Shown at the top of |');
  p('|---|---|---|');
  ['Mission 2 section', 'Mission 3 section', 'Mission 4 section', 'Open the Thank-You Mailbox section'].forEach((s, i) => p(`| ${C.code[i]} | Mission ${i + 1} | ${s} |`));
  p();
  p('### Copy-paste table');
  p();
  p('| # | Item | Help line | Response validation | Custom error text (clue) |');
  p('|---|---|---|---|---|');
  let n = 0;
  spec().forEach((it) => {
    const cell = (s) => String(s || '').replace(/\|/g, '\\|').replace(/\n/g, '<br>');
    if (it.type !== 'text') {
      p(`| | **${it.type === 'header' ? 'Form title' : 'Section'}: ${cell(it.title)}** | ${cell(it.description)} | | |`);
      return;
    }
    const v = it.validation ? (it.validation.kind === 'regex' ? `Regular expression > Matches > \`${it.validation.pattern}\`` : `Number > Equal to > ${it.validation.value}`) : 'None';
    p(`| ${++n} | ${cell(it.title)} | ${cell(it.help)} | ${v} | ${cell(it.error)} |`);
  });
  p();
  p(`**Confirmation message:** ${C.finale.success}`);
  p();
  return out.join('\n');
}

module.exports = { spec, splitForPages, appsScript, manuscript, letterPattern, wordPattern, codePattern };

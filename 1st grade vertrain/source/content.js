// Mission: Thank a Hero! — single source of truth for every file in this product.
// The student PDF, answer key, teacher guide, Google Form builder, and the
// full-content manuscript are all generated from this file, so they cannot drift apart.
// Original work © Mr. Pencil & Co. Nothing here is copied from another product.

const BRAND = 'Mr. Pencil & Co';
const TITLE = 'Mission: Thank a Hero!';
const SUBTITLE = 'Veterans Day Reading & Math Escape Room';

const story = [
  'Mr. Pencil has a big mailbox.',
  'Inside is a giant thank-you card for veterans.',
  'But oh no, the mailbox is locked!',
  'The lock needs 4 secret numbers.',
  'Each mission you finish gives you one number.',
  'Find all 4 numbers to open the mailbox.',
  'Then we can send the card to our heroes.',
  'Are you ready? Let’s go!',
];

// ---------------- Mission 1: reading ----------------
const passageTitle = 'What Is Veterans Day?';
const passage = [
  // paragraph 1: who veterans are
  [
    'A veteran is a person who served our country.',
    'Veterans worked in the military to keep us safe.',
    'Some were in the Army or the Navy.',
    'Some were in the Air Force or the Marines.',
  ],
  // paragraph 2: the day
  [
    'Veterans Day is on November 11.',
    'It comes every year in the fall.',
    'On this day, we say thank you.',
    'We thank veterans for being brave and kind.',
  ],
  // paragraph 3: what we see
  [
    'Many towns have a big parade.',
    'People march and play loud drums.',
    'You may see flags wave in the wind.',
    'Our flag is red, white, and blue.',
    'Some people wear a small red poppy.',
    'A poppy is a flower that helps us remember.',
  ],
  // paragraph 4: what kids can do
  [
    'You can help on Veterans Day, too!',
    'You can make a card for a veteran.',
    'You can wave a flag and say thanks.',
    'A big thank you makes a veteran smile.',
  ],
];

const wordsToKnow = [
  ['veteran', 'a person who served in the military'],
  ['military', 'the groups that keep our country safe'],
  ['parade', 'people who march down the street'],
  ['poppy', 'a small red flower'],
];

// type: 'mc' (type A, B, or C) | 'tf' (type T or F) | 'pic' (circle the picture; A, B, or C)
const m1Questions = [
  {
    type: 'mc',
    q: 'What is a veteran?',
    choices: ['a big drum', 'a person who served our country', 'a kind of flower'],
    answer: 'B',
    hint: 'Read sentence 1 again. It tells who a veteran is.',
  },
  {
    type: 'mc',
    star: true,
    q: 'How many colors are on our flag?',
    choices: ['2', '4', '3'],
    answer: 'C',
    starValue: 3,
    hint: 'Find the sentence about our flag. Count each color word.',
  },
  {
    type: 'mc',
    q: 'When is Veterans Day?',
    choices: ['November 11', 'July 4', 'December 25'],
    answer: 'A',
    hint: 'Look at sentence 5. What day is Veterans Day?',
  },
  {
    type: 'tf',
    q: 'Veterans Day is in the spring.',
    answer: 'F',
    hint: 'Look again. Which season does Veterans Day come in?',
  },
  {
    type: 'pic',
    q: 'Which flower do some people wear on Veterans Day?',
    choices: ['sunflower', 'poppy', 'daisy'],
    pictures: ['sunflower', 'poppy', 'daisy'],
    formWords: ['a tall yellow sunflower', 'a small red poppy', 'a white daisy'],
    answer: 'B',
    hint: 'Find the flower in the story. What is its name?',
  },
];

// ---------------- Mission 2: math ----------------
// pic: how the picture cue is drawn in the PDF; words: how it is described in the form.
const m2Problems = [
  {
    skill: 'Addition within 20',
    text: ['Sam has 8 flags.', 'He gets 6 more flags.'],
    ask: 'How many flags does Sam have now?',
    unit: 'flags',
    answer: 14,
    check: () => 8 + 6,
    pic: { kind: 'join', icon: 'flag', a: 8, b: 6 },
    words: 'Picture: 8 flags, a plus sign, and 6 more flags.',
    hint: 'Start at 8. Count up 6 more on your fingers.',
  },
  {
    skill: 'Subtraction within 20',
    text: ['Our class made 15 thank-you cards.', 'We mailed 9 cards.'],
    ask: 'How many cards are left?',
    unit: 'cards',
    answer: 6,
    check: () => 15 - 9,
    pic: { kind: 'takeaway', icon: 'card', a: 15, b: 9 },
    words: 'Picture: 15 thank-you cards. 9 of them have an X on them.',
    hint: 'Start with all the cards. Take away the ones we mailed.',
  },
  {
    skill: 'Subtraction within 20',
    star: true,
    text: ['Mia has 12 poppies.', 'She gives 5 poppies to her grandpa.'],
    ask: 'How many poppies does Mia have left?',
    unit: 'poppies',
    answer: 7,
    check: () => 12 - 5,
    pic: { kind: 'takeaway', icon: 'poppy', a: 12, b: 5 },
    words: 'Picture: 12 poppies. 5 of them have an X on them.',
    hint: 'Draw 12 circles. Cross out 5. Count what is left.',
  },
  {
    skill: 'Compare: how many more',
    text: ['Ben has 13 stars.', 'Ava has 9 stars.'],
    ask: 'How many more stars does Ben have than Ava?',
    unit: 'more stars',
    answer: 4,
    check: () => 13 - 9,
    pic: { kind: 'compare', icon: 'star', a: 13, b: 9, la: 'Ben', lb: 'Ava' },
    words: 'Picture: a row of 13 stars for Ben. Under it, a row of 9 stars for Ava.',
    hint: 'Line up the two rows. Count the stars that have no partner.',
  },
  {
    skill: 'Count by tens',
    text: ['Each box holds 10 flags.', 'There are 4 boxes.'],
    ask: 'How many flags are there in all?',
    unit: 'flags',
    answer: 40,
    check: () => 10 * 4,
    pic: { kind: 'tens', n: 4 },
    words: 'Picture: 4 boxes. Each box says 10.',
    hint: 'Count by tens. Say one number for each box.',
  },
  {
    skill: 'Add three numbers',
    text: ['The parade has 5 red flags, 4 white flags,', 'and 6 blue flags.'],
    ask: 'How many flags are there in all?',
    unit: 'flags',
    answer: 15,
    check: () => 5 + 4 + 6,
    pic: { kind: 'three', icon: 'flag', parts: [[5, 'red'], [4, 'white'], [6, 'blue']] },
    words: 'Picture: 5 red flags, 4 white flags, and 6 blue flags.',
    hint: 'Add two colors first. Then add the last color.',
  },
];
const m2StarValue = 7;

// ---------------- Mission 3: dog tag decoder ----------------
const m3Tags = [
  { word: 'FLAG', hint: 'Find each number on the key. This word waves in the wind!' },
  { word: 'HERO', hint: 'Match each number to a letter. Veterans are this kind of person.' },
  { word: 'THANK', hint: 'Five numbers make five letters. We say this word and then “you.”' },
  { word: 'FIVE', star: true, hint: 'Match each number to a letter. This word is a number word!' },
];
const m3StarValue = 5;
const encode = (w) => w.split('').map((c) => c.charCodeAt(0) - 64);

// ---------------- Mission 4: word scramble ----------------
const m4Words = [
  { scrambled: 'galf', word: 'flag', pic: 'flag', hint: 'It has 4 letters. It is red, white, and blue.' },
  { scrambled: 'oreh', word: 'hero', pic: 'medal', star: true, hint: 'Look at the word bank. Who is brave and helps others?' },
  { scrambled: 'rsat', word: 'star', pic: 'star', hint: 'It shines at night. You can see it on our flag, too.' },
  { scrambled: 'rbeav', word: 'brave', pic: 'shield', hint: 'It has 5 letters. It means you are not scared.' },
  { scrambled: 'murd', word: 'drum', pic: 'drum', hint: 'You hit it in a parade. Boom, boom, boom!' },
];
const wordBank = ['flag', 'hero', 'star', 'brave', 'drum'];
const wordBankPics = { flag: 'flag', hero: 'medal', star: 'star', brave: 'shield', drum: 'drum' };
const m4StarValue = 4; // letters in the star word "hero"

const code = [3, m2StarValue, m3StarValue, m4StarValue];
const codeString = code.join('');

const finale = {
  success: 'You unlocked the Thank-You Mailbox! Thank you, veterans!',
  hint: 'Put your 4 lock numbers in order: Mission 1, 2, 3, then 4.',
};

module.exports = {
  BRAND, TITLE, SUBTITLE, story, passageTitle, passage, wordsToKnow, m1Questions,
  m2Problems, m2StarValue, m3Tags, m3StarValue, encode, m4Words, wordBank, wordBankPics,
  m4StarValue, code, codeString, finale,
};

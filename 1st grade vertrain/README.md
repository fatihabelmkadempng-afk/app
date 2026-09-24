# Mission: Thank a Hero! (1st Grade Veterans Day Escape Room)

An original Veterans Day reading and math escape room for 1st grade by **Mr. Pencil & Co**. It works as a Google Form or as a no-prep printable.

**Lock code: 3 - 7 - 5 - 4**

## Files to upload to TPT (zip these together)

| File | What it is |
|---|---|
| `Student Printable - Mission Thank a Hero.pdf` | 10 pages: cover, mission story, passage, questions, math (2 pages), dog tag decoder, word scramble, mailbox finale, thank-you card |
| `Answer Key - Mission Thank a Hero.pdf` | 13 pages: answers at a glance, clue cards, a 5-page Google Form copy-paste sheet, and 6 filled-in student pages |
| `Teacher Guide - Mission Thank a Hero.pdf` | 2 pages: how to use it, timing, ideas, standards, and Google Form build steps |
| `Terms of Use - Mr Pencil and Co.pdf` | Single classroom license and credits |
| `Google Form Auto-Builder.txt` | Paste into script.google.com and click Run. It builds the whole form in about 2 minutes. |
| `Google Form Images/` | Optional pictures for the form: header, flowers, decoder key, word bank, open mailbox |

## Marketing (upload to your TPT listing)

| File | What it is |
|---|---|
| `Marketing/TPT Thumbnail 01-cover.png` to `05-answer-key.png` | Five 1500 x 1500 thumbnails built from the real product pages. Use 01 as the main cover. |
| `Marketing/TPT Preview Video - Mission Thank a Hero.mp4` | A 33-second, 1080 x 1080 preview video (H.264 MP4) |
| `Marketing/TPT Preview Video - poster.jpg` | A still frame to use as the video cover |
| `Marketing/Genspark Prompts.md` | Image and video prompts to paste into Genspark if you want AI-made extras |

## Files for you (do not upload)

| File | What it is |
|---|---|
| `01 Full Content - All Text, Answers, Hints, Build Steps.md` | Every word of the product in one place, plus the full Google Form build guide |
| `TPT Listing Copy.md` | Title, 256-word description, 12 tags, and 3 cover ideas |
| `Clip Art Descriptions.md` | A description of every picture, for making polished art |
| `source/` | The files that build everything. Edit `content.js` to change any text. |

## Rebuilding after an edit

```bash
cd "1st grade vertrain/source"
node check.js                             # re-solves every answer and checks the rules
NODE_PATH=$(npm root -g) node build.js    # remakes every PDF, image, and text file
NODE_PATH=$(npm root -g) node marketing.js  # remakes thumbnails and the preview video (needs ffmpeg: pip install imageio-ffmpeg)
```

`check.js` stops the build if a math answer is wrong or a hint gives away its answer. It also checks sentence length, banned words, and that the 4 lock digits match the code. `build.js` fails if anything spills past a page edge or any student text is smaller than 18pt.

## Fonts

- **Andika** by SIL International, made for beginning readers.
- **Fredoka** by Milena Brandão and Hafontia.

Both use the SIL Open Font License 1.1 and are embedded in the PDFs.

# Hey, Fede!

An interactive quiz and digital scrapbook about Federica Yanes. Visitors answer questions to unlock personal photographs, memories and stories.

The site is built with plain HTML, CSS and JavaScript. It does not require a build command or backend and is ready for GitHub Pages.

## The four files you will use most

- `index.html` contains the page sections and their order.
- `js/content.js` contains the questions, memories, stories, biography and favorites. Start here when adding your real information.
- `css/styles.css` controls colors, type, spacing, shapes and responsive behavior.
- `js/app.js` runs the quiz, score, sharing, unlocking and saved progress. You should not need to change this file when replacing content.

The music button plays the track selected in `js/content.js`. Music is off by default and begins only after a visitor presses the button.

## Preview the site

Opening `index.html` directly works for most features. A local server is more reliable:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in a browser.

## Replace the quiz questions

Open `js/content.js` and find `questions`. Each question follows this pattern:

```js
{
  category: "Music",
  question: "Which artist have I seen live twice?",
  answers: ["Artist A", "Artist B", "Artist C", "Artist D"],
  correctAnswer: 1,
  fact: "Artist B was also my first festival headline show.",
},
```

`correctAnswer` counts from zero: `0` means the first answer, `1` the second, `2` the third and `3` the fourth.

You can add or remove questions by copying or deleting a complete question block. The counters and score screen update automatically.

## Add your photographs

1. Put the image inside `assets/images`.
2. Use a simple lowercase file name without spaces, such as `madrid-trip.jpg`.
3. In `js/content.js`, find the matching memory and change:

```js
image: "",
```

to:

```js
image: "assets/images/madrid-trip.jpg",
```

For the large profile image, change `profileImage` near the top of the same file.

## Change the background music

To use a different track that you own or are licensed to publish:

1. Put the audio file inside `assets/audio`.
2. In `js/content.js`, change `backgroundMusic` to its path.
3. Adjust `backgroundMusicVolume` between `0` and `1`.

Avoid uploading a commercial artist's recording to GitHub Pages unless you have permission to redistribute it. The music remains off until a visitor chooses **Music on**, which avoids unexpected autoplay.

## Control what each score unlocks

Every memory and story includes `unlockAt`. The number is the minimum quiz score required to reveal it:

```js
unlockAt: 4,
```

The site remembers a visitor's best score in the browser, even after refresh. The scrapbook includes a **Reset score to 0** button for starting again.

## Change colors and fonts

The main design choices are grouped at the top of `css/styles.css` inside `:root`. Change a hex color there and it updates across the website.

The current expressive type combination includes:

- Syne for bold game-show display type
- MonteCarlo for scrapbook calligraphy
- Bodoni Moda and Bricolage Grotesque for the story index
- Space Grotesk for readable body text

The font link is in the `<head>` of `index.html`. The font assignments are the `--display`, `--accent` and `--body` variables at the top of the CSS.

## GitHub Pages

1. Create a new public GitHub repository.
2. Upload all project files, keeping the folder structure unchanged.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. GitHub will display the public `github.io` address after deployment.

## Final checks

- Add meaningful alternative text if a photograph communicates information.
- Test every quiz answer and score threshold.
- Test on a phone and a desktop browser.
- Ask two or three friends to play without explaining the interface.
- Keep screenshots of early and later versions for the process document.

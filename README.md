# lin
A line-based programming language.

## Manual Installation
`git clone` this repo, `cd` into it, and run `npm install` and `npm ln`.

### Editing
`index.js` holds the main executable.
To add to STDLIB, run `./esl` (which will open the STDLIB file in your `$EDITOR` and compile it to `stdlib.js` using `csl.js` when the editor is closed).
`lin.pegjs` is a PEG.js parser file that compiles to `lin-peg.js`.

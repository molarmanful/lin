#!/usr/bin/env node

let fs = require('fs')
let sl = fs.readFileSync('./src/stdlib.js') + ''
let exp = /\/\/ (.+)\n+SL\["(.+)"\]/g

fs.writeFileSync('./docs/commands.md',
  `# Commands\n**NOTE:** Anything with "index [number]" refers to the item at that specific index on the stack. "index 0" refers to the top of the stack, "index 1" refers to the second-from-top of stack, etc.\n\n${
    sl.match(exp).join`\n`.replace(exp, '- <code>$2</code>: $1')
  }`
)

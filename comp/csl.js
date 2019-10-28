#!/usr/bin/env node

let fs = require('fs')
let sl = fs.readFileSync('./src/sl') + ''
let header = `\
import {fs, cp, unesc, _, INT as I} from './bridge.js'
let SL = {}
`

fs.writeFileSync('./src/stdlib.js',
  header + `\n${
    sl.replace(/^(\S+) (.+)$/gm, 'SL["$1"]=(h,i,j,k,X,Y,Z)=>$2')
  }\nexport {SL}`
)
fs.writeFileSync('./docs/commands.md',
  `# Commands\n**NOTE:** Anything with "index [number]" refers to the item at that specific index on the stack. "index 0" refers to the top of the stack, "index 1" refers to the second-from-top of stack, etc.\n\n${
    sl.match(/^(\S+) .+ \/\/(.+)$/gm).join`\n`.replace(/^(\S+) .+ \/\/(.+)$/gm, '- <code>$1</code>: $2')
  }`
)

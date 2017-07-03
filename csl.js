#!/usr/bin/env node
fs=require('fs')
fs.writeFileSync('stdlib.js',
  `module.exports=$={}\n${
    (fs.readFileSync('stdlib')+'').replace(/^(\S+) (.+)$/gm,'$["$1"]=(h,i,j,k,X,Y,Z)=>$2')
  }`
)
fs.writeFileSync('docs/commands.md',
  `# Commands\n**NOTE:** Anything with "index [number]" refers to the item at that specific index on the stack. "index 0" refers to the top of the stack, "index 1" refers to the second-from-top of stack, etc.\n\n${
    (fs.readFileSync('stdlib')+'').match(/^(\S+) .+ \/\/(.+)$/gm).join`\n`.replace(/^(\S+) .+ \/\/(.+)$/gm,'- <code>$1</code>: $2')
  }`
)

#!/bin/env node
fs=require('fs')
fs.writeFileSync('stdlib.js',
  `module.exports={\n${
    (fs.readFileSync('stdlib')+'').replace(/^(\S+) (.+)$/gm,'  "$1":x=>$2,')
  }0:0}`
)

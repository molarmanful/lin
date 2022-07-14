#!/usr/bin/env node

// modules
import {_, fs, INTRP, chalk} from './bridge.js'
import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'

let odefs = [
  {name: 'help', alias: 'h', type: Boolean, description: 'Show this guide.'},
  {name: 'file', alias: 'f', type: String, typeLabel: '<file>', description: 'Execute file (default option).', defaultOption: true},
  {name: 'eval', alias: 'e', type: String, typeLabel: '<code>', description: 'Execute string.'},
  {name: 'verbose', alias: 'v', type: Boolean, description: 'Output detailed debugging info.'},
  {name: 'step', alias: 's', type: Boolean, description: 'Step-by-step verbose mode.'},
  {name: 'impl', alias: 'i', type: Boolean, description: 'Output stack contents on completion.'},
  // {name: 'itrlim', alias: 'l', type: Number,typeLabel: '<limit>', description: 'Maximum number of items to pretty-print in iterators.'}
]
let opts = commandLineArgs(odefs)

if(opts.help || !(opts.file || opts.eval))
  console.log(commandLineUsage([
    {
      header: 'lin',
      content: 'The little language that could.'
    },
    {
      header: 'Usage',
      content: ['lin <file> [options...]', 'lin [options...]']
    },
    {
      header: 'Options',
      optionList: odefs
    },
    {
      content: ['Made with <3 by Ben Pang (molarmanful).', 'License: MIT', 'Source: {underline https://github.com/molarmanful/lin}']
    }
  ]))

else {
  let I = new INTRP(opts.eval || fs.readFileSync(opts.file) + '', opts.file, {verbose: opts.verbose || opts.step, step: opts.step})
  if(opts.impl)
    _.map(I.stack, (a, i)=>{
      [
        chalk.gray.dim(`---{${i}}`),
        I.form(a)
      ].map(a=> console.log(a))
    })
} 
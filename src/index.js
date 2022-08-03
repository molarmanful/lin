#!/usr/bin/env node

// modules
import {_, fs, fsp, INTRP, chalk} from './bridge.js'
import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'
import * as repl from 'repl'

let odefs = [
  {name: 'help', alias: 'h', type: Boolean, description: 'Show this guide.'},
  {name: 'file', alias: 'f', type: String, typeLabel: '<file>', description: 'Execute file (default option).', defaultOption: true},
  {name: 'eval', alias: 'e', type: String, typeLabel: '<code>', description: 'Execute string.'},
  {name: 'verbose', alias: 'v', type: Boolean, description: 'Output detailed debugging info.'},
  {name: 'step', alias: 's', type: Boolean, description: 'Step-by-step verbose mode.'},
  {name: 'impl', alias: 'i', type: Boolean, description: 'Output stack contents on completion.'},
  {name: 'shell', alias: 'S', type: Boolean, description: 'Start shell mode.'},
]
let opts = commandLineArgs(odefs, {partial: true})

let exec = o=>{
  if(!('eval' in o) && !exists(o.file)){
    if(exists(o.file + '.lin')) o.file += '.lin'
    else {
      console.error(chalk.redBright(`ERR: bad file "${o.file}"`))
      return 0
    }
  }
  owarn(opts)
  let I = new INTRP('eval' in o ? o.eval || '' : fs.readFileSync(o.file) + '', o.file, {verbose: o.verbose || o.step, step: o.step})
  if(o.impl)
    _.map(I.stack, (a, i)=>{
      [
        chalk.gray.dim(`---{${i}}`),
        I.form(a)
      ].map(a=> console.log(a))
    })
}

let owarn = o=>{
  if(o._unknown)
    console.warn(chalk.yellowBright(`WRN: unknown opts ${o._unknown.join` `}`))
}

let exists = x=> fs.existsSync(x) && fs.statSync(x).isFile()

let cmds = {
  ':h': {
    d: 'help',
    f(){ console.log(`\n${Object.entries(cmds).map(([c, {d}])=> `${c}\t${d}`).join`\n`}\n`) }
  },
  ':x': {
    d: 'exit',
    f(){
      console.log('bye')
      process.exit(0)
    },
  },
  ':c': {
    d: 'clear',
    f(){ console.log('\x1bc') }
  },
}

owarn(opts)

if(opts.help)
  console.log(commandLineUsage([
    {
      header: 'lin',
      content: `The little language that could.`
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

else if(opts.shell || !Object.keys(opts).length)
  repl.start({
    prompt: 'lin > ',
    ignoreUndefined: true,
    completer(l){return [[], l]},
    eval(c, ctx, fl, f){
      c = c.trim().split(/\s+/)
      let opts = commandLineArgs(odefs, {partial: true, argv: c})
      if(opts.file in cmds){
        cmds[opts.file].f()
      }
      else exec(opts)
      f(null)
    },
  })

else exec(opts)
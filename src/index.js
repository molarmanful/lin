#!/usr/bin/env node

// modules
import {sh, INTRP, chalk} from './bridge.js'
import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'
import * as rlp from 'readline/promises'
import {parse} from 'shell-quote'

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
  if(!('eval' in o) && !sh.test('-f', o.file)){
    if(sh.test('-f', o.file + '.lin')) o.file += '.lin'
    else {
      console.error(chalk.redBright(`ERR: unknown "${o.file}"`))
      return o.child ? 0 : process.exit(1)
    }
  }

  owarn(opts)

  return new INTRP(
    'eval' in o ? o.eval || '' : sh.cat(o.file),
    o.file,
    {verbose: o.verbose || o.step, step: o.step, impl: o.impl}
  )
}

let owarn = o=>{
  if(o._unknown)
    console.warn(chalk.yellowBright(`WRN: unknown opts ${o._unknown.join` `}`))
}

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
    f(){ console.clear() },
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

else if(opts.shell || !Object.keys(opts).length){
  let hist = []
  while(1){
    chalk.reset()
    let r = rlp.createInterface({
      input: process.stdin,
      output: process.stdout,
      history: hist,
    })

    let c = await r.question(`${chalk.bold.magentaBright('ƒ')} ${chalk.magenta('→')} `)
    hist.push(c)

    await new Promise(res=>{
      r.once('close', res)
      r.close()
    })

    let opts = commandLineArgs(odefs, {partial: true, argv: parse(c)})

    if(!Object.keys(opts).length){}
    else if(opts.file in cmds) cmds[opts.file].f()
    else {
      opts.child = 1
      let I = exec(opts)
      if(I){
        // let S = $=>{ console.log('called'); I.exit(128) }
        // process.on('SIGINT', S)
        I.child = 1
        I.run()
        console.log()
        // process.off('SIGINT', S)
      }
    }
  }
}

else {
  let I = exec(opts)
  I.run()
}
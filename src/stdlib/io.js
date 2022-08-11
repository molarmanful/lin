import {__, _, SL, rust, sh} from '../bridge.js'

let IO = {}

// read file at path given by index 0
IO["cat"] = $=> $.u1(a=> $.v1(x=> sh.cat($.str(x) + ''), a))

// change current directory
IO["cd"] = $=> $.v1(x=> sh.cd($.str(x) + ''), $.shift())

// modify permissions
IO["chmod"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.v2((x, y)=> sh.chmod(y, $.str(x) + ''), Y, X)
}

// copy file at index 2 to index 1 with flags at index 0
IO["cp"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  let Z = $.shift()
  $.v3((x, y, z)=>
    sh.cp('-f' + z.replace(/[^fnurLP]/g, ''), $.str(x) + '', $.str(y) + ''),
    Z, Y, X
  )
}

// execute shell command
IO["exec"] = $=>
  $.u2((a, b)=> $.v1(x=>
    __.filter((y, i)=> ['stdout', 'stderr', 'code'].includes(i))
      ($.js2lin(sh.exec(x, $.lin2js(b)))),
    a
  ))

// list at given path
IO["ls"] = $=>
  $.u2((a, b)=> $.v2((x, y)=>
    sh.ls('-' + ('A' + y).replace(/[^RALdl]/g, ''), $.str(x) + ''),
    a, b
  ))

// create directory
IO["mkdir"] = $=> $.u1(a=> $.v1(x=> sh.mkdir('-p', $.str(x) + ''), a))

// move file at index 1 to index 0
IO["mv"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.v2((x, y)=> sh.mv($.str(x) + '', $.str(y) + ''), Y, X)
}

// `mv` without overwrite
IO["mvn"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.v2((x, y)=> sh.mv('-n', $.str(x) + '', $.str(y) + ''), Y, X)
}

// remove path (BE CAREFUL WHEN USING THIS FUNCTION)
IO["rm"] = $=> $.v1(x=> sh.rm('-rf', $.str(x)), $.shift())

// create/get tempdir
IO["tempdir"] = $=> $.unshift(sh.tempdir())

// test path
IO["test"] = $=>
  $.u2((a, b)=> $.v2((x, y)=> sh.test('-' + (y + '' || 'e'), $.str(x) + ''), a, b))

// find executable
IO["which"] = $=> $.u1(a=> $.v1(x=> sh.which($.str(x) + ''), a))

// write string at index 1 to file at path given by index 0
IO["*>"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.v2((x, y)=> sh.ShellString(x).to($.str(y) + ''), Y, X)
}

// `*>` but append
IO["*>>"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.v2((x, y)=> sh.ShellString(x).toEnd($.str(y) + ''), Y, X)
}

// push user input
IO["in"] = $=> $.unshift(rust.rline())

// push user input without echoing
IO["inh"] = $=> $.unshift(rust.rlinePw())

// output index 0 to STDOUT
IO["out"] = $=> $.v1(x=> process.stdout.write($.str(x) + ''), $.shift())

// output index 0 as a line to STDOUT
IO["outln"] = $=> $.v1(x=> process.stdout.write($.str(x) + '\n'), $.shift())

// `form outln`
IO["show"] = $=> $.exec('form outln', 1)

// clear TTY
IO["wipe"] = $=> console.clear()

export default IO
import {_, mth} from '../bridge.js'

let MULTISTACK = {}

// `es` index 1 on a stack with name given by index 0
MULTISTACK["'s"] = $=>{
  $.iter.unshift($.st)
  let X = $.shift()
  let Y = $.shift()
  $.st = X
  if(!$.stack[$.st]) $.stack[$.st] = []
  $.addf(a=> $.st = $.iter.shift())
  $.exec(Y, 1)
}

// push index 1 to another stack with name given by index 0
MULTISTACK["push"] = $=>{
  let X = $.shift()
  if(!$.stack[X]) $.stack[X] = []
  $.stack[X].unshift($.shift())
}

// push current stack to another stack with name given by index 0
MULTISTACK["pushs"] = $=>{
  let X = $.shift()
  if(!$.stack[X]) $.stack[X] = []
  $.stack[X].unshift($.stack[$.st])
}

// push top item of another stack with name given by index 0
MULTISTACK["pull"] = $=>{
  let X = $.shift()
  if(!$.stack[X]) $.stack[X] = []
  $.unshift($.stack[X].shift())
}

// `pull` without modifying other stack
MULTISTACK["pud"] = $=>{
  let X = $.shift()
  if(!$.stack[X]) $.stack[X] = []
  $.unshift($.stack[X][0])
}

// pull stack with name given by index 0 to current stack
MULTISTACK["pulls"] = $=>{
  let X = $.shift()
  if(!$.stack[X]) $.stack[X] = []
  $.unshift($.stack[X])
}

MULTISTACK["thr"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  let Z = $.shift()
  let W = $.shift()
  mth(async $=>{
    let {path, fn} = global.threadData
    let {INT} = await import(path)
    INT.run(fn)
    return INT.stack[INT.st]
  }, {
    path: new URL('../bridge.js', import.meta.url).href,
    fn: W
  })
    .then(r=>{
      $.stack[X] = r
      $.exec(Z)
    })
    .catch(e=>{
      $.stack[X] = [e]
      $.exec(Y, 1)
    })
}

export default MULTISTACK
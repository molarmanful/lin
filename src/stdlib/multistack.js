import {_, SL} from '../bridge.js'

let MULTISTACK = {}

// `es` index 1 on a stack with name given by index 0
MULTISTACK["'s"] = $=>{
  $.iter.push($.st)
  let X = $.shift()
  let Y = $.shift()
  if(!$.stack[$.st = X]) $.stack[$.st] = []
  $.addf(a=> $.st = $.iter.pop())
  $.exec(Y, 1)
}

// `es` on a copy of stack, then retrieve
MULTISTACK["Q"] = $=>
  $.u1(a=> $.v1(x=> $.quar(y=>{
    $.stack[$.st] = $.stack[$.iter.at(-1)].slice()
    $.exec(x)
  }), a))

// `gl`, `es` index 1, and `sL` in isolated stack
MULTISTACK[">:"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.v2((x, y)=> $.quar($$=>{
    $.stack[$.st] = [y]
    SL.gl($)
    $.exec(x)
    $.unshift(y)
    SL.sL($)
  }), Y, X)
}

// push index 1 to another stack with name given by index 0
MULTISTACK["push"] = $=>{
  let X = $.shift()
  if(!$.stack[X]) $.stack[X] = []
  $.stack[X].push($.shift())
}

// push current stack to another stack with name given by index 0
MULTISTACK["pushs"] = $=>{
  let X = $.shift()
  if(!$.stack[X]) $.stack[X] = []
  $.stack[X].push($.stack[$.st])
}

// push top item of another stack with name given by index 0
MULTISTACK["pull"] = $=>{
  let X = $.shift()
  if(!$.stack[X]) $.stack[X] = []
  $.unshift($.stack[X].pop())
}

// `pull` without modifying other stack
MULTISTACK["pud"] = $=>{
  let X = $.shift()
  if(!$.stack[X]) $.stack[X] = []
  $.unshift($.stack[X].at(-1))
}

// pull stack with name given by index 0 to current stack
MULTISTACK["pulls"] = $=>{
  let X = $.shift()
  if(!$.stack[X]) $.stack[X] = []
  $.unshift($.stack[X])
}

// set stack with name given by index 0 to current stack
MULTISTACK["hijk"] = $=> $.stack[$.shift()] = $.stack[$.st]

// set current stack to stack with name given by index 0
MULTISTACK["absb"] = $=> $.stack[$.st] = $.stack[$.shift()]

export default MULTISTACK
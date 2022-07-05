import {_, INT as I, SL} from '../bridge.js'

let MULTISTACK = {}

// execute string given by index 1 on a stack with name given by index 0
MULTISTACK["'s"] = $=>{
  I.iter.unshift(I.st)
  let X = I.shift()
  let Y = I.shift()
  I.st = X
  if(!I.stack[I.st]) I.stack[I.st] = []
  I.addf(a=> I.st = I.iter.shift())
  I.exec(Y, 1)
}

// push index 1 to another stack with name given by index 0
MULTISTACK["push"] = $=>{
  let X = I.shift()
  if(!I.stack[X]) I.stack[X] = []
  I.stack[X].unshift(I.shift())
}

// push current stack to another stack with name given by index 0
MULTISTACK["pushs"] = $=>{
  let X = I.shift()
  if(!I.stack[X]) I.stack[X] = []
  I.stack[X].unshift(...I.stack[I.st])
}

// push top item of another stack with name given by index 0
MULTISTACK["pull"] = $=>{
  let X = I.shift()
  if(!I.stack[X]) I.stack[X] = []
  I.unshift(I.stack[X].shift())
}

// `pull` without modifying other stack
MULTISTACK["pud"] = $=>{
  let X = I.shift()
  if(!I.stack[X]) I.stack[X] = []
  I.unshift(I.stack[X][0])
}

// pull stack with name given by index 0 to current stack
MULTISTACK["pulls"] = $=>{
  let X = I.shift()
  if(!I.stack[X]) I.stack[X] = []
  I.unshift(...I.stack[X])
}

export default MULTISTACK
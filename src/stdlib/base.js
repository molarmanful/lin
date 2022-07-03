import {_, INT as I, SL} from '../bridge.js'

let BASE = {}

BASE["("] = $=>{
  I.lambda = 1
}

BASE[")"] = $=>{}

BASE["["] = $=>{
  I.iter.unshift(I.st)
  I.st = I.iter[0] + '\n'
  I.stack[I.st] = []
}

BASE["]"] = $=>{
  let X = I.stack[I.st]
  delete I.stack[I.iter[0] + '\n']
  I.st = I.iter.shift()
  I.unshift(X)
}

BASE["{"] = $=>{
  I.objs.unshift({})
  I.iter.unshift(I.st)
  I.st = I.iter[0] + '\n'
  I.stack[I.st] = []
}

BASE["}"] = $=>{
  let X = I.objs.shift()
  delete I.stack[I.iter[0] + '\n']
  I.st = I.iter.shift()
  I.unshift(X)
}

// create new scope
BASE["${"] = $=>{
  I.scope.unshift({})
}

// destroy current scope
BASE["}$"] = $=>{
  I.scope.shift()
}

// push string at ID given by index 0
BASE["gi"] = $=>{
  let X = I.shift()
  if(!(X in I.ids)) I.id(X)
  I.unshift(I.ids[X])
}

// `gi` but follow scoping rules
BASE["gl"] = $=>{
  let X = I.shift()
  if(I.getscope(X) == undefined) I.id(X)
  I.unshift(I.getscope(X))
}

BASE["."] = $=> I.gl = 1

// push stack joined by newlines
BASE["gs"] = $=> I.unshift(I.form())

// push line at popped number (0-indexed)
BASE["g@"] = $=> I.unshift(I.lines[I.shift()])

//  push next line
BASE["g;"] = $=>{
  I.unshift(I.lines[I.lns[0] - -1])
}

//  push previous line
BASE["g;;"] = $=>{
  I.unshift(I.lines[I.lns[0] - 1])
}

// convert index 0 to its string representation
BASE["form"] = $=> I.unshift(I.form([I.shift()]))

// set global ID at index 0
BASE["si"] = $=> I.ids[I.shift()] = I.shift()

// `si` but follow scoping rules
BASE["sl"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  if(I.scope.length) I.scope[0][X] = Y
  else I.ids[X] = Y
}

// `sl` but without overriding existing scoping rules
BASE["sL"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  if(I.scope.length){
    let i = I.scope.findIndex(a=> X in a)
    if(~i) I.scope[i][X] = Y
    else if(X in I.ids) I.ids[X] = Y
    else I.scope[0][X] = Y
  }
  else I.ids[X] = Y
}

// bring ID at index 0 as string into global scope
BASE["::"] = $=> I.id(I.shift())

// pushes 1 if index 0 is a number, 2 if string, 3 if list, 4 if object, and 0 if anything else (ex.: undefined)
BASE["type"] = $=>{
  let X = I.shift()
  I.unshift(
    X.pop ? 3
    : X.big ? 2
    : ['number', 'bigint'].includes(typeof X) ? 1
    : I.isitr(X) ? 5
    : _.isObjectLike(X) ? 4
    : 0
  )
}

export default BASE
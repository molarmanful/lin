import {_, SL} from '../bridge.js'

let BASE = {}

BASE["("] = $=> $.lambda = 1

BASE["$("] = $=>{
  $.lambda = 1
  $.scoped = 1
}

BASE[")"] = $=>{
  let X = $.paren.join` `
  $.paren = []
  if($.scoped){
    X = `\${ ${X} }$`
    $.scoped = 0
  }
  $.unshift(X)
  $.lambda = 0
}

BASE["["] = $=>{
  $.iter.unshift($.st)
  $.st = $.iter[0] + '\n'
  $.stack[$.st] = []
}

BASE["]"] = $=>{
  let X = $.stack[$.st]
  delete $.stack[$.iter[0] + '\n']
  $.st = $.iter.shift()
  $.unshift(X)
}

BASE["{"] = $=>{
  $.objs.unshift({})
  $.iter.unshift($.st)
  $.st = $.iter[0] + '\n'
  $.stack[$.st] = []
}

BASE["}"] = $=>{
  let X = $.objs.shift()
  delete $.stack[$.iter[0] + '\n']
  $.st = $.iter.shift()
  $.unshift(X)
}

// create new scope
BASE["${"] = $=>{
  $.scope.unshift({})
}

// destroy current scope
BASE["}$"] = $=>{
  $.scope.shift()
}

// push string at ID given by index 0
BASE["gi"] = $=>{
  let X = $.shift()
  if(!(X in $.ids)) $.id(X)
  $.unshift($.ids[X])
}

// `gi` but follow scoping rules
BASE["gl"] = $=>{
  let X = $.shift()
  if($.getscope(X) == undefined) $.id(X)
  $.unshift($.getscope(X))
}

BASE["."] = $=> $.gl = 1

// push stack joined by newlines
BASE["gs"] = $=> $.unshift($.form($.stack[$.st]))

// push line at popped number (0-indexed)
BASE["g@"] = $=> $.unshift($.gline($.shift()))

//  push next line
BASE["g;"] = $=> $.unshift($.lns[0][1] - -1)

//  push previous line
BASE["g;;"] = $=> $.unshift($.lns[0][1] - 1)

// convert index 0 to its formatted representation
BASE["form"] = $=> $.unshift($.form([$.shift()]))

// set global ID at index 0
BASE["si"] = $=> $.ids[$.shift()] = $.shift()

// `si` but follow scoping rules
BASE["sl"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if($.scope.length) $.scope[0][X] = Y
  else $.ids[X] = Y
}

// `sl` but without overriding existing scoping rules
BASE["sL"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if($.scope.length){
    let i = $.scope.findIndex(a=> X in a)
    if(~i) $.scope[i][X] = Y
    else if(X in $.ids) $.ids[X] = Y
    else $.scope[0][X] = Y
  }
  else $.ids[X] = Y
}

// bring ID at index 0 as string into global scope
BASE["::"] = $=> $.id($.shift())

// pushes 1 if index 0 is a number, 2 if string, 3 if list, 4 if object, 5 if iterator, and 0 if anything else (ex.: undefined)
BASE["type"] = $=>{
  let X = $.shift()
  $.unshift(
    X.pop ? 3
    : X.big ? 2
    : ['number', 'bigint'].includes(typeof X) ? 1
    : $.isitr(X) ? 5
    : _.isObjectLike(X) ? 4
    : 0
  )
}

export default BASE
import {_, SL} from '../bridge.js'

let BASE = {}

BASE["("] = $=> $.lambda = 1

BASE["$("] = $=>{
  $.lambda = 1
  $.scoped = 1
}

BASE[")"] = $=>{
  let X = $.paren.join` `
  if($.scoped){
    X = `\${ ${X} }$`
    $.scoped = 0
  }
  $.unshift(X)
  $.lambda = 0
  $.paren = []
}

BASE["["] = $=>{
  $.iter.push($.st)
  $.st = $.iter.at(-1) + '\n'
  $.stack[$.st] = []
}

BASE["]"] = $=>{
  let X = $.stack[$.st]
  delete $.stack[$.iter.at(-1) + '\n']
  $.st = $.iter.pop()
  $.unshift(X)
}

BASE["{"] = $=>{
  $.objs.push(new Map())
  $.iter.push($.st)
  $.st = $.iter.at(-1) + '\n'
  $.stack[$.st] = []
}

BASE["}"] = $=>{
  let X = $.objs.pop()
  delete $.stack[$.iter.at(-1) + '\n']
  $.st = $.iter.pop()
  $.unshift(X)
}

// create new scope
BASE["${"] = $=>{
  $.scope.push({})
}

// destroy current scope
BASE["}$"] = $=>{
  $.scope.pop()
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

BASE["."] = $=> $.gl++

// push stack joined by newlines
BASE["gs"] = $=> $.unshift($.form($.stack[$.st]))

// push line at popped number (0-indexed)
BASE["g@"] = $=> $.unshift($.gline($.shift()))

// push next line
BASE["g;"] = $=> $.unshift($.gline($.lns.at(-1)[1] - -1))

// push previous line
BASE["g;;"] = $=> $.unshift($.gline($.lns.at(-1)[1] - 1))

// line number + index 0
BASE["L"] = $=> $.exec('$L +',1)

// set global ID at index 0
BASE["si"] = $=> $.ids[$.shift()] = $.shift()

// `si` but follow scoping rules
BASE["sl"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if($.scope.length) $.scope[$.scope.length - 1][X] = Y
  else $.ids[X] = Y
}

// `sl` but without overriding existing scoping rules
BASE["sL"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if($.scope.length){
    let i = _.findLastIndex($.scope, a=> X in a)
    if(~i) $.scope[i][X] = Y
    else if(X in $.ids) $.ids[X] = Y
    else $.scope[$.scope.length - 1][X] = Y
  }
  else $.ids[X] = Y
}

// bring ID at index 0 as string into global scope
BASE["::"] = $=> $.id($.shift())

// push type of index 0
BASE["type"] = $=>{
  let X = $.shift()
  $.unshift(
    $.isarr(X) ? 'arr'
    : $.ismap(X) ? 'obj'
    : $.isstr(X) ? 'str'
    : $.isnum(X) ? 'num'
    : $.isitr(X) ? 'itr'
    : $.isobj(X) ? 'obl'
    : 0
  )
}

export default BASE
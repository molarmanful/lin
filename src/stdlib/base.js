import {_, SL} from '../bridge.js'

let BASE = {}

BASE["("] = $=> $.lambda = 1

BASE["$("] = $=>{
  $.lambda = 1
  $.scoped = 1
  SL['(']($)
}

BASE[")"] = $=>{
  let X = $.paren.join` `
  if($.scoped){
    X = `\${ ${X} }`
    $.scoped = 0
  }
  $.unshift(X)
  $.lambda = 0
  $.paren = []
  if($.apos){
    $.apos = 0
    SL["'"]($)
  }
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
  $.curls.push(1)
}

BASE["}"] = $=>{
  let X = $.curls.pop()
  if(X == 1){
    let X = $.objs.pop()
    delete $.stack[$.iter.at(-1) + '\n']
    $.st = $.iter.pop()
    $.unshift(X)
  }
  else if(X == 2){
    $.scope.pop()
    $.scopin--
  }
}

// create new scope
BASE["${"] = $=>{
  $.scope.push({})
  $.curls.push(2)
}

// push string at ID given by index 0
BASE["gi"] = $=>
  $.u1(a=> $.v1(x=>{
    if(!(x in $.ids)) $.id(x)
    return $.getid(x)
  }, a))

// `gi` but follow scoping rules
BASE["gl"] = $=>
  $.u1(a=> $.v1(x=>{
    if($.getscope(x) == void 0) $.id(x)
    return $.getscope(x)
  }, a))

// magic dot
BASE["."] = $=> $.gl++

// push stack joined by newlines
BASE["gs"] = $=> $.unshift($.form($.stack[$.st]))

// push line at popped number (0-indexed)
BASE["g@"] = $=> $.u1(a=> $.v1(x=> $.gline(x), a))

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

// `gl`, `es` index 1, and `sL` in isolated stack
BASE[">:"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.unshift($.v2((x, y)=> $.quar(a=>{
    $.stack[$.st] = []
    $.unshift(y)
    SL.gl($)
    $.exec(x)
  }), Y, X), X)
  SL.sL($)
}

// bring ID at index 0 as string into global scope
BASE["::"] = $=> $.id($.shift())

// push type of index 0
BASE["type"] = $=>{
  let X = $.shift()
  $.unshift(
    $.isarr(X) ? 'arr'
    : $.islen(X) ? 'len'
    : $.ismat(X) ? 'mat'
    : $.ismap(X) ? 'obj'
    : $.isstr(X) ? 'str'
    : $.isrex(X) ? 'rex'
    : $.isnum(X) ? 'num'
    : $.isitr(X) ? 'itr'
    : $.isobj(X) ? 'obl'
    : 0
  )
}

export default BASE
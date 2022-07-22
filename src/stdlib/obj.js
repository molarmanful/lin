import {itr, _, SL} from '../bridge.js'

let OBJ = {}

// set a key-value pair in an object, where index 0 is the key and index 1 is the value
OBJ[":"] = $=>{
  let X = $.strtag($.shift())
  let Y = $.shift()
  if($.isstr(X)) X += ''
  if($.objs.length) $.objs[$.objs.length - 1].set(X, Y)
  else {
    let O = $.stack[$.st].at(-1)
    if($.isarl(O) && X < 0) X -= -O.length
    if($.isstr(O)){
      O = $.shift()
      $.unshift(O.slice(0, X) + Y + O.slice(X + 1))
    }
    else O.set(X, Y)
  }
}

OBJ[":|"] = $=> $.exec('dup gl swap :', 1)

// get value for key given by index 0 within object at index 1
OBJ["g:"] = $=>{
  SL.swap($)
  $.unshift($.gind($.shift(), $.shift()))
}

// get keys of object/list at index 0
OBJ["keys"] = $=> $.unshift([...$.shift().keys()])

// get values of object/list at index 0
OBJ["vals"] = $=> $.unshift([...$.shift().values()])

// remove key at index 0 from object at index 1
OBJ["del"] = $=> delete $.stack[$.st][$.stack[$.st].length - 2][$.shift()]

// convert object to a list containing each key-value pair
OBJ["enom"] = $=>{
  let X = $.shift()
  $.unshift(_.zip([...X.keys()], [...X.values()]))
}

// convert `enom`-style list into object
OBJ["denom"] = $=>{
  $.unshift(new Map(
    $.itrlist($.shift()).map(a=>
      $.isarr(a) ? a.length > 1 ? a : a.concat(a) : [a, a]
    ).filter(a=> a.length > 1)
  ))
}

// check if index 0 is in list/object at index 1
OBJ["el"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if($.isstr(X)) $.unshift(+_.includes(Y, X))
  else $.unshift(+itr.some(a=> _.isEqual(a, X), Y))
}

// parse JSON string
OBJ["<json"] = $=>{
  let P = x=>
    $.isarr(x) ? x.map(P)
    : $.isobj(x) ? new Map(Object.entries(x)).map(P)
    : x
  $.unshift(P(JSON.parse($.shift())))
}

// serialize as JSON
OBJ[">json"] = $=>{
  let S = x=>
    $.isarr(x) ? x.map(S)
    : $.isobj(x) ? Object.fromEntries(Array.from(x, ([a, b])=> [$.str(a) + '', S(b)]))
    : x
  $.unshift(JSON.stringify(S($.shift())))
}

export default OBJ
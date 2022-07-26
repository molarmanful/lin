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
OBJ["g:"] = $=> $.u2((a, b)=> $.gind(a, b))

// get keys of object/list at index 0
OBJ["keys"] = $=> $.u1(a=> [...a.keys()])

// get values of object/list at index 0
OBJ["vals"] = $=> $.u1(a=> [...a.values()])

// remove key at index 0 from object at index 1
OBJ["del"] = $=> $.stack[$.st][$.stack[$.st].length - 2].delete($.untag($.shift()))

// convert object to a list containing each key-value pair
OBJ["enom"] = $=> $.u1(a=> _.zip([...a.keys()], [...a.values()]))

// convert `enom`-style list into object
OBJ["denom"] = $=>{
  $.u1(a=> new Map(
    $.itrlist(a).map(b=>
      $.isarr(b) ? b.length > 1 ? b : b.concat(b) : [b, b]
    ).filter(b=> b.length > 1)
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
OBJ["<json"] = $=> $.u1(a=> $.v1(x=> $.js2lin(JSON.parse(x)), a))

// serialize as JSON
OBJ[">json"] = $=> $.u1(a=> JSON.stringify($.lin2js(a)))

export default OBJ
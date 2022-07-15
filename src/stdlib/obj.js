import {_, SL} from '../bridge.js'

let OBJ = {}

// set a key-value pair in an object, where index 0 is the key and index 1 is the value
OBJ[":"] = $=>{
  if($.objs.length) $.objs[$.objs.length - 1][$.shift()] = $.shift()
  else {
    let X = $.shift()
    let Y = $.shift()
    let O = $.stack[$.st].at(-1)
    if($.isarl(O) && X < 0) X -= -O.length
    if($.isstr(O)){
      O = $.shift()
      $.unshift(O.slice(0, X) + Y + O.slice(X + 1))
    }
    else O[X] = Y
  }
}

// get value for key given by index 0 within object at index 1
OBJ["g:"] = $=>{
  SL.swap($)
  $.unshift($.gind($.shift(), $.shift()))
}

// get keys of object/list at index 0
OBJ["keys"] = $=> $.unshift(Object.keys($.shift()))

// get values of object/list at index 0
OBJ["vals"] = $=> $.unshift(Object.values($.shift()))

// remove key at index 0 from object at index 1
OBJ["del"] = $=> delete $.stack[$.st][$.stack[$.st].length - 2][$.shift()]

// convert object to a list containing each key-value pair
OBJ["enom"] = $=>{
  let X = $.shift()
  $.unshift(Object.keys(X).map(a=> [a, X[a]]))
}

// convert `enom`-style list into object
OBJ["denom"] = $=>{
  let X = $.shift()
  let O = {}
  X.map(a=> O[a[0]] = a[1])
  $.unshift(O)
}

// check if index 0 is in list/object at index 1
OBJ["has"] = $=>{
  SL.swap($)
  $.unshift(+_.includes($.shift(), $.shift()))
}

export default OBJ
import {_, INT as I, SL} from '../bridge.js'

let OBJ = {}

// set a key-value pair in an object, where index 0 is the key and index 1 is the value
OBJ[":"] = $=>{
  if(I.objs.length) I.objs[0][I.shift()] = I.shift()
  else {
    let X = I.shift()
    let Y = I.shift()
    I.stack[I.st][0][X] = Y
  }
}

// get value for key given by index 0 within object at index 1
OBJ["g:"] = $=>{
  SL.swap()
  I.unshift(I.gind(I.shift(), I.shift()))
}

// get keys of object/list at index 0
OBJ["keys"] = $=> I.unshift(Object.keys(I.shift()))

// get values of object/list at index 0
OBJ["vals"] = $=> I.unshift(Object.values(I.shift()))

// remove key at index 0 from object at index 1
OBJ["del"] = $=> delete I.stack[I.st][1][I.shift()]

// convert object to a list containing each key-value pair
OBJ["enom"] = $=>{
  let X = I.shift()
  I.unshift(Object.keys(X).map(a=> [X[a], a]))
}

// convert `enom`-style list into object
OBJ["denom"] = $=>{
  let X = I.shift()
  I.unshift({})
  X.map(a=> I.stack[I.st][0][a[1]] = a[0])
}

export default OBJ
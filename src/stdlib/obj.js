import {_, INT as I} from '../bridge.js'

let OBJ = {}

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
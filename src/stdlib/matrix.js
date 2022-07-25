import {math, _, SL, itr} from '../bridge.js'

let MATRIX = {}

let mat = $=> x=> math.matrix($.itrlist(x))

// convert to matrix
MATRIX["mat"] = $=> $.u1(mat($))

// convert matrix to list
MATRIX["mat_"] = $=>{
  $.u1(a=> $.ismat(a) ? a.valueOf() : a)
}

// matrix size
MATRIX["dim"] = $=> $.u1(math.size)

// fill with index 0 to create valid shape
MATRIX["fl"] = $=>{
  $.u2((a, b)=> math.resize(a, math.size(a), b))
}

// identity matrix with side length at index 0
MATRIX["eye"] = $=> $.u1(a=> $.v1(math.identity, a))

export default MATRIX
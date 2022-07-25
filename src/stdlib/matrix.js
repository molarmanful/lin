import {math, _, SL, itr} from '../bridge.js'

let MATRIX = {}

let mat = $=> x=> math.matrix(x, 'sparse')

// matrix size
MATRIX["sz"] = $=> $.u1(math.size)

// convert to matrix
MATRIX["mat"] = $=> $.u1(a=> mat($)($.itrlist(a)))

// convert matrix to list
MATRIX["mat_"] = $=> $.u1(a=> $.ismat(a) ? a.valueOf() : a)

// get diagonal
MATRIX["d:"] = $=> $.u1(math.diag)

// autofill with index 0 to create validly-shaped matrix
MATRIX["fil"] = $=> $.u2((a, b)=> mat($)(math.resize(a, math.size(a), b)))

// generate matrix of 0s from size at index 0
MATRIX[">Zs"] = $=> $.u1(a=> math.zeros(a, 'sparse'))

// identity matrix with side length at index 0
MATRIX["eye"] = $=> $.u1(a=> $.v1(x=> math.identity(x, 'sparse'), a))

// flatten matrix
MATRIX["flt"] = $=> $.u1(a=> math.flatten(a))

// resize matrix
MATRIX[">sz"] = $=> $.u2((a, b)=> mat($)(math.resize(a, b)))

// reshape matrix
MATRIX[">sh"] = $=>
  $.u2((a, b)=> mat($)(math.reshape($.itrlist(itr.take(math.prod(b), itr.cycle(math.flatten(a)))), b)))

// transpose matrix
MATRIX["tsp"] = $=> $.u1(math.transpose)

// squeeze matrix
MATRIX["sqz"] = $=> $.u1(math.squeeze)

// determinant
MATRIX["det"] = $=> $.u1(math.det)

// inverse
MATRIX["inv"] = $=> $.u1(math.inv)

// Kronecker product
MATRIX["*kr"] = $=> $.u2(math.kron)

// dot product
MATRIX["*dt"] = $=> $.u2(math.dot)

// cross product
MATRIX["*cr"] = $=> $.u2(math.cross)

export default MATRIX
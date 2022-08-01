import {$C, math, _, SL, itr, __} from '../bridge.js'

let MATRIX = {}

let mat = $=> math.matrix

// matrix size
MATRIX["sz"] = $=> $.u1(a=> [...math.size(a)])

// convert to matrix
MATRIX["mat"] = $=> $.u1(mat($))

// convert multiline string to matrix
MATRIX["mtr"] = $=>
  $.u1(a=> $.v1(x=>(
    x.split`\n`.map(y=> $.quar($$=>{
      $.exec(y)
      SL.enclose($)
    }))
  ), a))

MATRIX["]^"] = $=> $.exec('] mat', 1)

// convert matrix to list
MATRIX["mat_"] = $=> $.u1(a=> $.ismat(a) ? a.valueOf() : a)

// convert to sparse matrix
MATRIX[">sp"] = $=> $.u1(a=> math.sparse(a))

// convert to dense matrix
MATRIX[">dn"] = $=> $.u1(a=> math.dense(a))

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
MATRIX["tsp"] = $=>
  $.u1(a=>{
    try{ a = math.transpose(a) }
    catch(e){ a = _.zip(...$.itrlist(a)) }
    return mat($)(a)
  })

// rotate matrix clockwise
MATRIX["m@"] = $=> $.exec("tsp ( \\rev ' ) %' mat")

// rotate matrix counterclockwise
MATRIX["m@_"] = $=> $.exec("tsp \\rev ' mat")

// squeeze matrix
MATRIX["sqz"] = $=> $.u1(math.squeeze)

// determinant
MATRIX["det"] = $=> $.u1(math.det)

// inverse
MATRIX["inv"] = $=> $.u1(math.inv)

// Moore-Penrose inverse
MATRIX["pnv"] = $=> $.u1(math.pinv)

// Kronecker product
MATRIX["*kr"] = $=> $.u2(math.kron)

// dot product
MATRIX["*dt"] = $=> $.u2(math.dot)

// cross product
MATRIX["*cr"] = $=> $.u2(math.cross)

// concat matrices
MATRIX["^++"] = $=> $.u3((a, b, c)=> $.v1(x=> math.concat(a, b, x), c))

// `^++` on last axis
MATRIX["^+"] = $=> $.u2(math.concat)

// sort matrix
MATRIX["srt"] = $=>{
  SL.swap($)
  let X = $.shift()
  let N = math.size(X)
  $.unshift(math.reshape($.each(math.flatten(X), _.sortBy), N))
}

// stencil matrix with specified neighborhood
MATRIX["stn"] = $=>{
  let X = $.shift()
  SL.swap($)
  $.u1(a=>{
    a = $.itrlist(a)
    let D = [...math.size(a)]
    let d = D.length
    let F = (x, f)=>
      $.imap(x, (y, i)=> f(y, X.map(z=> math.add(z, i).reduce((a, b)=> a?.[b], a), 2)), 2)
    return $.each(a, F, x=> x, 0, 1)
  })
}

// Moore ("queen") neighborhood
MATRIX["^Qr"] = $=> $.u2((a, b)=> $.v2((x, y)=> [...new $C.BaseN(_.range(-y, y + 1), x)], a, b))

// `1 ^Qn`
MATRIX["^Q"] = $=> $.exec("1 ^Qr", 1)

// von Neumann ("rook") neighborhood
MATRIX["^Rr"] = $=> $.u2((a, b)=> $.v2((x, y)=> [...new $C.BaseN(_.range(-y, y + 1), x)].filter(c=> c.filter(d=> d).length == 1), a, b))

// `1 ^Rn`
MATRIX["^R"] = $=> $.exec("1 ^Rr", 1)

export default MATRIX
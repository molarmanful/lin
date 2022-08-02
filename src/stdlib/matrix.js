import {$C, math, _, SL, itr, __} from '../bridge.js'

let MATRIX = {}

let mat = $=> math.matrix

// matrix size
MATRIX["sz"] = $=> $.u1(a=> $.sz(a))

// convert to matrix
MATRIX["mat"] = $=> $.u1(mat($))

let mstr = ($, a, f=x=> $.form([x]))=>{
  let S = $.sz(a)
  let D = S.length
  let A = $.imap(a, f, D)
  if(D > 1){
    let M
    $.imap(A, x=> M = _.zipWith(M, ...x, (...y)=> _.maxBy(y, z=> z?.length)), D - 2)
    A = $.imap(A, x=> _.zipWith(x, M, (y, z)=> _.padStart(y, z.length, ' ')), D - 1)
  }
  return itr.execPipe(
    itr.range(),
    itr.map(x=> x ? '\n'.repeat(x) : ' '),
    itr.take(D),
    itr.reduce(A, (x, y)=> $.imap(x, z=> z.join(y), -1))
  )
}

// convert matrix to string
MATRIX["m>s"] = $=> $.u1(a=> mstr($, a, x=> $.str(x) + ''))

// convert matrix to `form`ed string
MATRIX["m>f"] = $=> $.u1(a=> mstr($, a))

// convert matrix to "character" representation
MATRIX["m>c"] = $=>
  $.u1(a=>{
    let S = $.sz(a)
    let D = S.length
    a = $.imap(a, x=> $.str(x) + '', D)
    return itr.execPipe(
      itr.range(),
      itr.map(x=> x ? '\n'.repeat(x) : ''),
      itr.take(S.length),
      itr.reduce(a, (x, y)=> $.imap(x, z=> z.join(y), -1))
    )
  })

// convert multiline string to matrix
MATRIX["s>m"] = $=>
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
  $.u1(a=> math.reshape($.each(math.flatten(a), _.sortBy), math.size(a)))
}

// construct matrix from size and function
MATRIX["^it"] = $=> $.u1(a=> $.each(a, math.matrixFromFunction))

// split matrix into submatrices at index 0
MATRIX["spl"] = $=>
  $.u2((a, b)=>{
    let r = x=> x.slice().reverse()
    let A = $.sz(a)
    b = r(math.resize(r(b), [A.length], 1))
    let B = [...$C.CartesianProduct.from(r(b).map(x=> _.range(x)))]
    let C = [...$C.CartesianProduct.from(_.zipWith(r(b), r(A), (x, y)=> _.range(0, y ?? 1, x)))]
    let G = (x, i)=>{
      try { return math.subset(x, math.index(...i)) }
      catch(e){}
    }
    return math.reshape(
      C.map(x=> B.map(y=> G(a, r(math.add(x, y))))),
      [...math.ceil(math.dotDivide(A, b)), ...b]
    )
  })

let stencil = ($, X, F=(a, b)=> a?.[b])=> (x, f)=>
  $.imap(x, (y, i)=> f(y, X.map(z=> math.add(z, i).reduce((a, b)=> F(a, b), x))))

// stencil matrix with specified neighborhood
MATRIX["stn"] = $=>{
  let X = $.shift()
  SL.swap($)
  $.u1(a=>(
    a = $.itrlist(a),
    $.each(a, stencil($, X), x=> x, 0, 1)
  ))
}

// `stn` with wraparound
MATRIX["stm"] = $=>{
  let X = $.shift()
  SL.swap($)
  $.u1(a=>(
    a = $.itrlist(a),
    $.each(a, stencil($, X, (a, b)=> a?.[math.mod(b, a.length)]), x=> x, 0, 1)
  ))
}

// Moore ("queen") neighborhood
MATRIX["^Qr"] = $=>
  $.u2((a, b)=> $.v2((x, y)=>
    [...new $C.BaseN(_.range(-y, y + 1), x)].map(c=> c.reverse()), a, b
  ))

// `1 ^Qn`
MATRIX["^Q"] = $=> $.exec("1 ^Qr", 1)

// von Neumann ("rook") neighborhood
MATRIX["^Rr"] = $=>
  $.u2((a, b)=> $.v2((x, y)=>
    [...new $C.BaseN(_.range(-y, y + 1), x)]
      .filter(c=> c.filter(d=> d).length == 1)
      .map(c=> c.reverse()),
    a, b
  ))

// `1 ^Rn`
MATRIX["^R"] = $=> $.exec("1 ^Rr", 1)

export default MATRIX
import {math, $C, _, SL, itr, __} from '../bridge.js'

let MATRIX = {}

let G = (x, i)=> x?.get && x.get(i)

// matrix size
MATRIX["sz"] = $=> $.u1(a=> $.sz(a))

// convert to matrix
MATRIX["mat"] = $=> $.u1(a=> math.matrix(math.resize(a, $.sz(a), null)))

let mstr = ($, a, f=x=> $.form([x], ' '), sep=' ')=>{
  a = $.itrlist(a)
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
    itr.map(x=> x ? '\n'.repeat(x) : sep),
    itr.take(D),
    itr.reduce(A, (x, y)=> $.imap(x, z=> z.join(y), -1))
  )
}

// convert matrix to string
MATRIX["m>s"] = $=> $.u1(a=> mstr($, a, x=> $.str(x) + ''))

// convert matrix to `form`ed string
MATRIX["m>f"] = $=> $.u1(a=> mstr($, a))

// convert matrix to "character" representation
MATRIX["m>c"] = $=> $.u1(a=> mstr($, a, x=> $.str(x) + '', ''))

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

// get diagonal
MATRIX["d:"] = $=> $.u1(math.diag)

// autofill with index 0 to create validly-shaped matrix
MATRIX["fil"] = $=> $.u2((a, b)=> math.matrix(math.resize(a, $.sz(a), b)))

// generate matrix of 0s from size at index 0
MATRIX[">Zs"] = $=> $.u1(a=> math.zeros(a))

// identity matrix
MATRIX["eye"] = $=> $.u1(math.identity)

// flatten matrix
MATRIX["flt"] = $=> $.u1(a=> math.flatten(a))

// reshape matrix
MATRIX[">sh"] = $=>
  $.u2((a, b)=> math.matrix(math.reshape($.itrlist(itr.take(math.prod(b), itr.cycle(math.flatten(a)))), b)))

// transpose matrix
MATRIX["tsp"] = $=>
  $.u1(a=>{
    a = $.try($$=> math.transpose(a), e=> _.zip(...$.itrlist(a)))
    return math.matrix(a)
  })

// `tsp` with custom axis permutation
MATRIX["tps"] = $=>
  $.u2((a, b)=>{
    let s = $.sz(a)
    return math.matrixFromFunction(
      b.map(x=> G(s, x)),
      i=> b.map(x=> G(i, x)).reduce((x, i)=> G(x, i), a)
    )
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

// restrain to upper bound defined by index 0
MATRIX["hi"] = $=>
  $.u2((a, b)=> math.resize(a, _.zip(b, $.sz(a)).map(([x, y])=> Math.min(x < 0 ? Math.max(0, x + y) : x, y))))

// restrain to lower bound defined by index 0
MATRIX["lo"] = $=>
  $.u2((a, b)=> {
    let A = _.zip(b, $.sz(a))
    let B = [...$C.CartesianProduct.from(A.slice().reverse().map(([x, y])=> _.range(...x < 0 ? [x, 0] : x < y ? [x, y] : [0])))]
    return math.reshape(B.map(x=> x.reduceRight(G, a)), A.map(([x, y])=> Math.max(0, x < 0 ? -x : y - x)))
  })

// sort matrix
MATRIX["srt"] = $=>{
  SL.swap($)
  $.u1(a=> math.reshape($.each(math.flatten(a).valueOf(), _.sortBy), $.sz(a)))
}

// construct matrix from size and function
MATRIX["^it"] = $=> $.u1(a=> $.each(math.zeros(a).valueOf(), (x, f)=> $.imap(x, (y, i)=> f(i))))

// split matrix into submatrices at index 0
MATRIX["spl"] = $=>
  $.u2((a, b)=>{
    let r = x=> x.slice().reverse()
    let A = $.sz(a)
    b = r(math.resize(r(b), [A.length], 1))
    let B = [...$C.CartesianProduct.from(r(b).map(x=> _.range(x)))]
    let C = [...$C.CartesianProduct.from(_.zip(b, A).reverse().map(([x, y])=> _.range(0, y, x)))]
    return math.reshape(
      math.matrix(C.map(x=> B.map(y=> math.add(x, y).reduceRight(G, a)))),
      [...math.ceil(math.dotDivide(A, b)), ...b]
    )
  })

let stencil = ($, X, F=G)=> (x, f)=>
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
    $.each(a, stencil($, X, (a, b)=> G(a, math.mod(b, a.length))), x=> x, 0, 1)
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
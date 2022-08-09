import {math, rust, $C, _, SL, itr} from '../bridge.js'

let NUM = {}

// convert to bigint
NUM["N"] = $=> $.u1(a=> BigInt($.isarr(a) ? a.join`` : a))

// `N` but vectorized
NUM["NN"] = $=> $.u1(a=> $.v1(BigInt, a))

// convert to number
NUM["n_"] = $=>{
  let X = $.shift()
  $.unshift(Number($.isarr(X) ? X.join`` : X))
}

// `n_` but vectorized
NUM["nn"] = $=> $.u1(a=> $.v1(Number, a))

// convert number to digit list
NUM["ns"] = $=> $.u1(a=> $.v1(x=> _.map($.str(x) + '', y=> +y), a))

// `(index 1)*10^(index 0)`
NUM["E"] = $=> $.exec('10 swap ^ *', 1)

// negation
NUM["_"] = $=> $.u1(a=> $.v1(x=> -x, a))

// addition
NUM["+"] = $=> $.u2((a, b)=> $.v2((x, y)=> x - -y, a, b))

// subtraction
NUM["-"] = $=> $.u2((a, b)=> $.v2((x, y)=> x - y, a, b))

// multiplication
NUM["*"] = $=> $.u2((a, b)=> $.v2((x, y)=> x * y, a, b))

// division
NUM["/"] = $=> $.u2((a, b)=> $.v2((x, y)=> x / y, a, b))

let div = (x, y)=>{
  try { return Math.trunc(x / y) }
  catch(e){ return x / y }
}

// integer division
NUM["//"] = $=> $.u2((a, b)=> $.v2(div, a, b))

// modulus
NUM["%"] = $=> $.u2((a, b)=> $.v2((x, y)=> $.mod(x, y), a, b))

// divmod
NUM["/%"] = $=> $.exec('over over // rot_ %', 1)

// exponentiation
NUM["^"] = $=> $.u2((a, b)=> $.v2((x, y)=> x ** y, a, b))

// absolute value
NUM["abs"] = $=> $.u1(a=> $.v1(Math.abs, a))

// sign function
NUM["sign"] = $=> $.u1(a=> $.v1(Math.sign, a))

// push uniformly random number between 0 and 1
NUM["rng"] = $=> $.unshift(math.random())

// natural logarithm
NUM["ln"] = $=> $.u1(a=> $.v1(Math.ln, a))

// base-2 logarithm
NUM["logII"] = $=> $.u1(a=> $.v1(Math.log2, a))

// base-10 logarithm
NUM["logX"] = $=> $.u1(a=> $.v1(Math.log10, a))

// logarithm with base at index 0
NUM["log"] = $=> $.u2((a, b)=> $.v2(Math.log, a, b))

// sine
NUM["sin"] = $=> $.u1(a=> $.v1(Math.sin, a))

// cosine
NUM["cos"] = $=> $.u1(a=> $.v1(Math.cos, a))

// tangent
NUM["tan"] = $=> $.u1(a=> $.v1(Math.tan, a))

// hyperbolic sine
NUM["sinh"] = $=> $.u1(a=> $.v1(Math.sinh, a))

// hyperbolic cosine
NUM["cosh"] = $=> $.u1(a=> $.v1(Math.cosh, a))

// hyperbolic tangent
NUM["tanh"] = $=> $.u1(a=> $.v1(Math.tanh, a))

// inverse sine
NUM["asin"] = $=> $.u1(a=> $.v1(Math.asin, a))

// inverse cosine
NUM["acos"] = $=> $.u1(a=> $.v1(Math.acos, a))

// inverse tangent
NUM["atan"] = $=> $.u1(a=> $.v1(Math.atan, a))

// inverse tangent with coordinates (x,y) to (index 1, index 0)
NUM["atant"] = $=> $.u2((a, b)=> $.v2(Math.atan2, a, b))

// inverse hyperbolic sine
NUM["asinh"] = $=> $.u1(a=> $.v1(Math.asinh, a))

// inverse hyperbolic cosine
NUM["acosh"] = $=> $.u1(a=> $.v1(Math.acosh, a))

// inverse hyperbolic tangent
NUM["atanh"] = $=> $.u1(a=> $.v1(Math.atanh, a))

// push max of stack
NUM["max"] = $=> $.unshift(Math.max(...$.stack[$.st]))

// push min of stack
NUM["min"] = $=> $.unshift(Math.min(...$.stack[$.st]))

// bitwise not
NUM["~"] = $=> $.u1(a=> $.v1(x=> ~x, a))

// bitwise and
NUM["&"] = $=> $.u2((a, b)=> $.v2((x, y)=> x & y, a, b))

// bitwise or
NUM["|"] = $=> $.u2((a, b)=> $.v2((x, y)=> x | y, a, b))

// bitwise xor
NUM["$"] = $=> $.u2((a, b)=> $.v2((x, y)=> x ^ y, a, b))

// bitwise left shift
NUM["<<"] = $=> $.u2((a, b)=> $.v2((x, y)=> x << y, a, b))

// bitwise right shift, sign-propagating
NUM[">>"] = $=> $.u2((a, b)=> $.v2((x, y)=> x >> y, a, b))

// bitwise right shift, zero-fill
NUM[">>>"] = $=> $.u2((a, b)=> $.v2((x, y)=> x >>> y, a, b))

// round towards -∞
NUM["floor"] = $=> $.u1(a=> $.v1(Math.floor, a))

// round towards 0
NUM["trunc"] = $=> $.u1(a=> $.v1(Math.trunc, a))

// round towards or away from 0 depending on < or >= .5
NUM["round"] = $=> $.u1(a=> $.v1(Math.round, a))

// round towards ∞
NUM["ceil"] = $=> $.u1(a=> $.v1(Math.ceil, a))

// Miller-Rabin primality test
NUM["P?"] = $=>{
  $.u1(a=> $.v1(BigInt, a))
  $.u1(a=> $.v1(x=> x > 1 && rust.isprime($.str(x) + ''), a))
}

let fac = _.memoize($C.factorial)
let permn = _.memoize(([x, y])=> $C.permutation(x, y))
let combn = _.memoize(([x, y])=> $C.combination(x, y))

// factorial
NUM["F"] = $=> $.u1(a=> $.v1($C.factorial, a))

// *n* permute *k*
NUM["P"] = $=> $.u2((a, b)=> $.v2($C.permutation, a, b))

// *n* choose *k*
NUM["C"] = $=> $.u2((a, b)=> $.v2($C.combination, a, b))

let catln = x=>
  typeof x != 'bigint' ? catln(BigInt(x))
  : combn([2n * x, x]) - combn([2n * x, x + 1n])

// nth Catalan number
NUM["catln"] = $=> $.u1(a=> $.v1(catln, a))

let irange = function*(k){
  let n = 0n
  while(n <= k) yield n++
}
let stir2 = (n, k)=>
  [n, k].some(a=> typeof a != 'bigint') ? stir2(BigInt(n), BigInt(k))
  : itr.pipe(
      itr.map(j=> (-1n) ** (k - j) * combn([k, j]) * j ** n),
      itr.reduce((a, b)=> a + b)
    )(irange(k)) / fac(k)

// Stirling S2 number at n and k
NUM["stirII"] = $=> $.u2((a, b)=> $.v2(stir2, a, b))

let stir2m = _.memoize(([n, k])=> stir2(n, k))
let bell = n=>
  typeof n != 'bigint' ? bell(BigInt(n))
  : itr.pipe(
      itr.map(k=> stir2m([n, k])),
      itr.reduce((a, b)=> a + b)
    )(irange(n))

// nth Bell number
NUM["belln"] = $=> $.u1((a)=> $.v1(bell, a))

// convert decimal number to base-n digit list
NUM[">b"] = $=>{
  let f = (x, y, z=[])=> x > 0 ? f(div(x, y), y, [$.mod(x, y), ...z]) : z
  $.u2((a, b)=> $.v2((x, y)=> x == 0 ? [0] : f(x, y), a, b))
}

// convert base-n digit list to decimal number
NUM["<b"] = $=>
  $.u2((a, b)=> $.v1(x=>
    math.sum($.itrls(a).reverse().map((y, i)=> y * x ** i)),
    b
  ))

export default NUM
import {prime, RB, $C, _, SL} from '../bridge.js'

let NUM = {}

// convert to bigint
NUM["N"] = $=>{
  let X = $.shift()
  $.unshift(BigInt($.isarr(X) ? X.join`` : X))
}

// convert to number
NUM["n_"] = $=>{
  let X = $.shift()
  $.unshift(Number($.isarr(X) ? X.join`` : X))
}

// convert number to digit list
NUM["ns"] = $=> $.unshift(_.map($.str($.shift()), a=> +a))

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

// integer division
NUM["//"] = $=>{
  if(typeof $.get(0) == 'bigint') SL['/']($)
  $.exec('/ trunc', 1)
}

// modulus
NUM["%"] = $=> $.u2((a, b)=> $.v2($.mod, a, b))

// divmod
NUM["/%"] = $=> $.exec('over over // rot_ %', 1)

// exponentiation
NUM["^"] = $=> $.u2((a, b)=> $.v2((x, y)=> x ** y, a, b))

// absolute value
NUM["abs"] = $=> $.u1(a=> $.v1(Math.abs, a))

// sign function
NUM["sign"] = $=> $.u1(a=> $.v1(Math.sign, a))

// push uniformly random number between 0 and 1
NUM["rng"] = $=> $.unshift(RB.randu())

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
  $.u1(a=> $.v1(x=> x > 1 && prime(x), a))
}

// factorial
NUM["F"] = $=> $.u1(a=> $.v1($C.factorial, a))

// *n* permute *k*
NUM["P"] = $=> $.u2((a, b)=> $.v2($C.permutation, a, b))

// *n* choose *k*
NUM["C"] = $=> $.u2((a, b)=> $.v2($C.combination, a, b))

// nth Catalan number
NUM["catln"] = $=>{
  $.u1(a=> $.v1(BigInt, a))
  $.u1(a=> $.v1(x=> $C.combination(2n * x, x) - $C.combination(2n * x, x + 1n), a))
}

export default NUM
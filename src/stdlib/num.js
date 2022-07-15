import {$C, _, SL} from '../bridge.js'

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
NUM["_"] = $=> $.unshift(-$.shift())

// addition
NUM["+"] = $=> $.unshift($.shift() - -$.shift())

// subtraction
NUM["-"] = $=>{
  SL.swap($)
  $.unshift($.shift() - $.shift())
}

// multiplication
NUM["*"] = $=> $.unshift($.shift() * $.shift())

// division
NUM["/"] = $=>{
  SL.swap($)
  $.unshift($.shift() / $.shift())
}

// integer division
NUM["//"] = $=>{
  if(typeof $.get(0) == 'bigint') SL['/']($)
  $.exec('/ trunc', 1)
}

// modulus
NUM["%"] = $=>{
  SL.swap($)
  $.unshift($.mod($.shift(), $.shift()))
}

// divmod
NUM["/%"] = $=> $.exec('over over // rot_ %', 1)

// exponentiation
NUM["^"] = $=>{
  SL.swap($)
  $.unshift($.shift() ** $.shift())
}

// absolute value
NUM["abs"] = $=> $.unshift(Math.abs($.shift()))

// sign function
NUM["sign"] = $=> $.unshift(Math.sign($.shift()))

// push random number between 0 and 1
NUM["rng"] = $=> $.unshift(Math.random())

// natural logarithm
NUM["ln"] = $=> $.unshift(Math.ln($.shift()))

// base-2 logarithm
NUM["logII"] = $=> $.unshift(Math.log2($.shift()))

// base-10 logarithm
NUM["logX"] = $=> $.unshift(Math.log10($.shift()))

// logarithm with base at index 0
NUM["log"] = $=>{
  SL.swap($)
  $.unshift(Math.log($.shift(), $.shift()))
}

// sine
NUM["sin"] = $=> $.unshift(Math.sin($.shift()))

// cosine
NUM["cos"] = $=> $.unshift(Math.cos($.shift()))

// tangent
NUM["tan"] = $=> $.unshift(Math.tan($.shift()))

// hyperbolic sine
NUM["sinh"] = $=> $.unshift(Math.sinh($.shift()))

// hyperbolic cosine
NUM["cosh"] = $=> $.unshift(Math.cosh($.shift()))

// hyperbolic tangent
NUM["tanh"] = $=> $.unshift(Math.tanh($.shift()))

// inverse sine
NUM["asin"] = $=> $.unshift(Math.asin($.shift()))

// inverse cosine
NUM["acos"] = $=> $.unshift(Math.acos($.shift()))

// inverse tangent
NUM["atan"] = $=> $.unshift(Math.atan($.shift()))

// inverse tangent with coordinates (x,y) to (index 1, index 0)
NUM["atant"] = $=>{
  SL.swap($)
  $.unshift(Math.atan2($.shift(), $.shift()))
}

// inverse hyperbolic sine
NUM["asinh"] = $=> $.unshift(Math.asinh($.shift()))

// inverse hyperbolic cosine
NUM["acosh"] = $=> $.unshift(Math.acosh($.shift()))

// inverse hyperbolic tangent
NUM["atanh"] = $=> $.unshift(Math.atanh($.shift()))

// push max
NUM["max"] = $=> $.unshift(Math.max(...$.stack[$.st]))

// push min
NUM["min"] = $=> $.unshift(Math.min(...$.stack[$.st]))

// bitwise not
NUM["~"] = $=> $.unshift(~$.shift())

// logical not
NUM["!"] = $=> $.unshift(+!$.tru($.shift()))

// bitwise and
NUM["&"] = $=> $.unshift($.shift() & $.shift())

// bitwise or
NUM["|"] = $=> $.unshift($.shift() | $.shift())

// bitwise xor
NUM["$"] = $=> $.unshift($.shift() ^ $.shift())

// bitwise left shift
NUM["<<"] = $=>{
  SL.swap($)
  $.unshift($.shift() << $.shift())
}

// bitwise right shift, sign-propagating
NUM[">>"] = $=> {
  SL.swap($)
  $.unshift($.shift() >> $.shift())
}

// bitwise right shift, zero-fill
NUM[">>>"] = $=>{
  SL.swap($)
  $.unshift($.shift() >>> $.shift())
}

// round towards -∞
NUM["floor"] = $=> $.unshift(Math.floor($.shift()))

// round towards 0
NUM["trunc"] = $=> $.unshift(Math.trunc($.shift()))

// round towards or away from 0 depending on < or >= .5
NUM["round"] = $=> $.unshift(Math.round($.shift()))

// round towards ∞
NUM["ceil"] = $=> $.unshift(Math.ceil($.shift()))

// factorial
NUM["F"] = $=> $.unshift(combs.factorial($.shift()))

// *n* permute *k*
NUM["P"] = $=>{
  SL.swap($)
  $.unshift($C.permutation($.shift(), $.shift()))
}

// *n* choose *k*
NUM["C"] = $=>{
  SL.swap($)
  $.unshift($C.combination($.shift(), $.shift()))
}

export default NUM
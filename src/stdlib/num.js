import {_, INT as I, SL} from '../bridge.js'

let NUM = {}

// `(index 1)*10^(index 0)`
NUM["E"] = $=>{
  I.unshift(10)
  SL.swap()
  SL["^"]()
  SL["*"]()
}

// convert to BigInt
NUM["N"] = $=>{
  I.unshift(BigInt(I.shift()))
}

// negation
NUM["_"] = $=> I.unshift(-I.shift())

// addition
NUM["+"] = $=> I.unshift(I.shift() - - I.shift())

// subtraction
NUM["-"] = $=>{
  SL.swap()
  I.unshift(I.shift()-I.shift())
}

// multiplication
NUM["*"] = $=> I.unshift(I.shift() * I.shift())

// division
NUM["/"] = $=>{
  SL.swap()
  I.unshift(I.shift() / I.shift())
}

// integer division
NUM["//"] = $=>{
  SL["/"]()
  SL.trunc()
}

// modulus
NUM["%"] = $=>{
  SL.swap()
  I.unshift(I.mod(I.shift(), I.shift()))
}

// divmod
NUM["/%"] = $=>{
  SL.over()
  SL.over()
  SL['//']()
  SL.rot_()
  SL['%']()
}

// exponentiation
NUM["^"] = $=>{
  SL.swap()
  I.unshift(I.shift() ** I.shift())
}

// absolute value
NUM["abs"] = $=> I.unshift(Math.abs(I.shift()))

// sign function
NUM["sign"] = $=> I.unshift(Math.sign(I.shift()))

// push random number between 0 and 1
NUM["rand"] = $=> I.unshift(Math.random())

// natural logarithm
NUM["ln"] = $=> I.unshift(Math.ln(I.shift()))

// base-2 logarithm
NUM["logII"] = $=> I.unshift(Math.log2(I.shift()))

// base-10 logarithm
NUM["logX"] = $=> I.unshift(Math.log10(I.shift()))

// logarithm with base at index 0
NUM["log"] = $=>{
  SL.swap()
  I.unshift(Math.log(I.shift(), I.shift()))
}

// sine
NUM["sin"] = $=> I.unshift(Math.sin(I.shift()))

// cosine
NUM["cos"] = $=> I.unshift(Math.cos(I.shift()))

// tangent
NUM["tan"] = $=> I.unshift(Math.tan(I.shift()))

// hyperbolic sine
NUM["sinh"] = $=> I.unshift(Math.sinh(I.shift()))

// hyperbolic cosine
NUM["cosh"] = $=> I.unshift(Math.cosh(I.shift()))

// hyperbolic tangent
NUM["tanh"] = $=> I.unshift(Math.tanh(I.shift()))

// inverse sine
NUM["asin"] = $=> I.unshift(Math.asin(I.shift()))

// inverse cosine
NUM["acos"] = $=> I.unshift(Math.acos(I.shift()))

// inverse tangent
NUM["atan"] = $=> I.unshift(Math.atan(I.shift()))

// inverse tangent with coordinates (x,y) to (index 1, index 0)
NUM["atant"] = $=>{
  SL.swap()
  I.unshift(Math.atan2(I.shift(), I.shift()))
}

// inverse hyperbolic sine
NUM["asinh"] = $=> I.unshift(Math.asinh(I.shift()))

// inverse hyperbolic cosine
NUM["acosh"] = $=> I.unshift(Math.acosh(I.shift()))

// inverse hyperbolic tangent
NUM["atanh"] = $=> I.unshift(Math.atanh(I.shift()))

// push max
NUM["max"] = $=> I.unshift(Math.max(...I.stack[I.st]))

// push min
NUM["min"] = $=> I.unshift(Math.min(...I.stack[I.st]))

// bitwise not
NUM["~"] = $=> I.unshift(~I.shift())

// logical not
NUM["!"] = $=> I.unshift(+!I.tru(I.shift()))

// bitwise and
NUM["&"] = $=> I.unshift(I.shift() & I.shift())

// bitwise or
NUM["|"] = $=> I.unshift(I.shift() | I.shift())

// bitwise xor
NUM["$"] = $=> I.unshift(I.shift() ^ I.shift())

// bitwise left shift
NUM["<<"] = $=>{
  SL.swap()
  I.unshift(I.shift() << I.shift())
}

// bitwise right shift, sign-propagating
NUM[">>"] = $=> {
  SL.swap()
  I.unshift(I.shift() >> I.shift())
}

// bitwise right shift, zero-fill
NUM[">>>"] = $=>{
  SL.swap()
  I.unshift(I.shift() >>> I.shift())
}

// round towards -∞
NUM["floor"] = $=> I.unshift(Math.floor(I.shift()))

// round towards 0
NUM["trunc"] = $=> I.unshift(Math.trunc(I.shift()))

// round towards or away from 0 depending on < or >= .5
NUM["round"] = $=> I.unshift(Math.round(I.shift()))

// round towards ∞
NUM["ceil"] = $=> I.unshift(Math.ceil(I.shift()))

export default NUM
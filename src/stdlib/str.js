import {unesc, _, INT as I} from '../bridge.js'

let STR = {}

// unescape string at index 0
STR["unesc"] = $=> I.unshift(unesc(I.shift()))

// convert number to Unicode
STR[">char"] = $=> I.unshift(String.fromCodePoint(I.shift()))

// convert Unicode to number
STR["<char"] = $=> I.unshift(I.shift().codePointAt())

// lowercase
STR["lower"] = $=> I.unshift(I.shift().toLowerCase())

// uppercase
STR["upper"] = $=> I.unshift(I.shift().toUpperCase())

// repeat string by index 0
STR["rep"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  if(Y.big || Y.toFixed) I.unshift(_.repeat(Y, X))
  else I.unshift(_.range(X).flatMap(a=> Y))
}

// pad string given by index 2 until length given by index 0 with string given by index 1
STR["pad"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  let Z = I.shift()
  I.unshift(_.pad(Y,Z,X))
}

// `pad` but only from the left
STR["padl"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  let Z = I.shift()
  I.unshift(_.padStart(Y,Z,X))
}

// `pad` but only from the right
STR["padr"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  let Z = I.shift()
  I.unshift(_.padEnd(Y,Z,X))
}

export default STR
import {unesc, _} from '../bridge.js'

let STR = {}

STR["str"] = $=> $.unshift($.str($.shift()))

// unescape string at index 0
STR["unesc"] = $=> $.unshift(unesc($.shift()))

// convert number to Unicode
STR[">char"] = $=> $.unshift(String.fromCodePoint($.shift()))

// convert Unicode to number
STR["<char"] = $=> $.unshift($.shift().codePointAt())

// lowercase
STR["lower"] = $=> $.unshift($.shift().toLowerCase())

// uppercase
STR["upper"] = $=> $.unshift($.shift().toUpperCase())

// pad string given by index 2 until length given by index 0 with string given by index 1
STR["pad"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  let Z = $.shift()
  $.unshift(_.pad(Z, X, Y))
}

// `pad` but only from the left
STR["padl"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  let Z = $.shift()
  $.unshift(_.padStart(Z, X, Y))
}

// `pad` but only from the right
STR["padr"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  let Z = $.shift()
  $.unshift(_.padEnd(Z, X, Y))
}

export default STR
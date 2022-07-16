import {unesc, _} from '../bridge.js'

let STR = {}

STR["str"] = $=> $.unshift($.str($.shift()))

// unescape string at index 0
STR["unesc"] = $=> $.unshift(unesc($.shift()))

// convert charcode to char
STR[">char"] = $=> $.unshift(String.fromCodePoint($.shift()))

// convert charcode list to string
STR[">chars"] = $=> $.unshift(String.fromCodePoint(...$.shift()))

// convert char to charcode
STR["<char"] = $=> $.unshift($.shift().codePointAt())

// convert string to charcode list
STR["<chars"] = $=> $.unshift(_.map($.shift(), a=> a.codePointAt()))

// lowercase
STR[">a"] = $=> $.unshift($.shift().toLowerCase())

// uppercase
STR[">A"] = $=> $.unshift($.shift().toUpperCase())

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
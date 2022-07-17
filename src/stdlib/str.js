import {unesc, _, itr} from '../bridge.js'

let STR = {}

STR["///"] = $=>{
  let X
  let Y = $.lns.at(-1)[1] - -1
  $.unshift([...
    itr.pipe(
      itr.drop(Y),
      itr.takeWhile(a=> (X = a, Y++, !a.match(/^ *\\\\\\/)))
    )($.pkf.at(-1)?.lines || $.lines)
  ].join('\n'))
  let F = $.shift()
  F.orig.line[1]++
  $.unshift(F)
  $.exec($.strtag(X.replace(/^ *\\\\\\/, ''), [$.lns.at(-1)[0], Y]), 1)
}

STR["\\\\\\"] = $=>{}

// convert to string
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

// split with empty string
STR[">cs"] = $=> $.unshift($.str($.shift()).split``)

// join with empty string
STR["<cs"] = $=> $.unshift($.shift().join``)

// split with space
STR[">ws"] = $=> $.unshift($.str($.shift()).split` `)

// join with space
STR["<ws"] = $=> $.unshift($.shift().join` `)

// split with newline
STR[">ls"] = $=> $.unshift($.str($.shift()).split`\n`)

// join with newline
STR["<ls"] = $=> $.unshift($.shift().join`\n`)

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
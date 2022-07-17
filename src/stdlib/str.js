import {unesc, _, itr} from '../bridge.js'

let STR = {}

// construct multiline string by getting lines until index 0 is matched at the start of the string
STR["lns"] = $=>{
  let X, Z
  let Y = $.lns.at(-1)[1]
  let S = new RegExp(`^${$.shift()}`)
  $.unshift([...
    itr.pipe(
      itr.drop(Y + 1),
      itr.takeWhile(a=> (X = a, Y++, Z = !a.match(S)))
    )($.pkf.at(-1)?.lines || $.lines)
  ].join('\n'))
  let F = $.shift()
  F.orig.line[1]++
  $.unshift(F)
  if(!Z) $.exec($.strtag(X.replace(S, ''), [$.lns.at(-1)[0], Y]), 1)
}

// convert to string
STR["str"] = $=> $.unshift($.str($.shift()))

// tag string with line number
STR["tag"] = $=>{
  let X = $.shift()
  let X1 = Number(X)
  if($.isnum(Number(X1))) $.unshift($.strtag($.untag($.shift()), [0, X1]))
  else throw `bad tag number "${X}"`
}

// untag string
STR["tag_"] = $=> $.unshift($.untag($.shift()))

// unescape string at index 0
STR["esc_"] = $=> $.unshift(unesc($.shift()))

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

// UPPERCASE
STR[">A"] = $=> $.unshift($.shift().toUpperCase())

// capitalize first letter
STR[">Aa"] = $=> $.unshift(_.capitalize($.shift()))

// camelCase
STR[">aA"] = $=> $.unshift(_.camelCase($.shift()))

// kebab-case 
STR[">a-a"] = $=> $.unshift(_.kebabCase($.shift()))

// snake_case 
STR[">a_a"] = $=> $.unshift(_.snakeCase($.shift()))

// Start Case 
STR[">AA"] = $=> $.unshift(_.startCase($.shift()))

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
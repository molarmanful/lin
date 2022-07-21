import {RE2, unesc, _, itr, voca, SL} from '../bridge.js'

let STR = {}

// convert to string
STR["str"] = $=> $.unshift($.str($.shift()))

// convert to formatted representation
STR["form"] = $=> $.unshift($.form([$.shift()]))

// construct multiline string by getting lines until index 0 is matched at the start of the string
STR["lns"] = $=>{
  let X, Z
  let Y = $.lns.at(-1)[1]
  let S = new RE2(`^${$.str($.shift())}`)
  $.unshift([...
    itr.pipe(
      itr.drop(Y + 1),
      itr.takeWhile(a=> (X = a, Y++, Z = !a.match(S)))
    )($.pkf.at(-1)?.lines || $.lines)
  ].join('\n'))
  let F = $.shift()
  F.orig[1]++
  $.unshift(F)
  if(!Z) $.exec($.strtag(X.replace(S, ''), [0, Y]), 1)
}

// tag string with line number
STR["tag"] = $=>{
  let X = $.shift()
  let X1 = Number(X)
  if($.isnum(Number(X1))) $.unshift($.strtag($.untag($.shift()), [0, X1]))
  else $.err(`bad tag number "${X}"`)
}

// untag string
STR["tag_"] = $=> $.unshift($.untag($.shift()))

// equivalent of `sprintf` - takes string and list
STR["sf"] = $=>{
  SL.swap($)
  $.unshift(voca.vprintf($.shift(), $.shift()))
}

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

// split into words
STR["words"] = $=> $.unshift(voca.words($.shift()))

// split into graphemes
STR["graphms"] = $=> $.unshift(voca.graphemes($.shift()))

// lowercase
STR[">a"] = $=> $.unshift($.shift().toLowerCase())

// UPPERCASE
STR[">A"] = $=> $.unshift($.shift().toUpperCase())

// capitalize first letter
STR[">Aa"] = $=> $.unshift(voca.capitalize($.shift()))

// camelCase
STR[">aA"] = $=> $.unshift(voca.camelCase($.shift()))

// kebab-case 
STR[">a-a"] = $=> $.unshift(voca.kebabCase($.shift()))

// snake_case 
STR[">a_a"] = $=> $.unshift(voca.snakeCase($.shift()))

// Title Case 
STR[">AA"] = $=> $.unshift(voca.titleCase($.shift()))

// sWAP cASE
STR[">aa"] = $=> $.unshift(voca.titleCase($.shift()))


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

// latinize
STR["lat"] = $=> $.unshift(voca.latinise($.shift()))

// transliterate chars in index 2 from index 1 to index 0
STR["tr"] = $=>{
  let X = $.str($.shift()) + ''
  let Y = $.str($.shift()) + ''
  $.unshift(voca.tr($.shift(), Y, X))
}

// `tr` but with chars at index 1 and object at index 0
STR["tro"] = $=>{
  SL.swap($)
  $.unshift(voca.tr($.shift(), Object.fromEntries($.shift())))
}

// new regex with flags at index 0
STR["?"] = $=>{
  SL.swap($)
  $.unshift($.rex($.shift(), $.shift()))
}

// safe regex
STR["?!"] = $=>{
  SL.swap($)
  $.unshift($.srex($.shift(), $.shift()))
}

// unsafe regex
STR["??"] = $=>{
  SL.swap($)
  $.unshift($.urex($.shift(), $.shift()))
}

// iterator of matches when regex at index 0 is applied to string at index 1
STR["?m"] = $=>{
  let X = $.arex($.shift(), 'g')
  let Y = $.str($.shift()) + ''
  $.unshift(Y.matchAll(X))
}

// `?m` but detailed
STR["?M"] = $=>{
  let X = $.arex($.shift(), 'g')
  let Y = $.str($.shift()) + ''
  let m = a=> new Map(Object.entries(a).map(([b, c])=> [b, $.isobj(c) ? m(c) : c]))
  $.unshift(itr.map(m, Y.matchAll(X)))
}

// `?m` with indices only
STR["?i"] = $=>{
  let X = $.arex($.shift(), 'g')
  let Y = $.str($.shift()) + ''
  $.unshift(itr.map(a=> a.index, Y.matchAll(X)))
}

// `?m` with truthiness
STR["?t"] = $=>{
  let X = $.arex($.shift(), 'g')
  let Y = $.str($.shift()) + ''
  $.unshift(+X.test(Y))
}

// replace matches of regex at index 1 on string at index 2 with string at index 0
STR["?s"] = $=>{
  let X = $.str($.shift()) + ''
  let Y = $.arex($.shift())
  let Z = $.str($.shift()) + ''
  $.unshift(Z.replace(Y, X))
}

// `?s` with replacement function
STR["?S"] = $=>{
  let X = $.str($.shift()) + ''
  let Y = $.arex($.shift())
  let Z = $.str($.shift()) + ''
  $.unshift(Z.replace(Y, (m, ...c)=>{
    let groups
    if($.isobj(c.at(-1))) groups = new Map(Object.entries(c.pop()))
    let input = c.pop()
    let index = c.pop()
    return $.str($.quar(a=>{
      $.scope.push({index, input, groups})
      $.stack[$.st] = [c.reverse(), m]
      $.exec(X)
      $.scope.pop()
    }))
  }))
}

export default STR
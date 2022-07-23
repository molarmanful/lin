import {RE2, unesc, _, itr, voca, SL} from '../bridge.js'

let STR = {}

// convert to string
STR["str"] = $=> $.u1(a=> $.str(a))

// convert to formatted representation
STR["form"] = $=> $.u1(a=> $.form([a]))

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
  $.u2((a, b)=> $.v2((x, y)=>{
    let y1 = 0 | Number(y)
    if(!$.isnum(y1)) $.err(`bad tag number "${X}"`)
    return $.strtag($.untag(x), [0, y1])
  }, a, b))
}

// untag string
STR["tag_"] = $=> $.stack[$.st].set(-1, $.untag($.get(0)))

// equivalent of `sprintf` - takes string and list
STR["sf"] = $=> $.u2((a, b)=> $.v1(x=> voca.vprintf(x, b), a))

// unescape string at index 0
STR["esc_"] = $=> $.u1(a=> $.v1(unesc, a))

// convert charcode to char
STR[">char"] = $=> $.u1(a=> $.v1(String.fromCodePoint, a))

// convert charcode list to string
STR[">chars"] = $=> $.u1(a=> String.fromCodePoint(...a))

// convert char to charcode
STR["<char"] = $=> $.u1(a=> $.v1(x=> x.codePointAt(), a))

// convert string to charcode list
STR["<chars"] = $=> $.u1(a=> _.map(a, b=> b.codePointAt()))

// split string at index 1 over string at index 0
STR["split"] = $=> $.u2((a, b)=> $.v2((x, y)=> $.str(x).split(y), a, b))

// join list over string at index 0
STR["join"] = $=> $.u2((a, b)=> $.v1(x=> a.join($.str(x) + ''), b))

// split with empty string
STR[">cs"] = $=> $.u1(a=> $.v1(x=> $.str(x).split``, a))

// join with empty string
STR["<cs"] = $=> $.u1(a=> a.join``)

// split with space
STR[">ws"] = $=> $.u1(a=> $.v1(x=> $.str(x).split` `, a))

// join with space
STR["<ws"] = $=> $.u1(a=> a.join` `)

// split with newline
STR[">ls"] = $=> $.u1(a=> $.v1(x=> $.str(x).split`\n`, a))

// join with newline
STR["<ls"] = $=> $.u1(a=> a.join`\n`)

// split into words
STR["words"] = $=> $.u1(a=> $.v1(voca.words, a))

// split into graphemes
STR["graphms"] = $=> $.u1(a=> $.v1(voca.graphemes, a))

// lowercase
STR[">a"] = $=> $.u1(a=> $.v1(x=> x.toLowerCase(), a))

// UPPERCASE
STR[">A"] = $=> $.u1(a=> $.v1(x=> x.toUpperCase(), a))

// capitalize first letter
STR[">Aa"] = $=> $.u1(a=> $.v1(voca.capitalize, a))

// camelCase
STR[">aA"] = $=> $.u1(a=> $.v1(voca.camelCase, a))

// kebab-case 
STR[">a-a"] = $=> $.u1(a=> $.v1(voca.kebabCase, a))

// snake_case 
STR[">a_a"] = $=> $.u1(a=> $.v1(voca.snakeCase, a))

// Title Case 
STR[">AA"] = $=> $.u1(a=> $.v1(voca.titleCase, a))

// sWAP cASE
STR[">aa"] = $=> $.u1(a=> $.v1(voca.swapCase, a))

// pad string given by index 2 until length given by index 0 with string given by index 1
STR["pad"] = $=> $.u3((a, b, c)=> $.v3((x, y, z)=> _.pad($.str(x) + '', $.str(y) + '', z), a, c, b))

// `pad` but only from the left
STR["padl"] = $=> $.u3((a, b, c)=> $.v3((x, y, z)=> _.padStart($.str(x) + '', $.str(y) + '', z), a, c, b))

// `pad` but only from the right
STR["padr"] = $=> $.u3((a, b, c)=> $.v3((x, y, z)=> _.padEnd($.str(x) + '', $.str(y) + '', z), a, c, b))

// trim whitespace from both ends of the string
STR["trim"] = $=> $.u1(a=> $.v1(voca.trim, a))

// `trim` but only from the left
STR["trim"] = $=> $.u1(a=> $.v1(voca.trimLeft, a))

// `trim` but only from the right
STR["trimr"] = $=> $.u1(a=> $.v1(voca.trimRight, a))

// latinize
STR["lat"] = $=> $.u1(a=> $.v1(voca.latinise, a))

// transliterate chars in index 2 from index 1 to index 0
STR["tr"] = $=> $.u3((a, b, c)=> $.v3(voca.tr, a, b, c))

// `tr` but with chars at index 1 and object at index 0
STR["tro"] = $=> $.u2((a, b)=> $.v2(voca.tr, a, Object.fromEntries(b)))

// new regex with flags at index 0
STR["?"] = $=> $.u2((a, b)=> $.v2((x, y)=> $.rex(x, y), a, b))

// safe regex
STR["?!"] = $=> $.u2((a, b)=> $.v2((x, y)=> $.srex(x, y), a, b))

// unsafe regex
STR["??"] = $=> $.u2((a, b)=> $.v2((x, y)=> $.urex(x, y), a, b))

// iterator of matches when regex at index 0 is applied to string at index 1
STR["?m"] = $=> $.u2((a, b)=> $.v2((x, y)=> ($.str(x) + '').matchAll($.arex(y, 'g')), a, b))

// `?m` but detailed
STR["?M"] = $=>{
  let m = a=> new Map(Object.entries(a).map(([b, c])=> [b, $.isobj(c) ? m(c) : c]))
  $.u2((a, b)=> $.v2((x, y)=> itr.map(m, ($.str(x) + '').matchAll($.arex(y, 'g'))), a, b))
}

// `?m` with indices only
STR["?i"] = $=>
  $.u2((a, b)=> $.v2((x, y)=>
    itr.map(a=> a.index, ($.str(x) + '').matchAll($.arex(y, 'g'))), a, b
  ))

// `?m` with truthiness
STR["?t"] = $=> $.u2((a, b)=> $.v2((x, y)=> $.arex(y, 'g').test($.str(x) + ''), a, b))

// replace matches of regex at index 1 on string at index 2 with string at index 0
STR["?s"] = $=>
  $.u3((a, b, c)=> $.v3((x, y, z)=>
    ($.str(x) + '').replace($.arex(y), $.str(z) + ''), a, b, c
  ))

// `?s` with replacement function
STR["?S"] = $=>{
  let r = x=> (m, ...c)=>{
    let groups
    if($.isobj(c.at(-1))) groups = new Map(Object.entries(c.pop()))
    let input = c.pop()
    let index = c.pop()
    return $.str($.quar(a=>{
      $.scope.push({index, input, groups})
      $.stack[$.st] = [c.reverse(), m]
      $.exec(x)
      $.scope.pop()
    }))
  }
  $.u3((a, b, c)=> $.v3((x, y, z)=>
    ($.str(x) + '').replace($.arex(y), r($.str(z) + '')), a, b, c
  ))
}

export default STR
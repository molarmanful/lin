import {_, SL} from '../bridge.js'

let LIST = {}

// length of index 0
LIST["len"] = $=>{
  let X = $.shift()
  $.unshift(X.size || X.length)
}

// depth of index 0
LIST["dep"] = $=>{
  let D = x=> $.isobj(x) ? 1 + Math.max(0, ...$.ismap(x) ? _.map(x, D).values() : _.map(x, D)) : 0
  $.unshift(D($.shift()))
}

// `es` index 0 on list at index 1
LIST["'"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if($.isstr(Y) || $.isnum(Y)) Y = $.str(Y).split``
  $.iter.push($.st)
  $.st = $.iter.at(-1) + '\n'
  $.stack[$.st] = [...Y]
  $.addf(a=>{
    Y = $.stack[$.st]
    delete $.stack[$.iter.at(-1) + '\n']
    $.st = $.iter.pop()
    $.unshift(Y)
  })
  $.exec(X, 1)
}

// split string at index 1 over string at index 0
LIST["split"] = $=>{
  let X = $.shift()
  $.unshift($.str($.shift()).split(X))
}

// join list over string at index 0
LIST["join"] = $=>{
  let X = $.shift()
  $.unshift($.shift().join(X))
}

// pair top 2 items
LIST[","] = $=> $.unshift([$.shift(), $.shift()])

// concatenate top 2 items as strings or lists
LIST["++"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.unshift($.isarr(Y) ? _.concat(X, Y) : Y + $.str(X))
}

// get random item from list
LIST["r:"] = $=> $.exec('dup len rng * 0| g:', 1)

// repeat list/string by index 0
LIST["rep"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if($.isstr(Y) || $.isnum(Y)) $.unshift(_.repeat(Y, X))
  else $.unshift(_.range(X).flatMap(a=> Y))
}

// set union of lists at index 0 and index 1
LIST["union"] = $=>{
  SL.swap($)
  $.unshift(_.union($.shift(), $.shift()))
}

// set intersection of lists at index 0 and index 1
LIST["inter"] = $=>{
  SL.swap($)
  $.unshift(_.intersection($.shift(), $.shift()))
}

// set difference of lists at index 0 and index 1
LIST["diff"] = $=>{
  SL.swap($)
  $.unshift(_.difference($.shift(), $.shift()))
}

// wrap index 0 in a list
LIST["wrap"] = $=> $.unshift([$.shift()])

// wrap first _n_ items in a list, where _n_ is index 0
LIST["wraps"] = $=> $.unshift($.splice(0, $.shift()))

// opposite of `wrap`; take all items in list at index 0 and push to parent stack
LIST["wrap_"] = $=>{
  let X = $.shift()
  $.unshift(...$.isarr(X) ? X : [X])
}

// enclose entire stack into a list
LIST["enclose"] = $=> $.stack[$.st] = [$.stack[$.st].slice()]

// push entire stack as list
LIST["dups"] = $=> $.unshift($.stack[$.st].slice())

// set current stack to the list at index 0
LIST["usurp"] = $=> $.stack[$.st] = [...$.shift()]

// identity matrix with side length at index 0
LIST["eye"] = $=>{
  let X = $.shift()
  $.unshift(_.range(X).map((a, i)=> _.range(X).map((b, j)=> +(i == j))))
}

// convert list to truth mask
LIST["!s"] = $=>{
  let m = x=> x.map(a=> $.isarr(a) ?  m(a) : $.tru(a) ? 1 : 0)
  $.unshift(m($.shift()))
}

// use list at index 0 as replication mask for list at index 1
LIST["repl"] = $=>{
  let m = (x, y)=>
    y.flatMap((a, i)=>
      $.isarr(a) ?  $.isarr(x[i]) ? [m(x[i], a)] : [x[i]]
      : $.tru(a) && i in x ?  _.range($.isnum(a) ? a : 1).map(b=> x[i])
      : []
    )
  SL.swap($)
  $.unshift(m($.shift(), $.shift()))
}

export default LIST
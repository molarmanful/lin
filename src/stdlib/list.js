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
  $.unshift($.quar(a=>{
    $.stack[$.st] = [...Y]
    $.exec(X)
    LIST.enclose($)
  }))
}

// pair top 2 items
LIST[","] = $=> $.u2((a, b)=> [a, b])

// concatenate top 2 items as strings or lists
LIST["++"] = $=> $.u2((a, b)=> $.isarr(a) ? _.concat(a, b) : a + $.str(b))

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

// use list at index 0 as replication mask for list at index 1
LIST["repl"] = $=>{
  let m = (x, y)=>
    y.flatMap((a, i)=>
      $.isarr(a) ?  $.isarr(x[i]) ? [m(x[i], a)] : [x[i]]
      : $.tru(a) && i in x ?  _.range($.isnum(a) ? a : 1).map(b=> x[i])
      : []
    )
  $.u2((a, b)=> $.v2(m, a, b))
}

export default LIST
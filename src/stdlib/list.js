import {itr, _, SL} from '../bridge.js'

let LIST = {}

// length of index 0
LIST["len"] = $=> $.u1(a=> $.len(a))

// `es` index 0 on list at index 1
LIST["'"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if($.ismat(Y)) Y = Y.valueOf()
  else if($.isstr(Y) || $.isnum(Y)) Y = $.str(Y).split``
  $.unshift($.v1(x=>
    $.quar($$=>{
      $.stack[$.st] = [...Y]
      $.exec(x)
      LIST.enclose($)
    }), X
  ))
}

// concatenate strings
LIST["++"] = $=> $.u2((a, b)=> $.v2((x, y)=> $.str(x) + $.str(y), a, b))

// non-vectorized `++` (also works on lists)
LIST["+*"] = $=> $.u2((a, b)=> $.isarr(a) ? a.concat(b) : a + $.str(b))

// get random item from list
LIST["r:"] = $=> $.exec('dup len rng * 0| g:', 1)

// repeat list/string by index 0
LIST["rep"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if($.isstr(Y)) $.unshift($.v1(x=> _.repeat(Y, x), X))
  else $.unshift($.v1(x=> _.range(x).flatMap(a=> Y), X))
}

// set union of lists at index 0 and index 1
LIST["union"] = $=> $.u2((a, b)=> _.unionBy(a, b, x=> $.untag(x)))

// set intersection of lists at index 0 and index 1
LIST["inter"] = $=> $.u2((a, b)=> _.intersectionBy(a, b, x=> $.untag(x)))

// set difference of lists at index 0 and index 1
LIST["diff"] = $=> $.u2((a, b)=> _.differenceBy(a, b, x=> $.untag(x)))

// wrap index 0 in a list
LIST["wrap"] = $=> $.u1(a=> [a])

// `wrap` top 2 items
LIST[","] = $=> $.u2((a, b)=> $.v2((x, y)=> [x, y], a, b))

// `,` but non-vectorized
LIST[",_"] = $=> $.u2((a, b)=> [a, b])

// wrap first _n_ items
LIST["wraps"] = $=> $.u1(a=> $.splice(0, a))

// opposite of `wrap`; take all items in list at index 0 and push to parent stack
LIST["wrap_"] = $=>{
  let X = $.shift()
  $.unshift(...$.ismat(X) ? X.valueOf() : $.isitr(X) ? $.listitr(X) : $.isi(X) ? X : [X])
}

// enclose entire stack into a list
LIST["enclose"] = $=> $.stack[$.st] = [$.stack[$.st].slice()]

// push entire stack as list
LIST["dups"] = $=> $.unshift($.stack[$.st].slice())

// set current stack to the list at index 0
LIST["usurp"] = $=> $.stack[$.st] = [...$.shift()]

// get insert index of index 0 from binary searching over `es` of index 1 on each element in list
LIST["bins"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  let O = $.shift()
  $.unshift(X)
  $.unshift($.each(O, (x, f)=> _.sortedIndexBy(x, Y, f)))
}

// fill integer gaps with ranges
LIST["rfil"] = $=> $.exec(".(.+ (2wins (.(.-> )).' flat ) dip )", 1)

export default LIST
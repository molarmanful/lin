import {math, $C, itr, _, SL} from '../bridge.js'

let STACK = {}

// stack length
STACK["size"] = $=> $.exec('dups len', 1)

// stack depth
STACK["deps"] = $=> $.exec('dups dep', 1)

// convert each item in stack to an index-item pair
STACK["enum"] = $=> $.stack[$.st] = $.stack[$.st].map((a, b, c)=> [c.length - 1 - b, a])

// convert `enum`-style stack into a normal stack
STACK["denum"] = $=>{
  $.stack[$.st] = _.sortBy(
    $.stack[$.st].map(b=>
      $.isarr(b) ? b.length > 1 ? b : b.concat(b) : [b, b]
    ).filter(b=> b.length > 1 && $.isnum(+b[0])), a=> -a[0]
  ).map(a=> a[1])
}

// `dup` but with any index
STACK["pick"] = $=> $.u1(a=> $.v1(x=> $.get(x), a))

// `pop` but with any index
STACK["nix"] = $=> $.splice($.shift())

// `rot` but with any index
STACK["roll"] = $=> $.u1(a=> $.splice(a)[0])

// `rot_` but with any index
STACK["roll_"] = $=> $.splice($.shift() - 1, 0, $.shift())

// swap index 1 with index given by index 0
STACK["trade"] = $=> $.u1(a=> $.splice(a - 1, 1, $.shift())[0])

// push index 0
STACK["dup"] = $=> $.unshift($.get(0))

// pop index 0
STACK["pop"] = $=> $.shift()

// bring index 2 to index 0
STACK["rot"] = $=> $.unshift($.splice(2)[0])

// bring index 0 to index 2
STACK["rot_"] = $=> $.exec('rot rot', 1)

// bring index 1 to index 0
STACK["swap"] = $=> $.unshift($.splice(1)[0])

// pop index 1
STACK["nip"] = $=> $.exec('swap pop', 1)

// push index 0 to index 2
STACK["tuck"] = $=>{
  let X = $.shift()
  $.unshift(X, $.shift(), X)
}

// push index 1
STACK["over"] = $=> $.exec('swap tuck', 1)

// pop all items
STACK["clr"] = $=> $.stack[$.st] = []

// reverse stack
STACK["rev"] = $=> $.stack[$.st].reverse()

// pop index 0, `es`, push popped index 0
STACK["dip"] = $=>{
  SL.swap($)
  let X = $.shift()
  $.addf(a=> $.unshift(X))
  $.exec($.shift(), 1)
}

// exclusive range
STACK["range"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.unshift(...$.range(Y, X))
}

// `range` from 0 to index 0
STACK["rango"] = $=> $.unshift(...$.range(0, $.shift()))

// `range` from index 0 to 0
STACK["orang"] = $=> $.unshift(...$.range($.shift(), 0))

// shuffle stack
STACK["shuf"] = $=> $.stack[$.st] = _.shuffle($.stack[$.st])

// remove all duplicates in current stack
STACK["uniq"] = $=> $.stack[$.st] = _.uniq($.stack[$.st])

// keep top _n_ items, where _n_ is index 0
STACK["take"] = $=> {
  let X = -$.shift()
  $.stack[$.st] = (X < 0 ? _.takeRight : _.take)($.stack[$.st], Math.abs(X))
}

// pop top _n_ items, where _n_ is index 0
STACK["drop"] = $=> {
  let X = -$.shift()
  $.stack[$.st] = (X < 0 ?_.dropRight : _.drop)($.stack[$.st], Math.abs(X))
}

// `wrap_` all items
STACK["flat"] = $=> $.stack[$.st] = $.stack[$.st].flat()

// deshape the stack
STACK["blob"] = $=> $.stack[$.st] = $.stack[$.st].flat(1 / 0)

// split stack into _n_ lists, where _n_ is index 0
STACK["rows"] = $=>{
  let X = $.shift()
  let Y = $.stack[$.st].length / X
  let YY = Math.round(Y)
  $.stack[$.st] = _.chunk($.stack[$.st], YY)
  if(Y > YY) $.splice(1, 2, $.stack[$.st].slice(-2).flat())
}

// split stack into lists of length _n_, where _n_ is index 0
STACK["cols"] = $=> $.stack[$.st] = _.chunk($.stack[$.st], $.shift())

// reshape the stack using dimensions at index 0
STACK["shape"] = $=>{
  let X = $.itrlist($.shift())
  SL.blob($)
  $.stack[$.st] = [...math.reshape($.itrlist(itr.take(X.reduce((a, b)=> a * b, 1), itr.cycle($.listitr($.stack[$.st])))), X)]
}

// group multiple arrays' items together by indices
STACK["zip"] = $=>{
  let O = $.stack[$.st].slice()
  $.stack[$.st] = []
  _.map(O[0], (a, i)=>{
    $.stack[$.st].push(_.map(O, b=> b[i]))
  })
}

// split stack into consecutive slices given by index 0
STACK["wins"] = $=>{
  let X = $.shift()
  $.stack[$.st] = $.stack[$.st].flatMap((a,i,s)=>
    i > s.length - X ? [] : [s.slice(i, i + X)]
  )
}

// `es` on each individual item in the stack
STACK["map"] = $=> $.stack[$.st] = $.each($.stack[$.st])

// `map` and `flat`
STACK["mapf"] = $=> $.stack[$.st] = $.each($.stack[$.st], _.flatMap)

// `es` with accumulator and item; result of each `es` becomes the new accumulator
STACK["fold"] = $=> $.stack[$.st] = [$.acc($.stack[$.st])]

// `fold` with initial accumulator
STACK["folda"] = $=> $.stack[$.st] = [$.acc($.stack[$.st], 1)]

// `fold` with intermediate values
STACK["scan"] = $=>{
  let X = []
  let Y = $.acc($.stack[$.st], 0, _.reduce, (A, a)=> (X.push(a), A))
  $.stack[$.st] = [...X, Y]
}

// `scan` with initial accumulator
STACK["scana"] = $=>{
  let X = []
  $.acc($.stack[$.st], 1, _.reduce, (A, a)=> (X.push(A), A))
  $.stack[$.st] = X
}

// remove each item that is falsy after `es`
STACK["filter"] = $=> $.stack[$.st] = $.each($.stack[$.st], _.filter, $.tru)

// push 1 if any items return truthy after `es`, else push 0
STACK["any"] = $=> $.unshift(+$.each($.stack[$.st], _.some, $.tru))

// push 1 if all items return truthy after `es`, else push 0
STACK["all"] = $=> $.unshift(+$.each($.stack[$.st], _.every, $.tru))

// find first item that returns truthy after `es` or undefined on failure
STACK["find"] = $=> $.unshift($.each($.stack[$.st], _.findLast, $.tru))

// `find` but returns index
STACK["findi"] = $=>{
  let X = $.each($.stack[$.st], _.findLastIndex, $.tru)
  $.unshift(~X || undefined)
}

// `take` items until `es` returns falsy for an item
STACK["takew"] = $=> $.stack[$.st] = $.each($.stack[$.st], _.takeRightWhile, 0, $.tru)

// `drop` items until `es` returns falsy for an item
STACK["dropw"] = $=> $.stack[$.st] = $.each($.stack[$.st], _.dropRightWhile, 0, $.tru)

// sort items based on `es`
STACK["sort"] = $=> $.stack[$.st] = $.each($.stack[$.st], _.sortBy)

// sort items based on comparison function
STACK["sortc"] = $=> $.stack[$.st] = $.cmp($.stack[$.st])

// separate items into 2 lists based on whether they return truthy after `es` (top list holds truthy values, bottom list holds falsy values)
STACK["part"] = $=> $.stack[$.st] = $.each($.stack[$.st], _.partition, 0, $.tru)

// categorize items into keys after `es`ing index 0
STACK["group"] = $=> $.stack[$.st] = [new Map(Object.entries($.each($.stack[$.st], _.groupBy)))]

// map over cartesian product of stack
STACK["table"] = $=>{
  let X = $.shift()
  let O = [...$C.CartesianProduct.from($.stack[$.st])]
  $.unshift(X)
  $.stack[$.st] = $.each(O, _.map, x=> x, 1)
}

// get insert index of index 0 from binary searching over `es` of index 1 on each element in stack
STACK["bins"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  let O = $.stack[$.st].slice()
  $.unshift(X)
  $.unshift(O.length - $.each(O, (x, f)=> _.sortedIndexBy(x, Y, f)))
}

export default STACK
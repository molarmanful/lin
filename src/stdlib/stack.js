import {$C, itr, _, SL} from '../bridge.js'

let STACK = {}

// stack length
STACK["size"] = $=> $.exec('dups len', 1)

// stack depth
STACK["deps"] = $=> $.exec('dups dep', 1)

// convert each item in stack to an index-item pair
STACK["enum"] = $=> $.stack[$.st] = $.stack[$.st].map((a,b)=> [a, b])

// convert `enum`-style stack into a normal stack
STACK["denum"] = $=>{
  let X = _.sortBy($.stack[$.st].filter(a=> a.length > 1), a=> a[1])
  $.stack[$.st] = []
  X.map(a=> $.unshift(a[0]))
}

// `dup` but with any index
STACK["pick"] = $=> $.unshift($.get($.shift()))

// `drop` but with any index
STACK["nix"] = $=>{
  let X = $.shift()
  if(_.isObjectLike(X)) _.map(X, a=> $.splice(a))
  else $.splice(X)
}

// `rot` but with any index
STACK["roll"] = $=> $.unshift($.splice($.shift())[0])

// `rot_` but with any index
STACK["roll_"] = $=> $.splice($.shift(), 0, $.shift(), 1)

// swap index 1 with index given by index 0
STACK["trade"] = $=> $.unshift($.splice($.shift() - 1, 1, $.shift())[0])

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
STACK["nip"] = $=>{
  SL.swap($)
  $.shift()
}

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
  $.unshift(...$.range(Y, X).reverse())
}

// `range` from 0 to index 0
STACK["rango"] = $=> $.unshift(...$.range(0, $.shift()).reverse())

// `range` from index 0 to 0
STACK["orang"] = $=> $.unshift(...$.range($.shift(), 0).reverse())

// shuffle stack
STACK["shuf"] = $=> $.stack[$.st] = _.shuffle($.stack[$.st])

// remove all duplicates in current stack
STACK["uniq"] = $=> $.stack[$.st] = _.uniq($.stack[$.st])

// keep top _n_ items, where _n_ is index 0
STACK["take"] = $=> {
  let X = $.shift()
  $.stack[$.st] = (X < 0 ?_.takeRight : _.take)($.stack[$.st], Math.abs(X))
}

// pop top _n_ items, where _n_ is index 0
STACK["drop"] = $=> {
  let X = $.shift()
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
  $.stack[$.st] = _.chunk($.stack[$.st], 0 | Y)
  if(Y != (0 | Y)) $.splice(-2, 2, $.stack[$.st].slice(-2).flat())
}

// split stack into lists of length _n_, where _n_ is index 0
STACK["cols"] = $=> $.stack[$.st] = _.chunk($.stack[$.st], $.shift())

// reshape the stack using dimensions at index 0
STACK["shape"] = $=>{
  let X = $.itrlist($.listitr($.shift()))
  SL.blob($)
  let O = $.itrlist(itr.take(X.reduce((a, b)=> a * b, 1), itr.cycle($.listitr($.stack[$.st]))))
  $.stack[$.st] = X.slice(0, -1).reduce((a, b)=> _.chunk(a, b), O)
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

// `map` with list items treated as stacks
STACK["maps"] = $=> $.stack[$.st] = $.each($.stack[$.st], _.map, 1)

// `es` with accumulator and item; result of each `es` becomes the new accumulator
STACK["fold"] = $=> $.stack[$.st] = [$.acc($.stack[$.st])]

// `fold` with initial accumulator
STACK["folda"] = $=> $.stack[$.st] = [$.acc($.stack[$.st], 1)]

// `fold` with intermediate values
STACK["scan"] = $=>{
  let X = []
  let Y = $.acc($.stack[$.st], 0, _.reduceRight, (A, a)=> (X.unshift(a), A))
  $.stack[$.st] = [Y, ...X]
}

// `scan` with initial accumulator
STACK["scana"] = $=>{
  let X = []
  $.acc($.stack[$.st], 1, _.reduceRight, (A, a)=> (X.unshift(A), A))
  $.stack[$.st] = X
}

// remove each item that is falsy after `es`
STACK["filter"] = $=> $.stack[$.st] = $.each($.stack[$.st], _.filter)

// push 1 if any items return truthy after `es`, else push 0
STACK["any"] = $=> $.unshift(+$.each($.stack[$.st], _.some))

// push 1 if all items return truthy after `es`, else push 0
STACK["all"] = $=> $.unshift(+$.each($.stack[$.st], _.every))

// find first item that returns truthy after `es` or undefined on failure
STACK["find"] = $=> $.unshift($.each($.stack[$.st], _.find))

// `find` but returns index
STACK["findi"] = $=>{
  let X = $.each($.stack[$.st], _.findIndex)
  $.unshift(~X ? X : undefined)
}

// `take` items until `es` returns falsy for an item
STACK["takew"] = $=> $.stack[$.st] = $.each($.stack[$.st], _.takeWhile)

// `drop` items until `es` returns falsy for an item
STACK["dropw"] = $=> $.stack[$.st] = $.each($.stack[$.st], _.dropWhile)

// sort items based on `es`
STACK["sort"] = $=> $.stack[$.st] = $.each($.stack[$.st], _.sortBy).reverse()

// sort items based on comparison function
STACK["sortc"] = $=> $.stack[$.st] = $.cmp($.stack[$.st]).reverse()

// separate items into 2 lists based on whether they return truthy after `es` (top list holds truthy values, bottom list holds falsy values)
STACK["part"] = $=> $.stack[$.st] = $.each($.stack[$.st], _.partition)

// categorize items into keys after `es`ing index 0
STACK["group"] = $=> $.stack[$.st] = [$.each($.stack[$.st], _.groupBy)]

// map over cartesian product of stack
STACK["table"] = $=>{
  let X = $.shift()
  let O = [...$C.CartesianProduct.from($.stack[$.st])]
  $.unshift(X)
  $.stack[$.st] = $.each(O, _.map, true)
}

// get insert index of index 0 from binary searching over `es` of index 1 on each element in stack
STACK["bins"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  let O = $.stack[$.st].slice().reverse()
  $.unshift(X)
  $.unshift(O.length - $.each(O, (x, f)=> _.sortedIndexBy(x, Y, f)))
}

export default STACK
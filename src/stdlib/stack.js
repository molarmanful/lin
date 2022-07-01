import {itr, _, INT as I, SL, INT} from '../bridge.js'

let STACK = {}

// stack length
STACK["size"] = $=> I.exec('dups len', 1)

// stack depth
STACK["deps"] = $=> I.exec('dups dep', 1)

// convert each item in stack to an index-item pair
STACK["enum"] = $=> I.stack[I.st] = I.stack[I.st].map((a,b)=> [a, b])

// convert `enum`-style stack into a normal stack
STACK["denum"] = $=>{
  let X = _.sortBy(I.stack[I.st].filter(a=> a.length > 1), a=> a[1])
  I.stack[I.st] = []
  X.map(a=> I.unshift(a[0]))
}

// `dup` but with any index
STACK["pick"] = $=> I.unshift(I.get(I.shift()))

// `drop` but with any index
STACK["nix"] = $=>{
  let X = I.shift()
  if(_.isObjectLike(X)) _.map(X, a=> I.splice(a))
  else I.splice(X)
}

// `rot` but with any index
STACK["roll"] = $=> I.unshift(I.splice(I.shift())[0])

// `rot_` but with any index
STACK["roll_"] = $=> I.splice(I.shift(), 0, I.shift(), 1)

// swap index 1 with index given by index 0
STACK["trade"] = $=> I.unshift(I.splice(I.shift() - 1, 1, I.shift())[0])

// push index 0
STACK["dup"] = $=> I.unshift(I.get(0))

// pop index 0
STACK["pop"] = $=> I.shift()

// bring index 2 to index 0
STACK["rot"] = $=> I.unshift(I.splice(2)[0])

// bring index 0 to index 2
STACK["rot_"] = $=> I.exec('rot rot', 1)

// bring index 1 to index 0
STACK["swap"] = $=> I.unshift(I.splice(1)[0])

// pop index 1
STACK["nip"] = $=>{
  SL.swap()
  I.shift()
}

// push index 0 to index 2
STACK["tuck"] = $=>{
  let X = I.shift()
  I.unshift(X, I.shift(), X)
}

// push index 1
STACK["over"] = $=> I.exec('swap tuck', 1)

// pop all items
STACK["clr"] = $=> I.stack[I.st] = []

// reverse stack
STACK["rev"] = $=> I.stack[I.st].reverse()

// pop index 0, `es`, push popped index 0
STACK["dip"] = $=>{
  SL.swap()
  let X = I.shift()
  I.addf(a=> I.unshift(X))
  I.exec(I.shift(), 1)
}

// exclusive range
STACK["range"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  I.unshift(...I.range(Y, X).reverse())
}

// `range` from 0 to index 0
STACK["rango"] = $=> I.unshift(...I.range(0, I.shift()).reverse())

// `range` from index 0 to 0
STACK["orang"] = $=> I.unshift(...I.range(I.shift(), 0).reverse())

// remove all duplicates in current stack
STACK["uniq"] = $=> I.stack[I.st] = _.uniq(I.stack[I.st])

// keep top _n_ items, where _n_ is index 0
STACK["take"] = $=> {
  let X = I.shift()
  I.stack[I.st] = (X < 0 ?_.takeRight : _.take)(I.stack[I.st], Math.abs(X))
}

// pop top _n_ items, where _n_ is index 0
STACK["drop"] = $=> {
  let X = I.shift()
  I.stack[I.st] = (X < 0 ?_.dropRight : _.drop)(I.stack[I.st], Math.abs(X))
}

// `wrap_` all items
STACK["flat"] = $=> I.stack[I.st] = I.stack[I.st].flat()

// deshape the stack
STACK["blob"] = $=> I.stack[I.st] = I.stack[I.st].flat(1 / 0)

// split stack into _n_ lists, where _n_ is index 0
STACK["rows"] = $=>{
  let X = I.stack[I.st].length / I.shift()
  I.stack[I.st] = _.chunk(I.stack[I.st], 0 | X)
  if(X != 0 | X) I.splice(-2, 2, I.stack[I.st].slice(-2).flat())
}

// split stack into lists of length _n_, where _n_ is index 0
STACK["cols"] = $=> I.stack[I.st] = _.chunk(I.stack[I.st], I.shift())

// reshape the stack using dimensions at index 0
STACK["shape"] = $=>{
  let X = I.itrlist(I.listitr(I.shift()))
  SL.blob()
  let O = I.itrlist(itr.take(X.reduce((a, b)=> a * b, 1), itr.cycle(I.listitr(I.stack[I.st]))))
  I.stack[I.st] = X.slice(0, -1).reduce((a, b)=> _.chunk(a, b), O)
}

// group multiple arrays' items together by indices
STACK["zip"] = $=>{
  let O = I.stack[I.st].slice()
  I.stack[I.st] = []
  _.map(O[0], (a, i)=>{
    I.stack[I.st].push(_.map(O, b=> b[i]))
  })
}

// split stack into consecutive slices given by index 0
STACK["wins"] = $=>{
  let X = I.shift()
  I.stack[I.st] = I.stack[I.st].flatMap((a,i,s)=>
    i > s.length - X ? [] : [s.slice(i, i + X)]
  )
}

// `es` on each individual item in the stack
STACK["map"] = $=> I.stack[I.st] = I.each(I.stack[I.st])

// `es` with accumulator and item; result of each `es` becomes the new accumulator
STACK["fold"] = $=> I.stack[I.st] = [I.acc(I.stack[I.st])]

// `fold` with initial accumulator
STACK["folda"] = $=> I.stack[I.st] = [I.acc(I.stack[I.st], 1)]

// `fold` with intermediate values
STACK["scan"] = $=>{
  let X = []
  let Y = I.acc(I.stack[I.st], 0, _.reduceRight, (A, a)=> (X.unshift(a), A))
  I.stack[I.st] = [Y, ...X]
}

// `scan` with initial accumulator
STACK["scana"] = $=>{
  let X = []
  I.acc(I.stack[I.st], 1, _.reduceRight, (A, a)=> (X.unshift(A), A))
  I.stack[I.st] = X
}

// remove each item that is falsy after `es`
STACK["filter"] = $=> I.stack[I.st] = I.each(I.stack[I.st], _.filter)

// push 1 if any items return truthy after `es`, else push 0
STACK["any"] = $=> I.unshift(+I.each(I.stack[I.st], _.some))

// push 1 if all items return truthy after `es`, else push 0
STACK["all"] = $=> I.unshift(+I.each(I.stack[I.st], _.every))

// find first item that returns truthy after `es` or undefined on failure
STACK["find"] = $=> I.unshift(I.each(I.stack[I.st], _.find))

// `find` but returns index
STACK["findi"] = $=>{
  let X = I.each(I.stack[I.st], _.findIndex)
  I.unshift(~X ? X : undefined)
}

// `take` items until `es` returns falsy for an item
STACK["takew"] = $=> I.stack[I.st] = I.each(I.stack[I.st], _.takeWhile)

// `drop` items until `es` returns falsy for an item
STACK["dropw"] = $=> I.stack[I.st] = I.each(I.stack[I.st], _.dropWhile)

// sort items in ascending order based on `es`
STACK["sort"] = $=> I.stack[I.st] = I.each(I.stack[I.st], _.sortBy).reverse()

// `sort` with comparison function
STACK["sortc"] = $=> I.stack[I.st] = I.cmp(I.stack[I.st]).reverse()

// separate items into 2 lists based on whether they return truthy after `es` (top list holds truthy values, bottom list holds falsy values)
STACK["part"] = $=> I.stack[I.st] = I.each(I.stack[I.st], _.partition)

// categorize items into keys after `es`ing index 0
STACK["group"] = $=> I.stack[I.st] = [I.each(I.stack[I.st], _.groupBy)]

export default STACK
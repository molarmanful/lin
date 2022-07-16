import {itr, _, SL} from '../bridge.js'

let ITER = {}

let itrd = $=> $.listitr($.shift())

// convert to iterator
ITER["`"] = $=> $.unshift(itrd($))

ITER["]`"] = $=> $.exec('] `', 1)

ITER["[]`"] = $=> $.exec('[] `', 1)

// convert to iterator recursively
ITER["``"] = $=> $.unshift($.listitrs($.shift()))

ITER["]``"] = $=> $.exec('] ``', 1)

// convert from iterator to list
ITER["`_"] = $=> $.unshift($.itrls(itrd($)))

// convert from iterator to list recursively
ITER["`__"] = $=> $.unshift($.itrlist(itrd($)))

// convert from iterator to string
ITER["`_`"] = $=> $.unshift(itr.str(itrd($)))

// create iterator from initial value and function 
ITER["`it"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.unshift(itr.wrap($.gen(X, Y)))
}

// check if iterators are equal
ITER["`="] = $=> $.unshift(itr.equal(itrd($), itrd($)))

// check if iterators are deeply equal
ITER["`=*"] = $=> $.unshift(itr.deepEqual(itrd($), itrd($)))

// check if iterator at index 1 has sequence at index 0
ITER["`?"] = $=> $.unshift(itr.includesSeq(itrd($), itrd($)))

// `?` with multiple sequences
ITER["`?*"] = $=> $.unshift(itr.includesAnySeq(itr.listitrs($.shift()), itrd($)))

// create infinite cycle from index 0
ITER["`cyc"] = $=> $.unshift(itr.cycle(itrd($)))

// concatenate top 2 items into iterator
ITER["`+"] = $=>{
  SL.swap($)
  $.unshift(itr.concat(itrd($), itrd($)))
}

// prepend index 0 into iterator
ITER["`,"] = $=> $.unshift(itr.prepend($.shift(), itrd($)))

// combine top 2 items into partially-sorted iterator via comparison function
ITER["`+>"] = $=>{
  let X = $.shift()
  let Y = itrd($)
  let Z = itrd($)
  $.unshift(X)
  $.unshift($.cmp([Z, Y], (x, f)=> itr.collate(f, x)))
}

// use index 0 as a bitmask for the iterator at index 1
ITER["`mask"] = $=>{
  SL.swap($)
  $.unshift(itr.compress(itrd($), itrd($)))
}

// zip list of iterators into one iterator
ITER["`,*"] = $=> $.unshift(itr.zip(...itr.map(a=> $.listitr(a), itrd($))))

// iterator size (DOES NOT HALT ON INFINITE LISTS) 
ITER["`size"] = $=> $.unshift(itr.size($.listitr($.stack[$.st].at(-1))))

// convert each element to an index-element pair
ITER["`enum"] = $=> $.unshift(itr.enumerate(itrd($)))

// yield only unique elements
ITER["`uniq"] = $=> $.unshift(itr.uniq(itrd($)))

// reverse iterator
ITER["`rev"] = $=> $.unshift(itr.reverse(itrd($)))

// flatten iterator
ITER["`flat"] = $=> $.unshift(itr.flat(itrd($)))

// flatten iterator by max depth at index 0
ITER["`melt"] = $=> $.unshift(itr.flat($.shift(), itrd($)))

// split iterator into consecutive slices given by index 0
ITER["`xp"] = $=> $.unshift(itr.window($.shift(), itrd($)))

// split iterator into chunks of length given by index 0
ITER["`chunk"] = $=> $.unshift(itr.batch($.shift(), itrd($)))

// place index 0 between each element
ITER["`btwn"] = $=> $.unshift(itr.interposeSeq(itrd($), itrd($)))

// split iterator on sequence at index 0
ITER["`sp"] = $=> $.unshift(itr.splitOnSeq(itrd($), itrd($)))

// `\`sp` with multiple sequences
ITER["`sp*"] = $=> $.unshift(itr.splitOnAnySeq($.listitrs($.shift(), 2), itrd($)))

// first element
ITER["`^"] = $=> $.unshift(itr.first(itrd($)))

// _n_th element, where _n_ is index 0
ITER["`:"] = $=> $.exec('`d `^', 1)

// take first _n_ elements, where _n_ is index 0
ITER["`t"] = $=> $.unshift(itr.take($.shift(), itrd($)))

// `take` with sort predicate
ITER["`t>"] = $=>{
  let X = $.shift()
  SL.swap($)
  $.unshift($.cmp(itrd($), (x, f)=> itr.takeSorted(X, f, x)))
}

// drop first _n_ elements, where _n_ is index 0
ITER["`d"] = $=> $.unshift(itr.drop($.shift(), itrd($)))

// `es` index 0 over each element
ITER["`'"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.map(f, x)))
}

// fold with `es` of index 0 over each element
ITER["`/"] = $=>{
  SL.swap($)
  $.unshift($.acc(itrd($), 0, (x, f)=> itr.reduce(f, x)))
}

// `\`/` with accumulator
ITER["`/a"] = $=>{
  SL.rot($)
  $.unshift($.acc(itrd($), 1, (x, f)=> itr.reduce(f, x)))
}

// `\`/` with intermediate values
ITER["`\\"] = $=>{
  let X = []
  SL.swap($)
  let Y = $.acc(itrd($), 0, (x, f)=> itr.reduce(f, x), (A, a)=> (X.push(a), A))
  $.unshift([...X, Y])
}

// `\`\\` with accumulator
ITER["`\\a"] = $=>{
  let X = []
  SL.rot($)
  let Y = $.acc(itrd($), 1, (x, f)=> itr.reduce(f, x), (A, a)=> (X.push(A), A))
  $.unshift(X)
}

// filter truthy results after `es`ing index 0 over each element
ITER["`#"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.filter(f, x)))
}

// `take` while `es`ing index 0 over each element is truthy
ITER["`t'"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.takeWhile(f, x)))
}

// `drop` while `es`ing index 0 over each element is truthy
ITER["`d'"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.dropWhile(f, x)))
}

// `es` index 0 over each element and return original element
ITER["`tap"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.tap(f, x)))
}

// `es` index 0 over each element and partition based on truthiness
ITER["`part"] = $=>{
  let X = $.shift()
  let Y = itrd($)
  $.unshift(X)
  let A = $.each(Y, (x, f)=> itr.filter(f, x))
  $.unshift(X)
  let B = $.each(Y, (x, f)=> itr.filter(a=> !f(a), x))
  $.unshift([A, B])
}

// check if all elements are truthy after `es`ing index 0 over each element
ITER["`&"] = $=>{
  SL.swap($)
  $.unshift(+$.each(itrd($), (x, f)=> itr.every(f, x)))
}

// check if any elements are truthy after `es`ing index 0 over each element
ITER["`|"] = $=>{
  SL.swap($)
  $.unshift(+$.each(itrd($), (x, f)=> itr.some(f, x)))
}

// find first element that returns truthy after `es`ing index 0
ITER["`?'"] = $=>{
  SL.swap($)
  $.unshift(+$.each(itrd($), (x, f)=> itr.find(f, x)))
}

export default ITER
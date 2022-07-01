import {itr, _, INT as I, SL} from '../bridge.js'

let ITER = {}

let itrd = $=> I.listitr(I.shift())

// convert to iterator
ITER["`"] = $=> I.unshift(itrd())

// convert to iterator recursively
ITER["``"] = $=> I.unshift(I.listitrs(I.shift()))

ITER["]`"] = $=> I.exec('] `', 1)

ITER["]``"] = $=> I.exec('] ``', 1)

// convert from iterator to list
ITER["`_"] = $=> I.unshift(I.itrls(I.shift()))

// convert from iterator to list recursively
ITER["`__"] = $=> I.unshift(I.itrlist(I.shift()))

// check if iterators are equal
ITER["`="] = $=> I.unshift(itr.equal(itrd(), itrd()))

// check if iterators are deeply equal
ITER["`=*"] = $=> I.unshift(itr.deepEqual(itrd(), itrd()))

// check if iterator at index 1 has sequence at index 0
ITER["?"] = $=> I.unshift(itr.includesSeq(itrd(), itrd()))

// `?` with multiple sequences
ITER["?*"] = $=> I.unshift(itr.includesAnySeq(itr.listitrs(I.shift()), itrd()))

// create infinite cycle from index 0
ITER["`cyc"] = $=> I.unshift(itr.cycle(itrd()))

// concatenate top 2 items into iterator
ITER["`+"] = $=>{
  SL.swap()
  I.unshift(itr.concat(itrd(), itrd()))
}

// combine top 2 items into partially-sorted iterator via comparison function
ITER["`+>"] = $=>{
  let X = I.shift()
  let Y = itrd()
  let Z = itrd()
  I.unshift(X)
  I.unshift(I.cmp([Z, Y], itr.__collate))
}

// use index 0 as a bitmask for the iterator at index 1
ITER["`mask"] = $=>{
  SL.swap()
  I.unshift(itr.compress(itrd(), itrd()))
}

// zip all stack items into one iterator
ITER["`;"] = $=> I.stack[I.st] = [itr.zip(...I.stack[I.st].map(I.listitr))]

// prepend-concatenate index 0 into iterator
ITER["`,"] = $=> I.unshift(itr.concat(itrd(), itrd()))

// iterator size (DOES NOT HALT ON INFINITE LISTS) 
ITER["`size"] = $=> I.unshift(itr.size(I.listitr(I.stack[I.st][0])))

// convert each element to an index-element pair
ITER["`enum"] = $=> I.unshift(itr.enumerate(itrd()))

// yield only unique elements
ITER["`uniq"] = $=> I.unshift(itr.uniq(itrd()))

// reverse iterator
ITER["`rev"] = $=> I.unshift(itr.reverse(itrd()))

// flatten iterator
ITER["`flat"] = $=> I.unshift(itr.flat(itrd()))

// flatten iterator by max depth at index 0
ITER["`melt"] = $=> I.unshift(itr.flat(I.shift(), itrd()))

// split iterator into consecutive slices given by index 0
ITER["`xp"] = $=> I.unshift(itr.window(I.shift(), itrd()))

// split iterator into chunks of length given by index 0
ITER["`chunk"] = $=> I.unshift(itr.batch(I.shift(), itrd()))

// place index 0 between each element
ITER["`btwn"] = $=> I.unshift(itr.interposeSeq(itrd(), itrd()))

// split iterator on sequence at index 0
ITER["`sp"] = $=> I.unshift(itr.splitOnSeq(itrd(), itrd()))

// `\`sp` with multiple sequences
ITER["`sp*"] = $=> I.unshift(itr.splitOnAnySeq(I.listitrs(I.shift()), itrd()))

// first element
ITER["`^"] = $=> I.unshift(itr.first(itrd()))

// _n_th element, where _n_ is index 0
ITER["`:"] = $=> I.unshift(itr.first(itr.drop(I.shift(), itrd())))

// take first _n_ elements, where _n_ is index 0
ITER["`t"] = $=> I.unshift(itr.take(I.shift(), itrd()))

// `take` with sort predicate
ITER["`t>"] = $=>{
  let X = I.shift()
  SL.swap()
  I.unshift(I.cmp(itrd(), (x, f)=> itr.takeSorted(X, f, x)))
}

// drop first _n_ elements, where _n_ is index 0
ITER["`d"] = $=> I.unshift(itr.drop(I.shift(), itrd()))

// `es` index 0 over each element
ITER["`'"] = $=>{
  SL.swap()
  I.unshift(I.each(itrd(), itr.__map))
}

// fold with `es` of index 0 over each element
ITER["`/"] = $=>{
  SL.swap()
  I.unshift(I.acc(itrd(), 0, itr.__reduce))
}

// `\`/` with accumulator
ITER["`/a"] = $=>{
  SL.rot()
  I.unshift(I.acc(itrd(), 1, itr.__reduce))
}

// `\`/` with intermediate values
ITER["`\\"] = $=>{
  let X = []
  SL.swap()
  let Y = I.acc(itrd(), 0, itr.__reduce, (A, a)=> (X.unshift(a), A))
  I.unshift([Y, ...X])
}

// `\`\\` with accumulator
ITER["`\\a"] = $=>{
  let X = []
  SL.rot()
  let Y = I.acc(itrd(), 1, itr.__reduce, (A, a)=> (X.unshift(A), A))
  I.unshift(X)
}

// filter truthy results after `es`ing index 0 over each element
ITER["`#"] = $=>{
  let X = []
  SL.swap()
  let Y = I.acc(itrd(), 1, itr.__reduce, (A, a)=> (X.unshift(a), A))
  I.unshift([Y, ...X])
}

// `take` while `es`ing index 0 over each element is truthy
ITER["`t'"] = $=>{
  SL.swap()
  I.unshift(I.each(itrd(), itr.__takeWhile))
}

// `drop` while `es`ing index 0 over each element is truthy
ITER["`d'"] = $=>{
  SL.swap()
  I.unshift(I.each(itrd(), itr.__dropWhile))
}

// `es` index 0 over each element and return original element
ITER["`tap"] = $=>{
  SL.swap()
  I.unshift(I.each(itrd(), itr.__tap))
}

// `es` index 0 over each element and partition based on truthiness
ITER["`part"] = $=>{
  let X = I.shift()
  let Y = itrd()
  I.unshift(X)
  let A = I.each(Y, itr.__filter)
  I.unshift(X)
  let B = I.each(Y, (x, f)=> itr.filter(a=> !f(a), x))
  I.unshift([A, B])
}

// check if all elements are truthy after `es`ing index 0 over each element
ITER["`&"] = $=>{
  SL.swap()
  I.unshift(+I.each(itrd(), itr.__every))
}

// check if any elements are truthy after `es`ing index 0 over each element
ITER["`|"] = $=>{
  SL.swap()
  I.unshift(+I.each(itrd(), itr.__some))
}

// find first element that returns truthy after `es`ing index 0
ITER["`?'"] = $=>{
  SL.swap()
  I.unshift(+I.each(itrd(), itr.__some))
}

export default ITER
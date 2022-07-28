import {itr, _, SL} from '../bridge.js'

let ITER = {}

let itrd = $=> $.listitr($.shift())

// convert to iterator
ITER["`"] = $=> $.unshift(itrd($))

ITER["]`"] = $=> $.exec('] `', 1)

ITER["}`"] = $=> $.exec('} `', 1)

ITER["[]`"] = $=> $.exec('[] `', 1)

ITER["{}`"] = $=> $.exec('{} `', 1)

// convert to iterator recursively
ITER["``"] = $=> $.u1(a=> $.listitrs(a))

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
ITER["`eq"] = $=> $.unshift(itr.deepEqual(itrd($), itrd($)))

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
ITER["`uniq"] = $=> $.unshift(itr.distinct(itrd($)))

// reverse iterator
ITER["`rev"] = $=> $.unshift(itr.reverse(itrd($)))

// flatten iterator
ITER["`flat"] = $=> $.unshift(itr.flat(itrd($)))

// flatten iterator by max depth at index 0
ITER["`melt"] = $=>
  $.u2((a, b)=>(
    a = $.listitr(a),
    $.v1(x=> itr.flat(x, a), b)
  ))

// split iterator into consecutive slices given by index 0
ITER["`xp"] = $=>
  $.u2((a, b)=>(
    a = $.listitr(a),
    $.v1(x=> itr.window(x, a), b)
  ))

// split iterator in half at index
ITER["`bi"] = $=>
  $.u2((a, b)=>{
    a = $.listitr(a)
    return $.v1(x=>{
      let [X, Y] = itr.bisect(x, a)
      return [X, Y]
    }, b)
  })

// split iterator into chunks of length given by index 0
ITER["`chunk"] = $=>
  $.u2((a, b)=>(
    a = $.listitr(a),
    $.v1(x=> itr.batch(x, a), b)
  ))

// place index 0 between each element
ITER["`btwn"] = $=> $.unshift(itr.interposeSeq(itrd($), itrd($)))

// split iterator on sequence at index 0
ITER["`sp"] = $=> $.unshift(itr.splitOnSeq(itrd($), itrd($)))

// `\`sp` with multiple sequences
ITER["`sp*"] = $=> $.unshift(itr.splitOnAnySeq($.listitrs($.shift()), itrd($)))

// first element
ITER["`^"] = $=> $.unshift(itr.first(itrd($)))

// last element
ITER["`$"] = $=> $.unshift(itr.takeLast(itrd($)))

// _n_th element, where _n_ is index 0
ITER["`:"] = $=>
  $.u2((a, b)=>{
    a = $.listitr(a)
    return $.v1(x=> itr.first(itr.drop(x, a)), b)
  })

// take first _n_ elements, where _n_ is index 0
ITER["`t"] = $=>
  $.u2((a, b)=>{
    a = $.listitr(a)
    return $.v1(x=> itr.take(x, a), b)
  })

// `take` with sort predicate
ITER["`t>"] = $=>{
  let X = $.shift()
  SL.swap($)
  $.unshift($.cmp(itrd($), (x, f)=> itr.takeSorted(X, f, x)))
}

// drop first _n_ elements, where _n_ is index 0
ITER["`d"] = $=>
  $.u2((a, b)=>{
    a = $.listitr(a)
    return $.v1(x=> itr.drop(x, a), b)
  })

// map with `es` of index 0 over each element
ITER["`'"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.map(f, x)))
}

// map and flatten
ITER["`',"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.flatMap(f, x)))
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
  let scan = function*(f, xs){
    let i = 0
    let fr, acc
    for(let x of xs){
      if(!fr){
        acc = x
        fr = 1
        continue
      }
      yield acc
      acc = f(acc, x, i)
      i++
    }
    yield acc
  }
  SL.swap($)
  $.unshift($.acc(itrd($), 0, (x, f)=> scan(f, x)))
}

// `\`\\` with accumulator
ITER["`\\a"] = $=>{
  let scana = function*(f, xs, acc){
    let i = 0
    for(let x of xs){
      acc = f(acc, x, i)
      yield acc
      i++
    }
  }
  SL.rot($)
  $.unshift($.acc(itrd($), 1, (x, f, a)=> scana(f, x, a)))
}

// filter truthy results after `es`ing index 0 over each element
ITER["`#"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.filter(f, x), $.tru))
}

// `take` while `es`ing index 0 over each element is truthy
ITER["`t'"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.takeWhile(f, x), $.tru))
}

// `drop` while `es`ing index 0 over each element is truthy
ITER["`d'"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.dropWhile(f, x), $.tru))
}

// `es` index 0 over each element and return original element
ITER["`tap"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.tap(f, x)))
}

// `es` index 0 over each element and partition based on truthiness
ITER["`part"] = $=>{
  let [A, B] = $.each(itrd($), (x, f)=> itr.filter(f, x), $.tru)
  $.unshift([A, B])
}

// check if all elements are truthy after `es`ing index 0 over each element
ITER["`&"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.every(f, x), $.tru))
}

// check if any elements are truthy after `es`ing index 0 over each element
ITER["`|"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.some(f, x), $.tru))
}

// find first element that returns truthy after `es`ing index 0
ITER["`?'"] = $=>{
  SL.swap($)
  $.unshift($.each(itrd($), (x, f)=> itr.find(f, x), $.tru))
}

// sort iterator with comparison function
ITER["`>"] = $=>{
  SL.swap($)
  $.unshift($.cmp(itrd($), (x, f)=> itr.takeSorted(1 / 0, f, x)))
}

export default ITER
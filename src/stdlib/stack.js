import {_, INT as I, SL} from '../bridge.js'

let STACK = {}

// stack length
STACK["size"] = $=>{
  SL.dups()
  SL.len()
}

// stack depth
STACK["deps"] = $=>{
  SL.dups()
  SL.dep()
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
STACK["rot_"] = $=>{
  SL.rot()
  SL.rot()
}

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
STACK["over"] = $=>{
  SL.swap()
  SL.tuck()
}

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
STACK["flat"] = $=> I.stack[I.st] = _.flatten(I.stack[I.st])

// split stack into lists of length given by index 0
STACK["chunk"] = $=>{
  let X = I.shift()
  I.stack[I.st] = _.chunk(I.stack[I.st], X)
}

// split stack into consecutive slices given by index 0
STACK["wins"] = $=>{
  let X = I.shift()
  I.stack[I.st] = I.stack[I.st].flatMap((a,i,s)=>
    i > s.length - X ? [] : [s.slice(i, i + X)]
  )
}

// `es` on each individual item in the stack
STACK["map"] = $=>{
  let X = []
  I.each(
    (a, i)=> X.unshift(I.shift()),
    $=> I.stack[I.st] = X
  )
}

// `es` with accumulator and item; result of each `es` becomes the new accumulator
STACK["fold"] = $=>{
  I.acc(
    (a, b, i)=> I.shift(),
    a=> I.stack[I.st] = [a]
  )
}

// `fold` with initial accumulator
STACK["folda"] = $=>{
  I.acc(
    (a, b, i)=> I.shift(),
    a=> I.stack[I.st] = [a],
    true
  )
}

// `fold` with intermediate values
STACK["scan"] = $=>{
  let X = []
  I.acc(
    (a, b, i)=> (X.unshift(b), I.shift()),
    a=> I.stack[I.st] = [a, ...X]
  )
}

// `scan` with initial accumulator
STACK["scana"] = $=>{
  let X = []
  I.acc(
    (a, b, i)=>{
      let A = I.shift()
      X.unshift(A)
      return A
    },
    a=> I.stack[I.st] = X,
    true
  )
}

// remove each item that is falsy after `es`
STACK["filter"] = $=>{
  let X = []
  I.each(
    (a, i)=>{
      let A = I.shift()
      A && X.unshift(A)
    },
    $=> I.stack[I.st] = X
  )
}

// push 1 if any items return truthy after `es`, else push 0
STACK["any"] = $=>{
  let X = 0
  I.each(
    (a, i)=>{
      if(!X && I.tru(I.shift())) X = 1
    },
    $=> I.unshift(X)
  )
}

// push 1 if all items return truthy after `es`, else push 0
STACK["all"] = $=>{
  let X = 1
  I.each(
    (a, i)=>{
      if(X && !I.tru(I.shift())) X = 0
    },
    $=> I.unshift(X)
  )
}

// find first item that returns truthy after `es` or undefined on failure
STACK["find"] = $=>{
  let X
  I.each(
    (a, i)=>{
      if(X == undefined && I.tru(I.shift())) X = a
    },
    $=> I.unshift(X)
  )
}

// `find` but returns index
STACK["findi"] = $=>{
  let X
  I.each(
    (a, i)=>{
      if(X == undefined && I.tru(I.shift())) X = i
    },
    $=> I.unshift(X)
  )
}

// `take` items until `es` returns falsy for an item
STACK["takew"] = $=>{
  let X = 1
  let Y = []
  I.each(
    (a, i)=>{
      if(X && I.tru(I.shift())) Y.unshift(a)
      else X = 0
    },
    $=> I.stack[I.st] = Y
  )
}

// `drop` items until `es` returns falsy for an item
STACK["dropw"] = $=>{
  let X = 0
  let Y = []
  I.each(
    (a, i)=>{
      if(X || I.tru(I.shift())){
        X = 1
        Y.unshift(a)
      }
    },
    $=> I.stack[I.st] = Y
  )
}

// sort items in ascending order based on `es`
STACK["sort"] = $=>{
  let X = []
  let O = I.stack[I.st].slice(1)
  I.each(
    (a, i)=> X.unshift(I.shift()),
    $=>{
      I.stack[I.st] = O
      I.stack[I.st] =
        I.get(_.sortBy(I.range(0, X.length), a=> X[a])).reverse()
    }
  )
}

// separate items into 2 lists based on whether they return truthy after `es` (top list holds truthy values, bottom list holds falsy values)
STACK["part"] = $=>{
  let X = []
  let Y = []
  I.each(
    (a, i)=>{
      if(I.tru(I.shift())) X.unshift(a)
      else Y.unshift(a)
    },
    $=>{
      I.stack[I.st] = [X, Y]
    }
  )
}

// group multiple arrays' items together by indices
STACK["zip"] = $=>{
  let O = I.stack[I.st].slice()
  I.stack[I.st] = []
  _.map(O[0], (a, i)=>{
    I.stack[I.st].push(_.map(O, b=> b[i]))
  })
}

// categorize items into keys after `es`ing index 0
STACK["group"] = $=>{
  let X = []
  let O = I.stack[I.st].slice(1)
  I.each(
    (a, i)=> X.unshift(I.shift()),
    $=>{
      I.stack[I.st] = O
      I.stack[I.st] = [
        _.mapValues(_.groupBy(I.range(0, X.length), a=> X[a]), a=> I.get(a))
      ]
    }
  )
}

export default STACK
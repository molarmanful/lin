import {fs, cp, unesc, _, dec, INT as I} from './bridge.js'
let SL = {}

SL["("] = $=>{
  I.lambda = 1
  I.scope.unshift({})
}

SL[")"] = $=>{}

SL["["] = $=>{
  I.iter.unshift(I.st)
  I.st = I.iter[0] + '\n'
  I.stack[I.st] = []
}

SL["]"] = $=>{
  let X = I.stack[I.st]
  delete I.stack[I.iter[0] + '\n']
  I.st = I.iter.shift()
  I.unshift(X)
}

SL["{"] = $=>{
  I.objs.unshift({})
  I.iter.unshift(I.st)
  I.st = I.iter[0] + '\n'
  I.stack[I.st] = []
}

SL["}"] = $=>{
  let X = I.objs.shift()
  delete I.stack[I.iter[0] + '\n']
  I.st = I.iter.shift()
  I.unshift(X)
}

// push empty string
SL["()"] = $=> I.unshift('')

// initialize empty list
SL["[]"] = $=> I.unshift([])

// initialize empty list
SL["{}"] = $=> I.unshift({})

// push space
SL["\\"] = $=> I.unshift(' ')

// push newline
SL["n\\"] = $=> I.unshift('\n')

// push string at ID given by index 0
SL["gi"] = $=>{
  let X = I.shift()
  if(I.ids[X] == undefined) I.id(X)
  I.unshift(I.ids[X])
}

// `gi` but follow local scoping rules
SL["gl"] = $=>{
  let X = I.shift()
  if(I.getscope(X) == undefined) I.id(X)
  I.unshift(I.getscope(X))
}

// push stack joined by newlines
SL["gs"] = $=> I.unshift(I.form())

// push line at popped number (0-indexed)
SL["g@"] = $=> I.unshift(I.lines[I.shift()])

// get value for key given by index 0 within object at index 1
SL["g:"] = $=>{
  let X = I.shift()
  I.unshift(I.shift()[X])
}

// convert index 0 to its string representation
SL["form"] = $=> I.unshift(I.form([I.shift()]))

// set global ID at index 0
SL["si"] = $=> I.ids[I.shift()] = I.shift()

// `si` but follow local scoping rules
SL["sl"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  if(I.scope.length) I.scope[0][X] = Y
  else I.ids[X] = Y
}

// set a key-value pair in an object, where index 0 is the key and index 1 is the value
SL[":"] = $=>{
  if(I.objs.length) I.objs[0][I.shift()] = I.shift()
  else {
    let X = I.shift()
    let Y = I.shift()
    I.stack[I.st][0][X] = Y
  }
}

// bring ID at index 0 as string into global scope
SL["::"] = $=> I.id()

// pushes 1 if index 0 is a number, 2 if string, 3 if list, and 0 if anything else (ex.: undefined)
SL["type"] = $=>{
  let X = I.shift()
  I.unshift(
    X.pop ? 3
    : X.big ? 2
    : X.toFixed && !isNaN(X) ? 1
    : 0
  )
}

// execute string at index 0
SL["es"] = $=> I.exec(I.shift(), 1)

// `es` on index 1 for number of times given by index 0
SL["e*"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  I.addf(a=>{
    if(I.tru(X)){
      I.addf(a=> I.unshift(X - 1, Y), 'e*')
      I.exec(Y, 1)
    }
  })
}

// `es` if index 0 is truthy
SL["e&"] = $=>{
  if(I.tru(I.shift())) SL.es()
  else I.shift()
}

// `es` if index 0 is falsy
SL["e|"] = $=>{
  if(I.tru(I.shift())) I.shift()
  else SL.es()
}

// `es` on index 2 if index 0 is truthy; otherwise, `es` on index 1
SL["e?"] = $=>{
  let X = I.shift()
  if(!I.tru(X)) SL.swap()
  I.shift()
  SL.es()
}

// while `es` on index 1 is truthy, `es` on index 0
SL["ew"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  I.addf(a=>{
    if(I.tru(I.shift())){
      I.addf(a=> I.unshift(X, Y), 'ew')
      I.exec(Y, 1)
    }
  })
  I.exec(X, 1)
}

//  `es` line number at index 0
SL["e@"] = $=>{
  I.lns.unshift(I.shift())
  if(I.code[0].length) I.addf(a=> I.lns.shift())
  I.exec(I.lines[I.lns[0]], 1)
}

//  `es` next line
SL[";"] = $=>{
  I.unshift(I.lns[0] - -1)
  SL["e@"]()
}

//  `es` previous line
SL[";;"] = $=>{
  I.unshift(I.lns[0] - 1)
  SL["e@"]()
}

// end execution of current call stack frame
SL["break"] = $=> I.code.shift()

// read file at path given by index 0
SL["read"] = $=> I.unshift(fs.readFileSync(I.shift()) + '')

// write string at index 1 to file at path given by index 0
SL["write"] = $=> fs.writeFileSync(I.shift(), I.shift())

// push user input
SL["in"] = $=> I.unshift(('' + cp.execSync('read x; echo $x', {stdio: [process.stdin]})).slice(0, -1))

// push user input without echoing
SL["inh"] = $=> I.unshift(('' + cp.execSync('read -s x; echo $x', {stdio: [process.stdin]})).slice(0, -1))

// output index 0 to STDOUT
SL["out"] = $=> process.stdout.write('' + I.shift())

// output index 0 as a line to STDOUT
SL["outln"] = $=> process.stdout.write('' + I.shift() + '\n')

// Euler's constant
SL["$E"] = $=> I.unshift(dec.exp(1))

// Pi
SL["$Pi"] = $=> I.unshift(dec.acos(-1))

// `(index 1)*10^(index 0)`
SL["E"] = $=>{
  I.unshift(10)
  SL.swap()
  SL["^"]()
  SL["*"]()
}

// negation
SL["_"] = $=> I.unshift(dec.sub(0, I.shift()))

// addition
SL["+"] = $=> I.unshift(dec.add(I.shift(), I.shift()))

// subtraction
SL["-"] = $=>{
  SL.swap()
  I.unshift(dec.sub(I.shift(), I.shift()))
}

// multiplication
SL["*"] = $=> I.unshift(dec.mul(I.shift(), I.shift()))

// division
SL["/"] = $=>{
  SL.swap()
  I.unshift(dec.div(I.shift(), I.shift()))
}

// integer division
SL["//"] = $=>{
  SL["/"]()
  SL.trunc()
}

// modulus
SL["%"] = $=>{
  SL.swap()
  I.unshift(I.mod(I.shift(), I.shift()))
}

// divmod
SL["/%"] = $=>{
  SL.over()
  SL.over()
  SL['//']()
  SL.rot_()
  SL['%']()
}

// exponentiation
SL["^"] = $=>{
  SL.swap()
  I.unshift(dec.pow(I.shift(), I.shift()))
}

// absolute value
SL["abs"] = $=> I.unshift(dec.abs(I.shift()))

// sign function
SL["sign"] = $=> I.unshift(dec.sign(I.shift()))

// push random number between 0 and 1
SL["rand"] = $=> I.unshift(dec.random())

// push milliseconds since January 1, 1970 00:00:00.000
SL["time"] = $=> I.unshift(Date.now())

// natural logarithm
SL["ln"] = $=> I.unshift(dec.ln(I.shift()))

// base-2 logarithm
SL["logII"] = $=> I.unshift(dec.log2(I.shift()))

// base-10 logarithm
SL["logX"] = $=> I.unshift(dec.log10(I.shift()))

// logarithm with base at index 0
SL["log"] = $=>{
  SL.swap()
  I.unshift(dec.log(I.shift(), I.shift()))
}

// sine
SL["sin"] = $=> I.unshift(dec.sin(I.shift()))

// cosine
SL["cos"] = $=> I.unshift(dec.cos(I.shift()))

// tangent
SL["tan"] = $=> I.unshift(dec.tan(I.shift()))

// hyperbolic sine
SL["sinh"] = $=> I.unshift(dec.sinh(I.shift()))

// hyperbolic cosine
SL["cosh"] = $=> I.unshift(dec.cosh(I.shift()))

// hyperbolic tangent
SL["tanh"] = $=> I.unshift(dec.tanh(I.shift()))

// inverse sine
SL["asin"] = $=> I.unshift(dec.asin(I.shift()))

// inverse cosine
SL["acos"] = $=> I.unshift(dec.acos(I.shift()))

// inverse tangent
SL["atan"] = $=> I.unshift(dec.atan(I.shift()))

// inverse tangent with coordinates (x,y) to (index 1, index 0)
SL["atant"] = $=>{
  SL.swap()
  I.unshift(dec.atan(I.shift(), I.shift()))
}

// inverse hyperbolic sine
SL["asinh"] = $=> I.unshift(dec.asinh(I.shift()))

// inverse hyperbolic cosine
SL["acosh"] = $=> I.unshift(dec.acosh(I.shift()))

// inverse hyperbolic tangent
SL["atanh"] = $=> I.unshift(dec.atanh(I.shift()))

// push max
SL["max"] = $=> I.unshift(dec.max(...I.stack[I.st]))

// push min
SL["min"] = $=> I.unshift(dec.min(...I.stack[I.st]))

// exclusive range
SL["range"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  I.unshift(...I.range(Y, X).reverse())
}

// bitwise not
SL["~"] = $=> I.unshift(~I.shift())

// logical not
SL["!"] = $=> I.unshift(+!I.tru(I.shift()))

// bitwise and
SL["&"] = $=> I.unshift(I.shift() & I.shift())

// bitwise or
SL["|"] = $=> I.unshift(I.shift() | I.shift())

// bitwise xor
SL["$"] = $=> I.unshift(I.shift() ^ I.shift())

// bitwise left shift
SL["<<"] = $=>{
  SL.swap()
  I.unshift(I.shift() << I.shift())
}

// bitwise right I.shift, sign-propagating
SL[">>"] = $=> {
  SL.swap()
  I.unshift(I.shift() >> I.shift())
}

// bitwise right I.shift, zero-fill
SL[">>>"] = $=>{
  SL.swap()
  I.unshift(I.shift() >>> I.shift())
}

// equal
SL["="] = $=> I.unshift(+(I.shift() == I.shift()))

// not equal
SL["!="] = $=> I.unshift(+(I.shift() != I.shift()))

// greater than
SL[">"] = $=> I.unshift(+(I.shift() < I.shift()))

// less than
SL["<"] = $=> I.unshift(+(I.shift() > I.shift()))

// greater than or equal to
SL[">="] = $=> I.unshift(+(I.shift() <= I.shift()))

// less than or equal to
SL["<="] = $=> I.unshift(+(I.shift() >= I.shift()))

// comparison function (-1 for less than, 0 for equal, 1 for greater than)
SL["<=>"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  I.unshift(X < Y ? 1 : X > Y ? -1 : 0)
}

// round towards -∞
SL["floor"] = $=> I.unshift(dec.floor(I.shift()))

// round towards 0
SL["trunc"] = $=> I.unshift(dec.trunc(I.shift()))

// round towards or away from 0 depending on < or >= .5
SL["round"] = $=> I.unshift(dec.round(I.shift()))

// round towards ∞
SL["ceil"] = $=> I.unshift(dec.ceil(I.shift()))

// `dup` but with any index
SL["pick"] = $=> I.unshift(I.get(I.shift()))

// `drop` but with any index
SL["nix"] = $=> I.splice(I.shift())

// `rot` but with any index
SL["roll"] = $=> I.unshift(I.splice(I.shift())[0])

// `rot_` but with any index
SL["roll_"] = $=> I.splice(I.shift(), 0, I.shift(), 1)

// swap index 1 with index given by index 0
SL["trade"] = $=> I.unshift(I.splice(I.shift() - 1, 1, I.shift())[0])

// push index 0
SL["dup"] = $=> I.unshift(I.get(0))

// pop index 0
SL["pop"] = $=> I.shift()

// bring index 2 to index 0
SL["rot"] = $=> I.unshift(I.splice(2)[0])

// bring index 0 to index 2
SL["rot_"] = $=>{
  SL.rot()
  SL.rot()
}

// bring index 1 to index 0
SL["swap"] = $=> I.unshift(I.splice(1)[0])

// pop index 1
SL["nip"] = $=>{
  SL.swap()
  I.shift()
}

// push index 0 to index 2
SL["tuck"] = $=>{
  let X = I.shift()
  I.unshift(X, I.shift(), X)
}

// push index 1
SL["over"] = $=>{
  SL.swap()
  SL.tuck()
}

// pop all items
SL["clr"] = $=> I.stack[I.st] = []

// reverse stack
SL["rev"] = $=> I.stack[I.st].reverse()

// pop index 0, `es`, push popped index 0
SL["dip"] = $=>{
  SL.swap()
  let X = I.shift()
  I.addf(a=> I.unshift(X))
  I.exec(I.shift(), 1)
}

// split string at index 1 over string at index 0
SL["split"] = $=>{
  let X = I.shift()
  I.unshift((I.shift() + '').split(X).reverse())
}

// join list over string at index 0
SL["join"] = $=>{
  let X = I.shift()
  I.unshift(I.shift().slice().reverse().join(X))
}

// concatenate top 2 items as strings or lists
SL["++"] = $=>{
  let X = I.shift()
  I.unshift(I.concat(I.shift(), X))
}

// push string length of index 0
SL["len"] = $=>{
  let X = I.shift()
  I.unshift(X.toFixed ? (X + '').length : X.length)
}

// unescape string at index 0
SL["unesc"] = $=> I.unshift(unesc(I.shift()))

// convert number to Unicode
SL[">char"] = $=> I.unshift(String.fromCodePoint(I.shift()))

// convert Unicode to number
SL["<char"] = $=> I.unshift(I.shift().codePointAt())

// lowercase
SL["lower"] = $=> I.unshift(I.shift().toLowerCase())

// uppercase
SL["upper"] = $=> I.unshift(I.shift().toUpperCase())

// repeat string by index 0
SL["repeat"] = $=>{
  SL.swap()
  I.unshift((I.shift() + '').repeat(I.shift()))
}

// pad string given by index 2 until length given by index 0 with string given by index 1
SL["pad"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  let Z = I.shift()
  I.unshift(_.pad(Y,Z,X))
}

// `pad` but only from the left
SL["padr"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  let Z = I.shift()
  I.unshift(_.padStart(Y,Z,X))
}

// `pad` but only from the right
SL["padr"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  let Z = I.shift()
  I.unshift(_.padEnd(Y,Z,X))
}

// execute string given by index 1 on a stack with name given by index 0
SL["stack"] = $=>{
  I.iter.unshift(I.st)
  let X = I.shift()
  let Y = I.shift()
  I.st = X
  if(!I.stack[I.st]) I.stack[I.st] = []
  I.addf(a=> I.st = I.iter.shift())
  I.exec(Y, 1)
}

// push index 1 to another stack with name given by index 0
SL["push"] = $=>{
  let X = I.shift()
  if(!I.stack[X]) I.stack[X] = []
  I.stack[X].unshift(I.shift())
}

// push top item of another stack with name given by index 0
SL["pull"] = $=>{
  let X = I.shift()
  if(!I.stack[X]) I.stack[X] = []
  I.unshift(I.stack[X].shift())
}

// push stack length
SL["size"] = $=> I.unshift(I.stack[I.st].length)

// remove all duplicates in current stack
SL["uniq"] = $=> I.stack[I.st] = _.uniq(I.stack[I.st])

// keep top _n_ items, where _n_ is index 0
SL["take"] = $=> I.stack[I.st] = _.take(I.stack[I.st],I.shift())

// pop top _n_ items, where _n_ is index 0
SL["drop"] = $=> I.stack[I.st] = _.drop(I.stack[I.st],I.shift())

// push items of another stack with name given by index 0
SL["merge"] = $=> I.unshift(...I.stack[I.shift()])

// set union with current stack and stack with name given by index 0
SL["union"] = $=>{
  let X = I.shift()
  I.stack[I.st] = _.union(I.stack[X], I.stack[I.st])
}

// set intersection with current stack and stack with name given by index 0
SL["intersection"] = $=>{
  let X = I.shift()
  I.stack[I.st] = _.intersection(I.stack[X], I.stack[I.st])
}

// set difference with current stack and stack with name given by index 0
SL["difference"] = $=>{
  let X = I.shift()
  I.stack[I.st] = _.difference(I.stack[I.st], I.stack[X])
}

// wrap index 0 in a list
SL["wrap"] = $=> I.unshift([I.shift()])

// opposite of `wrap`; take all items in list at index 0 and push to parent stack
SL["wrap_"] = $=>{
  let X = I.shift()
  I.unshift(...X.pop ? X : [X])
}

// push entire stack as a list
SL["enclose"] = $=> I.unshift(I.stack[I.st].slice())

// set current stack to the list at index 0
SL["usurp"] = $=> I.stack[I.st] = [...shift()]

// apply function to list given by index 0
SL["'"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  if(Y.big) Y = Y.split``
  else if(Y.toFixed) Y = (Y + '').split``
  I.iter.unshift(I.st)
  I.st = I.iter[0]+'\n'
  I.stack[I.st] = Y
  I.addf(a=>{
    Y = I.stack[I.st]
    delete I.stack[I.iter[0]+'\n']
    I.st = I.iter.shift()
    I.unshift(Y)
  })
  I.exec(X, 1)
}

// `wrap_` all elements
SL["flat"] = $=> I.stack[I.st] = _.flatten(I.stack[I.st])

// split stack into lists of length given by index 0
SL["chunk"] = $=>{
  let X = I.shift()
  I.stack[I.st] = _.chunk(I.stack[I.st], X)
}

// get keys of object/list at index 0
SL["keys"] = $=> I.unshift(Object.keys(I.shift()))

// get values of object/list at index 0
SL["vals"] = $=> I.unshift(Object.values(I.shift()))

// convert each item in stack to a list containing index and item
SL["enum"] = $=> I.stack[I.st] = I.stack[I.st].map((a,b)=> [a, b])

// convert each item in object to a list containing index and item
SL["enom"] = $=>{
  let X = I.shift()
  I.unshift(Object.keys(X).map(a=> [X[a], a]))
}

// remove key at index 0 from object at index 1
SL["del"] = $=> delete I.stack[I.st][1][I.shift()]

// `es` on each individual item in the stack
SL["map"] = $=>{
  I.each((a,i)=>{
    I.stack[I.iter[0]].unshift(I.shift())
  })
}

// `es` with accumulator and item; result of each `es` becomes the new accumulator
SL["fold"] = $=>{
  I.acc(
    (a, b, i)=> I.shift(),
    a=>{
      I.stack[I.st] = [a]
    }
  )
}

// remove each item that is falsy after `es`
SL["filter"] = $=>{
  I.each((a,b)=>{
    let A = I.shift()
    A && I.stack[I.iter[0]].unshift(A)
  })
}

// push 1 if any items return truthy after `es`, else push 0
SL["any"] = $=>{
  let X = 0
  I.each(
    (a,i)=>{
      if(!X && I.tru(I.shift())) X = 1
    },
    a=>{
      I.stack[I.st] = [X]
    }
  )
}

// push 1 if all items return truthy after `es`, else push 0
SL["all"] = $=>{
  let X = 1
  I.each(
    (a,i)=>{
      if(X && !I.tru(I.shift())) X = 0
    },
    a=>{
      I.stack[I.st] = [X]
    }
  )
}

// find first item that returns truthy after `es` or undefined on failure
SL["find"] = $=>{
  let X
  I.each(
    (a,i)=>{
      let A = I.shift()
      if(X == undefined && I.tru(A)) X = a
    },
    a=>{
      I.stack[I.st] = [X]
    }
  )
}

// `find` but returns index (or -1 on fail)
SL["findi"] = $=>{
  let X = -1
  I.each(
    (a,i)=>{
      if(X == undefined && I.tru(I.shift())) X = i
    },
    a=>{
      I.stack[I.st] = [X]
    }
  )
}

// `take` items until `es` returns falsy for an item
SL["takew"] = $=>{
  let X = 1
  I.each(
    (a,i)=>{
      if(X && I.tru(I.shift())) I.stack[I.iter[0]].unshift(a)
      else X = 0
    }
  )
}

// `drop` items until `es` returns falsy for an item
SL["dropw"] = $=>{
  I.addf(a=> I.stack[I.st] = _.dropWhile(I.stack[I.st]))
  SL.map()
}

// sort items in ascending order based on `es`
SL["sort"] = $=>{
  I.addf(a=> I.stack[I.st] = _.sortBy(I.stack[I.st]).reverse())
  SL.map()
}

// separate items into 2 lists based on whether they return truthy after `es`
SL["part"] = $=>{
  I.addf(a=> I.stack[I.st] = _.partition(I.stack[I.st]))
  SL.map()
}

SL["zip"] = $=>{

}

export {SL}

import {fs, cp, unesc, _, INT as I} from './bridge.js'
let SL = {}

SL["("] = $=>{
  I.lambda=1
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
  delete I.stack[I.iter[0]+'\n']
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
SL["gi"] = $=> I.unshift(I.ids[I.shift()])

// `gi` but parse escape codes
SL["gi\\"] = $=> I.unshift(unesc(I.ids[I.shift()]))

// `gi` but follow local scoping rules
SL["gl"] = $=> I.unshift(I.getscope())

// `gl` but parse escape codes
SL["gl\\"] = $=> I.unshift(unesc(I.getscope()))

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
    let Y=I.shift()
    I.stack[I.st][0][X] = Y
  }
}

// `gi` without pushing anything to stack (used for exposing ID's cleanly)
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
  addf(a=>{
    if(X){
      addf(a=> I.unshift(i - 1, j), 'e*')
      I.exec(j, 1)
    }
  })
}

// `es` if index 1 is truthy
SL["e&"] = $=>{
  SL.swap()
  if(I.shift()) SL.es()
  else I.shift()
}

// `es` if index 1 is falsy
SL["e|"] = $=>{
  SL.swap()
  if(I.shift()) I.shift()
  else SL.es()
}

// `es` on index 1 if index 2 is truthy; otherwise, `es` on index 0
SL["e?"] = $=>{
  SL.rot()
  if(!I.shift()) SL.swap()
  I.shift()
  SL.es()
}

// while `es` on index 1 is truthy, `es` on index 0
SL["ew"] = $=>{
  i=I.shift()
  j=I.shift()
  addf(a=>{
    if(I.shift()){
      addf(a=> I.unshift(i, j), 'ew')
      I.exec(i, 1)
    }
  })
  I.exec(j, 1)
}

//  `es` next line
SL[";"] = $=>{
  I.lns.unshift(I.lns[0] + 1)
  if(I.code[0].length){
    I.addf(a=> I.lns.shift())
    I.exec(I.lines[I.lns[0]], 1)
  }
}

//  `es` previous line
SL[";;"] = $=>{
  I.lns.unshift(I.lns[0] - 1)
  if(I.code[0].length){
    I.addf(a=> I.lns.shift())
    I.exec(I.lines[I.lns[0]], 1)
  }
}

// end execution of current call stack frame
SL["stop"] = $=> I.code.shift()

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
SL["$E"] = $=> I.unshift(Math.E)

// Pi
SL["$Pi"] = $=> I.unshift(Math.PI)

// `(index 1)*10^(index 0)`
SL["E"] = $=>{
  SL.swap()
  I.unshift(I.shift() * 10 ** I.shift())
}

// negation
SL["_"] = $=> I.unshift(-I.shift())

// addition
SL["+"] = $=> I.unshift(I.shift() - -I.shift())

// subtraction
SL["-"] = $=>{
  SL.swap()
  I.unshift(I.shift() - I.shift())
}

// multiplication
SL["*"] = $=> I.unshift(I.shift() * I.shift())

// division
SL["/"] = $=>{
  SL.swap()
  I.unshift(I.shift() / I.shift())
}

// integer division
SL["//"] = $=>{
  SL.swap()
  I.unshift(Math.floor(I.shift() / I.shift()))
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
  I.unshift(I.shift() ** I.shift())
}

// absolute value
SL["abs"] = $=> I.unshift(Math.abs(I.shift()))

// sign function
SL["sign"] = $=> I.unshift(Math.sign(I.shift()))

// push random number between 0 and 1
SL["rand"] = $=> I.unshift(Math.random())

// push milliseconds since January 1, 1970 00:00:00.000
SL["time"] = $=> I.unshift(Date.now())

// natural logarithm
SL["ln"] = $=> I.unshift(Math.log(I.shift()))

// base-10 logarithm
SL["log"] = $=> I.unshift(Math.log10(I.shift()))

// sine
SL["sin"] = $=> I.unshift(Math.sin(I.shift()))

// cosine
SL["cos"] = $=> I.unshift(Math.cos(I.shift()))

// tangent
SL["tan"] = $=> I.unshift(Math.tan(I.shift()))

// hyperbolic sine
SL["sinh"] = $=> I.unshift(Math.sinh(I.shift()))

// hyperbolic cosine
SL["cosh"] = $=> I.unshift(Math.cosh(I.shift()))

// hyperbolic tangent
SL["tanh"] = $=> I.unshift(Math.tanh(I.shift()))

// inverse sine
SL["asin"] = $=> I.unshift(Math.asin(I.shift()))

// inverse cosine
SL["acos"] = $=> I.unshift(Math.acos(I.shift()))

// inverse tangent
SL["atan"] = $=> I.unshift(Math.atan(I.shift()))

// inverse hyperbolic sine
SL["asinh"] = $=> I.unshift(Math.asinh(I.shift()))

// inverse hyperbolic cosine
SL["acosh"] = $=> I.unshift(Math.acosh(I.shift()))

// inverse hyperbolic tangent
SL["atanh"] = $=> I.unshift(Math.atanh(I.shift()))

// push max
SL["max"] = $=> I.unshift(Math.max(...I.stack[I.st]))

// push min
SL["min"] = $=> I.unshift(Math.min(...I.stack[I.st]))

// inclusive range
SL["range"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  I.unshift(...I.range(Y, X).reverse())
}

// bitwise not
SL["~"] = $=> I.unshift(~I.shift())

// logical not
SL["!"] = $=> I.unshift(+!I.shift())

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
  let X=I.shift()
  let Y=I.shift()
  I.unshift(X < Y ? 1 : X > Y ? -1 : 0)
}

// round towards -∞
SL["floor"] = $=> I.unshift(Math.floor(I.shift()))

// round towards 0
SL["trunc"] = $=> I.unshift(Math.trunc(I.shift()))

// round towards or away from 0 depending on < or >= .5
SL["round"] = $=> I.unshift(Math.round(I.shift()))

// round towards ∞
SL["ceil"] = $=> I.unshift(Math.ceil(I.shift()))

// `dup` but with any index
SL["pick"] = $=> I.unshift(I.get(I.shift()))

// `drop` but with any index
SL["nix"] = $=> I.splice(I.shift())

// `rot` but with any index
SL["roll"] = $=>{
  let X = I.get(0)
  SL.pick()
  I.unshift(X + 1)
  SL.nix()
}

// `rot_` but with any index
SL["roll_"] = $=> I.splice(I.shift(), 0, I.shift())

// swap index 1 with index given by index 0
SL["trade"] = $=> I.unshift(I.splice(I.shift() - 1, 1, I.shift())[0])

// push index 0
SL["dup"] = $=> I.unshift(I.stack[I.st][0])

// pop index 0
SL["drop"] = $=> I.shift()

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
  SL.dup()
  SL.rot_()
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
  SL.swap()
  I.unshift(...(I.shift() + '').split(I.shift()).reverse())
}

// join stack over string at index 0
SL["join"] = $=>{
  let X = I.shift()
  I.unshift(I.stack[I.st].slice(0).reverse().join(X))
}

// concatenate top 2 items as strings or lists
SL["++"] = $=> I.unshift(I.concat(I.shift(), I.shift()))

// push string length of index 0
SL["len"] = $=>{
  let X = I.shift()
  I.unshift(X.toFixed? (X + '').length : X.length)
}

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
SL["push"] = $=> I.stack[I.shift()].unshift(I.shift())

// push top item of another stack with name given by index 0
SL["pull"] = $=> I.unshift(I.stack[I.shift()].shift())

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
  I.stack[I.st] = _.union(I.stack[I.st], I.stack[X])
}

// set intersection with current stack and stack with name given by index 0
SL["intersection"] = $=>{
  let X = I.shift()
  I.stack[I.st] = _.intersection(I.stack[I.st], I.stack[X])
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
SL["enclose"] = $=> I.unshift(I.stack[I.st].slice(0))

// set current stack to the list at index 0
SL["usurp"] = $=> I.stack[I.st] = [...shift()]

// apply function to list given by index 0
SL["'"] = $=> {
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
SL["enum"] = $=> I.stack[I.st] = I.stack[I.st].map((a,b)=> [b, a])

// convert each item in object to a list containing index and item
SL["enom"] = $=>{
  let X = I.shift()
  I.unshift(Object.keys(X).map(a=> [X[a], a]))
}

// remove key at index 0 from object at index 1
SL["del"] = $=> delete I.stack[I.st][1][I.shift()]

// `es` on each individual item in the stack
SL["map"] = $=> {
  let X = I.shift()
  I.iter.unshift(I.st)
  I.addf(a=>{
    delete I.stack[I.iter[0] + ' ']
    I.st = I.iter.shift()
  })
  I.stack[I.st].map((a,b)=>
    I.addf(
      $=>{
        I.st = I.iter[0] + ' '
        I.stack[I.st] = [a]
      },
      ...I.parse(X),
      $=> I.stack[I.iter[0]][b] = I.shift()
    )
  )
}

// `es` with accumulator and item; result of each `es` becomes the new accumulator
SL["fold"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  I.iter.unshift(I.st)
  I.addf(a=>{
    delete I.stack[I.iter[0] + ' ']
    I.st = I.iter.shift()
    I.stack[I.st] = [Y]
  })
  I.stack[I.st].map(a=>
    I.addf(
      $=>{
        I.st = I.iter[0] + ' '
        I.stack[I.st] = [a,Y]
      },
      ...I.parse(X),
      $=> Y = I.shift()
    )
  )
}

// remove each item that is falsy after `es`
SL["filter"] = $=>{
  I.addf(a=> I.stack[I.st] = I.stack[I.st].filter(a=> a))
  SL.map()
}

// push 1 if any items return truthy after `es`, else push 0
SL["any"] = $=>{
  I.addf(a=> I.stack[I.st] = [+I.stack[I.st].some(a=> a)])
  SL.map()
}

// push 1 if all items return truthy after `es`, else push 0
SL["all"] = $=> {
  I.addf(a=> I.stack[I.st] = [+I.stack[I.st].every(a=> a)])
  SL.map()
}

// find first item that returns truthy after `es` or undefined on failure
SL["find"] = $=> {
  I.addf(a=> I.stack[I.st] = [I.stack[I.st].find(a=> a)])
  SL.map()
}

// `find` but returns index (or -1 on fail)
SL["findi"] = $=>{
  I.addf(a=> I.stack[I.st] = [I.stack[I.st].findIndex(a=> a)])
  SL.map()
}

// `take` items until `es` returns falsy for an item
SL["takew"] = $=>{
  I.addf(a=> I.stack[I.st] = _.takeWhile(I.stack[I.st]))
  SL.map()
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

export {SL}

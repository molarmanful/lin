import {_, INT as I} from '../bridge.js'

let LIST = {}

// length of index 0
LIST["len"] = $=>{
  let X = I.shift()
  I.unshift(X.length)
}

// depth of index 0
LIST["dep"] = $=>{
  let d = x=> _.isObjectLike(x) ? 1 + Math.max(0, ..._.map(x, d)) : 0
  I.unshift(d(I.shift()))
}

// `es` index 0 on list at index 1
LIST["'"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  if(Y.big || Y.toFixed) Y = (Y + '').split``
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

// split string at index 1 over string at index 0
LIST["split"] = $=>{
  let X = I.shift()
  I.unshift((I.shift() + '').split(X).reverse())
}

// join list over string at index 0
LIST["join"] = $=>{
  let X = I.shift()
  I.unshift(I.shift().slice().reverse().join(X))
}

// concatenate top 2 items as strings or lists
LIST["++"] = $=>{
  let X = I.shift()
  I.unshift(I.concat(I.shift(), X))
}

// repeat list/string by index 0
LIST["rep"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  if(Y.big || Y.toFixed) I.unshift(_.repeat(Y, X))
  else I.unshift(_.range(X).flatMap(a=> Y))
}

// set union of lists at index 0 and index 1
LIST["union"] = $=> I.unshift(_.union(I.shift(), I.shift()))

// set intersection of lists at index 0 and index 1
LIST["inter"] = $=> I.unshift(_.intersection(I.shift(), I.shift()))

// set difference of lists at index 0 and index 1
LIST["diff"] = $=> I.unshift(_.difference(I.shift(), I.shift()))

// wrap index 0 in a list
LIST["wrap"] = $=> I.unshift([I.shift()])

// wrap first _n_ items in a list, where _n_ is index 0
LIST["wraps"] = $=> I.unshift(I.splice(0, I.shift()))

// opposite of `wrap`; take all items in list at index 0 and push to parent stack
LIST["wrap_"] = $=>{
  let X = I.shift()
  I.unshift(...X.pop ? X : [X])
}

// enclose entire stack into a list
LIST["enclose"] = $=> I.stack[I.st] = [I.stack[I.st].slice()]

// push entire stack as list
LIST["dups"] = $=> I.unshift(I.stack[I.st].slice())

// set current stack to the list at index 0
LIST["usurp"] = $=> I.stack[I.st] = [...I.shift()]

// convert each item in stack to a list containing index and item
LIST["enum"] = $=> I.stack[I.st] = I.stack[I.st].map((a,b)=> [a, b])

// convert `enum`-style stack into a normal stack
LIST["denum"] = $=>{
  let X = _.sortBy(I.stack[I.st].filter(a=> a.length > 1), a=> a[1])
  I.stack[I.st] = []
  X.map(a=> I.unshift(a[0]))
}

export default LIST
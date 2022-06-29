import {_, INT as I} from '../bridge.js'

let LOGIC = {}

// equal
LOGIC["="] = $=> I.unshift(+(I.shift() == I.shift()))

// strict equal
LOGIC["=="] = $=> I.unshift(+(I.shift() === I.shift()))

// deep equal
LOGIC["eq"] = $=> I.unshift(_.isEqual(I.shift(), I.shift()))

// not equal
LOGIC["!="] = $=> I.unshift(+(I.shift() != I.shift()))

// greater than
LOGIC[">"] = $=> I.unshift(+(I.shift() < I.shift()))

// less than
LOGIC["<"] = $=> I.unshift(+(I.shift() > I.shift()))

// greater than or equal to
LOGIC[">="] = $=> I.unshift(+(I.shift() <= I.shift()))

// less than or equal to
LOGIC["<="] = $=> I.unshift(+(I.shift() >= I.shift()))

// comparison function (-1 for less than, 0 for equal, 1 for greater than)
LOGIC["<=>"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  I.unshift(X < Y ? 1 : X > Y ? -1 : 0)
}

export default LOGIC
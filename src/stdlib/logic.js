import {_} from '../bridge.js'

let LOGIC = {}

// equal
LOGIC["="] = $=> $.unshift(+($.shift() == $.shift()))

// strict equal
LOGIC["=="] = $=> $.unshift(+($.shift() === $.shift()))

// deep equal
LOGIC["eq"] = $=> $.unshift(+_.isEqual($.shift(), $.shift()))

// not equal
LOGIC["!="] = $=> $.unshift(+($.shift() != $.shift()))

// greater than
LOGIC[">"] = $=> $.unshift(+($.shift() < $.shift()))

// less than
LOGIC["<"] = $=> $.unshift(+($.shift() > $.shift()))

// greater than or equal to
LOGIC[">="] = $=> $.unshift(+($.shift() <= $.shift()))

// less than or equal to
LOGIC["<="] = $=> $.unshift(+($.shift() >= $.shift()))

// comparison function (-1 for less than, 0 for equal, 1 for greater than)
LOGIC["<=>"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.unshift(X < Y ? 1 : X > Y ? -1 : 0)
}

export default LOGIC
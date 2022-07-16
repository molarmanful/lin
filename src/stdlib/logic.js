import {_} from '../bridge.js'

let LOGIC = {}

let unt = $=> $.untag($.shift())

// equal
LOGIC["="] = $=> $.unshift(+(unt($) == unt($)))

// strict equal
LOGIC["=="] = $=> $.unshift(+(unt($) === unt($)))

// deep equal
LOGIC["eq"] = $=> $.unshift(+_.isEqual(unt($), unt($)))

// not equal
LOGIC["!="] = $=> $.unshift(+(unt($) != unt($)))

// strict not equal
LOGIC["!=="] = $=> $.unshift(+(unt($) !== unt($)))

// greater than
LOGIC[">"] = $=> $.unshift(+(unt($) < unt($)))

// less than
LOGIC["<"] = $=> $.unshift(+(unt($) > unt($)))

// greater than or equal to
LOGIC[">="] = $=> $.unshift(+(unt($) <= unt($)))

// less than or equal to
LOGIC["<="] = $=> $.unshift(+(unt($) >= unt($)))

// comparison function (-1 for less than, 0 for equal, 1 for greater than)
LOGIC["<=>"] = $=>{
  let X = unt($)
  let Y = unt($)
  $.unshift(X < Y ? 1 : X > Y ? -1 : 0)
}

export default LOGIC
import {_} from '../bridge.js'

let LOGIC = {}

// logical not
LOGIC["!"] = $=> $.u1(a=> $.v1(x=> !$.untag(x), a))

// equal
LOGIC["="] = $=> $.u2((a, b)=> $.v2((x, y)=> $.untag(x) == $.untag(y), a, b))

// strict equal
LOGIC["=="] = $=> $.u2((a, b)=> $.v2((x, y)=> $.untag(x) === $.untag(y), a, b))

// deep equal
LOGIC["eq"] = $=> $.u2((a, b)=> $.v2((x, y)=> _.isEqual($.untag(x), $.untag(y)), a, b))

// not equal
LOGIC["!="] = $=> $.u2((a, b)=> $.v2((x, y)=> $.untag(x) != $.untag(y), a, b))

// strict not equal
LOGIC["!=="] = $=> $.u2((a, b)=> $.v2((x, y)=> $.untag(x) !== $.untag(y), a, b))

// greater than
LOGIC[">"] = $=> $.u2((a, b)=> $.v2((x, y)=> $.untag(x) > $.untag(y), a, b))

// less than
LOGIC["<"] = $=> $.u2((a, b)=> $.v2((x, y)=> $.untag(x) < $.untag(y), a, b))

// greater than or equal to
LOGIC[">="] = $=> $.u2((a, b)=> $.v2((x, y)=> $.untag(x) >= $.untag(y), a, b))

// less than or equal to
LOGIC["<="] = $=> $.u2((a, b)=> $.v2((x, y)=> $.untag(x) <= $.untag(y), a, b))

// comparison function (-1 for less than, 0 for equal, 1 for greater than)
LOGIC["<=>"] = $=>
  $.u2((a, b)=> $.v2((x, y)=>(
    x = $.untag(x),
    y = $.untag(y),
    x < y ? 1 : x > y ? -1 : 0
  ), a, b))

export default LOGIC
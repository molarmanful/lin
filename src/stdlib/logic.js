import {_} from '../bridge.js'

let LOGIC = {}

// logical not
LOGIC["!"] = $=> $.u1(a=> $.v1(x=> !$.tru(x), a))

// `!` but non-vectorized
LOGIC["!_"] = $=> $.u1(a=> !$.tru(a))

// logical and
LOGIC["&&"] = $=> $.u2((a, b)=> $.v2((x, y)=> $.tru(x) && $.tru(y), a, b))

// `&&` but non-vectorized
LOGIC["&&_"] = $=> $.u2((a, b)=> $.tru(a) || $.tru(b))

// logical or
LOGIC["||_"] = $=> $.u2((a, b)=> $.v2((x, y)=> $.tru(x) || $.tru(y), a, b))

// `||` but non-vectorized
LOGIC["||_"] = $=> $.u2((a, b)=> $.tru(a) || $.tru(b))

// equal
LOGIC["="] = $=> $.u2((a, b)=> $.v2((x, y)=> $.untag(x) == $.untag(y), a, b))

// `=` but non-vectorized
LOGIC["=_"] = $=> $.u2((a, b)=> $.untag(a) == $.untag(b))

// strict equal
LOGIC["=="] = $=> $.u2((a, b)=> $.v2((x, y)=> $.untag(x) === $.untag(y), a, b))

// `==` but non-vectorized
LOGIC["==_"] = $=> $.u2((a, b)=> $.untag(a) === $.untag(b))

// deep equal
LOGIC["eq"] = $=> $.u2((a, b)=> _.isEqualWith(a, b, (x, y)=> $.untag(x) == $.untag(y)))

// strict deep equal
LOGIC["eqq"] = $=> $.u2((a, b)=> _.isEqualWith(a, b, (x, y)=> $.untag(x) === $.untag(y)))

// not equal
LOGIC["!="] = $=> $.u2((a, b)=> $.v2((x, y)=> $.untag(x) != $.untag(y), a, b))

// `!=` but non-vectorized
LOGIC["!=_"] = $=> $.u2((a, b)=> $.untag(a) != $.untag(b))

// strict not equal
LOGIC["!=="] = $=> $.u2((a, b)=> $.v2((x, y)=> $.untag(x) !== $.untag(y), a, b))

// `!==` but non-vectorized
LOGIC["!==_"] = $=> $.u2((a, b)=> $.untag(a) !== $.untag(b))

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

// `<=> _`
LOGIC[">=<"] = $=> $.exec('<=> _', 1)

export default LOGIC
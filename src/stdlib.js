import BASE from './stdlib/base.js'
import CONSTANT  from './stdlib/constant.js'
import COUNT  from './stdlib/count.js'
import FLOW from './stdlib/flow.js'
import IO from './stdlib/io.js'
import ITER from './stdlib/iter.js'
import LIST from './stdlib/list.js'
import LOGIC from './stdlib/logic.js'
import MULTISTACK from './stdlib/multistack.js'
import NUM from './stdlib/num.js'
import OBJ from './stdlib/obj.js'
import STACK from './stdlib/stack.js'
import STR from './stdlib/str.js'

let SL = {
  ...BASE,
  ...CONSTANT,
  ...COUNT,
  ...FLOW,
  ...IO,
  ...ITER,
  ...LIST,
  ...LOGIC,
  ...MULTISTACK,
  ...NUM,
  ...OBJ,
  ...STACK,
  ...STR
}

export default SL
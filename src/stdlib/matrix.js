import {_, SL} from '../bridge.js'
import {reshape} from 'mathjs'

let MATRIX = {}

MATRIX["mat"] = $=>{
  let X = $.itrlist($.shift())
}

// reshape the stack using dimensions at index 0
MATRIX["shape"] = $=>{
  let X = $.itrlist($.shift())
  SL.blob($)
  $.stack[$.st] = [...reshape($.itrlist(itr.take(X.reduce((a, b)=> a * b, 1), itr.cycle($.listitr($.stack[$.st])))), X)]
}

// identity matrix with side length at index 0
MATRIX["eye"] = $=>{
  let X = $.shift()
  $.unshift(_.range(X).map((a, i)=> _.range(X).map((b, j)=> +(i == j))))
}

export default MATRIX
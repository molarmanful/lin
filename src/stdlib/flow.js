import {_, INT as I, SL} from '../bridge.js'

let FLOW = {}

// execute string at index 0
FLOW["es"] = $=> I.exec(I.shift(), 1)

// `es` for number of times given by index 0
FLOW["e*"] = $=>{
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
FLOW["e&"] = $=>{
  if(I.tru(I.shift())) SL.es()
  else I.shift()
}

// `es` if index 0 is falsy
FLOW["e|"] = $=>{
  if(I.tru(I.shift())) I.shift()
  else SL.es()
}

// `es` on index 2 if index 0 is truthy; otherwise, `es` on index 1
FLOW["e?"] = $=>{
  let X = I.shift()
  if(!I.tru(X)) SL.swap()
  I.shift()
  SL.es()
}

// while `es` on index 1 is truthy, `es` on index 0
FLOW["ew"] = $=>{
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
FLOW["e@"] = $=>{
  I.lns.unshift(I.shift())
  if(I.code[0].length) I.addf(a=> I.lns.shift())
  I.exec(I.lines[I.lns[0]], 1)
}

//  `es` next line
FLOW[";"] = $=>{
  I.unshift(I.lns[0] - -1)
  SL["e@"]()
}

//  `es` previous line
FLOW[";;"] = $=>{
  I.unshift(I.lns[0] - 1)
  SL["e@"]()
}

// end execution of current call stack frame
FLOW["break"] = $=> I.code.shift()

export default FLOW
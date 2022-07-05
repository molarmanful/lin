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
  let X = I.shift()
  let Y = I.shift()
  if(I.tru(Y)) I.unshift(X), SL.es()
}

// `es` if index 0 is falsy
FLOW["e|"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  if(!I.tru(Y)) I.unshift(X), SL.es()
}

// `es` on index 1 if index 2 is truthy; otherwise, `es` on index 0
FLOW["e?"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  let Z = I.shift()
  I.unshift(I.tru(Z) ? Y : X)
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

// `es` line number at index 0
FLOW["e@"] = $=> I.eline(I.shift())

// `es` current line
FLOW["@"] = $=> I.eline(I.lns[0])

// `es` next line
FLOW[";"] = $=> I.eline(I.lns[0] - -1)

// `es` previous line
FLOW[";;"] = $=> I.eline(I.lns[0] - 1)

// end execution of current call stack frame
FLOW["break"] = $=> I.code.shift()

export default FLOW
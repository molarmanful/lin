import {_, SL} from '../bridge.js'

let FLOW = {}

// execute string at index 0
FLOW["es"] = $=> $.exec($.shift(), 1)

// `es` for number of times given by index 0
FLOW["e*"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.addf(a=>{
    if($.tru(X)){
      $.addf(a=> $.unshift(X - 1, Y), 'e*')
      $.exec(Y, 1)
    }
  })
}

// `es` if index 0 is truthy
FLOW["e&"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if($.tru(Y)) $.unshift(X), SL.es($)
}

// `es` if index 0 is falsy
FLOW["e|"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if(!$.tru(Y)) $.unshift(X), SL.es($)
}

// `es` on index 1 if index 2 is truthy; otherwise, `es` on index 0
FLOW["e?"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  let Z = $.shift()
  $.unshift($.tru(Z) ? Y : X)
  SL.es($)
}

// while `es` on index 1 is truthy, `es` on index 0
FLOW["ew"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.addf(a=>{
    if($.tru($.shift())){
      $.addf(a=> $.unshift(X, Y), 'ew')
      $.exec(X, 1)
    }
  })
  $.exec(Y, 1)
}

// `es` next *n* lines, where *n* is index 0
FLOW["e@"] = $=> $.eline($.shift())

// `es` current line
FLOW["@"] = $=> $.eline(0)

// `es` next line
FLOW[";"] = $=> $.eline(1)

// `es` previous line
FLOW[";;"] = $=> $.eline(-1)

// end execution of current call stack frame
FLOW["break"] = $=> $.code.shift()

export default FLOW
import {_, SL, __} from '../bridge.js'

let FLOW = {}

// execute string at index 0
FLOW["es"] = $=> $.exec($.shift(), 1)

// `es` for number of times given by index 0
FLOW["e*"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if(X > 0){
    $.addf(a=> $.unshift(Y, X - 1), 'e*')
    $.exec(Y, 1)
  }
}

// `es` if index 0 is truthy
FLOW["e&"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if($.tru(Y)) $.exec(X, 1)
}

// `es` if index 0 is falsy
FLOW["e|"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  if(!$.tru(Y)) $.exec(X, 1)
}

// `es` on index 1 if index 2 is truthy; otherwise, `es` on index 0
FLOW["e?"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  let Z = $.shift()
  $.exec($.tru(Z) ? Y : X, 1)
}

// `e?` but using object; keys are conditions
FLOW["e="] = $=>{
  let X = $.shift()
  __.find((a, i)=>{
    $.unshift(i)
    SL.Q($)
    if($.tru($.shift())){
      $.exec(a, 1)
      return 1
    }
  })(X)
}

// while `es` on index 1 is truthy, `es` on index 0
FLOW["ew"] = $=>{
  let X = $.shift()
  let Y = $.get(0)
  SL.Q($)
  if($.tru($.shift())){
    $.addf(a=> $.unshift(Y, X), 'ew')
    $.exec(X, 1)
  }
}

// try `es` on index 1 and catch with index 0
FLOW["e!"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  $.catch = 1
  try {
    $.exec(Y)
    $.catch = 0
  }
  catch(e){
    $.catch = 0
    $.unshift(e instanceof Error ? e.message : e)
    $.exec(X)
  }
}

// `es` next *n* lines, where *n* is index 0
FLOW["e@"] = $=> $.eline($.shift())

// `es` current line
FLOW["@"] = $=> $.eline(0)

// `es` next line
FLOW[";"] = $=> $.eline(1)

// `es` previous line
FLOW[";;"] = $=> $.eline(-1)

// throw error
FLOW["err"] = $=> $.err($.shift())

// end execution of current call stack frame
FLOW["break"] = $=> $.code.shift()

// exit with code at index 0
FLOW["exit"] = $=> $.exit($.shift())

export default FLOW
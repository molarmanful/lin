import {_, INTRP, SL} from '../bridge.js'

let MODULE = {}

let imp = $=>{
  let F = $.mresolve($.shift() + '.lin')
  let X = $.mname(F)
  if(X.match(/["\d. ]/)) $.err(`bad pkg name "${X}"`)
  let I = new INTRP(sh.cat(F), F)
  I.child = 1
  I.run()
  if(!('__PKG' in I.ids)) $.err(`not a pkg "${X}"`)
  I.ids.__PKG.name = X
  I.ids.__PKG.file = F
  return {F, X, I}
}

MODULE[":i"] = $=>{
  let {X, I} = imp($)
  $.ids[X] = I.ids.__PKG
}

MODULE["a:i"] = $=>{
  let Y = $.shift()
  let {I} = imp($)
  $.ids[Y] = I.ids.__PKG
}

MODULE[":e"] = $=>{
  let X = $.shift()
  if($.ismap(X)){
    $.ids.__PKG = new $.PKG()
    $.ids.__PKG.lines = $.lines
    _.assign($.ids.__PKG.ids, Object.fromEntries(X))
  }
  else $.err(`bad export "${$.file}"`)
}

export default MODULE
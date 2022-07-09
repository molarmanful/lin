import {_, INTRP, fs, SL} from '../bridge.js'

let MODULE = {}

let imp = $=>{
  let F = $.mresolve($.shift() + '.lin')
  let X = $.mname(F)
  if(X.match(/[\d\s.]/)) throw `bad pkg name "${X}"`
  let I = new INTRP(fs.readFileSync(F) + '', F)
  I.ids.__PKG.name = X
  I.ids.__PKG.file = F
  return {F, X, I}
}

MODULE["a::i"] = $=>{
  let Y = $.shift()
  let {X, I} = imp($)
  $.ids[Y] = I.ids.__PKG
}

MODULE["::i"] = $=>{
  let {X, I} = imp($)
  $.ids[X] = I.ids.__PKG
}

MODULE["::e"] = $=>{
  if(!('__PKG' in $.ids)) $.ids.__PKG = new $.PKG()
  _.map($.shift(), a=>{
    $.id(a)
    $.ids.__PKG.ids[a] = $.ids[a]
    $.ids.__PKG.idls[a] = $.idls[a]
  })
  $.ids.__PKG.lines = $.lines
}

export default MODULE
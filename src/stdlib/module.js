import {_, INTRP, fs, SL} from '../bridge.js'

let MODULE = {}

let imp = $=>{
  let F = $.mresolve($.shift() + '.lin')
  let X = $.mname(F)
  if(X.match(/[\d. ]/)) throw `bad pkg name "${X}"`
  let I = new INTRP(fs.readFileSync(F) + '', F)
  I.ids.__PKG.name = X
  I.ids.__PKG.file = F
  return {F, X, I}
}

MODULE["::i"] = $=>{
  let {X, I} = imp($)
  $.ids[X] = I.ids.__PKG
}

MODULE["::e"] = $=>{
  let X = $.shift()
  if($.isobj(X)){
    $.ids.__PKG = new $.PKG()
    _.assign($.ids.__PKG.ids, Object.fromEntries(X))
  }
  else throw `bad export "${$.file}"`
}

export default MODULE
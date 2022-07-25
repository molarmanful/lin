import {itr, _, SL} from '../bridge.js'

let NEST = {}

// deep map on list with indices
NEST["Imap"] = $=>{
  SL.swap($)
  $.unshift($.each($.shift(), (x, f)=> $.imap(x, f), x=> x, 0, 1))
}

// use list at index 0 as replication mask for list at index 1
NEST["repl"] = $=>{
  let m = (x, y)=>
    $.ismat(x) ? m(x.valueOf(), y)
    : $.ismat(y) ? m(x, y.valueOf())
    : y.flatMap((a, i)=>
        $.isarr(a) ?  $.isarr(x[i]) ? [m(x[i], a)] : [x[i]]
        : $.tru(a) && i in x ? _.range($.isnum(a) ? a : 1).map(b=> x[i])
        : []
      )
  $.u2(m)
}

export default NEST
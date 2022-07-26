import {__, itr, _, SL} from '../bridge.js'

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

// lens get
NEST["%g"] = $=>
  $.u2((a, b)=>{
    let O = a
    $.imap(b, x=>{
      if(O != void 0) O = $.gind(O, x)
    })
    return O
  })

// lens set
NEST["%:"] = $=>
  $.u3((a, b, c)=>{

  })

// lens map flag
NEST["%a"] = $=> $.unshift(new $.LENS())

// polymorphic map
NEST["%'"] = $=>{
  SL.swap($)
  $.u1(a=> $.each(a, (x, f)=> __.map(f)(x), x=> x, 0, 1))
}

// polymorphic filter
NEST["%#"] = $=>{
  SL.swap($)
  $.u1(a=> $.each(a, (x, f)=> __.filter(f)(x), x=> x, 0, 1))
}

// polymorphic find
NEST["%?'"] = $=>{
  SL.swap($)
  $.u1(a=> $.each(a, (x, f)=> __.find(f)(x), x=> x, 0, 1))
}

// polymorphic any
NEST["%|"] = $=>{
  SL.swap($)
  $.u1(a=> $.each(a, (x, f)=> __.some(f)(x), x=> x, 0, 1))
}

// polymorphic all
NEST["%&"] = $=>{
  SL.swap($)
  $.u1(a=> !$.each(a, (x, f)=> __.some(__.not(f))(x), x=> x, 0, 1))
}

export default NEST
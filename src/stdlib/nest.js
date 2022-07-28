import {__, itr, _, SL} from '../bridge.js'

let NEST = {}

// deep map on list with indices
NEST["imap"] = $=>{
  SL.swap($)
  $.u1(a=> $.each(a, (x, f)=> $.imap(x, f), x=> x, 0, 1))
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

// traverse nested structure with function
NEST["walk"] = $=>{
  let m = (x, F, d=[])=>{
    x = F(x, d)
    if($.isitr(x)) return itr.map((a, i)=> m(a, F, d.concat(i)), x)
    if($.ismat(x)) x = x.valueOf()
    if($.isi(x)) return _.map(x, (a, i)=> m(a, F, d.concat(i)))
    return x
  }
  SL.swap($)
  $.u1(a=> $.each(a, (x, f)=> m(x, f), x=> x, 0, 1))
}

// lens view
NEST["%g"] = $=> $.u2((a, b)=> $.lget(a, b))

// lens modify
NEST["%:"] = $=> $.u3((a, b, c)=> $.lmod(a, b, c))

// lens map
NEST["%a"] = $=> $.unshift($.lens.a)

// lens filter
NEST["%f"] = $=> $.u1(a=> $.lens.f($.tlens(a)))

// lens find
NEST["%F"] = $=> $.u1(a=> $.lens.F($.tlens(a)))

// lens max
NEST["%Mx"] = $=> $.u1(a=> $.lens.MX($.tlens(a)))

// lens min
NEST["%Mn"] = $=> $.u1(a=> $.lens.MN($.tlens(a)))

// polymorphic map
NEST["%'"] = $=>{
  SL.swap($)
  $.u1(a=> $.each(a, (x, f)=> __.map(f)(x), x=> x, 0, 1))
}

// polymorphic fold
NEST["%/"] = $=>{
  SL.swap($)
  $.u1(a=> $.acc(a, 0, (x, f)=> __.reduce(f)(x), 1))
}

// polymorphic fold with accumulator
NEST["%/a"] = $=>{
  let folda = (x, f, a)=> (__.map((b, i)=> a = f(a, b, i))(x), a)
  SL.swap($)
  $.u1(a=> $.acc(a, 1, (x, f, y)=> folda(y, f, x), 1))
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
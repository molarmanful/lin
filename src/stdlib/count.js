import {$C, itr, _, INT as I, SL} from '../bridge.js'

let COUNT = {}

let iconv = x=> x?.pop ? x.reverse() : x

// factoradic representation of index 0
COUNT["facc"] = $=> I.unshift($C.factoradic(I.shift()).reverse())

// _m_th combinadic digit of _n_ C _k_, where _n_ _k_ _m_ are top 3 items
COUNT["combc"] = $=>{
  let X = I.shift()
  let Y = I.shift()
  let Z = I.shift()
  I.unshift($C.combinadic(Z, Y)(X).reverse())
}

// permutations of index 1 of length given by index 0
COUNT["`perm"] = $=>{
  SL.swap()
  I.unshift(new $C.Permutation(iconv(I.shift()), I.shift()))
}

// combinations of index 1 of length given by index 0
COUNT["`comb"] = $=>{
  SL.swap()
  I.unshift(new $C.Combination(iconv(I.shift()), I.shift()))
}

// powerset of index 0
COUNT["`pset"] = $=> I.unshift(new $C.PowerSet(iconv(I.shift())))

// generate base-N sequence from digits at index 1 with length at index 0
COUNT["`/\\"] = $=>{
  SL.swap()
  I.unshift(new $C.BaseN(iconv(I.shift()), I.shift()))
}

// cartesian product over list of sequences
COUNT["`'*"] = $=>{
  SL.swap()
  I.unshift($C.CartesianProduct.from(_.map(I.shift(), iconv).reverse()))
}

export default COUNT
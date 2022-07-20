import {$C, itr, _, SL} from '../bridge.js'

let COUNT = {}

// factoradic representation of index 0
COUNT["facc"] = $=> $.unshift($C.factoradic($.shift()))

// _m_th combinadic digit of _n_ C _k_, where _n_ _k_ _m_ are top 3 items
COUNT["combc"] = $=>{
  let X = $.shift()
  let Y = $.shift()
  let Z = $.shift()
  $.unshift($C.combinadic(Z, Y)(X))
}

// permutations of index 1 of length given by index 0
COUNT["`perm"] = $=>{
  SL.swap($)
  $.unshift(new $C.Permutation($.shift(), $.shift()))
}

// combinations of index 1 of length given by index 0
COUNT["`comb"] = $=>{
  SL.swap($)
  $.unshift(new $C.Combination($.shift(), $.shift()))
}

// powerset of index 0
COUNT["`pset"] = $=> $.unshift(new $C.PowerSet($.shift()))

// generate base-N sequence from digits at index 1 with length at index 0
COUNT["`/\\"] = $=>{
  SL.swap($)
  $.unshift(new $C.BaseN($.shift(), $.shift()))
}

// cartesian product over list of sequences
COUNT["`'*"] = $=> $.unshift($C.CartesianProduct.from($.shift()))

export default COUNT
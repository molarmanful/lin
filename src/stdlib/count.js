import {$C, _, SL} from '../bridge.js'

let COUNT = {}

// factoradic representation of index 0
COUNT["facc"] = $=> $.u1(a=> $.v1(x=> $C.factoradic(x), a))

// _m_th combinadic digit of _n_ C _k_, where _n_ _k_ _m_ are top 3 items
COUNT["combc"] = $=> $.u3((a, b, c)=> $.v3((x, y, z)=> $C.combinadic(x, y)(z), a, b, c))

// permutations of index 0
COUNT["`perm"] = $=> $.u1(a=> new $C.Permutation(a))

// permutations of index 1 of length given by index 0
COUNT["`pern"] = $=> $.u2((a, b)=> $.v1(x=> new $C.Permutation(a, x), b))

// combinations of index 1 of length given by index 0
COUNT["`comb"] = $=> $.u2((a, b)=> $.v1(x=> new $C.Combination(a, x), b))

// powerset of index 0
COUNT["`pset"] = $=> $.u1(a=> new $C.PowerSet(a))

// generate base-N sequence from digits at index 1 with length at index 0
COUNT["`/\\"] = $=> $.u2((a, b)=> $.v1(x=> new $C.BaseN(a, x), b))

// cartesian product over list of sequences
COUNT["`'*"] = $=> $.u1(a=> $C.CartesianProduct.from(a))

export default COUNT
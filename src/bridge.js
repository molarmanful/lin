import _ from 'lodash-es'

Map.prototype.map = function(f){
  let X = new Map(this)
  Array.from(this, ([i, a])=> X.set(i, f(a, i)))
  return X
}

Array.prototype.values = function(){
  return this
}

Array.prototype.get = function(i){
  return this[i]
}

Array.prototype.set = function(i, a){
  return (this[i] = a)
}

let omap = _.map.bind(_)
_.map = (x, f)=> x instanceof Map ? x.map(f) : omap(x, f)

export * as fs from 'fs'
export * as cp from 'child_process'
export * as rls from 'readline-sync'
export * as $C from 'js-combinatorics'
export * as itr from 'iter-tools-es'
export {default as chalk} from 'chalk'
export {runOnThread as mth} from 'funthreads'
export * as path from 'path'

export {_}
export {default as parse} from './parser.js'
export {default as unesc} from './unesc.js'
export {default as INTRP} from './int.js'
export {default as SL} from './stdlib.js'
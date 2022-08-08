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
  return i >= 0 ? this[i] : this[this.length + i]
}

Array.prototype.set = function(i, a){
  return i >= 0 ? (this[i] = a) : (this[this.length + i] = a)
}

Array.prototype.delete = function(i){
  this.splice(i, 1)
}

let omap = _.map.bind(_)
_.map = (x, f)=> ['DenseMatrix', 'SparseMatrix'].includes(x?.type) || x instanceof Map ? x.map(f) : omap(x, f)

export * as fs from 'fs'
export * as fsp from 'fs/promises'
export * as rls from 'readline-sync'
export * as $C from 'js-combinatorics'
export * as itr from 'iter-tools-es'
export {default as chalk} from 'chalk'
export * as path from 'path'
export {default as voca} from 'voca'
export {default as RE2} from 're2'
export * as math from 'mathjs'
export * as __ from 'shades'
export {default as sh} from 'shelljs'

export {_}
export {default as parse} from './parser.js'
export {default as unesc} from './unesc.js'
export {default as prime} from './prime.js'
export {default as INTRP} from './int.js'
export {default as SL} from './stdlib.js'
export {default as DOT} from './stdlib/dot.js'
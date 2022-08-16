import _ from 'lodash-es'
import {Temporal, Intl, toTemporalInstant} from '@js-temporal/polyfill'
import sh from 'shelljs'
import {create, all} from 'mathjs'

let math = create(all)

let mat = math.matrix.bind(math)
math.import({
  matrix(xs, ...a){
    let f = x=> x?.map ? x.map(f) : x?.xs ? x.xs : x
    return mat(xs.map(f), ...a)
  }
}, {override: true})

Map.prototype.map = function(f){ return new Map(this.entries.map(([i, a])=> f(a, i))) }

Array.prototype.values = function(){ return this }

Array.prototype.get = function(i){ return i >= 0 ? this[i] : this[this.length + i] }

Array.prototype.set = function(i, a){ return i >= 0 ? (this[i] = a) : (this[this.length + i] = a) }

Array.prototype.delete = function(i){ this.splice(i, 1) }

math.DenseMatrix.prototype.map = math.SparseMatrix.prototype.map = function(f){
  return math.matrix(this.valueOf().map(f))
}

math.DenseMatrix.prototype.get = math.SparseMatrix.prototype.get = function(i){
  let a = this.valueOf().get(i)
  return a instanceof Array ? math.matrix(a) : a
}

Date.prototype.toTemporalInstant = toTemporalInstant

let omap = _.map.bind(_)
_.map = (x, f)=> math.isMatrix(x) || x instanceof Map ? x.map(f) : omap(x, f)

sh.config.fatal = true

// export * as fs from 'fs'
export * as fsp from 'fs/promises'
export * as $C from 'js-combinatorics'
export * as itr from 'iter-tools-es'
export {default as chalk} from 'chalk'
export * as path from 'path'
export {default as voca} from 'voca'
export {default as RE2} from 're2'
export * as __ from 'shades'
export * as rust from '@molarmanful/lin-bindings'

export {_, Temporal, Intl, sh, math}
export {default as parse} from './parser.js'
export {default as unesc} from './unesc.js'
export {default as INTRP} from './int.js'
export {default as SL} from './stdlib.js'
export {DOT, DOTS} from './stdlib/dot.js'
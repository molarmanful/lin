import {SL} from '../bridge.js'

let DOT = {}
let DOTS = {}

// `lns`
DOT["."] = SL.lns

// `(...) '`
DOT["("] = $=> {
  $.apos = 1
  SL["("]($)
}

// `dup`
DOT["+"] = SL.dup

// `dups`
DOT["*"] = SL.dups

// `over`
DOT["+_"] = SL.over

// `pop`
DOT["-"] = SL.pop

// `nip`
DOT["-_"] = SL.nip

// `clr`
DOT["_"] = SL.clr

// `swap`
DOT["~"] = SL.swap

// `rot`
DOT["@"] = SL.rot

// `rot_`
DOT["@_"] = SL.rot_

// `range`
DOT["->"] = SL.range

// `rango`
DOT[">"] = SL.rango

// `orang`
DOT["<"] = SL.orang

// `map`
DOT["'"] = SL.map

// `mapf`
DOT["',"] = SL.mapf

// `fold`
DOT["/"] = SL.fold

// `folda`
DOT["/+"] = SL.fold

// `scan`
DOT["\\"] = SL.scan

// `scana`
DOT["\\+"] = SL.fold

// `filter`
DOT["#"] = SL.filter

// `any`
DOT["|"] = SL.any

// `all`
DOT["&"] = SL.all

// `find`
DOT[":"] = SL.find

// `findi`
DOT["#:"] = SL.findi

// `sort`
DOT["'>"] = SL.sort

// `sortc`
DOT["'>>"] = SL.sortc

// `zip`
DOT[","] = SL.zip

// `wrap`
DOT["$"] = SL.wrap

// `enclose`
DOT["$$"] = SL.enclose

// `wrap_`
DOT["$_"] = SL.wrap_

// `usurp`
DOT["$$_"] = SL.usurp

// `2e@`
DOT[";"] = $=> $.exec('2e@', 1)

// `2_ e@`
DOT[";;"] = $=> $.exec('2_ e@', 1)

// `mat`
DOT["^"] = SL.mat

// `mat_`
DOT["^_"] = SL.mat_

// `%craft`
DOT["%"] = SL['%craft']

// `"..." cp`
DOTS["cp"] = SL.cp

// `"..." cp`
DOTS["cp"] = SL.cp

// `"..." ls`
DOTS["ls"] = SL.ls

// `"..." test`
DOTS["test"] = SL.test

// `"..." ?!`
DOTS["?!"] = SL['?!']

// `"..." ??`
DOTS["??"] = SL['??']

// `"..." ?`
DOTS["?"] = SL['?']

// `"..." :`
DOTS[":"] = SL[':']

// `"..." sl`
DOTS["#"] = SL['sl']

// `"..." sL`
DOTS["\\"] = SL['sL']

export {DOT, DOTS}
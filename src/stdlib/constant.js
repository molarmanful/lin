import {math, rust, itr, _} from '../bridge.js'

let CONSTANT = {}

// undefined
CONSTANT["$U"] = $=> $.unshift(void 0)

// empty string
CONSTANT["()"] = $=> $.unshift('')

// empty list
CONSTANT["[]"] = $=> $.unshift([])

// empty object
CONSTANT["{}"] = $=> $.unshift(new Map())

// space
CONSTANT["\\"] = $=> $.unshift(' ')

// newline
CONSTANT["n\\"] = $=> $.unshift('\n')

// current line number
CONSTANT["$L"] = $=> $.unshift($.lns.at(-1)[1])

// current package
CONSTANT["$P"] = $=> $.unshift($.lns.at(-1)[0])

// current stack name
CONSTANT["$S"] = $=> $.unshift($.st)

// previous stack name
CONSTANT["$s"] = $=> $.unshift($.iter.at(-1))

// Euler's constant
CONSTANT["$E"] = $=> $.unshift(Math.E)

// Pi
CONSTANT["$Pi"] = $=> $.unshift(Math.PI)

// Infinity
CONSTANT["$I"] = $=> $.unshift(Infinity)

// milliseconds since January 1, 1970 00:00:00.000
CONSTANT["$T"] = $=> $.unshift(Date.now())

// infinite list of whole numbers
CONSTANT["$`"] = $=> $.unshift(itr.range())

// infinite list of primes
CONSTANT["$`P"] = $=> $.unshift(itr.filter(a=> rust.isprime(a + ''), itr.range({start: 2})))

// infinite list of uniformly random numbers between 0 and 1
CONSTANT["$`R"] = $=> $.unshift(itr.map(a=> math.random(), itr.range()))

// uppercase alphabet
CONSTANT["$A"] = $=> $.unshift('ABCDEFGHIJKLMNOPQRSTUVWXYZ')

// lowercase alphabet
CONSTANT["$a"] = $=> $.unshift('abcdefghijklmnopqrstuvwxyz')

// current working directory
CONSTANT["$cwd"] = $=> $.unshift(process.cwd())

export default CONSTANT
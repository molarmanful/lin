import {itr, _} from '../bridge.js'

let CONSTANT = {}

// undefined
CONSTANT["$U"] = $=> $.unshift(undefined)

// empty string
CONSTANT["()"] = $=> $.unshift('')

// empty list
CONSTANT["[]"] = $=> $.unshift([])

// empty object
CONSTANT["{}"] = $=> $.unshift({})

// push space
CONSTANT["\\"] = $=> $.unshift(' ')

// push newline
CONSTANT["n\\"] = $=> $.unshift('\n')

// current line number
CONSTANT["$L"] = $=> $.unshift($.lns[0])

// current stack name
CONSTANT["$S"] = $=> $.unshift($.st)

// Euler's constant
CONSTANT["$E"] = $=> $.unshift(Math.E)

// Pi
CONSTANT["$Pi"] = $=> $.unshift(Math.PI)

// Infinity
CONSTANT["$I"] = $=> $.unshift(Infinity)

// milliseconds since January 1, 1970 00:00:00.000
CONSTANT["time"] = $=> $.unshift(Date.now())

// infinite list of whole numbers
CONSTANT["$`"] = $=> $.unshift(itr.range())

export default CONSTANT
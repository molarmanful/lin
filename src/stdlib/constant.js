import {_, INT as I} from '../bridge.js'

let CONSTANT = {}

// undefined
CONSTANT["$U"] = $=> I.unshift(undefined)

// empty string
CONSTANT["()"] = $=> I.unshift('')

// empty list
CONSTANT["[]"] = $=> I.unshift([])

// empty object
CONSTANT["{}"] = $=> I.unshift({})

// push space
CONSTANT["\\"] = $=> I.unshift(' ')

// push newline
CONSTANT["n\\"] = $=> I.unshift('\n')

// current line number
CONSTANT["$L"] = $=> I.unshift(I.lns[0])

// current stack name
CONSTANT["$S"] = $=> I.unshift(I.st)

// Euler's constant
CONSTANT["$E"] = $=> I.unshift(Math.E)

// Pi
CONSTANT["$Pi"] = $=> I.unshift(Math.PI)

// milliseconds since January 1, 1970 00:00:00.000
CONSTANT["time"] = $=> I.unshift(Date.now())

export default CONSTANT
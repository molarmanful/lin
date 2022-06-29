import {fs, rls, _, INT as I} from '../bridge.js'

let IO = {}

// read file at path given by index 0
IO["read"] = $=> I.unshift(fs.readFileSync(I.shift()) + '')

// write string at index 1 to file at path given by index 0
IO["write"] = $=> fs.writeFileSync(I.shift(), I.shift())

// push user input
IO["in"] = $=> I.unshift(rls.question(''))

// push user input without echoing
IO["inh"] = $=> I.unshift(rls.question('',{hideEchoBack: true, mask: ''}))

// output index 0 to STDOUT
IO["out"] = $=> process.stdout.write('' + I.shift())

// output index 0 as a line to STDOUT
IO["outln"] = $=> process.stdout.write('' + I.shift() + '\n')

export default IO
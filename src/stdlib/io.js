import {fs, rls, _} from '../bridge.js'

let IO = {}

// read file at path given by index 0
IO["read"] = $=> $.unshift(fs.readFileSync($.shift()) + '')

// write string at index 1 to file at path given by index 0
IO["write"] = $=> fs.writeFileSync($.shift(), $.shift())

// push user input
IO["in"] = $=> $.unshift(rls.question(''))

// push user input without echoing
IO["inh"] = $=> $.unshift(rls.question('', {hideEchoBack: true, mask: ''}))

// output index 0 to STDOUT
IO["out"] = $=> process.stdout.write($.str($.shift()))

// output index 0 as a line to STDOUT
IO["outln"] = $=> process.stdout.write($.str($.shift()) + '\n')

export default IO
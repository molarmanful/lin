import {fs, fsp, rls, _, SL} from '../bridge.js'

let IO = {}

// read file at path given by index 0
IO["read"] = $=> $.u1(a=> $.v1(x=> fs.readFileSync($.str(x) + '') + '', a))

// write string at index 1 to file at path given by index 0
IO["write"] = $=> fsp.writeFile($.str($.shift()) + '', $.str($.shift()) + '')

// push user input
IO["in"] = $=> $.unshift(rls.question(''))

// push user input without echoing
IO["inh"] = $=> $.unshift(rls.question('', {hideEchoBack: true, mask: ''}))

// output index 0 to STDOUT
IO["out"] = $=> $.v1(x=> process.stdout.write($.str(x) + ''), $.shift())

// output index 0 as a line to STDOUT
IO["outln"] = $=> $.v1(x=> process.stdout.write($.str(x) + '\n'), $.shift())

// `form outln`
IO["show"] = $=> $.exec('form outln', 1)

// clear TTY
IO["wipe"] = $=> console.clear()

export default IO
// modules
import {fs, INT} from './bridge.js'
import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'

let odefs = [
  {name: 'help', alias: 'h', type: Boolean, description: 'Show this guide.'},
  {name: 'file', alias: 'f', type: String, typeLabel: '<file>', description: 'Execute file (default option).', defaultOption: true},
  {name: 'eval', alias: 'e', type: String, typeLabel: '<code>', description: 'Execute string.'},
  {name: 'verbose', alias: 'v', type: Boolean, description: 'Output detailed debugging info.'},
  // {name: 'itrlim', alias: 'l', type: Number,typeLabel: '<limit>', description: 'Maximum number of items to pretty-print in iterators.'}
]
let opts = commandLineArgs(odefs)

INT.verbose = opts.verbose
// INT.max_itr = opts.itrlim || 10

if(opts.help)
  console.log(commandLineUsage([
    {
      header: 'lin',
      content: 'The little language that could.'
    },
    {
      header: 'Usage',
      content: ['lin <file> [options...]', 'lin [options...]']
    },
    {
      header: 'Options',
      optionList: odefs
    },
    {
      content: ['Made with <3 by Ben Pang (molarmanful).', 'License: MIT', 'Source: {underline https://github.com/molarmanful/lin}']
    }
  ]))

else INT.run(opts.eval || fs.readFileSync(opts.file) + '')
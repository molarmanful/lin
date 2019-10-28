// modules
import {fs, INT} from './bridge.js'

// verbose mode
if(~process.argv.indexOf('-v')) INT.verbose = 1

// help flag
if(~process.argv.indexOf('-h')) console.log(fs.readFileSync('./comp/help.txt') + '')
else {
  let input = process.argv.filter(a=> a[0] != '-')[2]
  INT.lines = (~process.argv.indexOf('-e') ? input : fs.readFileSync(input) + '').split`\n`
  INT.exec(INT.lines[0])
}

parser=require('./lin-peg.js')
sl=require('./stdlib.js')
fs=require('fs')

stack=[]

exec=x=>{
  let lines=x.split`\n`
  lines[0].map(a=>a.big&&sl[a]?sl[a]():stack.push(a))
}

require.main!=module&&(module.exports=this)
process.argv[2]?exec(fs.readFileSync(process.argv[2])):console.log("ERR: no file argument specified")

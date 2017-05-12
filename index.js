#!/bin/env node

parser=require('./lin-peg.js')
sl=require('./stdlib.js')
fs=require('fs')

stack=[]
ln=[0]
ids={}
input=process.argv[process.argv.length-1]

get=x=>stack[(x%stack.length+stack.length)%stack.length]
splice=(x,y=1,z)=>z==[]._?
  stack.splice((x%stack.length+stack.length)%stack.length,y)
:stack.splice((x%stack.length+stack.length)%stack.length,y,z)
shift=x=>stack.shift()
unshift=x=>stack.unshift(x)

exec=x=>{
  parser.parse(x).map(a=>
    a.big&&a[1]&&a[0]=='\\'?
      unshift(a.slice(1))
    :a.big&&a[1]&&a[0]=='#'?
      0
    :a.big&&sl[a]?
      sl[a](x)
    :unshift(a)
  )
}
lne=x=>(exec(lines[ln[0]]),ln.shift())

require.main!=module&&(module.exports=this)
~process.argv.indexOf('-h')?
  console.log(fs.readFileSync('help.txt')+'')
:input?
  (lines=(
    ~process.argv.indexOf('-e')?
      input
    :fs.readFileSync(input)+''
  ).split`\n`,lne(),~process.argv.indexOf('-o')&&console.log(stack))
:console.log("ERR: no input argument specified")

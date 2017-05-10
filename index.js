#!/bin/env node

parser=require('./lin-peg.js')
sl=require('./stdlib.js')
fs=require('fs')

stack=[]
input=process.argv[process.argv.length-1]

exec=x=>{
  parser.parse(x).map(a=>
    a.big&&a[1]&&a[0]=='\\'?
      stack.unshift(a.slice(1))
    :a.big&&a[1]&&a[0]=='#'?
      0
    :a.big&&sl[a]?
      sl[a]()
    :stack.unshift(a)
  )
}

require.main!=module&&(module.exports=this)
~process.argv.indexOf('-h')?
  console.log(fs.readFileSync('help.txt')+'')
:input?
  (exec((lines=(
    ~process.argv.indexOf('-e')?
      input
    :fs.readFileSync(input)+''
  ).split`\n`)[0]),~process.argv.indexOf('-o')&&console.log(stack.join`\n`))
:console.log("ERR: no input argument specified")

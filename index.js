#!/bin/env node

//modules
parser=require('./lin-peg.js')
sl=require('./stdlib.js')
fs=require('fs')
unesc=require('unescape-js')

//variables
stack=[]
ln=[0]
ids={}
input=process.argv[process.argv.length-1]

//convenience functions for stdlib
mod=(x,y)=>(x%y+y)%y
form=x=>stack.map(a=>JSON.stringify(a)).join`\n`
get=x=>stack[mod(x,stack.length)]
splice=(x,y=1,z)=>z==[]._?
  stack.splice(mod(x,stack.length),y)
:stack.splice(mod(x,stack.length),y,z)
shift=x=>stack.shift()||0
unshift=x=>stack.unshift(x)

//exec wrapper for line jumping
lne=x=>(exec(lines[ln[0]]),ln.shift())

//main exec function
exec=x=>{
  x&&x.replace(/\s/g,'')&&parser.parse(x).map(a=>
    //refs
    a.big&&a[1]&&a[0]=='\\'?
      unshift(a.slice(1))
    //ids
    :a.big&&a[1]&&a[0]=='#'?
      0
    //matched functions
    :a.big&&sl[a]?
      sl[a](x)
    //everything else (numbers, unmatched functions)
    :unshift(a)
  )
}

//export as module
require.main!=module&&(module.exports=this)
//help flag
~process.argv.indexOf('-h')?
  console.log(fs.readFileSync('help.txt')+'')
//read argument
:input?
  (lines=(
    ~process.argv.indexOf('-e')?
      input
    :fs.readFileSync(input)+''
  ).split`\n`,lne())
:console.log("ERR: no input argument specified")

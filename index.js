#!/bin/env node

//modules
parser=require('./lin-peg.js')
sl=require('./stdlib.js')
fs=require('fs')
cp=require('child_process')
unesc=require('unescape-js')
_=require('lodash')

//variables
stack={0:[]}
st=0
lambda=0
paren=[]
ids={}
input=process.argv.filter(a=>a[0]!='-')[2]
iter=[]

//convenience functions for stdlib
id=(x=shift())=>ids[x]||(
  line=lines.find(a=>a.match(`^ *#${x}`)),
  line&&(ids[x]=line.replace(RegExp(`^ *#${x}`),''))
)
loc=(x=shift())=>stack[st].scope[x]||ids[x]||(
  line=lines.find(a=>a.match(`^ *#${x}`)),
  line&&(stack[st].scope[x]=line.replace(RegExp(`^ *#${x}`),''))
)
mod=(x,y)=>(x%y+y)%y
range=(x,y)=>_.range(x,y+Math.sign(y-x),Math.sign(y-x))
form=x=>stack[st].map(a=>a&&a.big?JSON.stringify(a):a).reverse().join`\n`
get=x=>stack[st][mod(x,stack[st].length)]
splice=(x,y=1,z)=>z==[].$?
  stack[st].splice(mod(x,stack[st].length),y)
:stack[st].splice(mod(x,stack[st].length),y,z)
shift=x=>stack[st].shift()
unshift=(...x)=>stack[st].unshift(...x)

//main exec function
exec=x=>{
  x&&x.replace(/\s/g,'')&&parser.parse(x).map(a=>{
    stack[st].scope||(stack[st].scope={})
    lambda?
      (
        a=='('?lambda++:a==')'&&lambda--,
        lambda?paren.push(a):(unshift(paren.join` `),paren=[])
      )
    //refs
    :a.big&&a[1]&&a[0]=='\\'?
      unshift(a.slice(1))
    //ids
    :a.big&&a[1]&&a[0]=='#'?
      0
    //matched functions
    :a.big&&stack[st].scope[a]?
      exec(stack[st].scope[a])
    :a.big&&ids[a]?
      exec(ids[a])
    :a.big&&sl[a]?
      sl[a]()
    //everything else (numbers)
    :unshift(a)
  })
}

//export as module
require.main!=module&&(module.exports=this)
//help flag
~process.argv.indexOf('-h')?
  console.log(fs.readFileSync('help.txt')+'')
//read argument
:exec((lines=(
  ~process.argv.indexOf('-e')?
    input
  :fs.readFileSync(input)+''
).split`\n`)[0])

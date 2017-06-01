#!/bin/env node

//modules
parser=require('./lin-peg.js')
sl=require('./stdlib.js')
fs=require('fs')
unesc=require('unescape-js')
_=require('lodash')

//variables
stack={0:[]}
st=0
ids={}
input=process.argv[process.argv.length-1]

//convenience functions for stdlib
id=x=>ids[x=shift()]||(
  line=lines.find(a=>(a.match`^ *#([^0-9. ])`||[])[1]==x),
  line&&(ids[x]=line.replace(/^ *#[^0-9. ]/,''))
)
mod=(x,y)=>(x%y+y)%y
range=(x,y)=>_.range(x,y,Math.sign(y-x))
form=x=>stack[st].map(a=>a&&a.big?JSON.stringify(a):a).reverse().join`\n`
get=x=>stack[st][mod(x,stack[st].length)]
splice=(x,y=1,z)=>z==[].$?
  stack[st].splice(mod(x,stack[st].length),y)
:stack[st].splice(mod(x,stack[st].length),y,z)
shift=x=>stack[st].shift()
unshift=(...x)=>stack[st].unshift(...x)

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
      sl[a]()
    //everything else (numbers)
    :unshift(a)
  )
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

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
ln=[0]
ids={}
input=process.argv[process.argv.length-1]

//convenience functions for stdlib
id=x=>ids[x=shift()]||(
  line=lines.find(a=>(a.match`^ *#([^\d. ])`||[])[1]==x),
  line&&(ids[x]=line.replace(/^ *#[^\d. ]/,''))
)
mod=(x,y)=>(x%y+y)%y
form=x=>stack[st].map(a=>JSON.stringify(a)).reverse().join`\n`
get=x=>stack[st][mod(x,stack[st].length)]
range=(x,y)=>_.range(x,y,Math.sign(y-x))
splice=(x,y=1,z)=>z==[].$?
  stack[st].splice(mod(x,stack[st].length),y)
:stack[st].splice(mod(x,stack[st].length),y,z)
shift=x=>stack[st].shift()||0
unshift=(...x)=>stack[st].unshift(...x)

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
    //reps
    :a[0]=='*'&&sl[a.slice(1)]?
      [...Array(shift())].map($=>sl[a.slice(1)](x))
    //matched functions
    :a.big&&sl[a]?
      sl[a](x)
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
:(lines=(
  ~process.argv.indexOf('-e')?
    input
  :fs.readFileSync(input)+''
).split`\n`,lne())

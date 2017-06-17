#!/bin/env node

//modules
parser=require('./lin-peg.js')
sl=require('./stdlib.js')
fs=require('fs')
cp=require('child_process')
unesc=require('unescape-js')
_=require('lodash')
Lazy=require('lazy.js')

//variables
stack={0:[]}
st=0
lambda=0
paren=[]
ids={}
input=process.argv.filter(a=>a[0]!='-')[2]
iter=[]
code=Lazy()

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
form=(x=stack[st],y='\n')=>x.map(a=>a&&a.big?JSON.stringify(a):a&&a.pop?`[ ${form(a,' ')} ]`:a).reverse().join(y)
parse=x=>parser.parse(x.pop?x.join` `:x+'')
get=x=>stack[st][mod(x,stack[st].length)]
splice=(x,y=1,z)=>z==[].$?
  stack[st].splice(mod(x,stack[st].length),y)
:stack[st].splice(mod(x,stack[st].length),y,z)
shift=x=>stack[st].shift()
unshift=(...x)=>stack[st].unshift(...x)
Number.prototype.concat=function(x){return (this+'').concat(x)}

//convenience functions for call stack

addf=(...x)=>code=Lazy([Lazy(x).concat(code.take())]).concat(code.drop())
addc=x=>code=Lazy([Lazy(x)]).concat(code)

//main exec function
exec=(x,y)=>{
  x+=''
  //reuse stack frame
  if(y){
    addf(...parse(x))
  }
  //new stack frame
  else{
    addc(parse(x))
    var a,b
    while(code.head()!=[]._&&code.head().head()!=[]._){
      b=code.head()
      a=b.head()
      code=code.drop()
      addc(b.drop())
      //initialize scope if necessary
      stack[st].scope||(stack[st].scope={})

      //for internal JS calls from commands
      a.call?
        a()
      //lambda mode
      :lambda?
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
      //empty strings
      :a.big&&!a?
        0
      //matched functions
      :a.big&&stack[st].scope[a]?
        exec(stack[st].scope[a],1)
      :a.big&&ids[a]?
        exec(ids[a],1)
      :a.big&&sl[a]?
        sl[a]()
      //everything else (numbers)
      :unshift(a)
    }
    code=code.drop()
  }
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

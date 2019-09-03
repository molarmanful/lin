#!/usr/bin/env node

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
idls={}
input=process.argv.filter(a=>a[0]!='-')[2]
iter=[]
code=[]
verbose=0
lns=[0]

//convenience functions for stdlib
id=(x=shift(),y,line)=>{
  y=RegExp(`^ *#${x}`)
  line=lines.findIndex(a=>a.match(y))
  ~line&&(
    ids[x]=lines[line].replace(y,''),
    idls[x]=line
  )
}
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
addc=x=>(code.unshift([]),addf(...x))
addf=(...x)=>code[0]=x.reduceRight((a,b)=>[b,A=>a],code[0])
getf=x=>(x=code[0][0],code[0]=code[0][1](),x)

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
    while(code[0]&&code[0].length){
      verbose&&!lambda&&['--->',code[0][0]+`{${lns[0]}}`,'---'].map(a=>console.log(a))

      a=getf()

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
      :a.big&&ids[a]?
        (
          idls[a]!=[]._&&lns.unshift(idls[a]),
          code[0].length&&addf(a=>lns.shift()),
          exec(ids[a],1)
        )
      :a.big&&sl[a]?
        sl[a]()
      //everything else (numbers)
      :a.toFixed?
        unshift(a)
      :0

      verbose&&!lambda&&[form(),'>---'].map(a=>console.log(a))
    }
    code.shift()
  }
}

//export as module
require.main!=module&&(module.exports=this)
//verbose mode
~process.argv.indexOf('-v')&&(verbose=1)
//help flag
~process.argv.indexOf('-h')?
  console.log(fs.readFileSync('help.txt')+'')
//read argument
:exec((lines=(
  ~process.argv.indexOf('-e')?
    input
  :fs.readFileSync(input)+''
).split`\n`)[0])

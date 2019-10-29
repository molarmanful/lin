// modules
import {parse, SL} from './bridge.js'

let INT = {}

// variables
INT.stack = {0: []}
INT.st = 0
INT.lambda = 0
INT.paren = []
INT.ids = {}
INT.idls = {}
INT.iter = []
INT.code = []
INT.verbose = 0
INT.lns = [0]
INT.scope = []
INT.objs = []
INT.lines = ''

// convenience functions for stdlib

INT.id = (x=INT.shift())=>{
  let y = RegExp(`^ *#${x}`)
  let line = INT.lines.findIndex(a=> a.match(y))
  if(~line){
    INT.ids[x] = INT.lines[line].replace(y, '')
    INT.idls[x] = line
  }
}

INT.getscope = (x=INT.shift())=>{
  let y = INT.scope.find(a=> a[x])
  return y ? y[x] : INT.ids[x]
}

INT.mod = (x,y)=> (x % y + y) % y

INT.range = (x,y)=>{
  let res = [x]
  let dir = Math.sign(y - x)
  let c = Math.abs(y - x) - 1
  while(c){
    x += dir
    res.push(x)
    c--
  }
  return res
}

INT.form = (x=INT.stack[INT.st],y='\n')=>
  x.map(a=>
    a && a.big ?
      JSON.stringify(a)
    : a && a.pop ?
      `[ ${INT.form(a, ' ')} ]`
    : a && typeof a == 'object' ?
      `{ ${
        Object.keys(a).map(b=> INT.form([b]) + ':' + INT.form([a[b]])).join` `
      } }`
    : a
  ).reverse().join(y)

INT.parse = x=> parse(x.pop ? x.join` ` : x + '')
INT.get = x=> INT.stack[INT.st][INT.mod(x, INT.stack[INT.st].length)]
INT.splice = (x,y=1,z)=> INT.stack[INT.st].splice(INT.mod(x, INT.stack[INT.st].length), y)
INT.shift = x=> INT.stack[INT.st].shift()
INT.unshift = (...x)=> INT.stack[INT.st].unshift(...x)
INT.concat = (x, y)=> (x + '').concat(y)

// convenience functions for call stack

INT.addc = x=>{
  INT.code.unshift([])
  INT.addf(...x)
}
INT.addf = (...x)=>{
  INT.code[0] = x.reduceRight((a,b)=> [b, A=> a], INT.code[0])
}
INT.getf = _=>{
  let x = INT.code[0][0]
  INT.code[0] = INT.code[0][1]()
  return x
}

// main exec function
INT.exec = (x,y)=>{
  x += ''

  // reuse stack frame
  if(y){
    INT.addf(...INT.parse(x))
  }

  // new stack frame
  else {
    INT.addc(INT.parse(x))

    while(INT.code[0] && INT.code[0].length){

      // verbose mode
      if(INT.verbose && !INT.lambda){
        [
          '--->',
          INT.code[0][0] + `{${INT.lns[0]}}`,
          '---'
        ].map(a=> console.log(a))
      }

      let a = INT.getf()

      // for internal JS calls from commands
      if(a.call){
        a()
      }

      // lambda mode
      else if(INT.lambda){
        if(a == '(') INT.lambda++
        else if(a == ')') INT.lambda--, INT.scope.shift()

        if(INT.lambda) INT.paren.push(a)
        else INT.unshift(INT.paren.join` `), INT.paren = []
      }

      else if(a.big){

        // refs
        if(a[1] && a[0] == '\\') INT.unshift(a.slice(1))

        // matched functions
        else if(INT.ids[a]){
          if(INT.idls[a] !== undefined) INT.lns.unshift(INT.idls[a])
          if(INT.code[0].length) INT.addf(a=>{INT.lns.shift(); INT.scope.shift()})
          INT.scope.unshift({})
          INT.exec(INT.ids[a], 1)
        }

        // stdlib functions
        else if(SL[a]) SL[a]()

      }

      // numbers
      else if(a.toFixed) INT.unshift(a)

      // verbose mode
      if(INT.verbose && !INT.lambda){
        [
          INT.form(),
          '>---'
        ].map(a => console.log(a))
      }

    }

    INT.code.shift()
  }
}

export {INT}

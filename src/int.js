// modules
import {dec, parse, SL} from './bridge.js'

let INT = {}

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

INT.mod = (x,y)=> dec.mod(dec.add(dec.mod(x, y), y), y)

INT.range = (x,y)=>{
  let res = [x]
  let dir = dec.sign(y - x)
  let c = dec.abs(y - x) - 1
  while(c > 0){
    x -= -dir
    res.push(x)
    c--
  }
  return res
}

INT.tru = x=> x.toFixed ? x != 0 : x

INT.form = (x=INT.stack[INT.st],y='\n')=>
  x.map(a=>
    a && a.toFixed ?
      +a
    : a && a.big ?
      JSON.stringify(a)
    : a && a.pop ?
      `[ ${INT.form(a, ' ')} ]`
    : a && typeof a == 'object' ?
      `{ ${
        Object.keys(a).map(b=> INT.form([b]) + ': ' + INT.form([a[b]])).join` `
      } }`
    : a == undefined ?
      'UNDEF'
    : a
  ).reverse().join(y)

INT.parse = x=> parse(x.pop ? x.join` ` : x + '')
INT.get = x=>{
  let g = INT.stack[INT.st][INT.mod(x, INT.stack[INT.st].length)]
  return g.slice ? g.slice() : g
}
INT.splice = (x,y=1,z,w=0)=>
  z != undefined ?
    INT.stack[INT.st].splice(INT.mod(x, INT.stack[INT.st].length + w), y, z)
  : INT.stack[INT.st].splice(INT.mod(x, INT.stack[INT.st].length + w), y)

INT.shift = x=> INT.stack[INT.st].shift()
INT.unshift = (...x)=> INT.stack[INT.st].unshift(...x)
INT.concat = (x, y)=> (x + '').concat(y)

INT.each = (f=$=>{},g=$=>{})=>{
  let X = INT.shift()
  let O = INT.stack[INT.st].slice()
  INT.stack[INT.st] = []
  INT.iter.unshift(INT.st)
  INT.addf(a=>{
    delete INT.stack[INT.iter[0] + ' ']
    INT.st = INT.iter.shift()
    g()
  })
  O.map((a,i)=>
    INT.addf(
      $=>{
        INT.st = INT.iter[0] + ' '
        INT.stack[INT.st] = [a]
      },
      ...INT.parse(X),
      $=> f(a, i)
    )
  )
}

INT.acc = (f=$=>{},g=$=>{})=>{
  let X = INT.shift()
  let Y = INT.shift()
  INT.iter.unshift(INT.st)
  INT.addf(a=>{
    delete INT.stack[INT.iter[0] + ' ']
    INT.st = INT.iter.shift()
    g(Y)
  })
  INT.stack[INT.st].map((a,i)=>
    INT.addf(
      $=>{
        INT.st = INT.iter[0] + ' '
        INT.stack[INT.st] = [a, Y]
      },
      ...INT.parse(X),
      $=>{
        Y = f(a, Y, i)
      }
    )
  )
}

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

//initialize everything
INT.run = x=>{
  INT.stack = {0: []}
  INT.st = 0
  INT.lambda = 0
  INT.paren = []
  INT.ids = {}
  INT.idls = {}
  INT.iter = []
  INT.code = []
  INT.verbose = INT.verbose || 0
  INT.lns = [0]
  INT.scope = []
  INT.objs = []
  INT.lines = x.split`\n`

  INT.exec(INT.lines[0])
}

export {INT}

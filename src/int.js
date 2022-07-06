// modules
import {chalk, itr, _, parse, SL} from './bridge.js'

let INT = {}

// convenience functions for stdlib

INT.print = x=> (console.log(x), x)

INT.id = x=>{
  let y = RegExp(`^ *#${x}`)
  let line = INT.lines.findIndex(a=> a.match(y))
  if(~line){
    INT.ids[x] = INT.lines[line].replace(y, '')
    INT.idls[x] = line
  }
}

INT.getscope = x=>{
  let y = INT.scope.find(a=> x in a)
  return y ? y[x] : INT.ids[x]
}

INT.mod = (x, y)=> (x % y + y) % y

INT.range = (x, y)=>{
  let res = [x]
  let dir = Math.sign(y - x)
  let c = Math.abs(y - x) - 1
  while(c > 0){
    x -= -dir
    res.push(x)
    c--
  }
  return res
}

INT.tru = x=> x

INT.str = x=>
  x?.pop ? INT.str(x).reverse().join` `
  : INT.isitr(x) ? '[...]`'
  : _.isObjectLike(x) ? _.map((a, i)=> i + str(a)).join` `
  : x

INT.form = (x=INT.stack[INT.st], y='\n')=>
  x.map(a=>
    a == Infinity ? '$I'
    : a && typeof a == 'bigint' ? a + 'N'
    : a?.toFixed ?
      a < 0 ? -a + '_' : a + ''
    : a?.big ? JSON.stringify(a)
    : a?.pop ?
      a.length ?
        `[ ${INT.form(a, ' ')} ]`
      : '[]'
    : a && INT.isitr(a)? '[...]`'
    : _.isObjectLike(a) ?
      _.keys(a).length ?
        `{ ${
          _.keys(a).map(b=> INT.form([b]) + ': ' + INT.form([a[b]])).join` `
        } }`
      : '{}'
    : a == undefined ? '$U'
    : a
  ).reverse().join(y)

INT.parse = x=> parse(x.pop ? x.join` ` : x + '')

INT.gind = (o, x)=>
  _.isObjectLike(x) ? _.map(x, a=> INT.gind(o, a))
  : o.at && !isNaN(+x) ? (o.pop ? a=> a : _.reverse)(o.at(typeof x == 'bigint' ? Number(x) : x))
  : o[x]

INT.get = x=> INT.gind(INT.stack[INT.st], x)

INT.splice = (x, y=1, z, w=0)=>
  z != undefined ?
    INT.stack[INT.st].splice(INT.mod(x, INT.stack[INT.st].length + w), y, z)
  : INT.stack[INT.st].splice(INT.mod(x, INT.stack[INT.st].length + w), y)

INT.shift = x=> _.cloneDeep(INT.stack[INT.st].shift())

INT.unshift = (...x)=> INT.stack[INT.st].unshift(...x)

INT.each = (O, f=_.map, s=false, g=x=> x)=>{
  let X = INT.shift()
  return f(O, (a, i)=>{
    INT.iter.unshift(INT.st)
    INT.st = INT.iter[0] + ' '
    INT.stack[INT.st] = s && itr.isIterable(a) ? [...a] : [a]
    INT.exec(X)
    let A = INT.shift()
    delete INT.stack[INT.iter[0] + ' ']
    INT.st = INT.iter.shift()
    return g(A)
  })
}

INT.acc = (O, ac=false, f=_.reduceRight, g=x=> x)=>{
  let X = INT.shift()
  let Y = ac && INT.shift()
  let F = (a, b)=>{
    INT.iter.unshift(INT.st)
    INT.st = INT.iter[0] + ' '
    INT.stack[INT.st] = [b, a]
    INT.exec(X)
    let A = INT.shift()
    delete INT.stack[INT.iter[0] + ' ']
    INT.st = INT.iter.shift()
    return g(A, a)
  }
  return ac ? f(O, F, Y) : f(O, F)
}

INT.cmp = (O, f=(x, f)=> x.sort(f), g=x=> x)=>{
  let X = INT.shift()
  return f(O, (a, b)=>{
    INT.iter.unshift(INT.st)
    INT.st = INT.iter[0] + ' '
    INT.stack[INT.st] = [b, a]
    INT.exec(X)
    let A = INT.shift()
    delete INT.stack[INT.iter[0] + ' ']
    INT.st = INT.iter.shift()
    return g(A)
  })
}

INT.isitr = x=> !x?.length && itr.isIterable(x)

INT.listitr = x=>
  !x?.pop && x?.length ? itr.map(a=> a.reverse(), x)
  : INT.isitr(x) ? x
  : (x?.big ? x=> x: itr.reverse)(itr.wrap(['number', 'bigint'].includes(typeof x) ? [x] : x))

INT.listitrs = x=>
  !x?.pop && x?.length ? INT.listitr(x)
  : INT.isitr(x) || x?.big ? x
  : x.pop ? INT.listitr(_.map(x, INT.listitrs))
  : x

INT.itrls = x=> itr.toArray(itr.reverse(x))

INT.itrlist = x=> INT.itrls(itr.map(a=> INT.isitr(a) ? INT.itrlist(a) : a, INT.listitr(x)))

INT.eline = x=>{
  if(INT.lines[x]){
    INT.tline(x)
    INT.exec(INT.lines[INT.lns[0]], 1)
  }
}

INT.tline = x=>{
  if(INT.lns.includes(x)){
    INT.lns = _.dropWhile(INT.lns, a=> a != x)
  }
  else {
    INT.lns.unshift(x)
    if(INT.code[0][0] || INT.code[1]) INT.addf(a=> INT.lns.shift())
  }
}

// convenience functions for call stack

INT.addc = x=>{
  INT.code.unshift([])
  INT.addf(...x)
}

INT.addf = (...x)=>{
  INT.code[0] = x.reduceRight((a,b)=> [b, ...a], INT.code[0])
}

INT.getf = _=>{
  let x = INT.code[0][0]
  INT.code[0] = INT.code[0].slice(1)
  return x
}

// main exec function
INT.exec = (x, y)=>{
  x += ''

  // reuse stack frame
  if(y){
    INT.addf(...INT.parse(x))
  }

  // new stack frame
  else {
    INT.addc(INT.parse(x))

    while(INT.code[0]?.length){

      // verbose mode
      if(INT.verbose && !INT.lambda){
        // console.log(INT.code.map(a=> a.map(b=> b+'')));
        [
          chalk.gray.dim(`———>{C:${INT.code.map(a=> a.length).join` `}}{L:${INT.lns.join` `}}{S:${(INT.st + '').replace(/\n/g, '\\n')}}`),
          chalk.greenBright(INT.code[0][0]),
          chalk.gray.dim('———')
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
        else if(a == ')') INT.lambda--
        else if(!a.match(/[^)]/g)) INT.lambda -= a.length

        if(INT.lambda > 0) INT.paren.push(a)
        else SL[')']()
      }

      // numbers
      else if(!isNaN(+a)) INT.unshift(a > Number.MAX_SAFE_INTEGER ? BigInt(a.replace(/\.\d*$/, '')) : Number(a))

      else {

        // magic dot
        if(INT.gl){
          INT.gl = 0
          INT.unshift(a)
          if(a[1] && a[0] == '#'){
            INT.unshift(INT.shift().slice(1))
            SL[INT.objs.length ? ':' : 'sl']()
          }
          if(a[1] && a[0] == '\\'){
            INT.unshift(INT.shift().slice(1))
            SL.sL()
          }
          else SL.gl()
        }

        // ignore hashes
        else if(a[1] && a[0] == '#'){}

        // brackets/parens only
        else if(a.match(/^[()\[\]{}]{2,}$/)) INT.exec(a.split``.join` `,1)

        // refs
        else if(a[1] && a[0] == '\\') INT.unshift(a.slice(1))

        // matched functions
        else if(a in INT.ids){
          if(a in INT.idls) INT.tline(INT.idls[a])
          INT.exec(INT.ids[a], 1)
        }

        // stdlib functions
        else if(a in SL) SL[a]()

        else throw `unknown function "${a}"`
      }

      // verbose mode
      if(INT.verbose && !INT.lambda){
        [
          INT.form(),
          chalk.gray.dim('>———')
        ].map(a => console.log(a))
      }

    }

    INT.code.shift()
  }
}

//initialize everything
INT.run = (x, lim=10)=>{
  INT.stack = {0: []}
  INT.st = 0
  INT.gl = 0
  INT.lambda = 0
  INT.paren = []
  INT.ids = {}
  INT.idls = {}
  INT.iter = []
  INT.code = []
  INT.verbose = INT.verbose || 0
  INT.lns = [0]
  INT.scope = []
  INT.scoped = 0
  INT.objs = []
  INT.lines = x.split`\n`
  // INT.max_itr = lim

  INT.exec(INT.lines[0])
}

export default INT
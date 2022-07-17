import {chalk, fs, rls, itr, _, path, parse, SL} from './bridge.js'

class PKG {
  constructor(n, f){
    this.name = n
    this.file = f
    this.ids = _.cloneDeep(SL)
    this.idls = {}
    this.lines = []
  }
}

class INTRP {

  constructor(x, file=0, opts={}){
    this.stack = {0: []}
    this.st = 0
    this.gl = 0
    this.lambda = 0
    this.paren = []
    this.ids = _.cloneDeep(SL)
    this.idls = {}
    this.lines = x.split`\n`
    this.lns = [[0, 0]]
    this.iter = []
    this.code = []
    this.verbose = opts.verbose
    this.step = opts.step
    this.scope = []
    this.scoped = 0
    this.objs = []
    this.file = file && this.mresolve(file)
    this.PKG = PKG
    this.pkg = []
    this.pkf = []

    this.exec(this.lines[0])
  }

  exec(x, y){
    if(this.isarr(x)) x = x.join` ` 
    else if(!this.isstr(x)) x += ''

    let orig = x.orig
    x = x.split`\n`[0]

    if(orig?.file == this.file && this.pkf.at(-1) && orig?.file != this.pkf.at(-1)?.file){
      this.addf($=> this.pkf.pop())
      this.pkf.push(0)
    }

    if(orig) this.tline(orig.line, 1)

    // reuse stack frame
    if(y) this.addf(...this.parse(x))

    // new stack frame
    else {
      this.addc(this.parse(x))

      while(this.code[0]?.length){

        if(this.step) console.clear()

        // verbose mode
        if(this.verbose && !this.lambda){
          // console.log(this.code.map(a=> a.map(b=> b+'')));
          [
            chalk.gray.dim(`———>{C:${this.code.map(a=> a.length).join` `}}{L:${this.lns.map(([a, b])=> this.mname(a) + ' ' + b).join`;`}}{S:${(this.st + '').replace(/\n/g, '\\n')}}`),
            chalk.greenBright(this.code[0][0]),
            chalk.gray.dim('———')
          ].map(a=> console.log(a))
        }

        let a = this.getf()

        // for internal JS calls from commands
        if(this.isfun(a)) a()

        // lambda mode
        else if(this.lambda){
          if(a.match(/^[()\[\]{}]+$/))
            this.lambda += (a.match(/\(/g) || []).length - (a.match(/\)/g) || []).length

          if(this.lambda > 0) this.paren.push(a)
          else SL[')'](this)
        }

        // numbers
        else if(this.isnum(+a)) this.unshift(+a > Number.MAX_SAFE_INTEGER ? BigInt(a.replace(/\.\d*$/, '')) : +a)

        else {
          // pkg call
          if(this.pkg.at(-1)){
            let {name, file, ids, idls} = this.pkg.at(-1)
            if(!(a in ids)) throw `unknown pkg fn "${name} ${a}"`
            this.addf($=> this.pkf.pop())
            this.pkf.push(this.pkg.pop())
            if(ids[a] instanceof PKG){
              this.pkg.push(ids[a])
            }
            else {
              if(a in idls) this.tline(idls[a])
              this.exec(ids[a], 1)
            }
          }

          // magic dot
          else if(this.gl){
            this.gl = 0
            this.unshift(a)
            if(a == '.') this.shift(), SL.lns(this)
            else if(a[1] && a[0] == '#'){
              this.unshift(this.shift().slice(1))
              SL[this.objs.length ? ':' : 'sl'](this)
            }
            else if(a[1] && a[0] == '\\'){
              this.unshift(this.shift().slice(1))
              SL.sL(this)
            }
            else SL.gl(this)
          }

          // ignore hashes
          else if(a[1] && a[0] == '#'){}

          // brackets/parens only
          else if(a.match(/^[()\[\]{}]{2,}$/)) this.exec(a.split``.join` `,1)

          // refs
          else if(a[1] && a[0] == '\\') this.unshift(a.slice(1))

          // matched pkg functions
          else if(this.pkf.at(-1)){
            if(a in this.pkf.at(-1).ids) this.fmatch(a, this.pkf.at(-1))
            else throw `unknown fn "${a}" in pkg "${this.pkf.at(-1).name}"`
          }

          // matched functions
          else if(a in this.ids) this.fmatch(a, this)

          else throw `unknown fn "${a}"`
        }

        // verbose mode
        if(this.verbose && !this.lambda){
          [
            this.form(this.stack[this.st]),
            chalk.gray.dim('>———')
          ].map(a => console.log(a))
        }

        if(this.step && !this.lambda) if(rls.question("[ENTER to continue, a + ENTER to auto-step]") == 'a') this.step = 0
      }

      this.code.shift()
    }
  }

  strtag(x, l){
    if(this.isstr(x) && !x?.orig){
      let X = new String(x)
      X.orig = {file: this.file, line: l || this.lns.at(-1)}
      return X
    }
    return x
  }

  untag(x){ return this.isstr(x) ? x + '' : x }

  fmatch(a, ctx){
    if(ctx.ids[a] instanceof PKG) this.pkg.push(ctx.ids[a])
    else if(ctx.ids[a] instanceof Function && a in SL) SL[a](this)
    else {
      if(a in ctx.idls) this.tline(ctx.idls[a])
      this.exec(ctx.ids[a], 1)
    }
  }

  print(x){ console.log(x); return x }

  id(x){
    let y = RegExp(`^ *#${x}`)
    let line = this.lines.findIndex(a=> a.match(y))
    if(~line){
      this.ids[x] = this.lines[line].replace(y, '')
      this.idls[x] = line
    }
  }

  getscope(x){
    let y = _.findLast(this.scope, a=> x in a)
    return y ? y[x] : this.ids[x]
  }

  mod(x, y){ return (x % y + y) % y }

  range(x, y){
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

  tru(x){ return x != '' && x }

  str(x){
    if(this.isstr(x) && x?.orig) return x
    return this.isstr(x) ? this.strtag(x + '')
      : this.isarr(x) ? x.join` `
      : this.isitr(x) ? '[...]`'
      : this.isobj(x) ? _.map(x, (a, i)=> i + this.str(a)).join` `
      : this.strtag(x + '')
  }

  form(x, y='\n'){
    let M = a=>{
      if(a?.orig){
        let m = this.mname(a.orig.file)
        let l = a.orig.line[1]
        return a.file == this.file ? `_(${m} ${l})` : `_${l}`
      }
      return ''
    }
    return x.map(a=>
      a == Infinity ? '$I'
      : typeof a == 'bigint' ? a + 'N'
      : this.isnum(a) ?
        a < 0 ? -a + '_' : a + ''
      : this.isstr(a) ? JSON.stringify(a + '') + M(a)
      : this.isarr(a) ?
        a.length ?
          `[ ${this.form(a, ' ')} ]`
        : '[]'
      : a instanceof Map ? this.print(a) &&
        a.size ?
          `{ ${Array.from(a, ([b, i])=> `${this.form([b])}=>${this.form([i])}`).join` `} }`
        : '{}'
      : this.isitr(a) ? '[...]`'
      : a == undefined ? '$U'
      : a
    ).join(y)
  }

  parse(x){ return parse(this.isarr(x) ? x.join` ` : x + '') }

  gind(o, x){
    return o.at && this.isnum(+x) ? o.at(this.isarr(o) ? Number(x) : x)
      : this.isobj(x) ? _.map(x, a=> this.gind(o, a))
      : o.get(x)
  }

  get(x){ return this.gind(this.stack[this.st], ~x) }

  splice(x, y=1, z){
    return z != undefined ? this.stack[this.st].splice(~x, y, z) : this.stack[this.st].splice(~x, y)
  }

  shift(){ return _.cloneDeep(this.strtag(this.stack[this.st].pop())) }

  unshift(...x){ return this.stack[this.st].push(...x.map(a=> this.strtag(a))) }

  each(O, f=_.map, s=false, g=x=> x){
    let X = this.shift()
    return f(O, (a, i)=>{
      this.iter.push(this.st)
      this.st = this.iter.at(-1) + ' '
      this.stack[this.st] = s && itr.isIterable(a) ? [...a] : [a]
      this.exec(X)
      let A = this.shift()
      delete this.stack[this.iter.at(-1) + ' ']
      this.st = this.iter.pop()
      return g(A)
    })
  }

  acc(O, ac=false, f=_.reduce, g=x=> x){
    let X = this.shift()
    let Y = ac && this.shift()
    let F = (a, b)=>{
      this.iter.push(this.st)
      this.st = this.iter.at(-1) + ' '
      this.stack[this.st] = [b, a]
      this.exec(X)
      let A = this.shift()
      delete this.stack[this.iter.at(-1) + ' ']
      this.st = this.iter.pop()
      return g(A, a)
    }
    return ac ? f(O, F, Y) : f(O, F)
  }

  cmp(O, f=(x, f)=> x.sort(f), g=x=> x){
    let X = this.shift()
    return f(O, (a, b)=>{
      this.iter.push(this.st)
      this.st = this.iter.at(-1) + ' '
      this.stack[this.st] = [b, a]
      this.exec(X)
      let A = this.shift()
      delete this.stack[this.iter.at(-1) + ' ']
      this.st = this.iter.pop()
      return g(A)
    })
  }

  *gen(f, a){
    while(true){
      yield a
      this.iter.push(this.st)
      this.st = this.iter.at(-1) + ' '
      this.stack[this.st] = [a]
      this.exec(f)
      a = this.shift()
      delete this.stack[this.iter.at(-1) + ' ']
      this.st = this.iter.pop()
    }
  }

  isarr(x){ return _.isArray(x) }

  isarl(x){ return _.isArrayLike(x) }

  isstr(x){ return _.isString(x) }

  isitr(x){ return x && !this.isarl(x) && itr.isIterable(x) }

  isobj(x){ return _.isObjectLike(x) }

  isnum(x){ return typeof x == 'bigint' || (_.isNumber(x) && !isNaN(x)) }

  isfun(x){ return _.isFunction(x) }

  listitr(x){
    return !this.isarl(x) && this.isnum(x?.length) ? itr.wrap(x)
      : this.isitr(x) ? x
      : itr.wrap(this.isnum(x) ? [x] : x)
  }

  listitrs(x){
    return !this.isarl(x) && this.isnum(x?.length) ? this.listitr(x)
      : this.isitr(x) || this.isstr(x) ? x
      : this.isarr(x) ? this.listitr(_.map(x, this.listitrs))
      : x
  }

  itrls(x){ return itr.toArray(x) }

  itrlist(x){ return this.itrls(itr.map(a=> this.isitr(a) ? this.itrlist(a) : a, this.listitr(x))) }

  mresolve(x){ return path.resolve(process.cwd(), x) }

  mname(x){ try { return path.basename(x, path.extname(x)) } catch(e){ return x } }

  gline(x){ return this.pkf.at(-1)?.lines[x] || this.lines[x] }

  eline(x){
    let l = this.lns.at(-1)[1] - -x
    if(this.gline(l)){
      this.tline(l)
      this.exec(this.gline(l), 1)
    }
  }

  tline(l, r=0){
    l = r ? l : [this.pkf.at(-1)?.file || 0, l]
    if(this.lns.some(a=> _.isEqual(l, a))){
      this.lns = _.dropRightWhile(this.lns, a=> !_.isEqual(l, a))
    }
    else {
      if(this.code[0][0] || this.code[1]) this.addf($=> this.lns.pop())
      this.lns.push(l)
    }
  }

  addc(x){
    this.code.unshift([])
    this.addf(...x)
  }

  addf(...x){ this.code[0] = x.reduceRight((a,b)=> [b, ...a], this.code[0]) }

  getf(){
    let x = this.code[0][0]
    this.code[0].shift()
    return x
  }
}

export default INTRP
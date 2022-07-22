import {DOT, RE2, unesc, chalk, rls, itr, _, path, parse, SL} from './bridge.js'

class PKG {
  constructor(n, f){
    this.name = n
    this.file = f
    this.ids = _.cloneDeep(SL)
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
    this.lines = x.split`\n`
    this.lns = [[0, 0]]
    this.iter = []
    this.code = []
    this.verbose = opts.verbose
    this.step = opts.step
    this.scope = []
    this.scoped = 0
    this.apos = 0
    this.objs = []
    this.file = file && this.mresolve(file)
    this.PKG = PKG
    this.pkg = []
    this.pkf = []

    this.exec(this.lines[0])
  }

  exec(x, y){

    if(this.isarr(x) || this.ismap(x))
      this.unshift(x.map(a=>
        this.quar($=>{
          this.stack[this.st] = this.stack[this.iter.at(-1)].slice()
          this.exec(a)
          SL.enclose(this)
        })
      ))

    else {
      if(!this.isstr(x)) x += ''

      let orig = x.orig
      x = x.split`\n`[0]

      if(orig && orig[0] == this.file && this.pkf.at(-1) && orig[0] != this.pkf.at(-1)?.file){
        this.addf($=> this.pkf.pop())
        this.pkf.push(0)
      }

      if(orig) this.tline(orig[1], orig[0])

      // reuse stack frame
      if(y) this.addf(...this.parse(x))

      // new stack frame
      else {
        this.addc(this.parse(x))

        while(this.code[0]?.length){
          let a = this.getf()

          if(this.step) console.clear()

          // verbose mode
          if(this.verbose && !this.lambda){
            [
              chalk.gray.dim(`———>{C:${
                  this.code.map(a=> a.length).join` `
                }}{L:${
                  this.lns.map(([a, b])=> this.mname(a) + ' ' + b).join`;`
                }}{S:${
                  (this.st + '').replace(/\n/g, '\\n')
                }}`),
              chalk.greenBright(a),
              chalk.gray.dim('———')
            ].map(a=> console.log(a))
          }

          // for internal JS calls from commands
          if(this.isfun(a)) a()

          // lambda mode
          else if(this.lambda){
            if(a.match(/^[()\[\]{}]+$/))
              this.lambda += (a.match(/\(/g) || []).length - (a.match(/\)/g) || []).length
            if(this.lambda > 0) this.paren.push(a)
            else SL[')'](this)
          }

          // pkg mode
          else if(this.pkg.at(-1)){
            let {name, file, ids} = this.pkg.at(-1)
            if(!(a in ids)) this.err(`unknown pkg fn "${name} ${a}"`)
            this.addf($=> this.pkf.pop())
            this.pkf.push(this.pkg.pop())
            this.fmatch(a, this.pkf.at(-1))
          }

          // literals
          else if(a?.[0] == '"'){
            if(this.gl){
              this.gl = 0
              a = unesc(a)
            }
            this.unshift(a.slice(1, a.slice(-1) == '"' ? -1 : undefined))
          }

          // numbers
          else if(this.isnum(+a)){
            this.unshift(+a > Number.MAX_SAFE_INTEGER ? BigInt(a.replace(/\.\d*$/, '')) : +a)
          }

          else {

            // brackets/parens only
            if(a.match(/^[()\[\]{}]{2,}$/)) this.exec(a.split``.join` `,1)

            // magic dot
            else if(this.gl){
              this.gl = 0
              if(a in DOT){
                DOT[a](this)
              }

              else if(a.slice(0, 2) == '?!'){
                this.unshift(a.slice(2))
                SL['?!'](this)
              }

              else if(a.slice(0, 2) == '??'){
                this.unshift(a.slice(2))
                SL['??'](this)
              }

              else if(a[0] == '?'){
                this.unshift(a.slice(1))
                SL['?'](this)
              }

              else if(a[1] && a[0] == ':'){
                this.unshift(a.slice(1))
                SL[':'](this)
              }

              else if(a[1] && a[0] == '#'){
                this.unshift(a.slice(1))
                SL.sl(this)
              }

              else if(a[1] && a[0] == '\\'){
                this.unshift(a.slice(1))
                SL.sL(this)
              }

              else {
                this.unshift(a)
                SL.gl(this)
              }
            }

            // ignore hashes
            else if(a[1] && a[0] == '#'){}

            // refs
            else if(a[1] && a[0] == '\\') this.unshift(a.slice(1))

            // matched functions
            else if(a in this.ids) this.fmatch(a, this)

            else this.err(`unknown fn "${a}"`)
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
  }

  err(x){
    console.error(chalk.redBright(`ERR: ${x}\nLNS: ${this.form(_.reverse(this.lns),'\n     ')}`))
    process.exit(1)
  }

  warn(x){
    if(this.verbose)
      console.warn(chalk.yellowBright(`WRN: ${x}\nLNS: ${this.form(_.reverse(this.lns),'\n     ')}`))
  }

  u1(f){
    this.unshift(f(this.shift()))
  }

  u2(f, s=1){
    let X = this.shift()
    let Y = this.shift()
    this.unshift(s ? f(Y, X) : f(X, Y))
  }

  u3(f, s=1){
    let X = this.shift()
    let Y = this.shift()
    let Z = this.shift()
    this.unshift(s ? f(Z, Y, X) : f(X, Y, Z))
  }

  v1(f, x){
    if(this.isarr(x) || this.ismap(x))
      return x.map(a=> this.v1(f, a))
    return this.prep(f(x))
  }

  v2(f, x, y){
    let isi = a=> this.isarr(a) || this.ismap(a)
    if(isi(x) && isi(y) && x.values().length == y.values().length)
      return x.map((a, i)=> this.v2(f, a, y.get(i)))
    if(isi(x)) return x.map(a=> this.v2(f, a, y))
    if(isi(y)) return y.map(a=> this.v2(f, x, a))
    else return this.prep(f(x, y))
  }

  v3(f, x, y, z){
    let isi = a=> this.isarr(a) || this.ismap(a)
    if(isi(x) && isi(y) && isi(z) && x.values().length == y.values().length && y.values().length == z.values().length)
      return x.map((a, i)=> this.v3(f, a, y.get(i), z.get(i)))
    if(isi(x) && isi(y) && x.values().length == y.values().length)
      return x.map((a, i)=> this.v3(f, a, y.get(i), z))
    if(isi(y) && isi(z) && y.values().length == z.values().length)
      return y.map((a, i)=> this.v3(f, x, a, z.get(i)))
    if(isi(x) && isi(z) && x.values().length == z.values().length)
      return x.map((a, i)=> this.v3(f, a, y, z.get(i)))
    if(isi(x)) return x.map(a=> this.v3(f, a, y, z))
    if(isi(y)) return y.map(a=> this.v3(f, x, a, z))
    if(isi(z)) return z.map(a=> this.v3(f, x, y, a))
    else return this.prep(f(x, y, z))
  }

  prep(x){ return _.isBoolean(x) ? +x : this.strtag(x) }

  strtag(x, l = [0]){
    if(this.isstr(x) && !x?.orig){
      let X = new String(x)
      X.orig = [l[0] || this.file, this.isnum(l[1]) ? 0 | l[1] : this.lns.at(-1)[1]]
      return X
    }
    return x
  }

  untag(x){ return this.isstr(x) ? x + '' : x }

  fmatch(a, ctx){
    if(ctx.ids[a] instanceof PKG) this.pkg.push(ctx.ids[a])
    else if(ctx.ids[a] instanceof Function && a in SL) SL[a](ctx)
    else this.exec(ctx.ids[a], 1)
  }

  print(x){ console.log(x); return x }

  id(x){
    let y = new RE2(`^ *#${x}`)
    let line = this.lines.findIndex(a=> a.match(y))
    if(~line){
      this.ids[x] = this.strtag(this.lines[line].replace(y, ''), [0, line])
    }
  }

  getid(x){
    let y = this.ids[x]
    return this.isfun(y) ? x : y
  }

  getscope(x){
    let y = _.findLast(this.scope, a=> x in a)
    return y ? y[x] : this.getid(x)
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
    return this.strtag(
      this.isstr(x) ? x + ''
      : this.isarr(x) ? x.map(a=> this.str(a)).join` `
      : this.isitr(x) ? '[...]`'
      : this.ismap(x) ? Array.from(x, ([a, i])=> i + ' ' + this.str(a)).join`\n`
      : x + ''
    )
  }

  prex(s, f=''){
    f = this.str(f) + ''
    if(this.isrex(s)){
      f = [...new Set(f + s.flags)].join``
      s = s.source
    }
    else s = this.str(s) + ''
    return [s, f]
  }

  rex(s, f=''){
    [s, f] = this.prex(s, f)
    try { return RE2(s, f) }
    catch(e){
      this.warn(`engine switch "${s}" "${f}" (${e})`)
      return this.urex(s, f)
    }
  }

  srex(s, f=''){
    [s, f] = this.prex(s, f)
    try { return RE2(s, f) }
    catch(e){ this.err(`bad safe regex "${s}" "${f}" (${e})`) }
  }

  urex(s, f=''){
    [s, f] = this.prex(s, f)
    try { return RegExp(s, f) }
    catch(e){ this.err(`bad regex "${s}" "${f}" (${e})`) }
  }

  arex(s, f=''){
    if(this.isstr(s)) return this.rex(s, f)
    if(s instanceof RE2) return this.srex(s, f)
    return this.urex(s, f)
  }

  form(x, y='\n'){
    let M = a=>{
      if(a?.orig){
        let m = this.mname(a.orig[0])
        let l = a.orig[1]
        return a[0] == this.file ? `_(${m} ${l})` : `_${l}`
      }
      return ''
    }
    return x.map(a=>
      a == Infinity ? '$I'
      : typeof a == 'bigint' ? a + 'N'
      : this.isnum(a) ?
        a < 0 ? -a + '_' : a + ''
      : this.isrex(a) ? JSON.stringify(a.source) + '?' + (a instanceof RE2 ? '!' : '?') + a.flags
      : this.isstr(a) ? JSON.stringify(a + '') + M(a)
      : this.isarr(a) ?
        a.length ?
          `[ ${this.form(a, ' ')} ]`
        : '[]'
      : this.ismap(a) ?
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
    return this.clone(
      o.at && this.isnum(+x) ? o.at(this.isarr(o) ? Number(x) : x)
      : this.isstr(x) ? o.get(this.untag(x))
      : this.isobj(x) ? _.map(x, a=> this.gind(o, a))
      : o.get(x)
    )
  }

  get(x){ return this.gind(this.stack[this.st], ~x) }

  clone(x){
    return _.cloneDeepWith(x, a=> this.isitr(a) ? a : undefined)
  }

  splice(x, y=1, z){
    return z != undefined ? this.stack[this.st].splice(~x, y, z) : this.stack[this.st].splice(~x, y)
  }

  shift(){ return this.clone(this.strtag(this.stack[this.st].pop())) }

  unshift(...x){ return this.stack[this.st].push(...x.map(a=> this.clone(this.prep(a)))) }

  quar(f){
    this.iter.push(this.st)
    this.st = this.iter.at(-1) + ' '
    f()
    let A = this.shift()
    delete this.stack[this.iter.at(-1) + ' ']
    this.st = this.iter.pop()
    return A
  }

  each(O, f=_.map, g=x=> x, s){
    let X = this.shift()
    return f(O, (a, i)=>
      g(this.quar($=>{
        this.stack[this.st] = s && itr.isIterable(a) ? [...a] : [a]
        this.exec(X)
      }))
    )
  }

  acc(O, ac=false, f=_.reduce, g=x=> x){
    let X = this.shift()
    let Y = ac && this.shift()
    let F = (a, b)=>
      g(this.quar($=>{
        this.stack[this.st] = [b, a]
        this.exec(X)
      }), a)
    return ac ? f(O, F, Y) : f(O, F)
  }

  cmp(O, f=(x, f)=> x.sort(f), g=x=> x){
    let X = this.shift()
    return f(O, (a, b)=>
      g(this.quar($=>{
        this.stack[this.st] = [b, a]
        this.exec(X)
      })
    ))
  }

  *gen(f, a){
    while(true){
      yield a
      a = this.quar($=>{
        this.stack[this.st] = [a]
        this.exec(f)
      })
    }
  }

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

  gline(x){ return this.strtag(this.pkf.at(-1)?.lines?.[x] || this.lines[x], [this.pkf.at(-1)?.file, x]) }

  eline(x){
    let l = this.lns.at(-1)[1] - -x
    if(this.gline(l)){
      this.tline(l)
      this.exec(this.gline(l), 1)
    }
  }

  tline(l, f = 0){
    l = f == this.file ? [0, l] : [this.pkf.at(-1)?.file || 0, l]
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

  getf(){ return this.code[0].shift() }

  // type checkers

  isarr(x){ return _.isArray(x) }

  isarl(x){ return _.isArrayLike(x) }

  isstr(x){ return _.isString(x) }

  isrex(x){ return _.isRegExp(x) || x instanceof RE2 }

  isitr(x){ return x && !this.isarl(x) && !this.ismap(x) && itr.isIterable(x) }

  ismap(x){ return x instanceof Map }

  isobj(x){ return _.isObjectLike(x) }

  isnum(x){ return typeof x == 'bigint' || (_.isNumber(x) && !isNaN(x)) }

  isfun(x){ return _.isFunction(x) }
}

export default INTRP
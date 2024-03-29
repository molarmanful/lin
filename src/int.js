import {math, Temporal, rust, voca, DOT, DOTS, RE2, unesc, chalk, itr, _, path, parse, SL, __} from './bridge.js'

class PKG {
  constructor(n, f){
    this.name = n
    this.file = f
    this.ids = _.cloneDeep(SL)
    this.lines = []
  }
}

class LENS {
  constructor({get, mod, traversal}, c=0){
    this.get = get
    this.mod = mod
    this.traversal = traversal
    this.custom = c
  }
}

class FN extends String {
  constructor(xs, orig){
    super(xs?.join ? xs.join` ` : xs)
    this.xs = xs
    this.orig = orig
    return this
  }

  [Symbol.toPrimitive](){ return this.toString() }
}

class INTRP {

  constructor(x, file=0, opts={}){
    this.stack = {0: []}
    this.st = 0
    this.gl = 0
    this.lambda = 0
    this.paren = []
    this.ids = _.cloneDeep(SL)
    this.lines = x.split(/\r?\n/)
    this.lns = [[0, 0]]
    this.iter = []
    this.code = []
    this.verbose = opts.verbose
    this.step = opts.step
    this.impl = opts.impl
    this.child = 0
    this.scope = []
    this.scoped = 0
    this.curls = []
    this.apos = 0
    this.catch = 0
    this.bind = 0
    this.objs = []
    this.file = file && this.mresolve(file)
    this.PKG = PKG
    this.LENS = LENS
    this.FN = FN
    this.pkg = []
    this.pkf = []

    this.lens = {
      a: new LENS(__.all()),
      f: f=> new LENS(__.matching(f)),
      F: f=> new LENS(__.findBy(f)),
      MX: f=> new LENS(__.maxBy(f)),
      MN: f=> new LENS(__.minBy(f)),
    }
  }

  run(){
    this.exec(this.lines[0])

    if(this.impl)
      _.map(this.stack, (a, i)=>{
        [
          chalk.gray.dim(`---{${i}}`),
          this.form(a)
        ].map(a=> console.log(a))
      })
  }

  exec(x, y){

    if(this.isarr(x) || this.ismap(x) || this.ismat(x) || this.isitr(x)){
      let F = a=> this.quar($=>{
        this.stack[this.st] = this.stack[this.iter.at(-1)].slice()
        this.exec(a)
        SL.enclose(this)
      })
      if(this.ismat(x)) x = x.valueOf()
      if(this.isitr(x)) this.unshift(itr.map(F, x))
      else this.unshift(__.map(F)(x))
    }

    else {
      if(!this.isstr(x)) x += ''

      let orig = x.orig
      if(!this.isfns(x)){
        if(this.istag(x)) x.xs = x.xs.split(/\r?\n/)[0]
        x = x.split(/\r?\n/)[0]
      }

      if(orig && orig[0] == this.file && this.pkf.at(-1) && orig[0] != this.pkf.at(-1)?.file){
        this.addf($=> this.pkf.pop())
        this.pkf.push(0)
      }

      if(orig) this.tline(orig[1], orig[0])

      // reuse stack frame
      if(y) this.addf(...this.isfns(x) ? x.xs : this.parse(x))

      // new stack frame
      else {
        this.addc(this.isfns(x) ? x.xs : this.parse(x))

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

          // ignore lenses
          if(this.islen(a)){}

          // for internal JS calls from commands
          else if(this.isfun(a)) a()

          // lambda mode
          else if(this.lambda){
            if(a.match(/^[()\[\]{}]{2,}$/)){
              this.addf(...a.slice(1))
              a = a[0]
            }
            if(a == '(') this.lambda++
            if(a == ')') this.lambda--
            if(this.lambda > 0) this.paren.push(a)
            else SL[')'](this)
          }

          // pkg mode
          else if(this.pkg.at(-1)){
            let {name, file, ids} = this.pkg.at(-1)
            if(!(a in ids)) this.err(`unknown pkg fn "${name} ${a}"`)
            this.addf($=> this.pkf.pop())
            this.pkf.push(this.pkg.pop())
            this.fmatch(a, this.pkf.at(-1), ids)
          }

          // literals
          else if(a?.[0] == '"'){
            if(this.gl){
              this.gl = 0
              a = unesc(a)
            }
            this.unshift(a.slice(1, a.slice(-1) == '"' ? -1 : void 0))
          }

          // numbers
          else if(this.isnum(+a)){
            this.unshift(+a > Number.MAX_SAFE_INTEGER ? BigInt(a.replace(/\.\d*$/, '')) : +a)
          }

          else {

            let A = this.gscope(a)

            // brackets/parens only
            if(a.match(/^[()\[\]{}]{2,}$/)) this.addf(...a)

            // magic dot
            else if(this.gl){
              this.gl = 0
              if(a in DOT){
                DOT[a](this)
              }
              else {
                let s = x=> _.sortBy(Object.keys(x), y=> -y.length).find(y=> a.startsWith(y))
                let A = s(DOTS)
                if(A){
                  this.unshift(a.slice(A.length))
                  DOTS[a.slice(0, A.length)](this)
                }
                else {
                  let A = s(DOT)
                  if(A){
                    DOT[a.slice(0, A.length)](this)
                    this.exec(a.slice(A.length), 1)
                  }
                  else {
                    this.unshift(a)
                    SL.gl(this)
                  }
                }
              }
            }

            // ignore hashes
            else if(a[1] && a[0] == '#'){}

            // refs
            else if(a[1] && a[0] == '\\') this.unshift(a.slice(1))

            // matched functions
            else if(A != void 0) this.fmatch(a, this, A)

            else this.err(`unknown fn "${a}"`)
          }

          // verbose mode
          if(this.verbose && !this.lambda){
            [
              this.form(this.stack[this.st]),
              chalk.gray.dim('>———')
            ].map(a => console.log(a))
          }

          if(this.step && !this.lambda){
            process.stdout.write("[ENTER to continue, a + ENTER to auto-step] ")
            if(rust.rline() == 'a') this.step = 0
          } 
        }

        this.code.shift()
      }
    }
  }

  exit(c){
    if(this.child){
      this.code = []
      delete this
    }
    else process.exit(c)
  }

  err(x){
    if(this.catch) throw x
    else {
      console.error(chalk.redBright(`ERR: ${x}\nLNS: ${this.form(_.reverse(this.lns),'\n     ')}`))
      this.exit(1)
    }
  }

  warn(x){
    if(this.verbose)
      console.warn(chalk.yellowBright(`WRN: ${x}\nLNS: ${this.form(_.reverse(this.lns),'\n     ')}`))
  }

  try(f, g){ try { return f() } catch(e){ return g(e) } }

  sz(x){ return math.size(x).valueOf() }

  oget(o, x){
    let O = o?.entries ? [...o.entries()] : Object.entries(o)
    return O.find(([i, a])=> _.isEqual(i, x))[1]
  }

  tlen(f, a, F){
    return this.quar($=>{
      this.scope.push({'%%': $=> $.u1(F)})
      this.stack[this.st] = [a]
      this.exec(f)
      this.scope.shift()
    })
  }

  tlens(f){
    return (
      !this.islen(f) ? 
        !this.isstr(f) ?
          this.ismap(f) ? Object.fromEntries(__.map(a=> this.tlens(a))(f).entries())
          : __.map(a=> this.tlens(a))
        : a=> this.tru(this.tlen(f, a))
      : f
    )
  }

  lpre(xs, ls){
    if(this.ismat(xs)) xs = xs.valueOf()
    else if(this.isitr(xs)) xs = this.itrlist(xs)
    ls = __.map(x=> this.untag(x))(_.flattenDeep([this.itrlist(ls)]))
    return [xs, ls]
  }

  lget(xs, ls){
    [xs, ls] = this.lpre(xs, ls)
    return __.get(...ls)(xs)
  }

  lmod(xs, y, ls, s){
    [xs, ls] = this.lpre(xs, ls)
    let R = (xs, y, ls, s) =>{
      if(ls.length == 0) return y(xs)
      if(xs != void 0){
        let [l, ...rs] = ls
        if(this.islen(l)) return l.mod(a=> R(a, y, rs, s))(xs)
        if(rs.length == 0) s == 2 ? xs.delete(l) : xs.set(l, y(xs.get(l)))
        else xs.set(l, R(xs.get(l), y, rs, s))
        return xs
      }
    }
    return (
      R(xs, s ? $=> y : a=> this.quar($=>{
        this.stack[this.st] = [a]
        this.exec(y)
      }), ls, s)
    )
  }

  js2lin(x){
    let r = a=> this.js2lin(a)
    return (
      Number.isNaN(x) || x == null ? void 0
      : x instanceof Date ? x.toTemporalInstant().toString()
      : this.isarr(x) ? x.map(r)
      : this.isobj(x) ? new Map(Object.entries(x)).map(r)
      : x
    )
  }

  lin2js(x, b=1){
    let r = a=> this.lin2js(a)
    return (
      x == void 0 ? null 
      : this.ismap(x) ? Object.fromEntries(x.map(r))
      : b && this.isitr(x) ? this.itrls(itr.map(r, x))
      : this.isi(x) ? x.map(r)
      : this.untag(x)
    )
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

  isi(x){ return this.isarr(x) || this.ismap(x) || this.ismat(x) }

  len(x){
    return (
      this.ismat(x) ? x.size()[0]
      : this.isitr(x) ? itr.size(x)
      : this.ismap(x) ? x.size()
      : x?.length
    )
  }

  arap(x){ return this.try($=> [...x], e=> [x]) }

  v1(f, x){
    // if(this.ismat(x)) x = x.valueOf()
    if(this.isitr(x)) return itr.map(a=> this.v1(f, a), x)
    if(this.isi(x)) return x.map(a=> this.v1(f, a))
    return this.prep(f(x))
  }

  v2(f, x, y){
    // if(this.ismat(x)) x = x.valueOf()
    // if(this.ismat(y)) y = y.valueOf()
    if(this.isi(x) && this.isi(y) && this.len(x) == this.len(y))
      return x.map((a, i)=> this.v2(f, a, __.get(i)(y)))
    if(this.isitr(x)) return itr.map(a=> this.v2(f, a, y), x)
    if(this.isitr(y)) return itr.map(a=> this.v2(f, x, a), y)
    if(this.isi(x)) return x.map(a=> this.v2(f, a, y))
    if(this.isi(y)) return y.map(a=> this.v2(f, x, a))
    else return this.prep(f(x, y))
  }

  v3(f, x, y, z){
    // if(this.ismat(x)) x = x.valueOf()
    // if(this.ismat(y)) y = y.valueOf()
    // if(this.ismat(z)) z = z.valueOf()
    if(this.isi(x) && this.isi(y) && this.isi(z) && this.len(x) == this.len(y) && this.len(y) == this.len(z))
      return x.map((a, i)=> this.v3(f, a, __.get(i)(y), __.get(i)(z)))
    if(this.isitr(x)) return itr.map(a=> this.v3(f, a, y, z), x)
    if(this.isitr(y)) return itr.map(a=> this.v3(f, x, a, z), y)
    if(this.isitr(z)) return itr.map(a=> this.v3(f, x, y, a), z)
    if(this.isi(x) && this.isi(y) && this.len(x) == this.len(y))
      return x.map((a, i)=> this.v3(f, a, __.get(i)(y), z))
    if(this.isi(y) && this.isi(z) && this.len(y) == this.len(z))
      return y.map((a, i)=> this.v3(f, x, a, __.get(i)(z)))
    if(this.isi(x) && this.isi(z) && this.len(x) == this.len(z))
      return x.map((a, i)=> this.v3(f, a, y, __.get(i)(z)))
    if(this.isi(x)) return x.map(a=> this.v3(f, a, y, z))
    if(this.isi(y)) return y.map(a=> this.v3(f, x, a, z))
    if(this.isi(z)) return z.map(a=> this.v3(f, x, y, a))
    else return this.prep(f(x, y, z))
  }

  prep(x){ return Number.isNaN(x) || x == null ? void 0 : _.isBoolean(x) ? +x : this.strtag(x) }

  strtag(x, l=[0], a=0){
    if(this.istag(x)) return x
    let O = [l[0] || this.file, this.isnum(l[1]) ? 0 | l[1] : this.lns.at(-1)[1]]
    if(a && this.isarr(x)) return new FN(x, O)
    if(this.isstr(x) && !this.istag(x)) return new FN(x, O)
    return x
  }

  untag(x){ return this.isstr(x) ? x + '' : x }

  fmatch(a, ctx, scp){
    if(scp[a] instanceof PKG) this.pkg.push(scp[a])
    else if(scp[a] instanceof Function) scp[a](ctx)
    else {
      if(this.istag(scp[a]) && !this.isarr(scp[a].xs)) scp[a].xs = this.parse(scp[a].xs)
      this.exec(scp[a], 1)
    }
  }

  print(x){ console.log(x); return x }

  id(x, f=0){
    let y = new RE2(`^ *#${x}`)
    let line = this.lines.findIndex(a=> y.test(a))
    if(~line){
      let l = this.lines[line].replace(y, '')
      if(f) l = this.parse(l)
      this.ids[x] = this.strtag(l, [0, line], f)
    }
  }

  getid(x){ return this.ids[x] }

  getscope(x){ return this.gscope(x)?.[x] }

  gscope(x){ return _.findLast([this.ids, ...this.scope], a=> x in a) }

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
      : this.ismat(x) ? this.str(x.valueOf())
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
        return voca.tr(a[0] == this.file ? `${m} ${l}` : `${l}`, '0123456789', '⁰¹²³⁴⁵⁶⁷⁸⁹')
      }
      return ''
    }
    return x.map(a=>
      this.isrex(a) ? JSON.stringify(a.source) + '?' + (a instanceof RE2 ? '!' : '?') + a.flags
      : a == Infinity ? '$I'
      : typeof a == 'bigint' ? a + 'N'
      : this.isnum(a) ? a + ''
      : this.isstr(a) ? JSON.stringify(a + '') + M(a)
      : this.ismat(a) ?
        `[${this.form(a.valueOf(), ' ')}]^`
      : this.istmp(a) ?
        `~(${a + ''})`
      : this.ismap(a) ?
        a.size ?
          `{${Array.from(a, ([b, i])=> `${this.form([b])}=>${this.form([i])}`).join` `}}`
        : '{}'
      : this.isarr(a) ?
        a.length ?
          `[${this.form(a, ' ')}]`
        : '[]'
      : this.isitr(a) ? '[...]`'
      : this.islen(a) ? `{...}%`
      : a == void 0 ? '$U'
      : a
    ).join(y)
  }

  parse(x){ return this.isarr(x) ? x : this.isfns(x) ? x.xs : parse(this.str(x) + '') }

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
    return _.cloneDeepWith(x, a=> this.isitr(a) ? a : void 0)
  }

  splice(x, y=1, z){
    return z != void 0 ? this.stack[this.st].splice(~x, y, z) : this.stack[this.st].splice(~x, y)
  }

  shift(){ return this.clone(this.strtag(this.stack[this.st].pop())) }

  unshift(...x){ return this.stack[this.st].push(...x.map(a=> this.clone(this.prep(a)))) }

  quar(f, s=' '){
    this.iter.push(this.st)
    this.st = this.iter.at(-1) + s
    this.stack[this.st] = []
    f()
    let A = this.shift()
    delete this.stack[this.iter.at(-1) + s]
    this.st = this.iter.pop()
    return A
  }

  each(O, f=_.map, g=x=> x, s, ind){
    return this.v1(x=> f(O, (a, i)=>
      g(this.quar($=>{
        this.stack[this.st] = s && itr.isIterable(a) ? [...a] : ind ? [i, a] : [a]
        this.exec(x)
      })
    )), this.shift())
  }

  depth(x){
    return (
      this.isitr(x) ? 1
      : this.isi(x) ?
        1 + Math.max(0,
          ...this.ismap(x) ? _.map(x, a=> this.depth(a)).values()
          : _.map(x, a=> this.depth(a))
        )
      : 0
    )
  }

  imap(x, F, D=1 / 0, f=(x, f)=> __.map(f)(x), g=itr.map, post=x=> x, d=[]){
    if(D < 0) D += this.depth(x)
    if(D == 0) return post(F(x, d))
    if(this.isitr(x)) return g((a, i)=> this.imap(a, F, D - 1, f, g, post, d.concat(i)), x)
    if(this.isi(x)) return f(x, (a, i)=> this.imap(a, F, D - 1, f, g, post, d.concat(i)))
    return post(F(x, d))
  }

  walk(x, F, d=[]){
    x = F(x, d)
    if(this.isitr(x)) return itr.map((a, i)=> this.walk(a, F, d.concat(i)), x)
    if(this.isi(x)) return __.map((a, i)=> this.walk(a, F, d.concat(i)))(x)
    return x
  }

  *paths(x, v=0, d=[]){
    yield v == 2 ? [x, d] : v == 1 ? x : d
    if(this.ismap(x))
      for(let [i, a] of x) yield* this.paths(a, v, d.concat(i))
    else if(this.isitr(x)){
      let i = 0
      for(let a of x) yield* this.paths(a, v, d.concat(i++))
    }
    else if(this.isi(x))
      for(let [i, a] of Object.entries(x)) yield* this.paths(a, v, d.concat(this.isnum(+i) ? +i : i))
  }

  acc(O, ac=0, f=_.reduce, ind, g=x=> x){
    let X = this.shift()
    let Y = ac && this.shift()
    let F = x=> (a, b, i)=>
      g(this.quar($=>{
        this.stack[this.st] = ind ? [i, a, b] : [a, b]
        this.exec(x)
      }), a)
    return this.v1(ac ? x=> f(O, F(x), Y) : x=> f(O, F(x)), X)
  }

  cmp(O, f=(x, f)=> x.sort(f), g=x=> x){
    let X = this.shift()
    return f(O, (a, b)=>
      g(this.quar($=>{
        this.stack[this.st] = [a, b]
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
    return (
      this.ismat(x) ? this.listitr(x.valueOf())
      : !this.isarl(x) && this.isnum(x?.length) ? itr.wrap(x)
      : this.isitr(x) ? x
      : itr.wrap(this.isnum(x) ? [x] : x)
    )
  }

  listitrs(x){
    return (
      this.ismat(x) ? this.listitrs(x.valueOf())
      : !this.isarl(x) && this.isnum(x?.length) ? this.listitr(x)
      : this.isitr(x) || this.isstr(x) ? x
      : this.isarr(x) ? this.listitr(_.map(x, this.listitrs))
      : x
    )
  }

  itrls(x){ 
    return (
      this.ismat(x) ? x.valueOf()
      : this.isitr(x) ? itr.toArray(x)
      : x
    )
  }

  itrlist(x){
    return (
      this.ismat(x) ? this.itrlist(x.valueOf())
      : this.isitr(x) ? this.itrls(itr.map(a=> this.itrlist(a), x))
      : this.isi(x) ? __.map(a=> this.itrlist(a))(x)
      : x
    )
  }

  mresolve(x){ return path.resolve(process.cwd(), x) }

  mname(x){ return this.try($=> path.basename(x, path.extname(x)), e=> x) }

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

  istag(x){ return x instanceof FN }

  isfns(x){ return this.istag(x) && this.isarr(x.xs) }

  isrex(x){ return _.isRegExp(x) || x instanceof RE2 }

  isitr(x){ return x && !this.isarl(x) && !this.ismap(x) && !this.ismat(x) && itr.isIterable(x) }

  ismap(x){ return x instanceof Map }

  isobj(x){ return _.isObjectLike(x) }

  isnum(x){ return typeof x == 'bigint' || (_.isNumber(x) && !isNaN(x)) }

  isfun(x){ return _.isFunction(x) }

  ismat(x){ return math.isMatrix(x) }

  islen(x){ return x instanceof LENS }

  istmp(x){ return x instanceof Temporal.Instant }
}

export default INTRP
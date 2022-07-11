import {chalk, rls, itr, _, path, parse, SL} from './bridge.js'

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

  constructor(x, file, opts={}){
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
    this.file = this.mresolve(file)
    this.PKG = PKG
    this.pkg = []
    this.pkf = []

    this.exec(this.lines[0])
  }

  exec(x, y){
    if(!x?.big) x += ''

    if(x.orig?.file == this.file && this.pkf[0] && x.orig?.file != this.pkf[0]?.file){
      this.addf($=> this.pkf.shift())
      this.pkf.unshift(0)
      this.tline(x.orig.line, 1)
    }

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
        if(a.call){
          a()
        }

        // lambda mode
        else if(this.lambda){
          if(a.match(/^[()\[\]{}]+$/))
            this.lambda += (a.match(/\(/g) || []).length - (a.match(/\)/g) || []).length

          if(this.lambda > 0) this.paren.push(a)
          else SL[')'](this)
        }

        // numbers
        else if(!isNaN(+a)) this.unshift(a > Number.MAX_SAFE_thisEGER ? BigInt(a.replace(/\.\d*$/, '')) : Number(a))

        else {
          // pkg call
          if(this.pkg[0]){
            let {name, file, ids, idls} = this.pkg[0]
            if(!(a in ids)) throw `unknown pkg fn "${name} ${a}"`
            this.addf($=> this.pkf.shift())
            this.pkf.unshift(this.pkg.shift())
            if(ids[a] instanceof PKG){
              this.pkg.unshift(ids[a])
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
            if(a[1] && a[0] == '#'){
              this.unshift(this.shift().slice(1))
              SL[this.objs.length ? ':' : 'sl'](this)
            }
            if(a[1] && a[0] == '\\'){
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
          else if(this.pkf[0]){
            if(a in this.pkf[0].ids) this.fmatch(a, this.pkf[0])
            else throw `unknown fn "${a}" in pkg "${this.pkf[0].name}"`
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

        if(this.step) if(rls.question("[ENTER to continue, a + ENTER to auto-step]") == 'a') this.step = 0
      }

      this.code.shift()
    }
  }

  strtag(x){
    if(x?.big && !x.orig){
      let X = new String(x)
      X.orig = {file: this.file, line: this.lns[0].slice()}
      return X
    }
    return x
  }

  fmatch(a, ctx){
    if(ctx.ids[a] instanceof PKG) this.pkg.unshift(ctx.ids[a])
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

  getscope(x, m=0){
    let y = this.scope.find(a=> x in a)
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
    return x?.big ? this.strtag(x + '')
      : x?.pop ? x.reverse().join` `
      : this.isitr(x) ? '[...]`'
      : _.isObjectLike(x) ? _.map((a, i)=> i + this.str(a)).join` `
      : this.strtag(x + '')
  }

  form(x, y='\n'){
    return x.map(a=>
      a == Infinity ? '$I'
      : a && typeof a == 'bigint' ? a + 'N'
      : a?.toFixed ?
        a < 0 ? -a + '_' : a + ''
      : a?.big ? JSON.stringify(a)
      : a?.pop ?
        a.length ?
          `[ ${this.form(a, ' ')} ]`
        : '[]'
      : a && this.isitr(a)? '[...]`'
      : _.isObjectLike(a) ?
        _.keys(a).length ?
          `{ ${
            _.keys(a).map(b=> this.form([b]) + ': ' + this.form([a[b]])).join` `
          } }`
        : '{}'
      : a == undefined ? '$U'
      : a
    ).reverse().join(y)
  }

  parse(x){ return parse(x.pop ? x.join` ` : x + '') }

  gind(o, x){
    return _.isObjectLike(x) ? _.map(x, a=> this.gind(o, a))
      : o.at && !isNaN(+x) ? (o.pop ? a=> a : _.reverse)(o.at(typeof x == 'bigint' ? Number(x) : x))
      : o[x]
  }

  get(x){ return this.gind(this.stack[this.st], x) }

  splice(x, y=1, z, w=0){
    return z != undefined ? this.stack[this.st].splice(this.mod(x, this.stack[this.st].length + w), y, z)
      : this.stack[this.st].splice(this.mod(x, this.stack[this.st].length + w), y)
  }

  shift(x){ return _.cloneDeep(this.stack[this.st].shift()) }

  unshift(...x){ return this.stack[this.st].unshift(...x.map(a=> this.strtag(a))) }

  each(O, f=_.map, s=false, g=x=> x){
    let X = this.shift()
    return f(O, (a, i)=>{
      this.iter.unshift(this.st)
      this.st = this.iter[0] + ' '
      this.stack[this.st] = s && itr.isIterable(a) ? [...a] : [a]
      this.exec(X)
      let A = this.shift()
      delete this.stack[this.iter[0] + ' ']
      this.st = this.iter.shift()
      return g(A)
    })
  }

  acc(O, ac=false, f=_.reduceRight, g=x=> x){
    let X = this.shift()
    let Y = ac && this.shift()
    let F = (a, b)=>{
      this.iter.unshift(this.st)
      this.st = this.iter[0] + ' '
      this.stack[this.st] = [b, a]
      this.exec(X)
      let A = this.shift()
      delete this.stack[this.iter[0] + ' ']
      this.st = this.iter.shift()
      return g(A, a)
    }
    return ac ? f(O, F, Y) : f(O, F)
  }

  cmp(O, f=(x, f)=> x.sort(f), g=x=> x){
    let X = this.shift()
    return f(O, (a, b)=>{
      this.iter.unshift(this.st)
      this.st = this.iter[0] + ' '
      this.stack[this.st] = [b, a]
      this.exec(X)
      let A = this.shift()
      delete this.stack[this.iter[0] + ' ']
      this.st = this.iter.shift()
      return g(A)
    })
  }

  isitr(x){ return !x?.length && itr.isIterable(x) }

  listitr(x){
    return !x?.pop && !x?.big && x?.length ? itr.map(a=> a.reverse(), x)
      : this.isitr(x) ? x
      : (x?.big ? x=> x: itr.reverse)(itr.wrap(['number', 'bigint'].includes(typeof x) ? [x] : x))
  }

  listitrs(x){
    return !x?.pop && x?.length ? this.listitr(x)
      : this.isitr(x) || x?.big ? x
      : x.pop ? this.listitr(_.map(x, this.listitrs))
      : x
  }

  itrls(x){ return itr.toArray(itr.reverse(x)) }

  itrlist(x){ return this.itrls(itr.map(a=> this.isitr(a) ? this.itrlist(a) : a, this.listitr(x))) }

  mresolve(x){ return path.resolve(process.cwd(), x) }

  mname(x){ try { return path.basename(x, path.extname(x)) } catch(e){ return x } }

  gline(x){ return this.pkf[0] ? this.pkf[0].lines[x] : this.lines[x] }

  eline(x){
    let l = this.lns[0][1] - -x
    if(this.gline(l)){
      this.tline(l)
      this.exec(this.gline(l), 1)
    }
  }

  tline(l, r=0){
    l = r ? l : [this.pkf[0]?.file || 0, l]
    if(this.lns.some(a=> _.isEqual(l, a))){
      this.lns = _.dropWhile(this.lns, a=> !_.isEqual(l, a))
    }
    else {
      if(this.code[0][0] || this.code[1]) this.addf($=> this.lns.shift())
      this.lns.unshift(l)
    }
  }

  addc(x){
    this.code.unshift([])
    this.addf(...x)
  }

  addf(...x){ this.code[0] = x.reduceRight((a,b)=> [b, ...a], this.code[0]) }

  getf(){
    let x = this.code[0][0]
    this.code[0] = this.code[0].slice(1)
    return x
  }
}

export default INTRP
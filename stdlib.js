module.exports=$={}
$["("]=(h=stack[st])=>lambda=1
$[")"]=(h=stack[st])=>{}
$["()"]=(h=stack[st])=>unshift('')

$["gi"]=(h=stack[st])=>unshift(id())
$["gi\\"]=(h=stack[st])=>unshift(unesc(id()))
$["gs"]=(h=stack[st])=>unshift(form())
$["si"]=(h=stack[st])=>ids[shift()]=shift()
$["::"]=(h=stack[st])=>id()

$["es"]=(h=stack[st])=>exec(shift())
$["e&"]=(h=stack[st])=>($.swap(),shift()?$.es():shift())
$["e|"]=(h=stack[st])=>($.swap(),shift()?shift():$.es())
$["e?"]=(h=stack[st])=>($.rot(),shift()||$.swap(),shift(),$.es())
$["ei"]=(h=stack[st])=>(i=shift(),setInterval(a=>exec(i),shift()))
$["et"]=(h=stack[st])=>(i=shift(),setTimeout(a=>exec(i),shift()))

$["read"]=(h=stack[st])=>unshift(fs.readFileSync(shift())+'')
$["write"]=(h=stack[st])=>fs.writeFileSync(shift(),shift())
$["in"]=(h=stack[st])=>(e=shift(),q=rl.createInterface(process.stdin,process.stdout),q.question('',a=>{
    unshift(e,a)
    $.es()
    q.close()
  }))
$["out"]=(h=stack[st])=>process.stdout.write(''+shift())
$["outln"]=(h=stack[st])=>process.stdout.write(''+shift()+'\n')

$["e"]=(h=stack[st])=>unshift(Math.E)
$["pi"]=(h=stack[st])=>unshift(Math.PI)

$["E"]=(h=stack[st])=>($.swap(),unshift(shift()*Math.pow(10,shift())))
$["_"]=(h=stack[st])=>unshift(-shift())
$["+"]=(h=stack[st])=>unshift(shift()- -shift())
$["-"]=(h=stack[st])=>($.swap(),unshift(shift()-shift()))
$["*"]=(h=stack[st])=>unshift(shift()*shift())
$["/"]=(h=stack[st])=>($.swap(),unshift(shift()/shift()))
$["//"]=(h=stack[st])=>($.swap(),unshift(Math.floor(shift()/shift())))
$["%"]=(h=stack[st])=>($.swap(),unshift(mod(shift(),shift())))
$["/%"]=(h=stack[st])=>($.over(),$.over(),$['//'](),$.rot_(),$['%']())
$["^"]=(h=stack[st])=>($.swap(),unshift(Math.pow(shift(),shift())))
$["abs"]=(h=stack[st])=>unshift(Math.abs(shift()))
$["sign"]=(h=stack[st])=>unshift(Math.sign(shift()))
$["rand"]=(h=stack[st])=>unshift(Math.random())
$["time"]=(h=stack[st])=>unshift(_.now())
$["ln"]=(h=stack[st])=>unshift(Math.log(shift()))
$["log"]=(h=stack[st])=>unshift(Math.log10(shift()))
$["sin"]=(h=stack[st])=>unshift(Math.sin(shift()))
$["cos"]=(h=stack[st])=>unshift(Math.cos(shift()))
$["tan"]=(h=stack[st])=>unshift(Math.tan(shift()))
$["sinh"]=(h=stack[st])=>unshift(Math.sinh(shift()))
$["cosh"]=(h=stack[st])=>unshift(Math.cosh(shift()))
$["tanh"]=(h=stack[st])=>unshift(Math.tanh(shift()))
$["asin"]=(h=stack[st])=>unshift(Math.asin(shift()))
$["acos"]=(h=stack[st])=>unshift(Math.acos(shift()))
$["atan"]=(h=stack[st])=>unshift(Math.atan(shift()))
$["asinh"]=(h=stack[st])=>unshift(Math.asinh(shift()))
$["acosh"]=(h=stack[st])=>unshift(Math.acosh(shift()))
$["atanh"]=(h=stack[st])=>unshift(Math.atanh(shift()))
$["max"]=(h=stack[st])=>unshift(Math.max(...stack[st]))
$["min"]=(h=stack[st])=>unshift(Math.min(...stack[st]))
$["range"]=(h=stack[st])=>($.swap(),unshift(...range(shift(),shift()).reverse()))

$["not"]=(h=stack[st])=>unshift(~shift())
$["NOT"]=(h=stack[st])=>unshift(+!shift())
$["and"]=(h=stack[st])=>unshift(shift()&shift())
$["or"]=(h=stack[st])=>unshift(shift()|shift())
$["xor"]=(h=stack[st])=>unshift(shift()^shift())

$["="]=(h=stack[st])=>unshift(+(shift()==shift()))
$["!="]=(h=stack[st])=>unshift(+(shift()!=shift()))
$[">"]=(h=stack[st])=>unshift(+(shift()<shift()))
$["<"]=(h=stack[st])=>unshift(+(shift()>shift()))
$[">="]=(h=stack[st])=>unshift(+(shift()<=shift()))
$["<="]=(h=stack[st])=>unshift(+(shift()>=shift()))
$["<=>"]=(h=stack[st])=>(i=shift(),j=shift(),unshift(i<j?1:i>j?-1:0))

$["floor"]=(h=stack[st])=>unshift(Math.floor(shift()))
$["trunc"]=(h=stack[st])=>unshift(Math.trunc(shift()))
$["round"]=(h=stack[st])=>unshift(Math.round(shift()))
$["ceil"]=(h=stack[st])=>unshift(Math.ceil(shift()))

$["pick"]=(h=stack[st])=>unshift(get(shift()))
$["nix"]=(h=stack[st])=>splice(shift())
$["roll"]=(h=stack[st])=>(x=get(0),$.pick(),unshift(x+1),$.nix())
$["roll_"]=(h=stack[st])=>splice(shift(),0,shift())
$["trade"]=(h=stack[st])=>unshift(splice(shift()-1,1,shift())[0])
$["dup"]=(h=stack[st])=>unshift(stack[st][0])
$["drop"]=(h=stack[st])=>shift()
$["rot"]=(h=stack[st])=>unshift(splice(2)[0])
$["rot_"]=(h=stack[st])=>($.rot(),$.rot())
$["swap"]=(h=stack[st])=>unshift(splice(1)[0])
$["nip"]=(h=stack[st])=>($.swap(),$.drop())
$["tuck"]=(h=stack[st])=>($.dup(),$.rot_())
$["over"]=(h=stack[st])=>($.swap(),$.tuck())
$["clr"]=(h=stack[st])=>stack[st]=[]
$["rev"]=(h=stack[st])=>stack[st].reverse()
$["dip"]=(h=stack[st])=>($.swap(),i=shift(),$.es(),unshift(i))

$["split"]=(h=stack[st])=>($.swap(),unshift(...shift().split(shift())))
$["join"]=(h=stack[st])=>unshift(stack.join(shift()))
$["++"]=(h=stack[st])=>($.swap(),unshift(''+shift()+shift()))
$["len"]=(h=stack[st])=>unshift((''+shift()).length)
$[">char"]=(h=stack[st])=>unshift(String.fromCharCode(shift()))
$["<char"]=(h=stack[st])=>unshift(shift().charCodeAt())
$["lower"]=(h=stack[st])=>unshift(shift().toLowerCase())
$["upper"]=(h=stack[st])=>unshift(shift().toUpperCase())

$["stack"]=(h=stack[st])=>stack[st=shift()]||(stack[st]=[])
$["push"]=(h=stack[st])=>stack[shift()].unshift(shift())
$["pull"]=(h=stack[st])=>unshift(stack[shift()].shift())
$["size"]=(h=stack[st])=>unshift(stack[st].length)
$["merge"]=(h=stack[st])=>unshift(...stack[shift()])
$["uniq"]=(h=stack[st])=>stack[st]=_.uniq(stack[st])
$["take"]=(h=stack[st])=>stack[st]=_.take(stack[st],shift())
$["drop"]=(h=stack[st])=>stack[st]=_.drop(stack[st],shift())

$["map"]=(h=stack[st])=>(X=shift(),St=st,st=St+' ',stack[St]=stack[St].map(a=>
    (stack[st]=[X,a],$.es(),shift())
  ),delete stack[st],st=St)
$["filter"]=(h=stack[st])=>(X=shift(),Y=stack[st],St=st,st=St+' ',stack[St]=stack[St].filter(a=>
    (stack[st]=[X,a],$.es(),shift())
  ),delete stack[st],st=St)
$["fold"]=(h=stack[st])=>(X=shift(),Z=shift(),St=st,st=St+' ',stack[St].map(a=>
    (stack[st]=[X,a,Z],$.es(),Z=shift())
  ),delete stack[st],st=St,stack[st]=[Z])
$["some"]=(h=stack[st])=>(X=shift(),St=st,st=St+' ',Z=+stack[St].some(a=>
    (stack[st]=[X,a],$.es(),shift())
  ),delete stack[st],st=St,stack[st]=[Z])
$["all"]=(h=stack[st])=>(X=shift(),St=st,st=St+' ',Z=+stack[St].every(a=>
    (stack[st]=[X,a],$.es(),shift())
  ),delete stack[st],st=St,stack[st]=[Z])
$["find"]=(h=stack[st])=>(X=shift(),St=st,st=St+' ',Z=stack[St].find(a=>
    (stack[st]=[X,a],$.es(),shift())
  ),delete stack[st],st=St,stack[st]=[Z])
$["findi"]=(h=stack[st])=>(X=shift(),St=st,st=St+' ',Z=stack[St].findIndex(a=>
    (stack[st]=[X,a],$.es(),shift())
  ),delete stack[st],st=St,stack[st]=[Z])
$["takewhile"]=(h=stack[st])=>(X=shift(),St=st,st=St+' ',stack[St]=_.takeWhile(stack[St],a=>
    (stack[st]=[X,a],$.es(),shift())
  ),delete stack[st],st=St)
$["dropwhile"]=(h=stack[st])=>(X=shift(),St=st,st=St+' ',stack[St]=_.dropWhile(stack[St],a=>
    (stack[st]=[X,a],$.es(),shift())
  ),delete stack[st],st=St)
$["sort"]=(h=stack[st])=>(X=shift(),St=st,st=St+' ',stack[St]=_.sortBy(stack[St],a=>
    (stack[st]=[X,a],$.es(),shift())
  ),delete stack[st],st=St)

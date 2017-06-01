module.exports=$={}
$["("]=(h=stack[st])=>lambda=1
$[")"]=(h=stack[st])=>{}

$["gl"]=(h=stack[st])=>unshift(lines[shift()])
$["gi"]=(h=stack[st])=>unshift(id())
$["gi\\"]=(h=stack[st])=>unshift(unesc(id()))
$["gs"]=(h=stack[st])=>unshift(form())
$["si"]=(h=stack[st])=>ids[shift()]=shift()

$["el"]=(h=stack[st])=>exec(lines[shift()])
$["es"]=(h=stack[st])=>exec(shift())
$["ei"]=(h=stack[st])=>exec(id())
$["ei&"]=(h=stack[st])=>($.swap(),shift()?$.ei():shift())
$["ei|"]=(h=stack[st])=>($.swap(),shift()?shift():$.ei())
$["ei?"]=(h=stack[st])=>($.rot(),shift()||$.swap(),shift(),$.ei())
$["es&"]=(h=stack[st])=>($.swap(),shift()?$.es():shift())
$["es|"]=(h=stack[st])=>($.swap(),shift()?shift():$.es())
$["es?"]=(h=stack[st])=>($.rot(),shift()||$.swap(),shift(),$.es())

$["read"]=(h=stack[st])=>unshift(fs.readFileSync(shift())+'')
$["write"]=(h=stack[st])=>fs.writeFileSync(shift(),shift())
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

$["floor"]=(h=stack[st])=>unshift(Math.floor(shift()))
$["trunc"]=(h=stack[st])=>unshift(Math.trunc(shift()))
$["round"]=(h=stack[st])=>unshift(Math.round(shift()))
$["ceil"]=(h=stack[st])=>unshift(Math.ceil(shift()))

$["pick"]=(h=stack[st])=>unshift(get(shift()))
$["nix"]=(h=stack[st])=>splice(shift())
$["roll"]=(h=stack[st])=>(x=get(0),$.pick(),unshift(x+1),$.nix())
$["roll_"]=(h=stack[st])=>splice(shift(),0,shift())
$["dup"]=(h=stack[st])=>unshift(stack[st][0])
$["drop"]=(h=stack[st])=>shift()
$["rot"]=(h=stack[st])=>unshift(splice(2,1)[0])
$["rot_"]=(h=stack[st])=>($.rot(),$.rot())
$["swap"]=(h=stack[st])=>($.dup(),$.rot_(),$.drop())
$["nip"]=(h=stack[st])=>($.swap(),$.drop())
$["tuck"]=(h=stack[st])=>($.dup(),$.rot_())
$["over"]=(h=stack[st])=>($.swap(),$.tuck())
$["clr"]=(h=stack[st])=>stack[st]=[]
$["rev"]=(h=stack[st])=>stack[st].reverse()

$["split"]=(h=stack[st])=>($.swap(),unshift(...shift().split(shift())))
$["join"]=(h=stack[st])=>unshift(stack.join(shift()))
$["++"]=(h=stack[st])=>($.swap(),unshift(''+shift()+shift()))
$["len"]=(h=stack[st])=>unshift((''+shift()).length)

$["stack"]=(h=stack[st])=>stack[st=shift()]||(stack[st]=[])
$["push"]=(h=stack[st])=>stack[shift()].unshift(shift())
$["pull"]=(h=stack[st])=>unshift(stack[shift()].shift())
$["size"]=(h=stack[st])=>unshift(stack[st].length)
$["merge"]=(h=stack[st])=>unshift(...stack[shift()])

$["map"]=(h=stack[st])=>(X=shift(),St=st,st=St+' ',stack[St]=stack[St].map(a=>
    (stack[st]=[X,a],$.ei(),shift())
  ),delete stack[st],st=St)
$["filter"]=(h=stack[st])=>(X=shift(),Y=stack[st],St=st,st=St+' ',stack[St]=stack[St].filter(a=>
    (stack[st]=[X,a],$.ei(),shift())
  ),delete stack[st],st=St)
$["fold"]=(h=stack[st])=>(X=shift(),Z=shift(),St=st,st=St+' ',stack[St].map(a=>
    (stack[st]=[X,a,Z],$.ei(),Z=shift())
  ),delete stack[st],st=St,unshift(Z))
$["some"]=(h=stack[st])=>(X=shift(),St=st,st=St+' ',Z=+stack[St].some(a=>
    (stack[st]=[X,a],$.ei(),shift())
  ),delete stack[st],st=St,unshift(Z))
$["every"]=(h=stack[st])=>(X=shift(),St=st,st=St+' ',Z=+stack[St].every(a=>
    (stack[st]=[X,a],$.ei(),shift())
  ),delete stack[st],st=St,unshift(Z))
$["find"]=(h=stack[st])=>(X=shift(),St=st,st=St+' ',Z=stack[St].find(a=>
    (stack[st]=[X,a],$.ei(),shift())
  ),delete stack[st],st=St,unshift(Z))

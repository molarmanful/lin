module.exports=$={}
$["gi"]=x=>(//
    unshift(
      ids[x=shift()]||(
        line=lines.find(a=>(a.match`^ *#([^\d. ])`||[])[1]==x),
        line&&(ids[x]=unesc(line.replace(/^ *#[^\d. ]/,'')))
      )
    )
  )
$["gs"]=x=>unshift(form())
$["si"]=x=>ids[shift()]=shift()

$["out"]=x=>process.stdout.write(''+shift())

$["e"]=x=>unshift(Math.E)
$["pi"]=x=>unshift(Math.PI)

$["E"]=x=>($.swap(),unshift(shift()*Math.pow(10,shift())))
$["_"]=x=>unshift(-shift())
$["+"]=x=>unshift(shift()- -shift())
$["-"]=x=>($.swap(),unshift(shift()-shift()))
$["*"]=x=>unshift(shift()*shift())
$["/"]=x=>($.swap(),unshift(shift()/shift()))
$["//"]=x=>($.swap(),unshift(Math.floor(shift()/shift())))
$["%"]=x=>($.swap(),unshift(mod(shift(),shift())))
$["/%"]=x=>($.over(),$.over(),$['//'](),$.rot_(),$['%']())
$["^"]=x=>($.swap(),unshift(Math.pow(shift(),shift())))

$["abs"]=x=>unshift(Math.abs(shift()))
$["rand"]=x=>unshift(Math.random(shift()))
$["ln"]=x=>unshift(Math.log(shift()))
$["log"]=x=>unshift(Math.log10(shift()))
$["sin"]=x=>unshift(Math.sin(shift()))
$["cos"]=x=>unshift(Math.cos(shift()))
$["tan"]=x=>unshift(Math.tan(shift()))
$["sinh"]=x=>unshift(Math.sinh(shift()))
$["cosh"]=x=>unshift(Math.cosh(shift()))
$["tanh"]=x=>unshift(Math.tanh(shift()))
$["asin"]=x=>unshift(Math.asin(shift()))
$["acos"]=x=>unshift(Math.acos(shift()))
$["atan"]=x=>unshift(Math.atan(shift()))
$["asinh"]=x=>unshift(Math.asinh(shift()))
$["acosh"]=x=>unshift(Math.acosh(shift()))
$["atanh"]=x=>unshift(Math.atanh(shift()))

$["~"]=x=>unshift(~shift())
$["&"]=x=>($.swap(),unshift(shift()&shift()))
$["|"]=x=>($.swap(),unshift(shift()|shift()))
$["$"]=x=>($.swap(),unshift(shift()^shift()))

$["floor"]=x=>unshift(Math.floor(shift()))
$["trunc"]=x=>unshift(Math.trunc(shift()))
$["round"]=x=>unshift(Math.round(shift()))
$["ceil"]=x=>unshift(Math.ceil(shift()))

$["pick"]=x=>unshift(get(shift()))
$["nix"]=x=>splice(shift())
$["roll"]=x=>(x=get(0),$.pick(),unshift(x+1),$.nix())
$["roll_"]=x=>splice(shift(),0,shift())
$["dup"]=x=>unshift(stack[st][0])
$["drop"]=x=>shift()
$["rot"]=x=>unshift(splice(2,1)[0])
$["rot_"]=x=>($.rot(),$.rot())
$["swap"]=x=>($.dup(),$.rot_(),$.drop())
$["nip"]=x=>($.swap(),$.drop())
$["tuck"]=x=>($.dup(),$.rot_())
$["over"]=x=>($.swap(),$.tuck())
$["clr"]=x=>stack[st]=[]
$["rev"]=x=>stack[st].reverse()
$["len"]=x=>unshift(stack[st].length)

$["stack"]=x=>stack[st=shift()]||(stack[st]=[])
$["sdup"]=x=>unshift(stack[shift()].shift())

$["el"]=x=>(ln.unshift(shift()),lne())
$["en"]=x=>(ln[0].big||ln.unshift(ln[0]+1),lne())
$["ep"]=x=>(ln[0].big||ln.unshift(ln[0]-1),lne())
$["ei"]=x=>(//
    exec(
      ids[x=shift()]||(
        line=lines.find(a=>(a.match`^ *#([^\d. ])`||[])[1]==x),
        line&&(ids[x]=line.replace(/^ *#[^\d. ]/,''))
      )
    )
  )
$["es"]=x=>(ln.unshift(''),exec(shift()))
$["e&"]=x=>($.swap(),shift()?$.ei():shift())
$["e|"]=x=>($.swap(),shift()?shift():$.ei())

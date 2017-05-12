module.exports=$={}
$["gi"]=x=>(//
    unshift(
      ids[x=shift()]||(
        line=lines.find(a=>(a.match`^ *#([^\d. ])`||[])[1]==id),
        line&&(ids[id]=line.replace(/^ *#[^\d. ]/,''))
      )
    )
  )
$["si"]=x=>ids[shift()]=shift()

$["_"]=x=>unshift(-shift())
$["+"]=x=>unshift(shift()- -shift())
$["-"]=x=>unshift(shift()-shift())
$["*"]=x=>unshift(shift()*shift())
$["/"]=x=>unshift(shift()/shift())
$["%"]=x=>unshift(shift()%shift())
$["^"]=x=>unshift(Math.pow(shift(),shift()))

$["pick"]=x=>unshift(get(shift()))
$["nix"]=x=>splice(shift())
$["roll"]=x=>(x=get(0),$.pick(),unshift(x+1),$.nix())
$["roll_"]=x=>splice(shift(),0,shift())
$["dup"]=x=>unshift(stack[0])
$["drop"]=x=>shift()
$["rot"]=x=>unshift(splice(2,1))
$["rot_"]=x=>($.rot(),$.rot())
$["swap"]=x=>($.dup(),$.rot_(),$.drop())
$["nip"]=x=>($.swap(),$.drop())
$["tuck"]=x=>($.dup(),$.rot())
$["over"]=x=>($.swap(),$.tuck())
$["clr"]=x=>stack=[]
$["rev"]=x=>stack.reverse()

$["el"]=x=>(ln.unshift(shift()),lne())
$["en"]=x=>(ln[0].big||ln.unshift(ln[0]+1),lne())
$["ep"]=x=>(ln[0].big||ln.unshift(ln[0]-1),lne())
$["ei"]=x=>(ln.unshift(''),id=shift(),
    exec(
      ids[x=shift()]||(
        line=lines.find(a=>(a.match`^ *#([^\d. ])`||[])[1]==id),
        line&&(ids[id]=line.replace(/^ *#[^\d. ]/,''))
      )
    )
  )
$["es"]=x=>(ln.unshift(''),exec(shift()))

module.exports=$={}
$["("]=(h=stack[st])=>lambda=1
$[")"]=(h=stack[st])=>{}
$["()"]=(h=stack[st])=>unshift('') //push empty string
$["\\"]=(h=stack[st])=>unshift(' ') //push space
$["\\\\"]=(h=stack[st])=>unshift('\n') //push newline

$["gi"]=(h=stack[st])=>unshift(id()) //push string at ID given by index 0
$["gi\\"]=(h=stack[st])=>unshift(unesc(id())) //`gi` but parse escape codes
$["gs"]=(h=stack[st])=>unshift(form()) //push stack joined by newlines
$["si"]=(h=stack[st])=>ids[shift()]=shift() //set ID at index 0
$["::"]=(h=stack[st])=>id() //`gi` without pushing anything to stack (used for exposing ID's cleanly)

$["es"]=(h=stack[st])=>exec(shift()) //execute string at index 0
$["e&"]=(h=stack[st])=>($.swap(),shift()?$.es():shift()) //`es` if index 1 is truthy
$["e|"]=(h=stack[st])=>($.swap(),shift()?shift():$.es()) //`es` if index 1 is falsy
$["e?"]=(h=stack[st])=>($.rot(),shift()||$.swap(),shift(),$.es()) //`es` on index 1 if index 2 is truthy; otherwise, `es` on index 0
$["ei"]=(h=stack[st])=>(i=shift(),setInterval(a=>exec(i),shift())) //`es` at millisecond intervals given by index 1
$["et"]=(h=stack[st])=>(i=shift(),setTimeout(a=>exec(i),shift())) //`es` after waiting milliseconds given by index 0

$["read"]=(h=stack[st])=>unshift(fs.readFileSync(shift())+'') //read file at path given by index 0
$["write"]=(h=stack[st])=>fs.writeFileSync(shift(),shift()) //write string at index 1 to file at path given by index 0
$["in"]=(h=stack[st])=>(e=shift(),q=rl.createInterface(process.stdin,process.stdout),q.question('',a=>{ //`es` with line of STDIN at index 0
    unshift(e,a)
    $.es()
    q.close()
  }))
$["out"]=(h=stack[st])=>process.stdout.write(''+shift()) //output index 0 to STDOUT
$["outln"]=(h=stack[st])=>process.stdout.write(''+shift()+'\n') //output index 0 as a line to STDOUT

$["e"]=(h=stack[st])=>unshift(Math.E) //Euler's constant
$["pi"]=(h=stack[st])=>unshift(Math.PI) //π

$["E"]=(h=stack[st])=>($.swap(),unshift(shift()*Math.pow(10,shift()))) //`(index 1)*10^(index 0)`
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
$["range"]=(h=stack[st])=>(i=shift(),j=shift(),unshift(...range(j,i).reverse()))

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

$["split"]=(h=stack[st])=>($.swap(),unshift(...(shift()+'').split(shift()).reverse()))
$["join"]=(h=stack[st])=>(i=shift(),unshift(stack[st].slice(0).reverse().join(i)))
$["++"]=(h=stack[st])=>($.swap(),unshift(''+shift()+shift()))
$["len"]=(h=stack[st])=>unshift((''+shift()).length)
$[">char"]=(h=stack[st])=>unshift(String.fromCharCode(shift()))
$["<char"]=(h=stack[st])=>unshift(shift().charCodeAt())
$["lower"]=(h=stack[st])=>unshift(shift().toLowerCase())
$["upper"]=(h=stack[st])=>unshift(shift().toUpperCase())
$["repeat"]=(h=stack[st])=>($.swap(),unshift((shift()+'').repeat(shift())))
$["pad"]=(h=stack[st])=>(i=shift(),j=shift(),k=shift(),unshift(_.pad(k,j,i)))
$["padl"]=(h=stack[st])=>(i=shift(),j=shift(),k=shift(),unshift(_.padStart(k,j,i)))
$["padr"]=(h=stack[st])=>(i=shift(),j=shift(),k=shift(),unshift(_.padEnd(k,j,i)))

$["stack"]=(h=stack[st])=>stack[st=shift()]||(stack[st]=[])
$["push"]=(h=stack[st])=>stack[shift()].unshift(shift())
$["pull"]=(h=stack[st])=>unshift(stack[shift()].shift())
$["size"]=(h=stack[st])=>unshift(stack[st].length)
$["merge"]=(h=stack[st])=>unshift(...stack[shift()])
$["uniq"]=(h=stack[st])=>stack[st]=_.uniq(stack[st])
$["take"]=(h=stack[st])=>stack[st]=_.take(stack[st],shift())
$["drop"]=(h=stack[st])=>stack[st]=_.drop(stack[st],shift())

$["map"]=(h=stack[st])=>(X=shift(),iter.unshift(st),stack[st]=stack[st].map(a=>
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["filter"]=(h=stack[st])=>(X=shift(),iter.unshift(st),stack[st]=stack[st].filter(a=>
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["fold"]=(h=stack[st])=>(X=shift(),Z=shift(),iter.unshift(st),stack[st].map(a=>
    (stack[st=iter[0]+' ']=[X,a,Z],$.es(),Z=shift())
  ),delete stack[iter[0]+' '],st=iter.shift(),unshift(Z))
$["some"]=(h=stack[st])=>(X=shift(),iter.unshift(st),Z=+stack[st].some(a=>
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],stack[st=iter.shift()]=[Z])
$["all"]=(h=stack[st])=>(X=shift(),iter.unshift(st),Z=+stack[st].every(a=>
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],stack[st=iter.shift()]=[Z])
$["find"]=(h=stack[st])=>(X=shift(),iter.unshift(st),Z=+stack[st].find(a=>
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],stack[st=iter.shift()]=[Z])
$["findi"]=(h=stack[st])=>(X=shift(),iter.unshift(st),Z=+stack[st].findIndex(a=>
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],stack[st=iter.shift()]=[Z])
$["takew"]=(h=stack[st])=>(X=shift(),iter.unshift(st),stack[st]=_.takeWhile(stack[st],a=>
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["dropw"]=(h=stack[st])=>(X=shift(),iter.unshift(st),stack[st]=_.dropWhile(stack[st],a=>
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["sort"]=(h=stack[st])=>(X=shift(),iter.unshift(st),stack[st]=_.sortBy(stack[st],a=>
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["part"]=(h=stack[st])=>(X=shift(),Y=shift(),iter.unshift(st),Z=_.partition(stack[st],a=>
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift(),stack[st]=Z[0],stack[Y]=Z[1])

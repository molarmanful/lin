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
$["_"]=(h=stack[st])=>unshift(-shift()) //negation
$["+"]=(h=stack[st])=>unshift(shift()- -shift()) //addition
$["-"]=(h=stack[st])=>($.swap(),unshift(shift()-shift())) //subtraction
$["*"]=(h=stack[st])=>unshift(shift()*shift()) //multiplication
$["/"]=(h=stack[st])=>($.swap(),unshift(shift()/shift())) //division
$["//"]=(h=stack[st])=>($.swap(),unshift(Math.floor(shift()/shift()))) //integer division
$["%"]=(h=stack[st])=>($.swap(),unshift(mod(shift(),shift()))) //modulus
$["/%"]=(h=stack[st])=>($.over(),$.over(),$['//'](),$.rot_(),$['%']()) //divmod
$["^"]=(h=stack[st])=>($.swap(),unshift(Math.pow(shift(),shift()))) //exponentiation
$["abs"]=(h=stack[st])=>unshift(Math.abs(shift())) //absolute value
$["sign"]=(h=stack[st])=>unshift(Math.sign(shift())) //sign function
$["rand"]=(h=stack[st])=>unshift(Math.random()) //push random number between 0 and 1
$["time"]=(h=stack[st])=>unshift(_.now()) //push milliseconds since January 1, 1970 00:00:00.000
$["ln"]=(h=stack[st])=>unshift(Math.log(shift())) //natural logarithm
$["log"]=(h=stack[st])=>unshift(Math.log10(shift())) //base-10 logarithm
$["sin"]=(h=stack[st])=>unshift(Math.sin(shift())) //sine
$["cos"]=(h=stack[st])=>unshift(Math.cos(shift())) //cosine
$["tan"]=(h=stack[st])=>unshift(Math.tan(shift())) //tangent
$["sinh"]=(h=stack[st])=>unshift(Math.sinh(shift())) //hyperbolic sine
$["cosh"]=(h=stack[st])=>unshift(Math.cosh(shift())) //hyperbolic cosine
$["tanh"]=(h=stack[st])=>unshift(Math.tanh(shift())) //hyperbolic tangent
$["asin"]=(h=stack[st])=>unshift(Math.asin(shift())) //inverse sine
$["acos"]=(h=stack[st])=>unshift(Math.acos(shift())) //inverse cosine
$["atan"]=(h=stack[st])=>unshift(Math.atan(shift())) //inverse tangent
$["asinh"]=(h=stack[st])=>unshift(Math.asinh(shift())) //inverse hyperbolic sine
$["acosh"]=(h=stack[st])=>unshift(Math.acosh(shift())) //inverse hyperbolic cosine
$["atanh"]=(h=stack[st])=>unshift(Math.atanh(shift())) //inverse hyperbolic tangent
$["max"]=(h=stack[st])=>unshift(Math.max(...stack[st])) //push max
$["min"]=(h=stack[st])=>unshift(Math.min(...stack[st])) //push min
$["range"]=(h=stack[st])=>(i=shift(),j=shift(),unshift(...range(j,i).reverse())) //inclusive range

$["~"]=(h=stack[st])=>unshift(~shift()) //bitwise not
$["!"]=(h=stack[st])=>unshift(+!shift()) //logical not
$["&"]=(h=stack[st])=>unshift(shift()&shift()) //bitwise and
$["|"]=(h=stack[st])=>unshift(shift()|shift()) //bitwise or
$["$"]=(h=stack[st])=>unshift(shift()^shift()) //bitwise xor
$["<<"]=(h=stack[st])=>($.swap(),unshift(shift()<<shift())) //bitwise left shift
$[">>"]=(h=stack[st])=>($.swap(),unshift(shift()>>shift())) //bitwise right shift, sign-propagating
$[">>>"]=(h=stack[st])=>($.swap(),unshift(shift()>>>shift())) //bitwise right shift, zero-fill

$["="]=(h=stack[st])=>unshift(+(shift()==shift())) //equal
$["!="]=(h=stack[st])=>unshift(+(shift()!=shift())) //not equal
$[">"]=(h=stack[st])=>unshift(+(shift()<shift())) //greater than
$["<"]=(h=stack[st])=>unshift(+(shift()>shift())) //less than
$[">="]=(h=stack[st])=>unshift(+(shift()<=shift())) //greater than or equal to
$["<="]=(h=stack[st])=>unshift(+(shift()>=shift())) //less than or equal to
$["<=>"]=(h=stack[st])=>(i=shift(),j=shift(),unshift(i<j?1:i>j?-1:0)) //comparison function (-1 for less than, 0 for equal, 1 for greater than)

$["floor"]=(h=stack[st])=>unshift(Math.floor(shift())) //round towards -∞
$["trunc"]=(h=stack[st])=>unshift(Math.trunc(shift())) //round towards 0
$["round"]=(h=stack[st])=>unshift(Math.round(shift())) //round towards or away from 0 depending on < or >= .5
$["ceil"]=(h=stack[st])=>unshift(Math.ceil(shift())) //round towards ∞

$["pick"]=(h=stack[st])=>unshift(get(shift())) //`dup` but with any index
$["nix"]=(h=stack[st])=>splice(shift()) //`drop` but with any index
$["roll"]=(h=stack[st])=>(x=get(0),$.pick(),unshift(x+1),$.nix()) //`rot` but with any index
$["roll_"]=(h=stack[st])=>splice(shift(),0,shift()) //`rot_` but with any index
$["trade"]=(h=stack[st])=>unshift(splice(shift()-1,1,shift())[0]) //swap index 1 with index given by index 0
$["dup"]=(h=stack[st])=>unshift(stack[st][0]) //push index 0
$["drop"]=(h=stack[st])=>shift() //pop index 0
$["rot"]=(h=stack[st])=>unshift(splice(2)[0]) //bring index 2 to index 0
$["rot_"]=(h=stack[st])=>($.rot(),$.rot()) //bring index 0 to index 2
$["swap"]=(h=stack[st])=>unshift(splice(1)[0]) //bring index 1 to index 0
$["nip"]=(h=stack[st])=>($.swap(),shift()) //pop index 1
$["tuck"]=(h=stack[st])=>($.dup(),$.rot_()) //push index 0 to index 2
$["over"]=(h=stack[st])=>($.swap(),$.tuck()) //push index 1
$["clr"]=(h=stack[st])=>stack[st]=[] //pop all items
$["rev"]=(h=stack[st])=>stack[st].reverse() //reverse stack
$["dip"]=(h=stack[st])=>($.swap(),i=shift(),$.es(),unshift(i)) //pop index 0, `es`, push popped index 0

$["split"]=(h=stack[st])=>($.swap(),unshift(...(shift()+'').split(shift()).reverse())) //split string at index 1 over string at index 0
$["join"]=(h=stack[st])=>(i=shift(),unshift(stack[st].slice(0).reverse().join(i))) //join stack over string at index 0
$["++"]=(h=stack[st])=>($.swap(),unshift(''+shift()+shift())) //concatenate top 2 items as strings
$["len"]=(h=stack[st])=>unshift((''+shift()).length) //push string length of index 0
$[">char"]=(h=stack[st])=>unshift(String.fromCodePoint(shift())) //convert number to Unicode
$["<char"]=(h=stack[st])=>unshift(shift().codePointAt()) //convert Unicode to number
$["lower"]=(h=stack[st])=>unshift(shift().toLowerCase()) //lowercase
$["upper"]=(h=stack[st])=>unshift(shift().toUpperCase()) //uppercase
$["repeat"]=(h=stack[st])=>($.swap(),unshift((shift()+'').repeat(shift()))) //repeat string by index 0
$["pad"]=(h=stack[st])=>(i=shift(),j=shift(),k=shift(),unshift(_.pad(k,j,i))) //pad string given by index 2 until length given by index 0 with string given by index 1
$["padl"]=(h=stack[st])=>(i=shift(),j=shift(),k=shift(),unshift(_.padStart(k,j,i))) //`pad` but only from the left
$["padr"]=(h=stack[st])=>(i=shift(),j=shift(),k=shift(),unshift(_.padEnd(k,j,i))) //`pad` but only from the right

$["stack"]=(h=stack[st])=>stack[st=shift()]||(stack[st]=[]) //initialize stack with name given by index 0 or switch to that stack if it already exists
$["push"]=(h=stack[st])=>stack[shift()].unshift(shift()) //push index 1 to another stack with name given by index 0
$["pull"]=(h=stack[st])=>unshift(stack[shift()].shift()) //push top item of another stack with name given by index 0
$["size"]=(h=stack[st])=>unshift(stack[st].length) //push stack length
$["uniq"]=(h=stack[st])=>stack[st]=_.uniq(stack[st]) //remove all duplicates in current stack
$["take"]=(h=stack[st])=>stack[st]=_.take(stack[st],shift()) //keep top _n_ items, where _n_ is index 0
$["drop"]=(h=stack[st])=>stack[st]=_.drop(stack[st],shift()) //pop top _n_ items, where _n_ is index 0
$["merge"]=(h=stack[st])=>unshift(...stack[shift()]) //push items of another stack with name given by index 0
$["union"]=(h=stack[st])=>(i=shift(),stack[st]=_.union(stack[st],stack[i])) //set union with current stack and stack with name given by index 0
$["intersection"]=(h=stack[st])=>(i=shift(),stack[st]=_.intersection(stack[st],stack[i])) //set intersection with current stack and stack with name given by index 0
$["difference"]=(h=stack[st])=>(i=shift(),stack[st]=_.difference(stack[st],stack[i])) //set difference with current stack and stack with name given by index 0

$["map"]=(h=stack[st])=>(X=shift(),iter.unshift(st),stack[st]=stack[st].map(a=> //`es` on each individual item in the stack
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["filter"]=(h=stack[st])=>(X=shift(),iter.unshift(st),stack[st]=stack[st].filter(a=> //remove each item that is falsy after `es`
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["fold"]=(h=stack[st])=>(X=shift(),Z=shift(),iter.unshift(st),stack[st].map(a=> //VERY hard to explain; [this might help](https://en.wikipedia.org/wiki/Fold_(higher-order_function))
    (stack[st=iter[0]+' ']=[X,a,Z],$.es(),Z=shift())
  ),delete stack[iter[0]+' '],st=iter.shift(),unshift(Z))
$["any"]=(h=stack[st])=>(X=shift(),iter.unshift(st),Z=+stack[st].some(a=> //push 1 if any items return truthy after `es`, else push 0
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],stack[st=iter.shift()]=[Z])
$["all"]=(h=stack[st])=>(X=shift(),iter.unshift(st),Z=+stack[st].every(a=> //push 1 if all items return truthy after `es`, else push 0
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],stack[st=iter.shift()]=[Z])
$["find"]=(h=stack[st])=>(X=shift(),iter.unshift(st),Z=stack[st].find(a=> //find first item that returns truthy after `es` or undefined on failure
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],stack[st=iter.shift()]=[Z])
$["findi"]=(h=stack[st])=>(X=shift(),iter.unshift(st),Z=+stack[st].findIndex(a=> //`find` but returns index (or -1 on fail)
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],stack[st=iter.shift()]=[Z])
$["takew"]=(h=stack[st])=>(X=shift(),iter.unshift(st),stack[st]=_.takeWhile(stack[st],a=> //`take` items until `es` returns falsy for an item
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["dropw"]=(h=stack[st])=>(X=shift(),iter.unshift(st),stack[st]=_.dropWhile(stack[st],a=> //`drop` items until `es` returns falsy for an item
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["sort"]=(h=stack[st])=>(X=shift(),iter.unshift(st),stack[st]=_.sortBy(stack[st],a=> //sort items in ascending order based on `es`
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["part"]=(h=stack[st])=>(X=shift(),Y=shift(),iter.unshift(st),Z=_.partition(stack[st],a=> //separate items based on whether they return truthy after `es`; failing items are put into a stack with the name given by index 1
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift(),stack[st]=Z[0],stack[Y]=Z[1])

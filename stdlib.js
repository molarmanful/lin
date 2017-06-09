module.exports=$={}
$["("]=(h,i,j,k,X,Y,Z)=>lambda=1
$[")"]=(h,i,j,k,X,Y,Z)=>{}
$["()"]=(h,i,j,k,X,Y,Z)=>unshift('') //push empty string
$["\\"]=(h,i,j,k,X,Y,Z)=>unshift(' ') //push space
$["n\\"]=(h,i,j,k,X,Y,Z)=>unshift('\n') //push newline

$["gi"]=(h,i,j,k,X,Y,Z)=>unshift(id()) //push string at ID given by index 0
$["gi\\"]=(h,i,j,k,X,Y,Z)=>unshift(unesc(id())) //`gi` but parse escape codes
$["gl"]=(h,i,j,k,X,Y,Z)=>unshift(loc()) //`gi` but in the local scope
$["gl\\"]=(h,i,j,k,X,Y,Z)=>unshift(unesc(loc())) //`gl` but parse escape codes
$["gs"]=(h,i,j,k,X,Y,Z)=>unshift(form()) //push stack joined by newlines
$["si"]=(h,i,j,k,X,Y,Z)=>ids[shift()]=shift() //set global ID at index 0
$["sl"]=(h,i,j,k,X,Y,Z)=>stack[st].scope[shift()]=shift() //set local ID at index 0
$["::"]=(h,i,j,k,X,Y,Z)=>loc() //`gi` without pushing anything to stack (used for exposing ID's cleanly)
$[":::"]=(h,i,j,k,X,Y,Z)=>id() //`::` but exposes ID's into the global scope

$["es"]=(h,i,j,k,X,Y,Z)=>exec(shift()) //execute string at index 0
$["e&"]=(h,i,j,k,X,Y,Z)=>($.swap(),shift()?$.es():shift()) //`es` if index 1 is truthy
$["e|"]=(h,i,j,k,X,Y,Z)=>($.swap(),shift()?shift():$.es()) //`es` if index 1 is falsy
$["e?"]=(h,i,j,k,X,Y,Z)=>($.rot(),shift()||$.swap(),shift(),$.es()) //`es` on index 1 if index 2 is truthy; otherwise, `es` on index 0

$["read"]=(h,i,j,k,X,Y,Z)=>unshift(fs.readFileSync(shift())+'') //read file at path given by index 0
$["write"]=(h,i,j,k,X,Y,Z)=>fs.writeFileSync(shift(),shift()) //write string at index 1 to file at path given by index 0
$["in"]=(h,i,j,k,X,Y,Z)=>unshift((''+cp.execSync('read x;echo $x',{stdio:[process.stdin]})).slice(0,-1)) //pushes user input
$["out"]=(h,i,j,k,X,Y,Z)=>process.stdout.write(''+shift()) //output index 0 to STDOUT
$["outln"]=(h,i,j,k,X,Y,Z)=>process.stdout.write(''+shift()+'\n') //output index 0 as a line to STDOUT

$["e"]=(h,i,j,k,X,Y,Z)=>unshift(Math.E) //Euler's constant
$["pi"]=(h,i,j,k,X,Y,Z)=>unshift(Math.PI) //π

$["E"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift(shift()*Math.pow(10,shift()))) //`(index 1)*10^(index 0)`
$["_"]=(h,i,j,k,X,Y,Z)=>unshift(-shift()) //negation
$["+"]=(h,i,j,k,X,Y,Z)=>unshift(shift()- -shift()) //addition
$["-"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift(shift()-shift())) //subtraction
$["*"]=(h,i,j,k,X,Y,Z)=>unshift(shift()*shift()) //multiplication
$["/"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift(shift()/shift())) //division
$["//"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift(Math.floor(shift()/shift()))) //integer division
$["%"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift(mod(shift(),shift()))) //modulus
$["/%"]=(h,i,j,k,X,Y,Z)=>($.over(),$.over(),$['//'](),$.rot_(),$['%']()) //divmod
$["^"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift(Math.pow(shift(),shift()))) //exponentiation
$["abs"]=(h,i,j,k,X,Y,Z)=>unshift(Math.abs(shift())) //absolute value
$["sign"]=(h,i,j,k,X,Y,Z)=>unshift(Math.sign(shift())) //sign function
$["rand"]=(h,i,j,k,X,Y,Z)=>unshift(Math.random()) //push random number between 0 and 1
$["time"]=(h,i,j,k,X,Y,Z)=>unshift(_.now()) //push milliseconds since January 1, 1970 00:00:00.000
$["ln"]=(h,i,j,k,X,Y,Z)=>unshift(Math.log(shift())) //natural logarithm
$["log"]=(h,i,j,k,X,Y,Z)=>unshift(Math.log10(shift())) //base-10 logarithm
$["sin"]=(h,i,j,k,X,Y,Z)=>unshift(Math.sin(shift())) //sine
$["cos"]=(h,i,j,k,X,Y,Z)=>unshift(Math.cos(shift())) //cosine
$["tan"]=(h,i,j,k,X,Y,Z)=>unshift(Math.tan(shift())) //tangent
$["sinh"]=(h,i,j,k,X,Y,Z)=>unshift(Math.sinh(shift())) //hyperbolic sine
$["cosh"]=(h,i,j,k,X,Y,Z)=>unshift(Math.cosh(shift())) //hyperbolic cosine
$["tanh"]=(h,i,j,k,X,Y,Z)=>unshift(Math.tanh(shift())) //hyperbolic tangent
$["asin"]=(h,i,j,k,X,Y,Z)=>unshift(Math.asin(shift())) //inverse sine
$["acos"]=(h,i,j,k,X,Y,Z)=>unshift(Math.acos(shift())) //inverse cosine
$["atan"]=(h,i,j,k,X,Y,Z)=>unshift(Math.atan(shift())) //inverse tangent
$["asinh"]=(h,i,j,k,X,Y,Z)=>unshift(Math.asinh(shift())) //inverse hyperbolic sine
$["acosh"]=(h,i,j,k,X,Y,Z)=>unshift(Math.acosh(shift())) //inverse hyperbolic cosine
$["atanh"]=(h,i,j,k,X,Y,Z)=>unshift(Math.atanh(shift())) //inverse hyperbolic tangent
$["max"]=(h,i,j,k,X,Y,Z)=>unshift(Math.max(...stack[st])) //push max
$["min"]=(h,i,j,k,X,Y,Z)=>unshift(Math.min(...stack[st])) //push min
$["range"]=(h,i,j,k,X,Y,Z)=>(i=shift(),j=shift(),unshift(...range(j,i).reverse())) //inclusive range

$["~"]=(h,i,j,k,X,Y,Z)=>unshift(~shift()) //bitwise not
$["!"]=(h,i,j,k,X,Y,Z)=>unshift(+!shift()) //logical not
$["&"]=(h,i,j,k,X,Y,Z)=>unshift(shift()&shift()) //bitwise and
$["|"]=(h,i,j,k,X,Y,Z)=>unshift(shift()|shift()) //bitwise or
$["$"]=(h,i,j,k,X,Y,Z)=>unshift(shift()^shift()) //bitwise xor
$["<<"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift(shift()<<shift())) //bitwise left shift
$[">>"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift(shift()>>shift())) //bitwise right shift, sign-propagating
$[">>>"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift(shift()>>>shift())) //bitwise right shift, zero-fill

$["="]=(h,i,j,k,X,Y,Z)=>unshift(+(shift()==shift())) //equal
$["!="]=(h,i,j,k,X,Y,Z)=>unshift(+(shift()!=shift())) //not equal
$[">"]=(h,i,j,k,X,Y,Z)=>unshift(+(shift()<shift())) //greater than
$["<"]=(h,i,j,k,X,Y,Z)=>unshift(+(shift()>shift())) //less than
$[">="]=(h,i,j,k,X,Y,Z)=>unshift(+(shift()<=shift())) //greater than or equal to
$["<="]=(h,i,j,k,X,Y,Z)=>unshift(+(shift()>=shift())) //less than or equal to
$["<=>"]=(h,i,j,k,X,Y,Z)=>(i=shift(),j=shift(),unshift(i<j?1:i>j?-1:0)) //comparison function (-1 for less than, 0 for equal, 1 for greater than)

$["floor"]=(h,i,j,k,X,Y,Z)=>unshift(Math.floor(shift())) //round towards -∞
$["trunc"]=(h,i,j,k,X,Y,Z)=>unshift(Math.trunc(shift())) //round towards 0
$["round"]=(h,i,j,k,X,Y,Z)=>unshift(Math.round(shift())) //round towards or away from 0 depending on < or >= .5
$["ceil"]=(h,i,j,k,X,Y,Z)=>unshift(Math.ceil(shift())) //round towards ∞

$["pick"]=(h,i,j,k,X,Y,Z)=>unshift(get(shift())) //`dup` but with any index
$["nix"]=(h,i,j,k,X,Y,Z)=>splice(shift()) //`drop` but with any index
$["roll"]=(h,i,j,k,X,Y,Z)=>(x=get(0),$.pick(),unshift(x+1),$.nix()) //`rot` but with any index
$["roll_"]=(h,i,j,k,X,Y,Z)=>splice(shift(),0,shift()) //`rot_` but with any index
$["trade"]=(h,i,j,k,X,Y,Z)=>unshift(splice(shift()-1,1,shift())[0]) //swap index 1 with index given by index 0
$["dup"]=(h,i,j,k,X,Y,Z)=>unshift(stack[st][0]) //push index 0
$["drop"]=(h,i,j,k,X,Y,Z)=>shift() //pop index 0
$["rot"]=(h,i,j,k,X,Y,Z)=>unshift(splice(2)[0]) //bring index 2 to index 0
$["rot_"]=(h,i,j,k,X,Y,Z)=>($.rot(),$.rot()) //bring index 0 to index 2
$["swap"]=(h,i,j,k,X,Y,Z)=>unshift(splice(1)[0]) //bring index 1 to index 0
$["nip"]=(h,i,j,k,X,Y,Z)=>($.swap(),shift()) //pop index 1
$["tuck"]=(h,i,j,k,X,Y,Z)=>($.dup(),$.rot_()) //push index 0 to index 2
$["over"]=(h,i,j,k,X,Y,Z)=>($.swap(),$.tuck()) //push index 1
$["clr"]=(h,i,j,k,X,Y,Z)=>stack[st]=[] //pop all items
$["rev"]=(h,i,j,k,X,Y,Z)=>stack[st].reverse() //reverse stack
$["dip"]=(h,i,j,k,X,Y,Z)=>($.swap(),i=shift(),$.es(),unshift(i)) //pop index 0, `es`, push popped index 0

$["split"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift(...(shift()+'').split(shift()).reverse())) //split string at index 1 over string at index 0
$["join"]=(h,i,j,k,X,Y,Z)=>(i=shift(),unshift(stack[st].slice(0).reverse().join(i))) //join stack over string at index 0
$["++"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift(''+shift()+shift())) //concatenate top 2 items as strings
$["len"]=(h,i,j,k,X,Y,Z)=>unshift((''+shift()).length) //push string length of index 0
$[">char"]=(h,i,j,k,X,Y,Z)=>unshift(String.fromCodePoint(shift())) //convert number to Unicode
$["<char"]=(h,i,j,k,X,Y,Z)=>unshift(shift().codePointAt()) //convert Unicode to number
$["lower"]=(h,i,j,k,X,Y,Z)=>unshift(shift().toLowerCase()) //lowercase
$["upper"]=(h,i,j,k,X,Y,Z)=>unshift(shift().toUpperCase()) //uppercase
$["repeat"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift((shift()+'').repeat(shift()))) //repeat string by index 0
$["pad"]=(h,i,j,k,X,Y,Z)=>(i=shift(),j=shift(),k=shift(),unshift(_.pad(k,j,i))) //pad string given by index 2 until length given by index 0 with string given by index 1
$["padl"]=(h,i,j,k,X,Y,Z)=>(i=shift(),j=shift(),k=shift(),unshift(_.padStart(k,j,i))) //`pad` but only from the left
$["padr"]=(h,i,j,k,X,Y,Z)=>(i=shift(),j=shift(),k=shift(),unshift(_.padEnd(k,j,i))) //`pad` but only from the right

$["stack"]=(h,i,j,k,X,Y,Z)=>stack[st=shift()]||(stack[st]=[]) //initialize stack with name given by index 0 or switch to that stack if it already exists
$["push"]=(h,i,j,k,X,Y,Z)=>stack[shift()].unshift(shift()) //push index 1 to another stack with name given by index 0
$["pull"]=(h,i,j,k,X,Y,Z)=>unshift(stack[shift()].shift()) //push top item of another stack with name given by index 0
$["size"]=(h,i,j,k,X,Y,Z)=>unshift(stack[st].length) //push stack length
$["uniq"]=(h,i,j,k,X,Y,Z)=>stack[st]=_.uniq(stack[st]) //remove all duplicates in current stack
$["take"]=(h,i,j,k,X,Y,Z)=>stack[st]=_.take(stack[st],shift()) //keep top _n_ items, where _n_ is index 0
$["drop"]=(h,i,j,k,X,Y,Z)=>stack[st]=_.drop(stack[st],shift()) //pop top _n_ items, where _n_ is index 0
$["merge"]=(h,i,j,k,X,Y,Z)=>unshift(...stack[shift()]) //push items of another stack with name given by index 0
$["union"]=(h,i,j,k,X,Y,Z)=>(i=shift(),stack[st]=_.union(stack[st],stack[i])) //set union with current stack and stack with name given by index 0
$["intersection"]=(h,i,j,k,X,Y,Z)=>(i=shift(),stack[st]=_.intersection(stack[st],stack[i])) //set intersection with current stack and stack with name given by index 0
$["difference"]=(h,i,j,k,X,Y,Z)=>(i=shift(),stack[st]=_.difference(stack[st],stack[i])) //set difference with current stack and stack with name given by index 0

$["map"]=(h,i,j,k,X,Y,Z)=>(X=shift(),iter.unshift(st),stack[st]=stack[st].map(a=> //`es` on each individual item in the stack
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["filter"]=(h,i,j,k,X,Y,Z)=>(X=shift(),iter.unshift(st),stack[st]=stack[st].filter(a=> //remove each item that is falsy after `es`
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["fold"]=(h,i,j,k,X,Y,Z)=>(X=shift(),Z=shift(),iter.unshift(st),stack[st].map(a=> //VERY hard to explain; [this might help](https://en.wikipedia.org/wiki/Fold_(higher-order_function))
    (stack[st=iter[0]+' ']=[X,a,Z],$.es(),Z=shift())
  ),delete stack[iter[0]+' '],st=iter.shift(),unshift(Z))
$["any"]=(h,i,j,k,X,Y,Z)=>(X=shift(),iter.unshift(st),Z=+stack[st].some(a=> //push 1 if any items return truthy after `es`, else push 0
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],stack[st=iter.shift()]=[Z])
$["all"]=(h,i,j,k,X,Y,Z)=>(X=shift(),iter.unshift(st),Z=+stack[st].every(a=> //push 1 if all items return truthy after `es`, else push 0
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],stack[st=iter.shift()]=[Z])
$["find"]=(h,i,j,k,X,Y,Z)=>(X=shift(),iter.unshift(st),Z=stack[st].find(a=> //find first item that returns truthy after `es` or undefined on failure
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],stack[st=iter.shift()]=[Z])
$["findi"]=(h,i,j,k,X,Y,Z)=>(X=shift(),iter.unshift(st),Z=+stack[st].findIndex(a=> //`find` but returns index (or -1 on fail)
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],stack[st=iter.shift()]=[Z])
$["takew"]=(h,i,j,k,X,Y,Z)=>(X=shift(),iter.unshift(st),stack[st]=_.takeWhile(stack[st],a=> //`take` items until `es` returns falsy for an item
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["dropw"]=(h,i,j,k,X,Y,Z)=>(X=shift(),iter.unshift(st),stack[st]=_.dropWhile(stack[st],a=> //`drop` items until `es` returns falsy for an item
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["sort"]=(h,i,j,k,X,Y,Z)=>(X=shift(),iter.unshift(st),stack[st]=_.sortBy(stack[st],a=> //sort items in ascending order based on `es`
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift())
$["part"]=(h,i,j,k,X,Y,Z)=>(X=shift(),Y=shift(),iter.unshift(st),Z=_.partition(stack[st],a=> //separate items based on whether they return truthy after `es`; failing items are put into a stack with the name given by index 1
    (stack[st=iter[0]+' ']=[X,a],$.es(),shift())
  ),delete stack[iter[0]+' '],st=iter.shift(),stack[st]=Z[0],stack[Y]=Z[1])

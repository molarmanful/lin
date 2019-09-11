module.exports=$={}
$["("]=(h,i,j,k,X,Y,Z)=>(lambda=1,scope.unshift({}))
$[")"]=(h,i,j,k,X,Y,Z)=>{}
$["["]=(h,i,j,k,X,Y,Z)=>(iter.unshift(st),stack[st=iter[0]+'\n']=[])
$["]"]=(h,i,j,k,X,Y,Z)=>(X=stack[st],delete stack[iter[0]+'\n'],st=iter.shift(),unshift(X))
$["{"]=(h,i,j,k,X,Y,Z)=>(objs.unshift({}),iter.unshift(st),stack[st=iter[0]+'\n']=[])
$["}"]=(h,i,j,k,X,Y,Z)=>(X=objs.shift(),delete stack[iter[0]+'\n'],st=iter.shift(),unshift(X))
$["()"]=(h,i,j,k,X,Y,Z)=>unshift('') //push empty string
$["[]"]=(h,i,j,k,X,Y,Z)=>unshift([]) //initialize empty list
$["{}"]=(h,i,j,k,X,Y,Z)=>unshift({}) //initialize empty list
$["\\"]=(h,i,j,k,X,Y,Z)=>unshift(' ') //push space
$["n\\"]=(h,i,j,k,X,Y,Z)=>unshift('\n') //push newline

$["gi"]=(h,i,j,k,X,Y,Z)=>unshift(ids[shift()]) //push string at ID given by index 0
$["gi\\"]=(h,i,j,k,X,Y,Z)=>unshift(unesc(ids[shift()])) //`gi` but parse escape codes
$["gl"]=(h,i,j,k,X,Y,Z)=>unshift(getscope())
$["gl\\"]=(h,i,j,k,X,Y,Z)=>unshift(unesc(getscope()))
$["gs"]=(h,i,j,k,X,Y,Z)=>unshift(form()) //push stack joined by newlines
$["g@"]=(h,i,j,k,X,Y,Z)=>unshift(lines[shift()]) //push line at popped number (0-indexed)
$["g:"]=(h,i,j,k,X,Y,Z)=>(X=shift(),unshift(shift()[X])) //get value for key given by index 0 within object at index 1
$["form"]=(h,i,j,k,X,Y,Z)=>unshift(form([shift()]))
$["si"]=(h,i,j,k,X,Y,Z)=>ids[shift()]=shift() //set global ID at index 0
$["sl"]=(h,i,j,k,X,Y,Z)=>(X=shift(),Y=shift(),scope.length?(scope[0][X]=Y):(ids[X]=Y))
$[":"]=(h,i,j,k,X,Y,Z)=>objs.length?(objs[0][shift()]=shift()):(X=shift(),Y=shift(),stack[st][0][X]=Y) //set a key-value pair in an object, where index 0 is the key and index 1 is the value
$["::"]=(h,i,j,k,X,Y,Z)=>id() //`gi` without pushing anything to stack (used for exposing ID's cleanly)
$["type"]=(h,i,j,k,X,Y,Z)=>(X=shift(),unshift(X.pop?3:X.big?2:X.toFixed&&!isNaN(X)?1:0)) //pushes 1 if index 0 is a number, 2 if string, 3 if list, and 0 if anything else (ex.: undefined)

$["es"]=(h,i,j,k,X,Y,Z)=>exec(shift(),1) //execute string at index 0
$["e*"]=(h,i,j,k,X,Y,Z)=>(i=shift(),j=shift(),addf(a=>(i&&(addf(a=>unshift(i-1,j),'e*'),exec(j,1))))) //`es` on index 1 for number of times given by index 0
$["e&"]=(h,i,j,k,X,Y,Z)=>($.swap(),shift()?$.es():shift()) //`es` if index 1 is truthy
$["e|"]=(h,i,j,k,X,Y,Z)=>($.swap(),shift()?shift():$.es()) //`es` if index 1 is falsy
$["e?"]=(h,i,j,k,X,Y,Z)=>($.rot(),shift()||$.swap(),shift(),$.es()) //`es` on index 1 if index 2 is truthy; otherwise, `es` on index 0
$["ew"]=(h,i,j,k,X,Y,Z)=>(i=shift(),j=shift(),addf(a=>(shift()&&(addf(a=>unshift(i,j),'ew'),exec(i,1)))),exec(j,1)) //while `es` on index 1 is truthy, `es` on index 0
$[";"]=(h,i,j,k,X,Y,Z)=>(lns.unshift(lns[0]+1),code[0].length&&addf(a=>lns.shift()),exec(lines[lns[0]],1)) // `es` next line
$[";;"]=(h,i,j,k,X,Y,Z)=>(lns.unshift(lns[0]-1),code[0].length&&addf(a=>lns.shift()),exec(lines[lns[0]],1)) // `es` previous line
$["stop"]=(h,i,j,k,X,Y,Z)=>code.shift() //end execution of current call stack frame

$["read"]=(h,i,j,k,X,Y,Z)=>unshift(fs.readFileSync(shift())+'') //read file at path given by index 0
$["write"]=(h,i,j,k,X,Y,Z)=>fs.writeFileSync(shift(),shift()) //write string at index 1 to file at path given by index 0
$["in"]=(h,i,j,k,X,Y,Z)=>unshift((''+cp.execSync('read x;echo $x',{stdio:[process.stdin]})).slice(0,-1)) //push user input
$["inh"]=(h,i,j,k,X,Y,Z)=>unshift((''+cp.execSync('read -s x;echo $x',{stdio:[process.stdin]})).slice(0,-1)) //push user input without echoing
$["out"]=(h,i,j,k,X,Y,Z)=>process.stdout.write(''+shift()) //output index 0 to STDOUT
$["outln"]=(h,i,j,k,X,Y,Z)=>process.stdout.write(''+shift()+'\n') //output index 0 as a line to STDOUT

$["$E"]=(h,i,j,k,X,Y,Z)=>unshift(Math.E) //Euler's constant
$["$Pi"]=(h,i,j,k,X,Y,Z)=>unshift(Math.PI) //π

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
$["dip"]=(h,i,j,k,X,Y,Z)=>($.swap(),i=shift(),addf(a=>unshift(i)),exec(shift(),1)) //pop index 0, `es`, push popped index 0

$["split"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift(...(shift()+'').split(shift()).reverse())) //split string at index 1 over string at index 0
$["join"]=(h,i,j,k,X,Y,Z)=>(i=shift(),unshift(stack[st].slice(0).reverse().join(i))) //join stack over string at index 0
$["++"]=(h,i,j,k,X,Y,Z)=>unshift(shift().concat(shift())) //concatenate top 2 items as strings or lists
$["len"]=(h,i,j,k,X,Y,Z)=>(X=shift(),unshift(X.toFixed?(X+'').length:X.length)) //push string length of index 0
$[">char"]=(h,i,j,k,X,Y,Z)=>unshift(String.fromCodePoint(shift())) //convert number to Unicode
$["<char"]=(h,i,j,k,X,Y,Z)=>unshift(shift().codePointAt()) //convert Unicode to number
$["lower"]=(h,i,j,k,X,Y,Z)=>unshift(shift().toLowerCase()) //lowercase
$["upper"]=(h,i,j,k,X,Y,Z)=>unshift(shift().toUpperCase()) //uppercase
$["repeat"]=(h,i,j,k,X,Y,Z)=>($.swap(),unshift((shift()+'').repeat(shift()))) //repeat string by index 0
$["pad"]=(h,i,j,k,X,Y,Z)=>(i=shift(),j=shift(),k=shift(),unshift(_.pad(k,j,i))) //pad string given by index 2 until length given by index 0 with string given by index 1
$["padl"]=(h,i,j,k,X,Y,Z)=>(i=shift(),j=shift(),k=shift(),unshift(_.padStart(k,j,i))) //`pad` but only from the left
$["padr"]=(h,i,j,k,X,Y,Z)=>(i=shift(),j=shift(),k=shift(),unshift(_.padEnd(k,j,i))) //`pad` but only from the right

$["stack"]=(h,i,j,k,X,Y,Z)=>(iter.unshift(st),X=shift(),Y=shift(),stack[st=X]||(stack[st]=[]),addf(a=>st=iter.shift()),exec(Y,1)) //execute string given by index 1 on a stack with name given by index 0
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
$["wrap"]=(h,i,j,k,X,Y,Z)=>unshift([shift()]) //wrap index 0 in a list
$["wrap_"]=(h,i,j,k,X,Y,Z)=>(X=shift(),unshift(...X.pop?X:[X])) //opposite of `wrap`; take all items in list at index 0 and push to parent stack
$["enclose"]=(h,i,j,k,X,Y,Z)=>unshift(stack[st].slice(0)) //push entire stack as a list
$["usurp"]=(h,i,j,k,X,Y,Z)=>stack[st]=[...shift()] //set current stack to the list at index 0
$["'"]=(h,i,j,k,X,Y,Z)=>(X=shift(),Y=shift(),Y=Y.big?Y.split``:Y.toFixed?(Y+'').split``:Y,iter.unshift(st), //apply function to list given by index 0
    stack[st=iter[0]+'\n']=Y,
    addf(a=>(Y=stack[st],delete stack[iter[0]+'\n'],st=iter.shift(),unshift(Y))),exec(X,1))
$["flat"]=(h,i,j,k,X,Y,Z)=>stack[st]=_.flatten(stack[st]) //`wrap_` all elements
$["chunk"]=(h,i,j,k,X,Y,Z)=>stack[st]=(X=shift(),_.chunk(stack[st],X)) //split stack into lists of length given by index 0
$["enum"]=(h,i,j,k,X,Y,Z)=>stack[st]=stack[st].map((a,b)=>[b,a]) //convert each item in stack to a list containing index and item
$["enom"]=(h,i,j,k,X,Y,Z)=>unshift(Object.keys(X=shift()).map(a=>[X[a],a])) //convert each item in stack to a list containing index and item

$["map"]=(h,i,j,k,X,Y,Z)=>(X=shift(),iter.unshift(st), //`es` on each individual item in the stack
  addf(a=>(delete stack[iter[0]+' '],st=iter.shift())),
  stack[st].map((a,b)=>
    addf(A=>stack[st=iter[0]+' ']=[a],...parse(X),A=>stack[iter[0]][b]=shift())
  ))
$["fold"]=(h,i,j,k,X,Y,Z)=>(X=shift(),Z=shift(),iter.unshift(st), //`es` with accumulator and item; result of each `es` becomes the new accumulator
  addf(a=>(delete stack[iter[0]+' '],stack[st=iter.shift()]=[Z])),
  stack[st].map(a=>
    addf(A=>stack[st=iter[0]+' ']=[a,Z],...parse(X),A=>Z=shift())
  ))

$["filter"]=(h,i,j,k,X,Y,Z)=>(addf(a=>stack[st]=stack[st].filter(a=>a)),$.map()) //remove each item that is falsy after `es`
$["any"]=(h,i,j,k,X,Y,Z)=>(addf(a=>stack[st]=[+stack[st].some(a=>a)]),$.map()) //push 1 if any items return truthy after `es`, else push 0
$["all"]=(h,i,j,k,X,Y,Z)=>(addf(a=>stack[st]=[+stack[st].every(a=>a)]),$.map()) //push 1 if all items return truthy after `es`, else push 0
$["find"]=(h,i,j,k,X,Y,Z)=>(addf(a=>stack[st]=[stack[st].find(a=>a)]),$.map()) //find first item that returns truthy after `es` or undefined on failure
$["findi"]=(h,i,j,k,X,Y,Z)=>(addf(a=>stack[st]=[stack[st].findIndex(a=>a)]),$.map()) //`find` but returns index (or -1 on fail)
$["takew"]=(h,i,j,k,X,Y,Z)=>(addf(a=>stack[st]=_.takeWhile(stack[st])),$.map()) //`take` items until `es` returns falsy for an item
$["dropw"]=(h,i,j,k,X,Y,Z)=>(addf(a=>stack[st]=_.dropWhile(stack[st])),$.map()) //`drop` items until `es` returns falsy for an item
$["sort"]=(h,i,j,k,X,Y,Z)=>(addf(a=>stack[st]=_.sortBy(stack[st]).reverse()),$.map()) //sort items in ascending order based on `es`
$["part"]=(h,i,j,k,X,Y,Z)=>(addf(a=>stack[st]=_.partition(stack[st])),$.map()) //separate items into 2 lists based on whether they return truthy after `es`

import {fs, cp, unesc, _, INT as I} from './bridge.mjs'
let SL = {}

SL["("]=(h,i,j,k,X,Y,Z)=>(I.lambda=1,I.scope.unshift({}))
SL[")"]=(h,i,j,k,X,Y,Z)=>{}
SL["["]=(h,i,j,k,X,Y,Z)=>(I.iter.unshift(I.st),I.stack[I.st=I.iter[0]+'\n']=[])
SL["]"]=(h,i,j,k,X,Y,Z)=>(X=I.stack[I.st],delete I.stack[I.iter[0]+'\n'],I.st=I.iter.shift(),I.unshift(X))
SL["{"]=(h,i,j,k,X,Y,Z)=>(I.objs.unshift({}),I.iter.unshift(I.st),I.stack[I.st=I.iter[0]+'\n']=[])
SL["}"]=(h,i,j,k,X,Y,Z)=>(X=I.objs.shift(),delete I.stack[I.iter[0]+'\n'],I.st=I.iter.shift(),I.unshift(X))
SL["()"]=(h,i,j,k,X,Y,Z)=>I.unshift('') //push empty string
SL["[]"]=(h,i,j,k,X,Y,Z)=>I.unshift([]) //initialize empty list
SL["{}"]=(h,i,j,k,X,Y,Z)=>I.unshift({}) //initialize empty list
SL["\\"]=(h,i,j,k,X,Y,Z)=>I.unshift(' ') //push space
SL["n\\"]=(h,i,j,k,X,Y,Z)=>I.unshift('\n') //push newline

SL["gi"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.ids[I.shift()]) //push string at ID given by index 0
SL["gi\\"]=(h,i,j,k,X,Y,Z)=>I.unshift(unesc(I.ids[I.shift()])) //`gi` but parse escape codes
SL["gl"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.getscope())
SL["gl\\"]=(h,i,j,k,X,Y,Z)=>I.unshift(unesc(I.getscope()))
SL["gs"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.form()) //push stack joined by newlines
SL["g@"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.lines[I.shift()]) //push line at popped number (0-indexed)
SL["g:"]=(h,i,j,k,X,Y,Z)=>(X=I.shift(),I.unshift(I.shift()[X])) //get value for key given by index 0 within object at index 1
SL["form"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.form([I.shift()]))
SL["si"]=(h,i,j,k,X,Y,Z)=>I.ids[I.shift()]=I.shift() //set global ID at index 0
SL["sl"]=(h,i,j,k,X,Y,Z)=>(X=I.shift(),Y=I.shift(),I.scope.length?(I.scope[0][X]=Y):(I.ids[X]=Y))
SL[":"]=(h,i,j,k,X,Y,Z)=>I.objs.length?(I.objs[0][I.shift()]=I.shift()):(X=I.shift(),Y=I.shift(),I.stack[I.st][0][X]=Y) //set a key-value pair in an object, where index 0 is the key and index 1 is the value
SL["::"]=(h,i,j,k,X,Y,Z)=>I.id() //`gi` without pushing anything to stack (used for exposing ID's cleanly)
SL["type"]=(h,i,j,k,X,Y,Z)=>(X=I.shift(),I.unshift(X.pop?3:X.big?2:X.toFixed&&!isNaN(X)?1:0)) //pushes 1 if index 0 is a number, 2 if string, 3 if list, and 0 if anything else (ex.: undefined)

SL["es"]=(h,i,j,k,X,Y,Z)=>I.exec(I.shift(),1) //execute string at index 0
SL["e*"]=(h,i,j,k,X,Y,Z)=>(i=I.shift(),j=I.shift(),addf(a=>(i&&(addf(a=>I.unshift(i-1,j),'e*'),I.exec(j,1))))) //`es` on index 1 for number of times given by index 0
SL["e&"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.shift()?SL.es():I.shift()) //`es` if index 1 is truthy
SL["e|"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.shift()?I.shift():SL.es()) //`es` if index 1 is falsy
SL["e?"]=(h,i,j,k,X,Y,Z)=>(SL.rot(),I.shift()||SL.swap(),I.shift(),SL.es()) //`es` on index 1 if index 2 is truthy; otherwise, `es` on index 0
SL["ew"]=(h,i,j,k,X,Y,Z)=>(i=I.shift(),j=I.shift(),addf(a=>(I.shift()&&(addf(a=>I.unshift(i,j),'ew'),I.exec(i,1)))),I.exec(j,1)) //while `es` on index 1 is truthy, `es` on index 0
SL[";"]=(h,i,j,k,X,Y,Z)=>(I.lns.unshift(I.lns[0]+1),I.code[0].length&&addf(a=>I.lns.shift()),I.exec(I.lines[I.lns[0]],1)) // `es` next line
SL[";;"]=(h,i,j,k,X,Y,Z)=>(I.lns.unshift(I.lns[0]-1),I.code[0].length&&addf(a=>I.lns.shift()),I.exec(I.lines[I.lns[0]],1)) // `es` previous line
SL["stop"]=(h,i,j,k,X,Y,Z)=>I.code.shift() //end execution of current call stack frame

SL["read"]=(h,i,j,k,X,Y,Z)=>I.unshift(fs.readFileSync(I.shift())+'') //read file at path given by index 0
SL["write"]=(h,i,j,k,X,Y,Z)=>fs.writeFileSync(I.shift(),I.shift()) //write string at index 1 to file at path given by index 0
SL["in"]=(h,i,j,k,X,Y,Z)=>I.unshift((''+cp.execSync('read x;echo $x',{stdio:[process.stdin]})).slice(0,-1)) //push user input
SL["inh"]=(h,i,j,k,X,Y,Z)=>I.unshift((''+cp.execSync('read -s x;echo $x',{stdio:[process.stdin]})).slice(0,-1)) //push user input without echoing
SL["out"]=(h,i,j,k,X,Y,Z)=>process.stdout.write(''+I.shift()) //output index 0 to STDOUT
SL["outln"]=(h,i,j,k,X,Y,Z)=>process.stdout.write(''+I.shift()+'\n') //output index 0 as a line to STDOUT

SL["$E"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.E) //Euler's constant
SL["$Pi"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.PI) //π

SL["E"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.unshift(I.shift()*Math.pow(10,I.shift()))) //`(index 1)*10^(index 0)`
SL["_"]=(h,i,j,k,X,Y,Z)=>I.unshift(-I.shift()) //negation
SL["+"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.shift()- -I.shift()) //addition
SL["-"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.unshift(I.shift()-I.shift())) //subtraction
SL["*"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.shift()*I.shift()) //multiplication
SL["/"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.unshift(I.shift()/I.shift())) //division
SL["//"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.unshift(Math.floor(I.shift()/I.shift()))) //integer division
SL["%"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.unshift(I.mod(I.shift(),I.shift()))) //modulus
SL["/%"]=(h,i,j,k,X,Y,Z)=>(SL.over(),SL.over(),$['//'](),SL.rot_(),$['%']()) //divmod
SL["^"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.unshift(Math.pow(I.shift(),I.shift()))) //exponentiation
SL["abs"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.abs(I.shift())) //absolute value
SL["sign"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.sign(I.shift())) //sign function
SL["rand"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.random()) //push random number between 0 and 1
SL["time"]=(h,i,j,k,X,Y,Z)=>I.unshift(_.now()) //push milliseconds since January 1, 1970 00:00:00.000
SL["ln"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.log(I.shift())) //natural logarithm
SL["log"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.log10(I.shift())) //base-10 logarithm
SL["sin"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.sin(I.shift())) //sine
SL["cos"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.cos(I.shift())) //cosine
SL["tan"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.tan(I.shift())) //tangent
SL["sinh"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.sinh(I.shift())) //hyperbolic sine
SL["cosh"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.cosh(I.shift())) //hyperbolic cosine
SL["tanh"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.tanh(I.shift())) //hyperbolic tangent
SL["asin"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.asin(I.shift())) //inverse sine
SL["acos"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.acos(I.shift())) //inverse cosine
SL["atan"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.atan(I.shift())) //inverse tangent
SL["asinh"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.asinh(I.shift())) //inverse hyperbolic sine
SL["acosh"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.acosh(I.shift())) //inverse hyperbolic cosine
SL["atanh"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.atanh(I.shift())) //inverse hyperbolic tangent
SL["max"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.max(...I.stack[I.st])) //push max
SL["min"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.min(...I.stack[I.st])) //push min
SL["range"]=(h,i,j,k,X,Y,Z)=>(i=I.shift(),j=I.shift(),I.unshift(...I.range(j,i).reverse())) //inclusive range

SL["~"]=(h,i,j,k,X,Y,Z)=>I.unshift(~I.shift()) //bitwise not
SL["!"]=(h,i,j,k,X,Y,Z)=>I.unshift(+!I.shift()) //logical not
SL["&"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.shift()&I.shift()) //bitwise and
SL["|"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.shift()|I.shift()) //bitwise or
SL["$"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.shift()^I.shift()) //bitwise xor
SL["<<"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.unshift(I.shift()<<I.shift())) //bitwise left shift
SL[">>"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.unshift(I.shift()>>I.shift())) //bitwise right I.shift, sign-propagating
SL[">>>"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.unshift(I.shift()>>>I.shift())) //bitwise right I.shift, zero-fill

SL["="]=(h,i,j,k,X,Y,Z)=>I.unshift(+(I.shift()==I.shift())) //equal
SL["!="]=(h,i,j,k,X,Y,Z)=>I.unshift(+(I.shift()!=I.shift())) //not equal
SL[">"]=(h,i,j,k,X,Y,Z)=>I.unshift(+(I.shift()<I.shift())) //greater than
SL["<"]=(h,i,j,k,X,Y,Z)=>I.unshift(+(I.shift()>I.shift())) //less than
SL[">="]=(h,i,j,k,X,Y,Z)=>I.unshift(+(I.shift()<=I.shift())) //greater than or equal to
SL["<="]=(h,i,j,k,X,Y,Z)=>I.unshift(+(I.shift()>=I.shift())) //less than or equal to
SL["<=>"]=(h,i,j,k,X,Y,Z)=>(i=I.shift(),j=I.shift(),I.unshift(i<j?1:i>j?-1:0)) //comparison function (-1 for less than, 0 for equal, 1 for greater than)

SL["floor"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.floor(I.shift())) //round towards -∞
SL["trunc"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.trunc(I.shift())) //round towards 0
SL["round"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.round(I.shift())) //round towards or away from 0 depending on < or >= .5
SL["ceil"]=(h,i,j,k,X,Y,Z)=>I.unshift(Math.ceil(I.shift())) //round towards ∞

SL["pick"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.get(I.shift())) //`dup` but with any index
SL["nix"]=(h,i,j,k,X,Y,Z)=>I.splice(I.shift()) //`drop` but with any index
SL["roll"]=(h,i,j,k,X,Y,Z)=>(x=I.get(0),SL.pick(),I.unshift(x+1),SL.nix()) //`rot` but with any index
SL["roll_"]=(h,i,j,k,X,Y,Z)=>I.splice(I.shift(),0,I.shift()) //`rot_` but with any index
SL["trade"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.splice(I.shift()-1,1,I.shift())[0]) //swap index 1 with index given by index 0
SL["dup"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.stack[I.st][0]) //push index 0
SL["drop"]=(h,i,j,k,X,Y,Z)=>I.shift() //pop index 0
SL["rot"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.splice(2)[0]) //bring index 2 to index 0
SL["rot_"]=(h,i,j,k,X,Y,Z)=>(SL.rot(),SL.rot()) //bring index 0 to index 2
SL["swap"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.splice(1)[0]) //bring index 1 to index 0
SL["nip"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.shift()) //pop index 1
SL["tuck"]=(h,i,j,k,X,Y,Z)=>(SL.dup(),SL.rot_()) //push index 0 to index 2
SL["over"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),SL.tuck()) //push index 1
SL["clr"]=(h,i,j,k,X,Y,Z)=>I.stack[I.st]=[] //pop all items
SL["rev"]=(h,i,j,k,X,Y,Z)=>I.stack[I.st].reverse() //reverse stack
SL["dip"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),i=I.shift(),addf(a=>I.unshift(i)),I.exec(I.shift(),1)) //pop index 0, `es`, push popped index 0

SL["split"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.unshift(...(I.shift()+'').split(I.shift()).reverse())) //split string at index 1 over string at index 0
SL["join"]=(h,i,j,k,X,Y,Z)=>(i=I.shift(),I.unshift(I.stack[I.st].slice(0).reverse().join(i))) //join stack over string at index 0
SL["++"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.concat(I.shift(),I.shift())) //concatenate top 2 items as strings or lists
SL["len"]=(h,i,j,k,X,Y,Z)=>(X=I.shift(),I.unshift(X.toFixed?(X+'').length:X.length)) //push string length of index 0
SL[">char"]=(h,i,j,k,X,Y,Z)=>I.unshift(String.fromCodePoint(I.shift())) //convert number to Unicode
SL["<char"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.shift().codePointAt()) //convert Unicode to number
SL["lower"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.shift().toLowerCase()) //lowercase
SL["upper"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.shift().toUpperCase()) //uppercase
SL["repeat"]=(h,i,j,k,X,Y,Z)=>(SL.swap(),I.unshift((I.shift()+'').repeat(I.shift()))) //repeat string by index 0
SL["pad"]=(h,i,j,k,X,Y,Z)=>(i=I.shift(),j=I.shift(),k=I.shift(),I.unshift(_.pad(k,j,i))) //pad string given by index 2 until length given by index 0 with string given by index 1
SL["padl"]=(h,i,j,k,X,Y,Z)=>(i=I.shift(),j=I.shift(),k=I.shift(),I.unshift(_.padStart(k,j,i))) //`pad` but only from the left
SL["padr"]=(h,i,j,k,X,Y,Z)=>(i=I.shift(),j=I.shift(),k=I.shift(),I.unshift(_.padEnd(k,j,i))) //`pad` but only from the right

SL["stack"]=(h,i,j,k,X,Y,Z)=>(I.iter.unshift(I.st),X=I.shift(),Y=I.shift(),I.stack[I.st=X]||(I.stack[I.st]=[]),I.addf(a=>I.st=I.iter.shift()),I.exec(Y,1)) //execute string given by index 1 on a stack with name given by index 0
SL["push"]=(h,i,j,k,X,Y,Z)=>I.stack[I.shift()].unshift(I.shift()) //push index 1 to another stack with name given by index 0
SL["pull"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.stack[I.shift()].shift()) //push top item of another stack with name given by index 0
SL["size"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.stack[I.st].length) //push stack length
SL["uniq"]=(h,i,j,k,X,Y,Z)=>I.stack[I.st]=_.uniq(I.stack[I.st]) //remove all duplicates in current stack
SL["take"]=(h,i,j,k,X,Y,Z)=>I.stack[I.st]=_.take(I.stack[I.st],I.shift()) //keep top _n_ items, where _n_ is index 0
SL["drop"]=(h,i,j,k,X,Y,Z)=>I.stack[I.st]=_.drop(I.stack[I.st],I.shift()) //pop top _n_ items, where _n_ is index 0
SL["merge"]=(h,i,j,k,X,Y,Z)=>I.unshift(...I.stack[I.shift()]) //push items of another stack with name given by index 0
SL["union"]=(h,i,j,k,X,Y,Z)=>(i=I.shift(),I.stack[I.st]=_.union(I.stack[I.st],I.stack[i])) //set union with current stack and stack with name given by index 0
SL["intersection"]=(h,i,j,k,X,Y,Z)=>(i=I.shift(),I.stack[I.st]=_.intersection(I.stack[I.st],I.stack[i])) //set intersection with current stack and stack with name given by index 0
SL["difference"]=(h,i,j,k,X,Y,Z)=>(i=I.shift(),I.stack[I.st]=_.difference(I.stack[I.st],I.stack[i])) //set difference with current stack and stack with name given by index 0
SL["wrap"]=(h,i,j,k,X,Y,Z)=>I.unshift([I.shift()]) //wrap index 0 in a list
SL["wrap_"]=(h,i,j,k,X,Y,Z)=>(X=I.shift(),I.unshift(...X.pop?X:[X])) //opposite of `wrap`; take all items in list at index 0 and push to parent stack
SL["enclose"]=(h,i,j,k,X,Y,Z)=>I.unshift(I.stack[I.st].slice(0)) //push entire stack as a list
SL["usurp"]=(h,i,j,k,X,Y,Z)=>I.stack[I.st]=[...shift()] //set current stack to the list at index 0
SL["'"]=(h,i,j,k,X,Y,Z)=>(X=I.shift(),Y=I.shift(),Y=Y.big?Y.split``:Y.toFixed?(Y+'').split``:Y,I.iter.unshift(I.st), //apply function to list given by index 0
    I.stack[I.st=I.iter[0]+'\n']=Y,
    I.addf(a=>(Y=I.stack[I.st],delete I.stack[I.iter[0]+'\n'],I.st=I.iter.shift(),I.unshift(Y))),I.exec(X,1))
SL["flat"]=(h,i,j,k,X,Y,Z)=>I.stack[I.st]=_.flatten(I.stack[I.st]) //`wrap_` all elements
SL["chunk"]=(h,i,j,k,X,Y,Z)=>I.stack[I.st]=(X=I.shift(),_.chunk(I.stack[I.st],X)) //split stack into lists of length given by index 0
SL["keys"]=(h,i,j,k,X,Y,Z)=>I.unshift(Object.keys(I.shift())) //get keys of object/list at index 0
SL["vals"]=(h,i,j,k,X,Y,Z)=>I.unshift(Object.values(I.shift())) //get values of object/list at index 0
SL["enum"]=(h,i,j,k,X,Y,Z)=>I.stack[I.st]=I.stack[I.st].map((a,b)=>[b,a]) //convert each item in stack to a list containing index and item
SL["enom"]=(h,i,j,k,X,Y,Z)=>I.unshift(Object.keys(X=I.shift()).map(a=>[X[a],a])) //convert each item in stack to a list containing index and item
SL["del"]=(h,i,j,k,X,Y,Z)=>delete I.stack[I.st][1][I.shift()]

SL["map"]=(h,i,j,k,X,Y,Z)=>(X=I.shift(),I.iter.unshift(I.st), //`es` on each individual item in the stack
  I.addf(a=>(delete I.stack[I.iter[0]+' '],I.st=I.iter.shift())),
  I.stack[I.st].map((a,b)=>
    I.addf(A=>I.stack[I.st=I.iter[0]+' ']=[a],...I.parse(X),A=>I.stack[I.iter[0]][b]=I.shift())
  ))
SL["fold"]=(h,i,j,k,X,Y,Z)=>(X=I.shift(),Z=I.shift(),I.iter.unshift(I.st), //`es` with accumulator and item; result of each `es` becomes the new accumulator
  I.addf(a=>(delete I.stack[I.iter[0]+' '],I.stack[I.st=I.iter.shift()]=[Z])),
  I.stack[I.st].map(a=>
    I.addf(A=>I.stack[I.st=I.iter[0]+' ']=[a,Z],...I.parse(X),A=>Z=I.shift())
  ))

SL["filter"]=(h,i,j,k,X,Y,Z)=>(I.addf(a=>I.stack[I.st]=I.stack[I.st].filter(a=>a)),SL.map()) //remove each item that is falsy after `es`
SL["any"]=(h,i,j,k,X,Y,Z)=>(I.addf(a=>I.stack[I.st]=[+I.stack[I.st].some(a=>a)]),SL.map()) //push 1 if any items return truthy after `es`, else push 0
SL["all"]=(h,i,j,k,X,Y,Z)=>(I.addf(a=>I.stack[I.st]=[+I.stack[I.st].every(a=>a)]),SL.map()) //push 1 if all items return truthy after `es`, else push 0
SL["find"]=(h,i,j,k,X,Y,Z)=>(I.addf(a=>I.stack[I.st]=[I.stack[I.st].find(a=>a)]),SL.map()) //find first item that returns truthy after `es` or undefined on failure
SL["findi"]=(h,i,j,k,X,Y,Z)=>(I.addf(a=>I.stack[I.st]=[I.stack[I.st].findIndex(a=>a)]),SL.map()) //`find` but returns index (or -1 on fail)
SL["takew"]=(h,i,j,k,X,Y,Z)=>(I.addf(a=>I.stack[I.st]=_.takeWhile(I.stack[I.st])),SL.map()) //`take` items until `es` returns falsy for an item
SL["dropw"]=(h,i,j,k,X,Y,Z)=>(I.addf(a=>I.stack[I.st]=_.dropWhile(I.stack[I.st])),SL.map()) //`drop` items until `es` returns falsy for an item
SL["sort"]=(h,i,j,k,X,Y,Z)=>(I.addf(a=>I.stack[I.st]=_.sortBy(I.stack[I.st]).reverse()),SL.map()) //sort items in ascending order based on `es`
SL["part"]=(h,i,j,k,X,Y,Z)=>(I.addf(a=>I.stack[I.st]=_.partition(I.stack[I.st])),SL.map()) //separate items into 2 lists based on whether they return truthy after `es`

export {SL}
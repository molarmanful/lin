module.exports={
  "id":x=>(id=stack.shift(),stack.unshift(lines.find(a=>(a.match`^ *#([^\d. ])`||[])[1]==id).replace(/^ *#[^\d. ]/,''))),

  "_":x=>stack.unshift(-stack.shift()),
  "+":x=>stack.unshift(stack.shift()+stack.shift()),
  "-":x=>stack.unshift(stack.shift()-stack.shift()),
  "*":x=>stack.unshift(stack.shift()*stack.shift()),
  "/":x=>stack.unshift(stack.shift()/stack.shift()),
  "%":x=>stack.unshift(stack.shift()%stack.shift()),
  "^":x=>stack.unshift(Math.pow(stack.shift(),stack.shift())),

  "dup":x=>stack.unshift(stack[0]),
  "drop":x=>stack.shift(),
  "swap":x=>stack.splice(1,0,stack.shift()),
  "rot":x=>stack.unshift(stack.splice(2,1)),
  "rot_":x=>stack.splice(2,0,stack.shift()),
  "nip":x=>stack.splice(1,1),
  "tuck":x=>stack.splice(2,0,stack[0]),
  "over":x=>stack.unshift(stack[1]),
  "roll":x=>stack.unshift(stack.splice(stack.shift(),1)),
  "roll_":x=>stack.splice(stack.shift(),0,stack.shift()),
  "clr":x=>stack=[],
  "rev":x=>stack.reverse(),

  "el":x=>(ln.unshift(stack.shift()),lne()),
  "en":x=>(ln.unshift(ln[0]+1),lne()),
  "ep":x=>(ln.unshift(ln[0]-1),lne()),
  "es":x=>exec(stack.shift()),
0:0}
module.exports={
  "_":x=>stack.unshift(-stack.shift()),
  "+":x=>stack.unshift(stack.shift()+stack.shift()),
  "-":x=>stack.unshift(stack.shift()-stack.shift()),
  "*":x=>stack.unshift(stack.shift()*stack.shift()),
  "/":x=>stack.unshift(stack.shift()/stack.shift()),
  "%":x=>stack.unshift(stack.shift()%stack.shift()),
  "^":x=>stack.unshift(Math.pow(stack.shift(),stack.shift())),

  "dup":x=>stack.unshift(stack[stack.length-1]),
  "drop":x=>stack.shift(),
  "swap":x=>stack.splice(1,0,stack.shift()),
  "rot":x=>stack.unshift(stack.splice(2,1)),
  "rot_":x=>stack.splice(2,0,stack.shift()),

  "el":x=>exec(lines[stack.pop()]),
0:0}
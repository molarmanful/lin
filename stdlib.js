module.exports={
  "_":x=>stack.push(-stack.pop()+''),
  "+":x=>stack.push(stack.pop()- -stack.pop()+''),
  "-":x=>stack.push(-stack.pop()- -stack.pop()+''),
  "*":x=>stack.push(-stack.pop()*stack.pop()+''),
  "/":x=>stack.push(1/stack.pop()*stack.pop()+''),
  "DUP":x=>stack.push(stack[stack.length-1]),
  "DROP":x=>stack.pop(),
  "SWAP":x=>stack.splice(-2,0,stack.pop()),
0:0}
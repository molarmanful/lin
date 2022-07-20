# Program Flow
After parsing the code, the commands are placed in a call stack. The call stack holds a series of frames, which in turn hold a series of commands. Each execution loop, the top command in the top call stack frame is popped for execution. Once a stack frame holds no more commands, it is popped; and once the call stack holds no more stack frames, execution ends. To illustrate the concept better, see the following example.

```
\a :: 10 a
#a 1- dup \a e&
```

The snippet above recursively decrements 10 until it is 0. When executed, here are the stages of call stack that the program runs through:

```
[ \a :: 10 a ]
[ :: 10 a ]
[ 10 a ]
[ a ]
[ 1 - dup \a e& ]
[ - dup \a e& ]
[ dup \a e& ]
[ \a e& ]
[ e& ]
[ 1 - dup \a e& ]
...
[ \a e& ]
[ e& ]
[  ]
```

For those of you who are familiar with functional programming, lin happens to implement tail call optimization (TCO). This is better-illustrated with the following example.

```
\a :: 0 a
#a 1+ a
```

The snippet above infinitely increments 0 using recursion. When executed, here are the stages of call stack that the program runs through:

```
[ \a :: 0 a ]
[ :: 0 a ]
[ 0 a ]
[ a ]
[ 1 + a ]
[ + a ]
[ a ]
[ 1 + a ]
[ + a ]
[ a ]
[ 1 + a ]
[ + a ]
[ a ]
...
```

You should notice that the call stack frame, overall, does not really grow in size; rather, the call stack frame returns to its original size each time the recursive call is made. Thus, execution could potentially run forever without a stack overflow. Note that TCO only works because the recursive call is assigned to the last command on the call stack frame. Here is a another example, in which TCO cannot be applied effectively.

```
\a :: 5 a
#a 1- dup ( a 1+ ) e&
```

The snippet above is a contrived recursive function that decrements until zero then increments until 1 less than the original number. When executed, here are the stages of call stack that the program runs through:

```
[ \a :: 5 a ]
[ :: 5 a ]
[ 5 a ]
[ a ]
[ 1 - dup ( a 1 + ) e& ]
[ - dup ( a 1 + ) e& ]
[ dup ( a 1 + ) e& ]
[ ( a 1 + ) e& ]
[ e& ]
[ a 1 + ]
[ 1 - dup ( a 1 + ) e& 1 + ]
[ - dup ( a 1 + ) e& 1 + ]
[ dup ( a 1 + ) e& 1 + ]
[ ( a 1 + ) e& 1 + ]
[ e& 1 + ]
[ a 1 + 1 + ]
...
[ a 1 + 1 + 1 + ]
...
[ a 1 + 1 + 1 + 1 + ]
[ 1 + 1 + 1 + 1 + ]
[ + 1 + 1 + 1 + ]
[ 1 + 1 + 1 + ]
...
[ 1 + ]
[ + ]
[ ]
```

You should be able to see that the stack size bloats because `+` is at the tail rather than the recursive call itself.

In other programming languages that do not implement TCO, recursion could cause a stack overflow. For example, in non-TCO Javascript implementations, the following snippet would cause a stack overflow:

```
a = x=> a(x + 1)
a(0)
```

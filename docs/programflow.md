# Program Flow
After parsing the code, the commands are placed in a call stack. The call stack holds a series of frames, which in turn hold a series of commands. Each execution loop, the top command in the top call stack frame is popped for execution. Once a stack frame holds no more commands, it is popped; and once the call stack holds no more stack frames, execution ends. To illustrate the concept better, see the following example.

```
\a ::: 10 a
#a 1- dup \a e&
```

The snippet above recursively decrements 10 until it is 0. When executed, here are the stages of stack frames that the program runs through:

```
[ \a ::: 10 a ]
[ ::: 10 a ]
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
\a ::: 0 a
#a 1+ a
```

The snippet above infinitely increments 0 using recursion. When executed, here are the stages of stack frames that the program runs through:

```
[ \a ::: 0 a ]
[ ::: 0 a ]
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

In other programming languages that do not implement TCO, an equivalent code would cause a stack overflow. For example, in non-TCO Javascript implementations, the following snippet would cause a stack overflow:

```
a=x=>a(x+1)
a(0)
```

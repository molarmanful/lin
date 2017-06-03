# Iteration
This serves as a (hopefully) clarifying explanation for map, filter, fold, and other commands that iterate over the stack.

## How does it work?
Each of the commands takes at least a function (and possibly other side arguments).

1. After consuming the function and other arguments, the command iterates over each item in the stack.
2. During each iteration, the item is put into a new stack, and the function essentially executes within the context of that stack.
3. Upon the function's completion, the top item in the stack is considered the returned value. It is up to the command to determine what to do with the returned value.

**NOTE:** In the case of the fold command, the accumulated value along with the current item are both put into the new stack.

## Visualization
```
       +–––––––– STACK ––––> Each Item
       |           |             |
       V           |             |
    Other Args     V             V
       |        Function <–– NEW STACK
       |           |
       |           V
       |        Top Item
       |           |
       |           V
       +––––––> COMMAND
                   |
                   V
                 STACK
```

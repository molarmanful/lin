# Functions
There are 2 ways to define functions. Note that there are no dedicated function types in lin, but strings that can be evaluated via the `es` command.

# Lambda
The `(` command takes all numbers and keys until the matching `)`, joins them with a space, and pushes the resulting string to the stack.

```
( 1 2 3 4 ) ( + - ^ max )

=> "1 2 3 4 gs out" "+ - ^ max"
```

# ID
This is an easy way to declare named functions. Note that after the first time a function is ID'd, it is memoized so that the program doesn't have to search the lines repeatedly at each function call. ID's must be present at the start of a line in order to be properly found.

```
\sum :: \prod :: 1 2 3 4 sum 5 6 7 8 prod out
#sum \+ fold
#prod \* fold

=> 100800
```

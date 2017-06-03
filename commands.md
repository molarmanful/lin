# Commands
**NOTE:** Anything with "index [number]" refers to the item at that specific index on the stack. "index 0" refers to the top of the stack, "index 1" refers to the second-from-top of stack, etc.

- <code>()</code>: push empty string
- <code>\\</code>: push space
- <code>\\\\</code>: push newline
- <code>gi</code>: push string at ID given by index 0
- <code>gi\\</code>: `gi` but parse escape codes
- <code>gs</code>: push stack joined by newlines
- <code>si</code>: set ID at index 0
- <code>::</code>: `gi` without pushing anything to stack (used for exposing ID's cleanly)
- <code>es</code>: execute string at index 0
- <code>e&</code>: `es` if index 1 is truthy
- <code>e|</code>: `es` if index 1 is falsy
- <code>e?</code>: `es` on index 1 if index 2 is truthy; otherwise, `es` on index 0
- <code>ei</code>: `es` at millisecond intervals given by index 1
- <code>et</code>: `es` after waiting milliseconds given by index 0
- <code>read</code>: read file at path given by index 0
- <code>write</code>: write string at index 1 to file at path given by index 0
- <code>in</code>: `es` with line of STDIN at index 0
- <code>out</code>: output index 0 to STDOUT
- <code>outln</code>: output index 0 as a line to STDOUT
- <code>e</code>: Euler's constant
- <code>pi</code>: π
- <code>E</code>: `(index 1)*10^(index 0)`
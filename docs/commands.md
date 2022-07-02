# Commands

**NOTE:** Anything with "index [number]" refers to the item at that specific index on the stack. "index 0" refers to the top of the stack, "index 1" refers to the second-from-top of stack, etc.

## BASE

Command | Description
--- | ---
<code>gi</code> | push string at ID given by index 0
<code>gl</code> | `gi` but follow local scoping rules
<code>gs</code> | push stack joined by newlines
<code>g@</code> | push line at popped number (0-indexed)
<code>g;</code> |  push next line
<code>g;;</code> |  push previous line
<code>form</code> | convert index 0 to its string representation
<code>si</code> | set global ID at index 0
<code>sl</code> | `si` but follow local scoping rules
<code>::</code> | bring ID at index 0 as string into global scope
<code>type</code> | pushes 1 if index 0 is a number, 2 if string, 3 if list, 4 if object, and 0 if anything else (ex.: undefined)

## CONSTANT

Command | Description
--- | ---
<code>$U</code> | undefined
<code>()</code> | empty string
<code>[]</code> | empty list
<code>{}</code> | empty object
<code>\\</code> | push space
<code>n\\</code> | push newline
<code>$L</code> | current line number
<code>$S</code> | current stack name
<code>$E</code> | Euler's constant
<code>$Pi</code> | Pi
<code>$I</code> | Infinity
<code>time</code> | milliseconds since January 1, 1970 00:00:00.000
<code>$`</code> | infinite list of whole numbers

## COUNT

Command | Description
--- | ---
<code>facc</code> | factoradic representation of index 0
<code>combc</code> | _m_th combinadic digit of _n_ C _k_, where _n_ _k_ _m_ are top 3 items
<code>`perm</code> | permutations of index 1 of length given by index 0
<code>`comb</code> | combinations of index 1 of length given by index 0
<code>`pset</code> | powerset of index 0
<code>`/\\</code> | generate base-N sequence from digits at index 1 with length at index 0
<code>`'*</code> | cartesian product over list of sequences

## FLOW

Command | Description
--- | ---
<code>es</code> | execute string at index 0
<code>e*</code> | `es` for number of times given by index 0
<code>e&</code> | `es` if index 0 is truthy
<code>e\|</code> | `es` if index 0 is falsy
<code>e?</code> | `es` on index 2 if index 0 is truthy; otherwise, `es` on index 1
<code>ew</code> | while `es` on index 1 is truthy, `es` on index 0
<code>e@</code> |  `es` line number at index 0
<code>;</code> |  `es` next line
<code>;;</code> |  `es` previous line
<code>break</code> | end execution of current call stack frame

## IO

Command | Description
--- | ---
<code>read</code> | read file at path given by index 0
<code>write</code> | write string at index 1 to file at path given by index 0
<code>in</code> | push user input
<code>inh</code> | push user input without echoing
<code>out</code> | output index 0 to STDOUT
<code>outln</code> | output index 0 as a line to STDOUT

## ITER

Command | Description
--- | ---
<code>`</code> | convert to iterator
<code>``</code> | convert to iterator recursively
<code>`_</code> | convert from iterator to list
<code>`__</code> | convert from iterator to list recursively
<code>`_`</code> | convert from iterator to string
<code>`=</code> | check if iterators are equal
<code>`=*</code> | check if iterators are deeply equal
<code>?</code> | check if iterator at index 1 has sequence at index 0
<code>?*</code> | `?` with multiple sequences
<code>`cyc</code> | create infinite cycle from index 0
<code>`+</code> | concatenate top 2 items into iterator
<code>`,</code> | prepend-concatenate index 0 into iterator
<code>`+></code> | combine top 2 items into partially-sorted iterator via comparison function
<code>`mask</code> | use index 0 as a bitmask for the iterator at index 1
<code>`,*</code> | zip all stack items into one iterator
<code>`size</code> | iterator size (DOES NOT HALT ON INFINITE LISTS) 
<code>`enum</code> | convert each element to an index-element pair
<code>`uniq</code> | yield only unique elements
<code>`rev</code> | reverse iterator
<code>`flat</code> | flatten iterator
<code>`melt</code> | flatten iterator by max depth at index 0
<code>`xp</code> | split iterator into consecutive slices given by index 0
<code>`chunk</code> | split iterator into chunks of length given by index 0
<code>`btwn</code> | place index 0 between each element
<code>`sp</code> | split iterator on sequence at index 0
<code>`sp*</code> | `\`sp` with multiple sequences
<code>`^</code> | first element
<code>`:</code> | _n_th element, where _n_ is index 0
<code>`t</code> | take first _n_ elements, where _n_ is index 0
<code>`t></code> | `take` with sort predicate
<code>`d</code> | drop first _n_ elements, where _n_ is index 0
<code>`'</code> | `es` index 0 over each element
<code>`/</code> | fold with `es` of index 0 over each element
<code>`/a</code> | `\`/` with accumulator
<code>`\\</code> | `\`/` with intermediate values
<code>`\\a</code> | `\`\\` with accumulator
<code>`#</code> | filter truthy results after `es`ing index 0 over each element
<code>`t'</code> | `take` while `es`ing index 0 over each element is truthy
<code>`d'</code> | `drop` while `es`ing index 0 over each element is truthy
<code>`tap</code> | `es` index 0 over each element and return original element
<code>`part</code> | `es` index 0 over each element and partition based on truthiness
<code>`&</code> | check if all elements are truthy after `es`ing index 0 over each element
<code>`\|</code> | check if any elements are truthy after `es`ing index 0 over each element
<code>`?'</code> | find first element that returns truthy after `es`ing index 0

## LIST

Command | Description
--- | ---
<code>len</code> | length of index 0
<code>dep</code> | depth of index 0
<code>'</code> | `es` index 0 on list at index 1
<code>split</code> | split string at index 1 over string at index 0
<code>join</code> | join list over string at index 0
<code>++</code> | concatenate top 2 items as strings or lists
<code>rep</code> | repeat list/string by index 0
<code>union</code> | set union of lists at index 0 and index 1
<code>inter</code> | set intersection of lists at index 0 and index 1
<code>diff</code> | set difference of lists at index 0 and index 1
<code>wrap</code> | wrap index 0 in a list
<code>wraps</code> | wrap first _n_ items in a list, where _n_ is index 0
<code>wrap_</code> | opposite of `wrap`; take all items in list at index 0 and push to parent stack
<code>enclose</code> | enclose entire stack into a list
<code>dups</code> | push entire stack as list
<code>usurp</code> | set current stack to the list at index 0

## LOGIC

Command | Description
--- | ---
<code>=</code> | equal
<code>==</code> | strict equal
<code>eq</code> | deep equal
<code>!=</code> | not equal
<code>></code> | greater than
<code><</code> | less than
<code>>=</code> | greater than or equal to
<code><=</code> | less than or equal to
<code><=></code> | comparison function (-1 for less than, 0 for equal, 1 for greater than)

## MULTISTACK

Command | Description
--- | ---
<code>'s</code> | execute string given by index 1 on a stack with name given by index 0
<code>push</code> | push index 1 to another stack with name given by index 0
<code>pushs</code> | push current stack to another stack with name given by index 0
<code>pull</code> | push top item of another stack with name given by index 0
<code>pulls</code> | pull stack with name given by index 0 to current stack

## NUM

Command | Description
--- | ---
<code>N</code> | convert to bigint
<code>NN</code> | convert to bigint (reversed if list)
<code>n_</code> | convert to number
<code>N_</code> | convert to number (reversed if list)
<code>ns</code> | convert number to digit list
<code>E</code> | `(index 1)*10^(index 0)`
<code>_</code> | negation
<code>+</code> | addition
<code>-</code> | subtraction
<code>*</code> | multiplication
<code>/</code> | division
<code>//</code> | integer division
<code>%</code> | modulus
<code>/%</code> | divmod
<code>^</code> | exponentiation
<code>abs</code> | absolute value
<code>sign</code> | sign function
<code>rand</code> | push random number between 0 and 1
<code>ln</code> | natural logarithm
<code>logII</code> | base-2 logarithm
<code>logX</code> | base-10 logarithm
<code>log</code> | logarithm with base at index 0
<code>sin</code> | sine
<code>cos</code> | cosine
<code>tan</code> | tangent
<code>sinh</code> | hyperbolic sine
<code>cosh</code> | hyperbolic cosine
<code>tanh</code> | hyperbolic tangent
<code>asin</code> | inverse sine
<code>acos</code> | inverse cosine
<code>atan</code> | inverse tangent
<code>atant</code> | inverse tangent with coordinates (x,y) to (index 1, index 0)
<code>asinh</code> | inverse hyperbolic sine
<code>acosh</code> | inverse hyperbolic cosine
<code>atanh</code> | inverse hyperbolic tangent
<code>max</code> | push max
<code>min</code> | push min
<code>~</code> | bitwise not
<code>!</code> | logical not
<code>&</code> | bitwise and
<code>\|</code> | bitwise or
<code>$</code> | bitwise xor
<code><<</code> | bitwise left shift
<code>>></code> | bitwise right shift, sign-propagating
<code>>>></code> | bitwise right shift, zero-fill
<code>floor</code> | round towards -∞
<code>trunc</code> | round towards 0
<code>round</code> | round towards or away from 0 depending on < or >= .5
<code>ceil</code> | round towards ∞
<code>F</code> | factorial
<code>P</code> | *n* permute *k*
<code>C</code> | *n* choose *k*

## OBJ

Command | Description
--- | ---
<code>:</code> | set a key-value pair in an object, where index 0 is the key and index 1 is the value
<code>g:</code> | get value for key given by index 0 within object at index 1
<code>keys</code> | get keys of object/list at index 0
<code>vals</code> | get values of object/list at index 0
<code>del</code> | remove key at index 0 from object at index 1
<code>enom</code> | convert object to a list containing each key-value pair
<code>denom</code> | convert `enom`-style list into object

## STACK

Command | Description
--- | ---
<code>size</code> | stack length
<code>deps</code> | stack depth
<code>enum</code> | convert each item in stack to an index-item pair
<code>denum</code> | convert `enum`-style stack into a normal stack
<code>pick</code> | `dup` but with any index
<code>nix</code> | `drop` but with any index
<code>roll</code> | `rot` but with any index
<code>roll_</code> | `rot_` but with any index
<code>trade</code> | swap index 1 with index given by index 0
<code>dup</code> | push index 0
<code>pop</code> | pop index 0
<code>rot</code> | bring index 2 to index 0
<code>rot_</code> | bring index 0 to index 2
<code>swap</code> | bring index 1 to index 0
<code>nip</code> | pop index 1
<code>tuck</code> | push index 0 to index 2
<code>over</code> | push index 1
<code>clr</code> | pop all items
<code>rev</code> | reverse stack
<code>dip</code> | pop index 0, `es`, push popped index 0
<code>range</code> | exclusive range
<code>rango</code> | `range` from 0 to index 0
<code>orang</code> | `range` from index 0 to 0
<code>uniq</code> | remove all duplicates in current stack
<code>take</code> | keep top _n_ items, where _n_ is index 0
<code>drop</code> | pop top _n_ items, where _n_ is index 0
<code>flat</code> | `wrap_` all items
<code>blob</code> | deshape the stack
<code>rows</code> | split stack into _n_ lists, where _n_ is index 0
<code>cols</code> | split stack into lists of length _n_, where _n_ is index 0
<code>shape</code> | reshape the stack using dimensions at index 0
<code>zip</code> | group multiple arrays' items together by indices
<code>wins</code> | split stack into consecutive slices given by index 0
<code>map</code> | `es` on each individual item in the stack
<code>fold</code> | `es` with accumulator and item; result of each `es` becomes the new accumulator
<code>folda</code> | `fold` with initial accumulator
<code>scan</code> | `fold` with intermediate values
<code>scana</code> | `scan` with initial accumulator
<code>filter</code> | remove each item that is falsy after `es`
<code>any</code> | push 1 if any items return truthy after `es`, else push 0
<code>all</code> | push 1 if all items return truthy after `es`, else push 0
<code>find</code> | find first item that returns truthy after `es` or undefined on failure
<code>findi</code> | `find` but returns index
<code>takew</code> | `take` items until `es` returns falsy for an item
<code>dropw</code> | `drop` items until `es` returns falsy for an item
<code>sort</code> | sort items in ascending order based on `es`
<code>sortc</code> | `sort` with comparison function
<code>part</code> | separate items into 2 lists based on whether they return truthy after `es` (top list holds truthy values, bottom list holds falsy values)
<code>group</code> | categorize items into keys after `es`ing index 0
<code>table</code> | map over cartesian product of stack

## STR

Command | Description
--- | ---
<code>unesc</code> | unescape string at index 0
<code>>char</code> | convert number to Unicode
<code><char</code> | convert Unicode to number
<code>lower</code> | lowercase
<code>upper</code> | uppercase
<code>pad</code> | pad string given by index 2 until length given by index 0 with string given by index 1
<code>padl</code> | `pad` but only from the left
<code>padr</code> | `pad` but only from the right
# Commands

**NOTE:** Anything with "index [number]" refers to the item at that specific index on the stack. "index 0" refers to the top of the stack, "index 1" refers to the second-from-top of stack, etc.

## Sections

- [BASE](#BASE)
- [CONSTANT](#CONSTANT)
- [COUNT](#COUNT)
- [DOT](#DOT)
- [FLOW](#FLOW)
- [IO](#IO)
- [ITER](#ITER)
- [LIST](#LIST)
- [LOGIC](#LOGIC)
- [MODULE](#MODULE)
- [MULTISTACK](#MULTISTACK)
- [NUM](#NUM)
- [OBJ](#OBJ)
- [STACK](#STACK)
- [STR](#STR)

## BASE

Command | Description
--- | ---
<code>${</code> | create new scope
<code>}$</code> | destroy current scope
<code>gi</code> | push string at ID given by index 0
<code>gl</code> | `gi` but follow scoping rules
<code>.</code> | magic dot
<code>gs</code> | push stack joined by newlines
<code>g@</code> | push line at popped number (0-indexed)
<code>g;</code> | push next line
<code>g;;</code> | push previous line
<code>L</code> | line number + index 0
<code>si</code> | set global ID at index 0
<code>sl</code> | `si` but follow scoping rules
<code>sL</code> | `sl` but without overriding existing scoping rules
<code>::</code> | bring ID at index 0 as string into global scope
<code>type</code> | push type of index 0

## CONSTANT

Command | Description
--- | ---
<code>$U</code> | undefined
<code>()</code> | empty string
<code>[]</code> | empty list
<code>{}</code> | empty object
<code>\\</code> | space
<code>n\\</code> | newline
<code>$L</code> | current line number
<code>$P</code> | current package
<code>$S</code> | current stack name
<code>$s</code> | previous stack name
<code>$E</code> | Euler's constant
<code>$Pi</code> | Pi
<code>$I</code> | Infinity
<code>time</code> | milliseconds since January 1, 1970 00:00:00.000
<code>$\`</code> | infinite list of whole numbers
<code>$A</code> | uppercase alphabet
<code>$a</code> | lowercase alphabet

## COUNT

Command | Description
--- | ---
<code>facc</code> | factoradic representation of index 0
<code>combc</code> | _m_th combinadic digit of _n_ C _k_, where _n_ _k_ _m_ are top 3 items
<code>\`perm</code> | permutations of index 0
<code>\`pern</code> | permutations of index 1 of length given by index 0
<code>\`comb</code> | combinations of index 1 of length given by index 0
<code>\`pset</code> | powerset of index 0
<code>\`/\\</code> | generate base-N sequence from digits at index 1 with length at index 0
<code>\`'*</code> | cartesian product over list of sequences

## DOT

Command | Description
--- | ---
<code>.</code> | `lns`
<code>+</code> | `dup`
<code>-</code> | `pop`
<code>~</code> | `swap`
<code>@</code> | `rot`
<code>@_</code> | `rot_`
<code>'</code> | `map`
<code>',</code> | `mapf`
<code>/</code> | `fold`
<code>/+</code> | `folda`
<code>\\</code> | `scan`
<code>\\+</code> | `scana`
<code>#</code> | `filter`
<code>\|</code> | `any`
<code>&</code> | `all`
<code>:</code> | `find`
<code>:#</code> | `findi`
<code>,</code> | `zip`
<code>$</code> | `wrap`
<code>$$</code> | `enclose`
<code>$_</code> | `wrap_`
<code>;</code> | `2e@`
<code>;;</code> | `2_ e@`

## FLOW

Command | Description
--- | ---
<code>es</code> | execute string at index 0
<code>e*</code> | `es` for number of times given by index 0
<code>e&</code> | `es` if index 0 is truthy
<code>e\|</code> | `es` if index 0 is falsy
<code>e?</code> | `es` on index 1 if index 2 is truthy; otherwise, `es` on index 0
<code>ew</code> | while `es` on index 1 is truthy, `es` on index 0
<code>e@</code> | `es` next *n* lines, where *n* is index 0
<code>@</code> | `es` current line
<code>;</code> | `es` next line
<code>;;</code> | `es` previous line
<code>err</code> | throw error
<code>break</code> | end execution of current call stack frame
<code>exit</code> | exit with code at index 0

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
<code>\`</code> | convert to iterator
<code>\`\`</code> | convert to iterator recursively
<code>\`_</code> | convert from iterator to list
<code>\`__</code> | convert from iterator to list recursively
<code>\`_\`</code> | convert from iterator to string
<code>\`it</code> | create iterator from initial value and function 
<code>\`=</code> | check if iterators are equal
<code>\`=*</code> | check if iterators are deeply equal
<code>\`?</code> | check if iterator at index 1 has sequence at index 0
<code>\`?*</code> | `?` with multiple sequences
<code>\`cyc</code> | create infinite cycle from index 0
<code>\`+</code> | concatenate top 2 items into iterator
<code>\`,</code> | prepend index 0 into iterator
<code>\`+></code> | combine top 2 items into partially-sorted iterator via comparison function
<code>\`mask</code> | use index 0 as a bitmask for the iterator at index 1
<code>\`,*</code> | zip list of iterators into one iterator
<code>\`size</code> | iterator size (DOES NOT HALT ON INFINITE LISTS) 
<code>\`enum</code> | convert each element to an index-element pair
<code>\`uniq</code> | yield only unique elements
<code>\`rev</code> | reverse iterator
<code>\`flat</code> | flatten iterator
<code>\`melt</code> | flatten iterator by max depth at index 0
<code>\`xp</code> | split iterator into consecutive slices given by index 0
<code>\`chunk</code> | split iterator into chunks of length given by index 0
<code>\`btwn</code> | place index 0 between each element
<code>\`sp</code> | split iterator on sequence at index 0
<code>\`sp*</code> | `\`sp` with multiple sequences
<code>\`^</code> | first element
<code>\`:</code> | _n_th element, where _n_ is index 0
<code>\`t</code> | take first _n_ elements, where _n_ is index 0
<code>\`t></code> | `take` with sort predicate
<code>\`d</code> | drop first _n_ elements, where _n_ is index 0
<code>\`'</code> | map with `es` of index 0 over each element
<code>\`',</code> | map and flatten
<code>\`/</code> | fold with `es` of index 0 over each element
<code>\`/a</code> | `\`/` with accumulator
<code>\`\\</code> | `\`/` with intermediate values
<code>\`\\a</code> | `\`\\` with accumulator
<code>\`#</code> | filter truthy results after `es`ing index 0 over each element
<code>\`t'</code> | `take` while `es`ing index 0 over each element is truthy
<code>\`d'</code> | `drop` while `es`ing index 0 over each element is truthy
<code>\`tap</code> | `es` index 0 over each element and return original element
<code>\`part</code> | `es` index 0 over each element and partition based on truthiness
<code>\`&</code> | check if all elements are truthy after `es`ing index 0 over each element
<code>\`\|</code> | check if any elements are truthy after `es`ing index 0 over each element
<code>\`?'</code> | find first element that returns truthy after `es`ing index 0

## LIST

Command | Description
--- | ---
<code>len</code> | length of index 0
<code>dep</code> | depth of index 0
<code>'</code> | `es` index 0 on list at index 1
<code>split</code> | split string at index 1 over string at index 0
<code>join</code> | join list over string at index 0
<code>,</code> | pair top 2 items
<code>++</code> | concatenate top 2 items as strings or lists
<code>r:</code> | get random item from list
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
<code>!==</code> | strict not equal
<code>></code> | greater than
<code><</code> | less than
<code>>=</code> | greater than or equal to
<code><=</code> | less than or equal to
<code><=></code> | comparison function (-1 for less than, 0 for equal, 1 for greater than)

## MODULE

Command | Description
--- | ---


## MULTISTACK

Command | Description
--- | ---
<code>'s</code> | `es` index 1 on a stack with name given by index 0
<code>push</code> | push index 1 to another stack with name given by index 0
<code>pushs</code> | push current stack to another stack with name given by index 0
<code>pull</code> | push top item of another stack with name given by index 0
<code>pud</code> | `pull` without modifying other stack
<code>pulls</code> | pull stack with name given by index 0 to current stack
<code>hijk</code> | set stack with name given by index 0 to current stack
<code>absb</code> | set current stack to stack with name given by index 0

## NUM

Command | Description
--- | ---
<code>N</code> | convert to bigint
<code>n_</code> | convert to number
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
<code>rng</code> | push random number between 0 and 1
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
<code>el</code> | check if index 0 is in list/object at index 1
<code><json</code> | parse JSON string
<code>>json</code> | serialize as JSON

## STACK

Command | Description
--- | ---
<code>size</code> | stack length
<code>deps</code> | stack depth
<code>enum</code> | convert each item in stack to an index-item pair
<code>denum</code> | convert `enum`-style stack into a normal stack
<code>pick</code> | `dup` but with any index
<code>nix</code> | `pop` but with any index
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
<code>shuf</code> | shuffle stack
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
<code>mapf</code> | `map` and `flat`
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
<code>sort</code> | sort items based on `es`
<code>sortc</code> | sort items based on comparison function
<code>part</code> | separate items into 2 lists based on whether they return truthy after `es` (top list holds truthy values, bottom list holds falsy values)
<code>group</code> | categorize items into keys after `es`ing index 0
<code>table</code> | map over cartesian product of stack
<code>bins</code> | get insert index of index 0 from binary searching over `es` of index 1 on each element in stack

## STR

Command | Description
--- | ---
<code>str</code> | convert to string
<code>form</code> | convert to formatted representation
<code>lns</code> | construct multiline string by getting lines until index 0 is matched at the start of the string
<code>tag</code> | tag string with line number
<code>tag_</code> | untag string
<code>sf</code> | equivalent of `sprintf` - takes string and list
<code>esc_</code> | unescape string at index 0
<code>>char</code> | convert charcode to char
<code>>chars</code> | convert charcode list to string
<code><char</code> | convert char to charcode
<code><chars</code> | convert string to charcode list
<code>>cs</code> | split with empty string
<code><cs</code> | join with empty string
<code>>ws</code> | split with space
<code><ws</code> | join with space
<code>>ls</code> | split with newline
<code><ls</code> | join with newline
<code>words</code> | split into words
<code>graphms</code> | split into graphemes
<code>>a</code> | lowercase
<code>>A</code> | UPPERCASE
<code>>Aa</code> | capitalize first letter
<code>>aA</code> | camelCase
<code>>a-a</code> | kebab-case 
<code>>a_a</code> | snake_case 
<code>>AA</code> | Title Case 
<code>>aa</code> | sWAP cASE
<code>pad</code> | pad string given by index 2 until length given by index 0 with string given by index 1
<code>padl</code> | `pad` but only from the left
<code>padr</code> | `pad` but only from the right
<code>lat</code> | latinize
<code>tr</code> | transliterate chars in index 2 from index 1 to index 0
<code>tro</code> | `tr` but with chars at index 1 and object at index 0
<code>?</code> | new regex with flags at index 0
<code>?!</code> | safe regex
<code>??</code> | unsafe regex
<code>?m</code> | iterator of matches when regex at index 0 is applied to string at index 1
<code>?M</code> | `?m` but detailed
<code>?i</code> | `?m` with indices only
<code>?t</code> | `?m` with truthiness
<code>?s</code> | replace matches of regex at index 1 on string at index 2 with string at index 0
<code>?S</code> | `?s` with replacement function
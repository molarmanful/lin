#Scope
Every lin program gets 2 scopes which are a collection of ID's: global and local. Every stack can access the global scope; in addition, each stack gets its own local scope. Each time a command is executed, the ID's it can access are the union of the global scope and the current stack's local scope.

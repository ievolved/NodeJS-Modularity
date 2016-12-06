# NodeJS-Modularity
----

Example refactoring cumbersome vanilla NodeJS to something more modular and eloquent.  The idea is to use a NodeJS application as it might be written by someone just learning about NodeJS and demonstrate how to gradually refactor the code to be both reusable and modular.

Start with modularity-1 and read the comments.  Then modularity-2 and read the comments, then modularity-3 and read the comments.  Along the way make note about how the code improves.

**Learning objectives**

* maintain ES6 syntax compliance
* identify code that is duplicated many times and then change it so it is used only once
* introduction to routing by reducing multiple if-elseif-else statements into a basic routing mechanism
* structuring request methods by GET/POST/Etc. and dropping into a 405 if method not used
* structuring request urls by url name and dropping into a 404 if a url not found
* breaking reusable functions into another file for reusability (part of the modularity) objective
* sending a response with content-type, status codes

**At module 4:**

* create custom async function (when breaking an async call into a reusable function that must return a result)


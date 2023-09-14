var PI = 3.14;
PI = 42; // stop me from doing this!

/* Write an ES2015 Version */

const PI = 3.14;

//QUIZ
//- What is the difference between ***var*** and ***let***?
// var is scoped to the function, if declared in the main body of the code it will be aglobal varibale added to the window var can be hoisted, can be redeclared and reaassigned 
// let is scoped to the code block {}, it will not be a global variable and will not be added to window, will not be hoisted, cannot be redeclared, can nbe reassigned
//- What is the difference between **var** and ***const***?
// var is scoped to the function, if declared in the main body of the code it will be aglobal varibale added to the window var can be hoisted, can be redeclared and reaassigned 
// const is copred to the code block {}, it will not be a global variable and will not be added to window, will not be hoisted, cannot be redeclared, cannot be reassigned, CAN be mutated
//- What is the difference between **let** and **const**?
// let can be reassigned 
// const cannot be reassigned, can be mutated
//- What is hoisting?
// hoisting referes to the behavior of var when var declaration will be executed before any code in a file is executed, so var variables exist as undefined before asssignment and technically can be used in functions befoore assignmentt
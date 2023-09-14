function double(arr) {
    return arr.map(function(val) {
      return val * 2;
    });
  }

  /* Write an ES2015 Version */

  const double = (arr)=>arr.map(val=>val*2);

//## **Refactor the following function to use arrow functions:**
//Replace ALL functions with arrow functions:

  function squareAndFindEvens(numbers){
    var squares = numbers.map(num=>num ** 2);
    var evens = squares.filter(square=>square % 2 === 0);
    return evens;
  }

  const squareAndFindEvensOnLiner = numbers => numbers.map(num=>num ** 2).filter(square=>square % 2 === 0);
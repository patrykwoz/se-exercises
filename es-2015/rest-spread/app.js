function filterOutOdds() {
    var nums = Array.prototype.slice.call(arguments);
    return nums.filter(function(num) {
      return num % 2 === 0
    });
  }

  /* Write an ES2015 Version */

  function filterOutOdds(...nums){
    if (!nums.length) return undefined;
    return nums.filter(num=>num%2===0);
  }

  function findMin(...nums){
    if (!nums.length) return undefined;
    return nums.reduce((accumulator, current)=>{
        return current < accumulator ? current : accumulator;
    })
  }

  function mergeObjects(obj1, obj2){
    return {...obj1, ...obj2};

  }

  function doubleAndReturnArgs(arr, ...nums){
    return [...arr, ...nums.map(val=>val*2)];
  }

  /** remove a random element in the items array
and return a new array without that item. */

const removeRandom = items => {
    const newItems = [...items];
    newItems.splice(Math.floor(Math.random()*items.length),1);
    return newItems;
}

/** Return a new array with every item in array1 and array2. */

const extend = (array1, array2) => [...array1, ...array2];

/** Return a new object with all the keys and values
from obj and a new key/value pair */

const addKeyVal = (obj, key, value) => ({...obj, [key]:value});

/** Return a new object with a key removed. */

const removeKey = (obj,key) => {
    const newObj = {...obj};
    delete newObj[key];
    return newObj;
};


/** Combine two objects and return a new object. */

const combine = (obj1, obj2) => ({...obj1, ...obj2});

/** Return a new object with a modified key and value. */

const update = (obj, key, val) => ({...obj, [key]:val});
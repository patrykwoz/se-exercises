function countZeroes(arr) {
    let leftIdx = 0;
    let rightIdx = arr.length - 1;

    // Edge case: if the first element is 0, then all elements are 0
    if (arr[0] === 0) {
        return arr.length;
    }

    while (leftIdx <= rightIdx) {
        let middleIdx = Math.floor((leftIdx + rightIdx) / 2);

        // If the current element is 1 and the next one is 0, then we've found our boundary
        if (arr[middleIdx] === 1 && arr[middleIdx + 1] === 0) {
            return arr.length - middleIdx - 1;
        }
        
        // If current element is 1, move the left pointer to the right
        if (arr[middleIdx] === 1) {
            leftIdx = middleIdx + 1;
        } 
        // Otherwise, move the right pointer to the left
        else {
            rightIdx = middleIdx - 1;
        }
    }
    
    // Return 0 because there are no zeroes in the array
    return 0;
}


module.exports = countZeroes
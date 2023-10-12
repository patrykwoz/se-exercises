function findRotatedIndex(arr, val) {
    const rotationIdx = findRotation(arr);
    
    // If array is not rotated
    if (rotationIdx === -1) {
        return binarySearch(arr, val, 0, arr.length - 1);
    }

    // If the searched element is the first element of the rotated array
    if (arr[rotationIdx] === val) return rotationIdx;

    if (val >= arr[0]) {
        return binarySearch(arr, val, 0, rotationIdx - 1);
    }
    return binarySearch(arr, val, rotationIdx, arr.length - 1);
}

function binarySearch(arr, val, start, end) {
    while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        if (arr[mid] === val) return mid;
        else if (arr[mid] < val) start = mid + 1;
        else end = mid - 1;
    }
    return -1; 
}

function findRotation(arr) {
    let leftIdx = 0;
    let rightIdx = arr.length - 1;
    let endVal = arr[arr.length - 1];

    while (leftIdx <= rightIdx) {
        let middleIdx = Math.floor((leftIdx + rightIdx) / 2);
        
        if (middleIdx < arr.length - 1 && arr[middleIdx] > arr[middleIdx+1]) {
            return middleIdx+1;
        } 
        else if (arr[middleIdx] > endVal) {
            leftIdx = middleIdx + 1;
        } else {
            rightIdx = middleIdx - 1;
        }
    }
    
    return -1;
}

module.exports = findRotatedIndex
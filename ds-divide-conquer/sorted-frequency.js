function sortedFrequency(arr, val) {
    let firstIdx = findFirstOccurrence(arr, val);
    if (firstIdx === -1) return -1;

    let lastIdx = findLastOccurrence(arr, val);
    
    return lastIdx - firstIdx + 1;
}

function findFirstOccurrence(arr, val) {
    let leftIdx = 0;
    let rightIdx = arr.length - 1;
    let result = -1;

    while (leftIdx <= rightIdx) {
        let middleIdx = Math.floor((leftIdx + rightIdx) / 2);
        
        if (arr[middleIdx] === val) {
            result = middleIdx;
            rightIdx = middleIdx - 1;
        } else if (arr[middleIdx] < val) {
            leftIdx = middleIdx + 1;
        } else {
            rightIdx = middleIdx - 1;
        }
    }
    
    return result;
}

function findLastOccurrence(arr, val) {
    let leftIdx = 0;
    let rightIdx = arr.length - 1;
    let result = -1;

    while (leftIdx <= rightIdx) {
        let middleIdx = Math.floor((leftIdx + rightIdx) / 2);
        
        if (arr[middleIdx] === val) {
            result = middleIdx;
            leftIdx = middleIdx + 1;
        } else if (arr[middleIdx] < val) {
            leftIdx = middleIdx + 1;
        } else {
            rightIdx = middleIdx - 1;
        }
    }
    
    return result;
}


module.exports = sortedFrequency
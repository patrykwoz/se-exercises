function findRotationCount(arr) {
    const rotationIdx = findRotation(arr);
    if (rotationIdx > 0){
        return rotationIdx;
    }
    return 0;
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

module.exports = findRotationCount
function findFloor(arr, x) {
    let leftIdx = 0;
    let rightIdx = arr.length - 1;

    while (leftIdx <= rightIdx) {
        const mid = Math.floor((leftIdx + rightIdx) / 2);
        if ((arr[mid] <= x) && (mid + 1 > arr.length - 1 || arr[mid + 1] > x)) return arr[mid];
        else if (arr[mid] < x) leftIdx = mid + 1;
        else rightIdx = mid - 1;
    }
    return -1; 
}

module.exports = findFloor
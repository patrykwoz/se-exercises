//function calculating mean (average)
function mean(arr) {
    let sum = 0;
    for (let num of arr) {
        sum += num;
    }
    return sum / arr.length;
}

//function calculating median (midpoint)
function median(arr) {
    arr.sort((a, b) => a - b);
    let mid = Math.floor(arr.length / 2);
    if (arr.length % 2 === 0) {
        return (arr[mid] + arr[mid - 1]) / 2;
    } else {
        return arr[mid];
    }
}

//function calculating mode (most frequent number)
function mode(arr) {
    let count = {};
    for (let num of arr) {
        if (count[num]) {
            count[num] += 1;
        } else {
            count[num] = 1;
        }
    }
    let max = 0;
    let mode = null;
    for (let num in count) {
        if (count[num] > max) {
            max = count[num];
            mode = num;
        }
    }
    return mode;
}

module.exports = {mean, median, mode};
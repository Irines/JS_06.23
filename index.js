function getDistance(x1, y1, x2, y2) {
    if(isValid(x1) && isValid(y1) && isValid(x2) && isValid(y2)) {
        let dist = Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
        return Number.isInteger(dist) ? dist : Math.trunc(dist * 100)/100;
    } else {
        throw new Error('Числа должны быть в пределах -1000; 1000');
    }
}

function isValid(num) {
    return num >= -1000 && num <= 1000 && !isNaN(num)
}

function switchPlaces(arr) {
    if (!Array.isArray(arr)) {
        throw new Error('Входящий аргумент должен быть массивом');
    }
    if (arr.length == 0) {
        return arr;
    }

    let middleIndex = Math.floor(arr.length / 2);
    let firstHalf = arr.slice(0, middleIndex);
    let secondHalf = arr.length % 2 !== 0 ? arr.slice(middleIndex + 1) : arr.slice(middleIndex);
    return arr.length % 2 !== 0 ? [...secondHalf, arr[middleIndex], ...firstHalf] : [...secondHalf, ...firstHalf];
}

function getDivisors(num) {
    if (Number.isFinite(num) && !Number.isNaN(num)) {
        let divisors = [];
        const sqrt = Math.floor(Math.sqrt(num));
      
        for (let i = 1; i <= sqrt; i++) {
          if (num % i === 0) {
            divisors.push(i);
            if (i !== sqrt) {
              divisors.push(num / i);
            }
          }
        }
      
        return divisors.sort((a, b) => b - a);
    } else {
        throw new Error('Невалидный ввод');
    }
}

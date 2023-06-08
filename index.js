const myCustomFilter = function (callback, contextObj = null) {
    if (!callback || typeof callback !== "function") {
        throw new Error("Invalid argument.");
    }
    if (contextObj && typeof contextObj !== "object") {
        throw new Error("Invalid argument.");
    }
    let filteredArr = [];

    for (let i = 0; i < this.length; i++) {
        if (contextObj === null) {
            if (callback(this[i], i, this)) {
                filteredArr.push(this[i]);
            }
        } else {
            if (callback.call(contextObj, this[i], i, this)) {
                filteredArr.push(this[i]);
            }
        }
    }
    return filteredArr;
};

Array.prototype.customFilter = myCustomFilter;

const bubbleSort = (input) => {
    validateArr(input);
    let arr = [...input];
    for (let i = 0; i < arr.length - 1; i++) {
        let swapDuringCycle = false;
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                let save = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = save;
                swapDuringCycle = true;
            }
        }
        if (!swapDuringCycle) break;
    }
    return arr;
};

const validateArr = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error("Invalid argument.");
    }
    for (let el of arr) {
        if (typeof el !== "number" || isNaN(el) || !isFinite(el)) {
            throw new Error("Invalid argument.");
        }
    }
};

const storageWrapper = (callback, arr = null) => {
    if (!callback || typeof callback !== "function") {
        throw new Error("Invalid argument.");
    }
    if (arr && !Array.isArray(arr)) {
        throw new Error("Invalid argument.");
    }

    let closuredArr = [];
    if (!arr) {
        return () => {
            return (closuredArr = [...closuredArr, callback()]);
        };
    } else {
        return () => {
            const newVal = callback();
            arr.push(newVal);
            return newVal;
        };
    }
};

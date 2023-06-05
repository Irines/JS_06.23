function makeDeepCopy(obj) {
    if (typeof obj !== "object" || obj == null || obj instanceof Map || obj instanceof Set || Array.isArray(obj)) {
        throw new Error();
    } else {
        let copy = recursiveCopy(obj);
        return copy;
    }
}

function getStringType(value) {
    let _toString = Object.prototype.toString;
    let str = _toString.call(value);
    return str.slice(8, -1);
}

// WeakMap is used to keep track of already copied objects and prevent looping when copying objects with circular references.
function recursiveCopy(target, map = new WeakMap()) {
    // clone primitive types
    if (typeof target != "object" || target == null) {
        return target;
    }

    const type = getStringType(target);
    let cloneTarget = null;

    if (map.get(target)) {
        return map.get(target);
    }
    map.set(target, cloneTarget);

    // in case if String/Number/Boolean created with function-constructor
    if (type != "Set" && type != "Map" && type != "Array" && type != "Object") {
        return target;
    }

    // clone Set
    if (type == "Set") {
        cloneTarget = new Set();
        target.forEach((value) => {
            cloneTarget.add(recursiveCopy(value, map));
        });
        return cloneTarget;
    }

    // clone Map
    if (type == "Map") {
        cloneTarget = new Map();
        target.forEach((value, key) => {
            cloneTarget.set(key, recursiveCopy(value, map));
        });
        return cloneTarget;
    }

    // clone Array
    if (type == "Array") {
        cloneTarget = new Array();
        for (const key in target) {
            cloneTarget[key] = recursiveCopy(target[key], map);
        }
        return cloneTarget;
    }

    // clone Object
    if (type == "Object") {
        cloneTarget = new Object();
        for (const key in target) {
            cloneTarget[key] = recursiveCopy(target[key], map);
        }
        return cloneTarget;
    }

    return cloneTarget;
}

function createIterable(from, to) {
    let iterable = {
        from: from,
        to: to,
        [Symbol.iterator]: function () {
            return {
                current: this.from,
                last: this.to,
                next() {
                    if (this.current <= this.last) {
                        return { done: false, value: this.current++ };
                    } else {
                        return { done: true };
                    }
                },
            };
        },
    };

    return iterable;
}

function createProxy(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
        throw new Error();
    }

    return new Proxy(obj, {
        get(target, prop) {
            if (prop in target) {
                target[prop].readAmount = (target[prop].readAmount || 0) + 1;
                return target[prop].value;
            }
            return undefined;
        },
        set(target, prop, value) {
            if (prop in target) {
                const existingValue = target[prop].value;
                if (typeof existingValue === typeof value) {
                    target[prop].value = value;
                } else {
                    return false;
                }
            } else {
                target[prop] = { value, readAmount: 0 };
            }

            return true;
        },
    });
}

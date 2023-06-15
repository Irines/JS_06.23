class Stack {
    constructor(limit = 10) {
        if (typeof limit !== "number" || !Number.isFinite(limit) || isNaN(limit) || limit < 0) {
            throw new Error("Invalid limit value");
        }
        this.limit = limit;
        this.stack = [];
        this.size = 0;
    }

    push(element) {
        if (this.size >= this.limit) {
            throw new Error("Limit exceeded");
        }
        this.size++;
        this.stack[this.size - 1] = element;
    }

    pop() {
        if (this.isEmpty()) {
            throw new Error("Empty stack");
        }
        let deleted = this.stack[this.size - 1];
        delete this.stack[this.size - 1];
        this.size--;
        return deleted;
    }

    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.stack[this.size - 1];
    }

    isEmpty() {
        return this.size === 0;
    }

    toArray() {
        if (this.size === 0) {
            return [];
        }
        const arr = [];
        for (let i = 0; i < this.size; i++) {
            arr.push(this.stack[i]);
        }
        return arr;
    }

    static fromIterable(iterable) {
        if (typeof iterable[Symbol.iterator] !== "function") {
            throw new Error("Not iterable");
        }
        const size = iterable.length ?? iterable.size ?? 0;
        const stack = new Stack(size);
        for (let elem of iterable) {
            stack.push(elem);
        }
        return stack;
    }
}

class ListNode {
    constructor(data, next = null) {
        this.data = data;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    append(elem) {
        const newNode = new ListNode(elem);

        if (!this.head || !this.tail) {
            this.head = newNode;
            this.tail = newNode;
        }

        this.tail.next = newNode;
        this.tail = newNode;
    }

    prepend(elem) {
        const newNode = new ListNode(elem, this.head);
        this.head = newNode;

        if (!this.tail) {
            this.tail = newNode;
        }
    }

    find(elem) {
        if (!this.head) {
            return null;
        }

        let currentNode = this.head;

        while (currentNode) {
            if (elem !== undefined && currentNode.data === elem) {
                return currentNode;
            }
            currentNode = currentNode.next;
        }
        return null;
    }

    toArray() {
        if (!this.head) {
            return [];
        }
        let currentNode = this.head;
        const arr = [];
        while (currentNode) {
            arr.push(currentNode.data);
            currentNode = currentNode.next;
        }
        return arr;
    }

    static fromIterable(iterable) {
        if (typeof iterable[Symbol.iterator] !== "function") {
            throw new Error("Not iterable");
        }
        const newLinkedList = new LinkedList();
        for (let el of iterable) {
            newLinkedList.append(el);
        }
        return newLinkedList;
    }
}

class Car {
    constructor() {}
    #brand = "";
    #model = "";
    #maxSpeed = 100;
    #maxFuelVolume = 20;
    #yearOfManufacturing = 1950;
    #fuelConsumption = 1;
    #damage = 1;
    #currentFuelVolume = 0;
    #isStarted = false;
    #mileage = 0;
    #health = 100;
    get brand() {
        return this.#brand;
    }

    set brand(value) {
        if (notValidInputString(value)) {
            throw new Error("Invalid brand name");
        }
        this.#brand = value;
    }

    get model() {
        return this.#model;
    }

    set model(value) {
        if (notValidInputString(value)) {
            throw new Error("Invalid model name");
        }
        this.#model = value;
    }

    get yearOfManufacturing() {
        return this.#yearOfManufacturing;
    }

    set yearOfManufacturing(value) {
        const currentYear = new Date().getFullYear();
        if (notValidNumber(value) || value < 1950 || value > currentYear) {
            throw new Error("Invalid year of manufacturing");
        }
        this.#yearOfManufacturing = value;
    }

    get maxSpeed() {
        return this.#maxSpeed;
    }

    set maxSpeed(value) {
        if (notValidNumber(value) || value < 100 || value > 330) {
            throw new Error("Invalid max speed");
        }
        this.#maxSpeed = value;
    }
    get maxFuelVolume() {
        return this.#maxFuelVolume;
    }

    set maxFuelVolume(value) {
        if (notValidNumber(value) || value < 20 || value > 100) {
            throw new Error("Invalid max fuel volume");
        }
        this.#maxFuelVolume = value;
    }

    get fuelConsumption() {
        return this.#fuelConsumption;
    }

    set fuelConsumption(value) {
        if (value <= 0 || notValidNumber(value)) {
            throw new Error("Invalid fuel consumption");
        }
        this.#fuelConsumption = value;
    }

    get damage() {
        return this.#damage;
    }

    set damage(value) {
        if (notValidNumber(value) || value < 1 || value > 5) {
            throw new Error("Invalid damage");
        }
        this.#damage = value;
    }

    get currentFuelVolume() {
        return this.#currentFuelVolume;
    }

    get isStarted() {
        return this.#isStarted;
    }

    get health() {
        return this.#health;
    }

    get mileage() {
        return this.#mileage;
    }

    start() {
        if (this.#isStarted) {
            throw new Error("Car has already started");
        }
        this.#isStarted = true;
    }

    shutDownEngine() {
        if (!this.#isStarted) {
            throw new Error("Car hasn't started yet");
        }
        this.#isStarted = false;
    }

    fillUpGasTank(amount) {
        if (typeof amount !== "number" || isNaN(amount) || !Number.isFinite(amount) || amount <= 0) {
            throw new Error("Invalid fuel amount");
        }
        if (this.#currentFuelVolume + amount > this.#maxFuelVolume) {
            throw new Error("Too much fuel");
        }
        if (this.#isStarted) {
            throw new Error("You have to shut down your car first");
        }
        this.#currentFuelVolume += amount;
    }

    drive(speed, duration) {
        if (notValidNumber(speed) || speed <= 0) {
            throw new Error("Invalid speed");
        }
        if (notValidNumber(duration) || duration <= 0) {
            throw new Error("Invalid duration");
        }
        if (speed > this.#maxSpeed) {
            throw new Error("Car can't go this fast");
        }
        if (!this.#isStarted) {
            throw new Error("You have to start your car first");
        }
        const fuelNeeded = (this.#fuelConsumption * speed * duration) / 100;
        if (fuelNeeded > this.#currentFuelVolume) {
            throw new Error("You don't have enough fuel");
        }
        const healthLost = (this.#damage * speed * duration) / 100;
        if (healthLost > this.#health) {
            throw new Error("Your car won’t make it");
        }
        this.#currentFuelVolume -= fuelNeeded;
        this.#health -= healthLost;
        this.#mileage += speed * duration;
    }

    repair() {
        if (this.#isStarted) {
            throw new Error("You have to shut down your car first");
        }
        if (this.#currentFuelVolume < this.#maxFuelVolume) {
            throw new Error("You have to fill up your gas tank first");
        }
        this.#health = 100;
    }

    getFullAmount() {
        if (this.#currentFuelVolume === this.#maxFuelVolume) {
            return 0;
        } else {
            return this.#maxFuelVolume - this.#currentFuelVolume;
        }
    }
}

const notValidInputString = (value) => {
    if (typeof value !== "string" || value.length < 1 || value.length > 50) {
        return true;
    } else return false;
};

const notValidNumber = (value) => {
    if (typeof value !== "number" || isNaN(value) || !Number.isFinite(value) || !Number.isInteger(value)) {
        return true;
    } else return false;
};
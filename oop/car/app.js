class Vehicle {
    constructor(make, model, year){
        this.make = make;
        this.model = model;
        this.year = year;
    }
    honk(){
        return 'Beep.';
    }
    toString (){
        return  `This vehicle is a ${this.make} ${this.model} from ${this.year}`;
    }
}

class Car extends Vehicle{
    constructor(make, model, year){
        super(make, model, year);
        this.numWheels = 4;
    }
}

class Motorcycle extends Vehicle{
    constructor(make, model, year){
        super(make, model, year);
        this.numWheels = 2;
    }
    revEngine (){
        return 'VROOM!!!'
    }
}

class Garage {
    constructor(capacity){
        this.capacity = capacity;
        this.carCount = 0;
        this.vehicles = [];
    }
    add(vehicle){
        if (!(vehicle instanceof Vehicle)){
            throw new Error('Only vehicles are allowed in here!');
        }
        if (this.carCount>=this.capacity){
            throw new Error('Sorry, we’re full.');
        }
        this.vehicles.push(vehicle);
        this.carCount ++;
        return 'Vehicle added!';
    }
}
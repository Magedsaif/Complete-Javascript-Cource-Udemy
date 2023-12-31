'use strict';
// constructor function
// JS doesnt have regular classes, but we can create objects from a constructor functions.

const Person = function (firstName, birthYear) {
  //Instance properties
  this.firstName = firstName;
  this.birthYear = birthYear;
  /*
 never create a methods inside of a constructor function becaus if we are creating thousands of instances each one would carry around a copy of that method and other methods we would create which will affect the performance, instead we would use the prototype and prototype inheritance
 */
  //   this.calcAge = function () {
  //     console.log(2037 - this.birthYear);
  //   };
};

/* const jonas = new Person('jonas', 1991);
console.log(jonas);

// 1. a new empty object {} is created
// 2.function is called, this = {}. the THIS keyword will point to the newely created object that was created in No.1
// 3.{} linked to a prototype, the new object is linked (__proto__ property) to the constructor function's prototype property.
// 4.function automatically return {}, the new object is returned from the constructor function call

const matilda = new Person('matilda', 2017);
const jack = new Person('jack', 1975);

console.log(matilda);
console.log(jack);
const jay = 'jay';
console.log(jay instanceof Person);
console.log(jonas instanceof Person); */

///////////////////////////////////////////////////////////////////////////
// Prototypes
// protoype property of the person constructor function, so all the objects that are created  through this constructor  function will inherit, so they will get access to all the methods and properties on this prototype

/* // inheritance in constructor functions
console.log(Person.prototype);
Person.prototype.calcAge = function () {
  console.log(2037 - this.birthYear);
};
// THIS KEYWORD IS SET TO THE OBJECT THAT IS CALLING THE METHOD.
// prototypal inheritance and protoype chain
jonas.calcAge(); // 46
matilda.calcAge();
jack.calcAge();
console.log(jonas.__proto__); // return the prototype of jonas
console.log(jonas.__proto__ === Person.prototype);
console.log(Person.prototype.isPrototypeOf(jonas));
console.log(Person.prototype.isPrototypeOf(Person)); //false

Person.prototype.species = 'homo sepians';
console.log(jonas, matilda);

console.log(jonas.hasOwnProperty('firstName')); // true
console.log(jonas.hasOwnProperty('species')); // false because that is not over the jonas object but because it's prototype of Person

// the prototype property of OBJECT
// this is the reason why we could use the hasOwnProperty because its a method in the prototype of the object so we got access to it through the prototypal inheritance in the prototype chain
console.log(jonas.__proto__);
console.log(jonas.__proto__.__proto__);
// the prototype of the prototype is NULL becaus the object.protoype is the top of the prototype chain
console.log(jonas.__proto__.__proto__.__proto__);

console.dir(Person.prototype.constructor);

// prototype of array

const arr = [3, 6, 5, 9, 7, 3, 7, 7, 3]; // so [] === new Array
// since all the objects in JS has a prototype
//the prototype of the array has all the metods of the array so each array will inherit those method from its prototype
console.log(arr.__proto__);
console.log(arr.__proto__ === Array.prototype);
// object.prototype
console.log(arr.__proto__.__proto__);
console.log(arr);

// adding a new method to the prototype property of the array constructor, so all arrays would inherit method
Array.prototype.unique = function () {
  return [...new Set(this)];
};

console.log(arr.unique());

const h1 = document.querySelector('h1');
console.dir(x => x + 1); */

///////////////////////////////////////
// Coding Challenge #1

/*
1. Use a constructor function to implement a Car. A car has a make and a speed property. The speed property is the current speed of the car in km/h;
2. Implement an 'accelerate' method that will increase the car's speed by 10, and log the new speed to the console;
3. Implement a 'brake' method that will decrease the car's speed by 5, and log the new speed to the console;
4. Create 2 car objects and experiment with calling 'accelerate' and 'brake' multiple times on each of them.

DATA CAR 1: 'BMW' going at 120 km/h
DATA CAR 2: 'Mercedes' going at 95 km/h

GOOD LUCK 😀
*/
/* 
const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};

Car.prototype.accelerate = function () {
  console.log(this.speed += 10);
};

Car.prototype.brake = function () {
  console.log(this.speed -= 5);
}

const BMW = new Car('BMW', 120);
const Mercedes = new Car('Mercedes', 95);

BMW.accelerate();
BMW.accelerate();
BMW.accelerate();
Mercedes.accelerate();
Mercedes.accelerate();
BMW.brake();
 */
//////////////////////////////////////////////////////////////////////
// ES6 Classes
//--------------------------------------------------------------------
//two teps
//class expression

// const PersonCl = class {}

//class declaration

class PersonCl {
    constructor(firstName, birthYear) {
        this.firstName = firstName;
        this.birthYear = birthYear;
    }
    calcAge (){
        console.log(2037 - this.birthYear);
    }
}
// all the methods we write on the class outside the constructor will be on the prototype of the class, not on the object it self

const jessica = new PersonCl('jessica', 1996);

console.log(jessica);

jessica.calcAge();

console.log(jessica.__proto__ === PersonCl.prototype);

// the same as adding it on the class it self
PersonCl.prototype.greet = function() {
    console.log(`hey ${this.firstName}`);
};

jessica.greet();

// Important methods
// 1.classes are not hoisted, not like function decleration, which we can use before declaring 
// 2. Class are first class citizens, so we can pass them to into function as well as returning them 
// 3.classes are executed in strict mode 


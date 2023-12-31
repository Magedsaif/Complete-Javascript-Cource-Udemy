'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-12-24T14:43:26.374Z',
    '2023-12-25T18:49:59.371Z',
    '2023-12-21T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2023-12-24T14:43:26.374Z',
    '2023-12-25T18:49:59.371Z',
    '2023-12-21T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0); // 09 08 07
  // const month = `${date.getMonth() + 1}`.padStart(2, 0); // the +1 because it's a zero based.
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  //setting the time to 5 minutes

  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // in each call, print the remaining time to the user
    labelTimer.textContent = `${min}:${sec}`;

    // when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
    }
    // decrease by 1s
    time--;
  };
  let time = 120;

  // call the timer every second
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// Fake Always logged in

currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Experimenting INTL API
// we now correctedly formatted the datefor any country around the world
const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  // weekday: 'short'
};
// const locale = navigator.language;
// labelDate.textContent = new Intl.DateTimeFormat(
//   currentAccount.locale,
//   options
// ).format(now);

/* const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0); // 09 08 07
const month = `${now.getMonth() + 1 }`.padStart(2, 0); // because it's a zero based
const year = now.getFullYear();
const hour = `${now.getHours() + 1 }`.padStart(2, 0);
const min = `${now.getMinutes() + 1 }`.padStart(2, 0)

const dateFormatted = `${day}/${month}/${year}, ${hour}:${min}`
// this will view a static time, if we want to display the current time we would need syjg called (((((TIMER))))) whish we will study later
labelDate.textContent = dateFormatted; */

// day / month / year / format

/////////////////////////////////////
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short'
    };
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // timer
    // to seperate the timer of each user
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

//////////////////////////////////
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//////////////////////////////////

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add Loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // reset the timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

//////////////////////////////////

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* console.log(23 === 23.0);

Base 10 - 0 to 9
Binary base 2 - 0 1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3); // false

conversions
console.log(Number('23'));
console.log(typeof(+'23')); // number

Parsing
it will get the number in the string with only the condition that the string should start with number, the second argument is radix
console.log(Number.parseInt('     30px', 10));
console.log(Number.parseInt('   e23', 10));

console.log(Number.parseFloat('   2.5rem   '));

check if the value is Not A Number
console.log(Number.isNaN('20'));
console.log(Number.isNaN(20));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23/0));

the besst way to Check if the value is a number
console.log(Number.isFinite(20));
console.log(Number.isFinite(20/0));


console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));

////////////////////////////////////////////////////
Mathg & Rounding
------------------------------------------------------------------

console.log(Math.sqrt(25));
console.log(25 ** (1/2));
console.log(8 ** (1/3));
console.log(Math.max(5,18,'23',11,2)); // 23
console.log(Math.max(5,18,'23px',11,2)); // does not parse // NaN

console.log(Math.min(5,18,'23',11,2)); // 2

console.log(Math.PI * Number.parseFloat('10px') ** 2); // the area of a circle of 10 px


console.log(Math.trunc(Math.random()* 6) + 1);

function that will give us a number between min and max
const randomInt = (min, max) =>
Math.floor(Math.random() * (max - min) + 1 + min);

console.log(randomInt(10, 20));


Rounding integars

console.log(Math.trunc(23.3)); // remove any decimal parts

to the nearst integers
console.log(Math.round(23.3));
console.log(Math.round(23.9));

rounded up
console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

rounded down
console.log(Math.floor(23.3));
console.log(Math.floor(23.9));


console.log(Math.trunc(-23.3)); // -23
console.log(Math.floor(-23.3)); // -24

Rounding Decimals
number is not a primitive like strings, whish dont have methods, so Js behind the scenes do (((boxing))), means transforming it to a number object then call a metod on that object then when it finishes it will convert it back to a primitve.
console.log((2.7).toFixed(0)); // will alwas return a string
console.log((2.7).toFixed(3)); // will alwas return a string
console.log((2.345).toFixed(2)); // will alwas return a string
console.log(+(2.345).toFixed(2)); // will retuen a number
////////////////////////////////////////////////////
Reminder Operator
----------------------------------------------------------------


console.log(5%2);
console.log(5/2); // 5 = 2 * 2 + 1 the reminder is 1

console.log(8%3);
console.log(8/3); // 8 = 2 * 3 + 2 the reminder is 2

console.log(6 % 2); // so its an odd number

const isEven = (n) => n % 2 === 0;

console.log((isEven(2)));
console.log((isEven(7)));
console.log((isEven(8)));

every Nth time i want to do sthg i use reminder operator

labelBalance.addEventListener('click', function() {
  [...document.querySelectorAll('.movements__row')].forEach(function(row, i) {
  if (i % 2 === 0) row.style.backgroundColor = 'orangered';
  if (i % 3 === 0) row.style.backgroundColor = 'blue';

});
})

////////////////////////////////////////////////////
Numeric Separator
---------------------------------------------------------------

287,460,000,000
const diameter = 287_460_000_000;
console.log(diameter);


const price= 345_99;
console.log(price);

const PI = 3.14_15;
console.log(PI);

console.log(Number('230_000')); // NaN

////////////////////////////////////////////////////
BIGINT
------------------------------------------------------------------
console.log(2 ** 53 - 1); // biggest number that JS can represent
console.log(Number.MAX_SAFE_INTEGER); // same

but if we want more than rhese in real world apps like id's in an api
the n transforms the regular number into a big int number

console.log(46354654736251436254365847368542313543568432135645n);

operations

console.log(10000n + 10000n);
console.log(6354654654365465435463546n * 32143543541321354351431n);
console.log(Math.sqrt(16n)); // error
but we can not mix bigInt's with regular numbers.

const huge = 13213643621325416513213143n;
const num = 23;

exceptions

console.log(huge * BigInt(num));

console.log(20n > 15); // true

console.log(20n === 20); // false

console.log(typeof 20n); // bigint


console.log( huge + ' is really big 111');

divisions

console.log(10n /3n); // 3n >>> nearst possible

/////////////////////////////////////////////////////
Creating Dates
-----------------------------------------------------------------

create a date
 */

/*
const now = new Date();
console.log(now);

console.log(new Date('Fri Dec 22 2023 19:53:59'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 8, 30, 15, 23, 5));

// starting ti,e since the beginig of UNIX System
console.log(new Date(0));

console.log(new Date(3 * 24 * 60 * 60 * 1000));

 */
/*
// working with dates
const future = new Date(2037, 10, 19, 15, 23, 5);
console.log(future.getFullYear()); //2037
console.log(future.getMonth()); // 10 cause its a zero based
console.log(future.getDay()); // day 4 caust its a day week
console.log(future.getHours()); // 15
console.log(future.getMinutes()); // 23
console.log(future.getSeconds()); // 5
console.log(future.toISOString()); // 2037-11-19T13:23:05.000Z to string
// gives me the time passed tsince that date
console.log(future.getTime());
// the millisecond based on that has passed since 1970
console.log(new Date(2142249785000));
// time stamp of current moment since 1970
console.log(Date.now());

// changing the year
future.setFullYear(2040);
console.log(future);
 */

////////////////////////////////////////////////////////////////////
// Operations with Dates
// -----------------------------------------------------------------

/* const future = new Date(2037, 10, 19, 15, 23, 5);
console.log(+future); // gonna give me the Timestamp of That Date

// function that takes two dates and give the days between them

const calcDaysPassed = (date1, date2) =>
 Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)

const days1 = calcDaysPassed(
  new Date(2037, 3, 4),
  new Date(2037, 3, 14, 10, 8));

console.log(days1); */

/////////////////////////////////////////////////////////////////////
// internationalizating Dates (INTL)
// -----------------------------------------------------------------

////////////////////////////////////////////////////////////////////
// internationalizating Numbers (INTL)
//------------------------------------------------------------------
/*
const num = 3884764.23;

const Options = {
  style: "currency",
  unit: 'celsius',
  currency: 'EUR',
};

console.log('US: ',new Intl.NumberFormat('en-us',Options).format(num));

console.log('Germany: ',new Intl.NumberFormat('de-DE',Options).format(num));

console.log('Syria: ',new Intl.NumberFormat('ar-SY',Options).format(num));

console.log(navigator.language, new Intl.NumberFormat(navigator.language,Options).format(num));
 */

////////////////////////////////////////////////////////////////////
// Timers: SetTimeout AND SetInterval

// SetTimeout: runs just once after a defined timer.
// SetInterval: keeps running basically forever until we stop it.
//-----------------------------------------------------------------

// as soon as JS hits this line of code it will keep counting the time in the background and register the callback function to be called after the time has elapsed, hence it will move out to the next line of code
// means Asynchronous JS
// if there is an arguments it will be accepted after the intervals
// we also can cancel the timer at least until the delay has actually passed

/* const ingredients = ['olives', 'spinach'];

const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`here is your pizza with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
console.log('waiting...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// run a certain function every some time
// setInterval

setInterval(function () {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format the result as a string
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  console.log(formattedTime);
}, 1000);
 */

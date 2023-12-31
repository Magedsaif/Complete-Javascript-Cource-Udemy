'use strict';

// user story: Describes how a user will interact with our application and how the application will respond to that interaction. OR It is a description of the application's functionality from the perspective of the user.

// common format: As a <type of user>, I want <an action> so that <a benefit>.
// answers the question: Who, What, Why ?

// 1: As a user, I want to log my running workouts with location, distance, time and pace so I can keep a log of all my running.

// 1: features: Map where we can click to add new workout,

//geolocation to display map at current location, running and cycling icons for different workouts,

//form to input distance, time, pace, and cadence,

// 2: As a user, I want to log my cycling workouts with location, distance, time, speed and elevation gain so I can keep a log of all my cycling.

// 2:features, form to input distance, time, speed, elevation gain, and elevation gain.

// 3: As a user, I want to see all my workouts at a glance so I can easily track my progress over time.

// 3:features, display all workouts in a list

// 4: As a user, I want to also see my workouts on a map so I can easily check where I work out the most.

// 4:features, display all workouts on a map

// 5: As a user, I want to see all my workouts when I leave the app and come back later so that I can keep using the app over time.
// 5:features, store workout data in the browser using local storage API
// 5:features, on page load, read the saved data from local storage and display

// 5:features, move map to workout location on click

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent;

if (navigator.geolocation)
  // Geolocation API
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // using destructuring
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      const coords = [latitude, longitude];
      map = L.map('map').setView(coords, 13);
      console.log(map);

      L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // handling clicks on map
      map.on('click', function (mapE) {
        mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus(); // start on distance
      });
    },
    function () {
      alert('Could not get your position');
    }
  );

form.addEventListener('submit', function (e) {
  e.preventDefault();
  //clear input feilds after submitting
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';
  // Display Marker
  console.log(mapEvent);
  // using destructuring
  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('workout')
    .openPopup();
});

// toggle between cadence and elevation gain based on workout type selected (running or cycling) using event delegation on the parent element of the two input fields (form__row) and listening for the click event on the parent element and then checking if the target element is the inputType element and then toggling the hidden class on the two input fields (inputCadence and inputElevation) using the closest method to select the parent element of the two input fields (form__row) and then using the toggle method to toggle the hidden class on the parent element of the two input fields (form__row) which will toggle the hidden class on the two input fields (inputCadence and inputElevation) as well. The hidden class is used to hide the two input fields (inputCadence and inputElevation) by setting the display property to none.

inputType.addEventListener('click', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});

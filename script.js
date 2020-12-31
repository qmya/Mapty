'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//Using Geo-location API : navigator.geolocation.getCurrentPosition()
//Here it will take two function one when the position is successfully getted and the other is when it is failed
navigator.geolocation.getCurrentPosition(
  function (position) {
    console.log(position);

    // const latitude = position.coords.latitude;
    const { latitude } = position.coords;
    // const longitude = position.coords.longitude;
    const { longitude } = position.coords;
    console.log(latitude, longitude);
    console.log(`https://www.google.ca/maps/@${latitude},${longitude}`);
    const coords = [latitude, longitude];
    const map = L.map('map').setView(coords, 13); //in setView the first one is latitude, longitude and the last one is zoom level
    //Maps are made up of tiles:
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(coords)
      .addTo(map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();
  },
  function () {
    alert('Could not get your position');
  }
);

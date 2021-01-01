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

let map, mapEvent;
//Using Geo-location API : navigator.geolocation.getCurrentPosition()
//Here it will take two function one when the position is successfully getted and the other is when it is failed
if (navigator.geolocation)
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
      map = L.map('map').setView(coords, 13); //in setView the first one is latitude, longitude and the last one is zoom level
      console.log(map);
      //Maps are made up of tiles:
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      //this is coming from leaflet
      //Handling clicks on Map:
      map.on('click', function (mapE) {
        console.log(mapE);
        mapEvent = mapE;
        //1)  when you click on the map the form appears
        form.classList.remove('hidden');
        inputDistance.focus();
      });
    },
    function () {
      alert('Could not get your position');
    }
  );

//Now when you press enter key the form get submitted
form.addEventListener('submit', function (e) {
  //prevent default behaviour of form
  e.preventDefault();
  //Here this SUBMIT is actually an enter button
  //clear the form
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
    '';
  console.log('Enter button is clicked on the form');
  console.log(mapEvent);
  //Display a marker
  const { lat, lng } = mapEvent.latlng;
  //Adding a popup and marker to the map where we clicked
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        maxHeight: 300,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('Workout')
    .openPopup();
});

//Adding an event listening to the options:
inputType.addEventListener('change', function () {
  //   e.preventDefault();

  //   const optionValue = e.target.value;
  //   console.log(`input option is ${optionValue}`);
  //   if (optionValue === 'Cyling') {
  // inputElevation.classList.remove('hidden');
  // inputCadence.classList.add('hidden');
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  //   }
});

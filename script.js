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

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10); //We shouldnt create any id by our own we should use a library to take care of it
  constructor(coords, distance, duration) {
    this.coords = coords; //[lat, lng]
    this.distance = distance; //in km
    this.duration = duration; //in mins
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  //Calulating the Pace
  calcPace() {
    //Pace is define as min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    //km/hr
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run1 = new Running([43, -79], 5.2, 24, 178);
// const cycling1 = new Cycling([43, -79], 27, 95, 523);
// console.log(run1, cycling1);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//APPLICATION ARCHITECTURE :
class App {
  //To make it encapsulated and make it part of the class object:
  #map;
  #mapEvent;
  constructor() {
    //We want to call the geolocation when the application starts
    this._getPosition();
    //Now when you press enter key the form get submitted
    form.addEventListener('submit', this._newWorkOut.bind(this));
    //Adding an event listening to the options:
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    //Using Geo-location API : navigator.geolocation.getCurrentPosition()
    //Here it will take two function one when the position is successfully getted and the other is when it is failed
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    console.log(position);
    const { latitude } = position.coords; // const latitude = position.coords.latitude;
    const { longitude } = position.coords; // const longitude = position.coords.longitude;
    console.log(latitude, longitude);
    console.log(`https://www.google.ca/maps/@${latitude},${longitude}`);
    const coords = [latitude, longitude];
    console.log(this);
    this.#map = L.map('map').setView(coords, 13); //in setView the first one is latitude, longitude and the last one is zoom level
    console.log(this.#map);
    //Maps are made up of tiles:
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    //this is coming from leaflet
    //Handling clicks on Map:
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    console.log(mapE);
    this.#mapEvent = mapE;
    //1)  when you click on the map the form appears
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkOut(e) {
    //prevent default behaviour of form
    e.preventDefault();
    console.log(this);
    //Here the SUBMIT is actually an enter button
    //clear the form
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
      '';
    console.log('Enter button is clicked on the form');
    //Display a marker
    const { lat, lng } = this.#mapEvent.latlng;
    //Adding a popup and marker to the map where we clicked
    L.marker([lat, lng])
      .addTo(this.#map)
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
  }
}
//Here we can call the class object
const app = new App();

console.log(app);

const locationEl = document.getElementById("location");
const weatherEl = document.getElementById("weather");
const tempEl = document.getElementById("temp");
const windEl = document.getElementById("wind");
const coordsEl = document.getElementById("coords");

//changes wind direction from degrees to cardinal
//https://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words
const getWindDirection = (wind) => {
  let degrees = wind.deg;
  let val = Math.floor((degrees / 22.5 ) + 0.5 );
  let arr= ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return arr[(val % 16)];
}

//displays data from current weather api call
const displayCurrentWeather = (data) => {
  let weather = data.weather[0].description;
  let temp = data.main.temp;
  let wind = data.wind;
  let coords = data.coord;

// console.log()

  locationEl.innerHTML = data.name;
  weatherEl.innerHTML = weather;
  tempEl.innerHTML = temp + " Degrees Farenheit";
  windEl.innerHTML = `Wind Speed: ${wind.speed}, Wind Direction: ${getWindDirection(wind)}`;
  coordsEl.innerHTML = `Longitude: ${coords.lon}, Latitude: ${coords.lat}`;
}

//takes searched city and gets its coordinates
const apiRun = (city) => {
fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=216201144e1f793e1de02515a9f93cd6`,
    {
    method: "GET", //GET is the default.
    credentials: "same-origin", // include, *same-origin, omit
    redirect: "follow", // manual, *follow, error
  }
)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    //sets lon and lat to two decimal places
    const long = parseFloat(data[0].lon).toFixed(2);
    const lat = parseFloat(data[0].lat).toFixed(2);
    
    console.log("Geocode: ", data);

    const currentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=216201144e1f793e1de02515a9f93cd6&units=imperial`;

    // console.log(currentWeather)

//second api call to get current weather
    fetch(currentWeather)
    .then((response) =>{
      return response.json();
    })
    .then((data) =>{
      console.log("Current Weather: ", data);
      displayCurrentWeather(data);
    })
  });
}

const formEl = document.getElementById("search-form");
const formEntry = formEl.elements["search-bar"]

//form entry to search for city
formEl.addEventListener("submit", function (event) {
    event.preventDefault();
   let citySearch = formEntry.value;
   
    // console.log(citySearch)
    apiRun(citySearch);
});
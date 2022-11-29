const locationEl = document.getElementById("location");
const weatherEl = document.getElementById("weather");
const tempEl = document.getElementById("temp");
const windEl = document.getElementById("wind");
const coordsEl = document.getElementById("coords");
const searchHistory = document.getElementById("search-history");

//changes wind direction from degrees to cardinal
//https://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words
const getWindDirection = (wind) => {
  let degrees = wind.deg;
  let val = Math.floor(degrees / 22.5 + 0.5);
  let arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return arr[val % 16];
};

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
};

//generates html for five day forecast
const displayFiveDay = (data) => {
  for (let i = 0; i < 5; i++) {
    let noon = [2, 10, 18, 26, 34];
    let iconURL = `http://openweathermap.org/img/wn/${data.list[noon[i]].weather[0].icon}.png`;
    let windFor = data.list[noon[i]].wind
    let dateFor = data.list[noon[i]].dt_txt.split(" ", 1)
    let html = (`
    <h2>${dateFor}</h2>
    <img src="${iconURL}"></img>
    <h2 class="text-center">Temp</h2>
    <div>${Math.floor(data.list[noon[i]].main.temp)} Degrees F</div>
    <h2 class="text-center">Wind</h2>
    <div class="text-center">Speed: <br>${windFor.speed} mph</div>
    <div class="text-center">${getWindDirection(windFor)}</div>
    `);
    let element = document.getElementById(`day-${(i + 1)}`);
    
    // console.log("noon: ", noon);
    // console.log("html: ", html);
    element.innerHTML = html;
  }
}

//takes searched city and gets its coordinates
const apiRun = (city) => {
  const newSearchHistoryItem = document.createElement("button")
  newSearchHistoryItem.innerHTML = getCities()
  searchHistory.append(newSearchHistoryItem)
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

      const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=216201144e1f793e1de02515a9f93cd6&units=imperial`;

      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=216201144e1f793e1de02515a9f93cd6&units=imperial`;

      // console.log(currentWeather)

      //second api call to get current weather
      fetch(currentWeatherURL)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("Current Weather: ", data);
          displayCurrentWeather(data);

          fetch(forecastURL)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log("forecast: ", data)
            displayFiveDay(data)
          })
        });
    });
};

const formEl = document.getElementById("search-form");
const formEntry = formEl.elements["search-bar"];

// const searchHistoryClick = (event) => {
//   let target = event.target;
//   console.log(target);
// }


const getCities = () => {
  const raw = localStorage.getItem('cities');
  if (!raw) return []
  
  return JSON.parse(raw)
}

const saveCities = (cities) => {
  localStorage.setItem("cities", JSON.stringify(cities))
}

//form entry to search for city
formEl.addEventListener("submit", function (event) {
  event.preventDefault(); 
  let citySearch = formEntry.value;
  
const cities = getCities();
cities.push(citySearch)
saveCities(cities)

  apiRun(citySearch);
});

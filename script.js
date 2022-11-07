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
    const long = parseFloat(data[0].lon).toFixed(2);
    const lat = parseFloat(data[0].lat).toFixed(2);

    console.log(long);
    console.log(lat);
    console.log(data);

    const weatherData = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=216201144e1f793e1de02515a9f93cd6`;

    console.log(weatherData)

    fetch(weatherData)
    .then((response) =>{
      return response.json();
    })
    .then((data) =>{
      console.log(data);
    })
  });
}

const formEl = document.getElementById("search-form");
const formEntry = formEl.elements["search-bar"]

formEl.addEventListener("submit", function (event) {
    event.preventDefault();
   let citySearch = formEntry.value
    console.log(citySearch)
    apiRun(citySearch);
});
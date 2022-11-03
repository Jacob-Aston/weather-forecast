// fetch(
//   "api.openweathermap.org/data/2.5/forecast?q=WestValleyCity&appid=216201144e1f793e1de02515a9f93cd6",
//   {
//     method: "GET", //GET is the default.
//     credentials: "same-origin", // include, *same-origin, omit
//     redirect: "follow", // manual, *follow, error
//   }
// )
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   });

const formEl = document.getElementById("search-form");
const formEntry = formEl.elements["search-bar"]

formEl.addEventListener("submit", function (event) {
    event.preventDefault();
   let citySearch = formEntry.value
    console.log(citySearch)
});
// ELEMENTS
let preloader = document.querySelector("#loaderContainer");
let changeLocation = document.querySelector("#change-location");
let searchBlock = document.querySelector(".search");
let searchInput = document.querySelector(".search-input");
let searchButton = document.querySelector(".search-button");
let searchIcon = document.querySelector(".search-button svg");
let errorBlock = document.querySelector(".error");
let defaultCard =
  '<div class="card inline-flex self-center"><div class="flex-col flex">  <p id="hour">3PM</p>  <h1 id="temperature" class="font-bold">   28 °C  </h1></div></div>';

let activeCard =
  '<div class="card active-card inline-flex"><div>  <p id="hour" class="text-[12px]">3PM</p>  <h1 id="temperature">28 °C</h1>  <p id="feels-like">Feels like 30°C</p></div></div>';
let cardsBlock = document.querySelector(".cards-block");

// DATA
let weather = document.querySelector("#weather");
let city = document.querySelector("#city");
let currentTemperature = document.querySelector("#current-temperature");
let day = document.querySelector("#day");
let humidity = document.querySelector("#humidity");
let airPressure = document.querySelector("#air-pressure");
let rainChance = document.querySelector("#rain-chance");
let windSpeed = document.querySelector("#wind-speed");
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// SERVER
updatePage();

async function getData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=a176d1906d2286711687fa945d96c7b8`
    );
    if (!response.ok) {
      throw new Error(`Not Found`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    errorBlock.classList.add("show");
  }
}

function updatePage(cityName = city.textContent.trim()) {
  let listSize;
  getData(cityName).then((data) => {
    if (!data) throw new Error("Invalid name");

    console.log(data);
    listSize = data.list.length;
    while (cardsBlock.firstChild) {
      cardsBlock.removeChild(cardsBlock.firstChild);
    }
    for (let i = 0; i < listSize; i++) {
      if (i == 0) {
        cardsBlock.insertAdjacentHTML("afterbegin", activeCard);
      } else {
        cardsBlock.insertAdjacentHTML("beforeend", defaultCard);
      }
    }
    let hours = document.querySelectorAll("#hour");
    let temperatures = document.querySelectorAll("#temperature");
    let feelsLike = document.querySelector("#feels-like");
    let cards = document.querySelectorAll(".card");
    for (let i = 0; i < listSize; i++) {
      hours[i].textContent = data.list[i].dt_txt.split(" ")[1].slice(0, 5);
      temperatures[i].textContent = Math.round(data.list[i].main.temp) + " °C";
    }
    let activeCardIndex = [...cards].findIndex((i) => i.classList.contains("active-card"));

    feelsLike.textContent = `Feels like: ${Math.round(data.list[0].main.feels_like)} °C `;
    weather.textContent = data.list[0].weather[0].description;
    city.textContent = cityName;
    currentTemperature.textContent = temperatures[0].textContent;
    day.textContent =
      days[new Date(data.list[activeCardIndex].dt_txt.split(" ")[activeCardIndex]).getDay()];
    humidity.textContent = data.list[activeCardIndex].main.humidity + "%";
    airPressure.textContent = data.list[activeCardIndex].main.pressure + " PS";
    rainChance.textContent = Math.round(data.list[activeCardIndex].pop * 100) + "%";
    windSpeed.textContent = data.list[activeCardIndex].wind.speed + " km/h";
  });
}
// PRELOADER
window.onload = function () {
  preloader.classList.remove("show");
};

// INTERFACE
searchInput.addEventListener("input", function (e) {
  searchButton.classList.add("toBlack");
  searchIcon.querySelector("path").classList.add("toBlack");
  if (searchInput.value == "") {
    searchButton.classList.remove("toBlack");
    searchIcon.querySelector("path").classList.remove("toBlack");
  }
});

searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (searchInput.value != "") {
    if (!updatePage(searchInput.value)) errorBlock.classList.remove("show");
  }
});

changeLocation.addEventListener("click", function (e) {
  e.preventDefault();
  if (errorBlock.classList.contains("show")) {
    errorBlock.classList.remove("show");
  }
  if (searchBlock.classList.contains("show")) {
    searchBlock.classList.remove("show");
    return;
  }
  searchBlock.classList.add("show");
});

//cookie, multilang, slider

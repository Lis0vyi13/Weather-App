// ELEMENTS
let preloader = document.querySelector("#loaderContainer");
let changeLocation = document.querySelector("#change-location");
let searchBlock = document.querySelector(".search");
let searchInput = document.querySelector(".search-input");
let searchButton = document.querySelector(".search-button");
let searchIcon = document.querySelector(".search-button svg");
let cards = document.querySelectorAll(".card");
let defaultCard =
  '<div class="card mt-10 bg-opacity-5 inline-flex self-center"><div class="p-[15px] gap-5 flex-col flex">  <p id="hour" class="text-xs">3PM</p>  <h1 id="temperature" class="min-[1px]:text-2xl min-[670px]:text-3xl font-bold">   28 °C  </h1></div></div>';

let activeCard =
  '<div class="card active-card bg-opacity-5 inline-flex"><div>  <p id="hour" class="text-[12px]">3PM</p>  <h1 id="temperature">28 °C</h1>  <p id="feels-like">Feels like 30°C</p></div></div>';
let cardsBlock = document.querySelector(".cards-block");

// DATA
let weather = document.querySelector("#weather");
let city = document.querySelector("#city");
let currentTemperature = document.querySelector("#current-temperature");
let temperature = document.querySelector("#temperature");
let day = document.querySelector("#day");
let hour = document.querySelector("#hour");
let feelsLike = document.querySelector("#feels-like");
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
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
}

function updatePage() {
  let listSize;
  getData(city.textContent.trim()).then((data) => {
    console.log(data);
    listSize = data.list.length;
    for (let i = 0; i < listSize; i++) {
      if (i == 0) {
        cardsBlock.insertAdjacentHTML("afterbegin", activeCard);
      } else {
        cardsBlock.insertAdjacentHTML("beforeend", defaultCard);
      }
    }
    weather.textContent = data.list[0].weather[0].description;
    currentTemperature.textContent = Math.round(data.list[0].main.temp) + " °C";
    day.textContent = days[new Date(data.list[0].dt_txt.split(" ")[0]).getDay()];
    humidity.textContent = data.list[0].main.humidity + "%";
    airPressure.textContent = data.list[0].main.pressure + " " + "PS";
    rainChance.textContent = Math.round(data.list[0].pop * 100) + "%";
    windSpeed.textContent = data.list[0].wind.speed + " km/h";
  });
}

// PRELOADER
window.onload = function () {
  preloader.style.opacity = 0;
  preloader.style.pointerEvents = "none";
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

changeLocation.addEventListener("click", function (e) {
  e.preventDefault();
  if (searchBlock.style.opacity == 1) {
    searchBlock.style.pointerEvents = "none";
    searchBlock.style.opacity = 0;
    return;
  }
  searchBlock.style.pointerEvents = "auto";
  searchBlock.style.opacity = 1;
});

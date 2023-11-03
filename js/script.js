// ELEMENTS
let preloader = document.querySelector("#loaderContainer");
let changeLocation = document.querySelector("#change-location");
let searchBlock = document.querySelector(".search");
let searchInput = document.querySelector(".search-input");
let searchButton = document.querySelector(".search-button");
let searchIcon = document.querySelector(".search-button svg");
let errorBlock = document.querySelector(".error");
let defaultCard =
  '<div class="card inline-flex self-center"><div class="flex-col flex">  <p id="hour">3PM</p>  <h1 id="temperature" class="font-bold"> 28 °C</h1> <p id="feels-like">Feels like 30°C</p></div></div>';

let activeCard =
  '<div class="card active-card inline-flex"><div>  <p id="hour" class="text-[12px]">3PM</p>  <h1 id="temperature">28 °C</h1>  <p id="feels-like">Feels like 30°C</p></div></div>';
let cardsBlock = document.querySelector(".cards-block");
let buttons = document.querySelectorAll(".buttons");
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
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
if (localStorage.getItem("city")) {
  city.textContent = localStorage.getItem("city");
}
document.addEventListener("DOMContentLoaded", async function () {
  await updatePage();
  updateData();
});

// SERVER
async function getData(cityName) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${cityName}&appid=a176d1906d2286711687fa945d96c7b8`
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

async function updatePage(cityName = city.textContent.trim()) {
  const data = await getData(cityName);
  console.log(data);

  dataError(data);
  while (cardsBlock.firstChild) {
    cardsBlock.removeChild(cardsBlock.firstChild);
  }
  for (let i = 0; i < data.list.length; i++) {
    if (i == 0) {
      cardsBlock.insertAdjacentHTML("afterbegin", activeCard);
    } else {
      cardsBlock.insertAdjacentHTML("beforeend", defaultCard);
    }
  }
}
function changeBackground(data) {
  dataError(data);
  const root = document.documentElement;
  const weatherInfo = data.list[0].weather[0];
  const dayTime = weatherInfo.icon.at(-1);
  const weather = weatherInfo.main;
  let imgName = dayTime == "n" ? "night-" + weather : weather;
  const arr = ["Snow", "Rain", "Drizzle", "Thunderstorm", "Clouds", "Clear"];
  arr.slice(0, 4).forEach(function (item) {
    if (imgName.slice(imgName.length - item.length) == item) {
      imgName = item;
      return;
    }
  });
  if (!imgName.startsWith("night-") && !arr.some((item) => item === imgName)) {
    imgName = "default";
  }

  root.style.setProperty("--background", `url(../img/${imgName}.jpg) no-repeat`);
}
async function updateData(cityName = city.textContent.trim()) {
  const data = await getData(cityName);
  dataError(data);

  const currWeather = data.list[0].weather[0];
  changeBackground(data);
  const img = document.querySelector("#weather-img");
  img.src = `https://openweathermap.org/img/wn/${currWeather.icon}@2x.png`;
  img.alt = currWeather.description;

  let cards = document.querySelectorAll(".card");
  let hours = document.querySelectorAll("#hour");
  let temperatures = document.querySelectorAll("#temperature");
  let feelsLike = document.querySelectorAll("#feels-like");
  let cardLength = data.list.length;

  for (let i = 0; i < cardLength; i++) {
    if (i > 0) {
      feelsLike[i].style.display = "none";
    }
    hours[i].textContent = data.list[i].dt_txt.split(" ")[1].slice(0, 5);
    temperatures[i].textContent = Math.round(data.list[i].main.temp) + " °C";
    feelsLike[i].textContent = `Feels like: ${Math.round(data.list[i].main.feels_like)} °C `;
  }

  let activeCardIndex = [...cards].findIndex((i) => i.classList.contains("active-card"));
  weather.textContent = currWeather.description;
  city.textContent = cityName;
  currentTemperature.textContent = temperatures[0].textContent;
  day.textContent =
    month[new Date().getMonth()] +
    " " +
    new Date().getDate() +
    ", " +
    days[new Date(data.list[activeCardIndex].dt_txt.split(" ")[activeCardIndex]).getDay()];
  humidity.textContent = data.list[activeCardIndex].main.humidity + "%";
  airPressure.textContent = data.list[activeCardIndex].main.pressure + " PS";
  rainChance.textContent = Math.round(data.list[activeCardIndex].pop * 100) + "%";
  windSpeed.textContent = data.list[activeCardIndex].wind.speed + " km/h";
}

function dataError(data) {
  if (!data) {
    console.error("Invalid data");
    return;
  }
}
// SLIDER
let count = 0;
let value = 0;
buttons.forEach(function (button) {
  button.addEventListener("click", async function (e) {
    await getData(city.textContent.trim());

    const cards = document.querySelectorAll(".card");
    const activeCardIndex = [...cards].findIndex((i) => i.classList.contains("active-card"));
    const windowWidth = window.innerWidth;

    function resetSliderOnResize() {
      cardsBlock.style.left = 0 + "px";
      if (cards[activeCardIndex + 1].classList.contains("active-card")) {
        toggleActiveCard(cards, activeCardIndex + 1, 0);
      }
      count = 0;
    }

    if (windowWidth >= 670) {
      value = 143;
    } else if (windowWidth >= 440) {
      value = 132;
    } else {
      value = 116;
    }

    if (e.target == document.querySelector("#button-left")) {
      if (activeCardIndex == 0) return;
      count += value;
      window.addEventListener("resize", resetSliderOnResize);
      toggleActiveCard(cards, activeCardIndex, activeCardIndex - 1);
    } else if (e.target == document.querySelector("#button-right")) {
      count -= value;
      window.addEventListener("resize", resetSliderOnResize);
      if (activeCardIndex == 32) {
        count = 0;
        toggleActiveCard(cards, activeCardIndex, 0);
      } else {
        toggleActiveCard(cards, activeCardIndex, activeCardIndex + 1);
      }
    }
    cardsBlock.style.left = count + "px";
  });
});

function toggleActiveCard(cards, currentIndex, newIndex) {
  cards[currentIndex].classList.toggle("active-card");
  cards[currentIndex].querySelector("#feels-like").style.display = "none";

  cards[newIndex].classList.toggle("active-card");
  cards[newIndex].querySelector("#feels-like").style.display = "block";
}

function resetSlider() {
  const cards = document.querySelectorAll(".card");
  const activeCardIndex = [...cards].findIndex((i) => i.classList.contains("active-card"));
  cardsBlock.style.left = 0 + "px";
  if (cards[activeCardIndex + 1].classList.contains("active-card")) {
    toggleActiveCard(cards, activeCardIndex + 1, 0);
  }
}

window.onload = () =>
  setTimeout(() => {
    preloader.classList.remove("show");
  }, 200);
// INTERFACE
changeLocation.addEventListener("click", (e) => {
  e.preventDefault();
  if (errorBlock.classList.contains("show")) {
    errorBlock.classList.remove("show");
  }
  searchBlock.classList.toggle("show");
});
searchInput.addEventListener("input", (e) => {
  const hasValue = searchInput.value !== "";
  searchButton.classList.toggle("toBlack", hasValue);
  searchIcon.querySelector("path").classList.toggle("toBlack", hasValue);
});

searchInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    sendData();
  }
});

searchButton.addEventListener("click", async (e) => {
  e.preventDefault();
  sendData();
});

function getCityInfo() {
  updatePage(searchInput.value);
  updateData(searchInput.value);
}

async function sendData() {
  if (searchInput.value !== "") {
    const result = await loadData(searchInput.value);
    if (result) {
      preloader.classList.toggle("show");
      setTimeout(() => {
        preloader.classList.toggle("show");
      }, 200);
      getCityInfo();
      resetSlider();
      localStorage.setItem("city", searchInput.value);
      if (errorBlock.classList.contains("show")) errorBlock.classList.remove("show");
    }
  }
}

async function loadData(cityName) {
  try {
    const data = await getData(cityName);
    return data;
  } catch (error) {
    return false;
  }
}

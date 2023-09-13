// bg-white bg-opacity-5 shadow-2xl

let cards = document.querySelectorAll(".card");
let cardsBlock = document.querySelector(".cards");
let cardWidth = cards[1].offsetWidth;
let gap = 32;

async function getData() {
  const request = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=Poltava&appid=a176d1906d2286711687fa945d96c7b8"
  );
  const data = await request.json();
  console.log(data);
}

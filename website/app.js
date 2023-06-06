/* Global letiables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
let hour = d.getHours()
let lat = 0;
let lon = 0;
let jsonData = [];
if (hour < 6 || hour >= 18) {
  document.body.classList.toggle("night");
  document.getElementById("card").style.background = "#ffffff47";
}


function getWeatherByCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setLocation);
  }
  else {
    alert('Geolocation is not supported by this browser.');
  }
}

function setLocation(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  document.getElementById('zip_code').required = false;
  document.getElementById('country').required = false;
  document.getElementById('curr_loc_btn').innerText = `lat: ${lat}  lon: ${lon}`;
  console.log(lat, lon);
}


// Update weather data on the page

async function postReqest(serverURL = "http://localhost:3000/") {
  const zip = document.getElementById("zip_code").value;
  const cc = document.getElementById("country").value.toLowerCase();
  const feel = document.getElementById("feelings").value;
  const isZip = (zip) ? true : false;
  const postdata = {
    isZip: isZip, lat: lat, lon: lon, zip: zip, CC: cc, feeling: feel
  }
  // console.log(postdata);
  try {
    const res = await fetch(
      serverURL + "add", {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postdata),
    });

    const data = await res.json();
    return data;

  } catch (error) {
    console.log("error", error);
  }
}

async function getData(serverURL = "http://localhost:3000/") {
  const res = await fetch(serverURL + "all");
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
}

function updateUI(res) {
  const ele = document.getElementById("entryHolder");
  console.log(res);
  jsonData.unshift({ name: res.name, date: new Date().toDateString(), feeling: res.feeling, temp: res.temp, icon: res.icon });
  currentPage = 1;
  displayRecords(currentPage, pageSize);
  updatePaginationButtons();
}

async function submit() {
  await postReqest().then(res => { updateUI(res) })
}


// UI
let currentPage = 1;
let pageSize = window.innerWidth >= 768 ? 5 : 2;


function createCard(name, date, icon, temp, feeling) {
  let weatherCard = document.createElement('div');
  weatherCard.className = 'weather-card';
  weatherCard.id = 'card';
  weatherCard.style.backgroundImage = `url(./img/${icon}.svg)`
  weatherCard.style.backgroundSize = 'cover';
  // Create the card content container
  let cardContent = document.createElement('div');
  cardContent.className = 'card-content';

  // Create the location element
  let locationElem = document.createElement('h5');
  locationElem.id = 'location';
  locationElem.textContent = name;

  // Create the date element
  let dateElem = document.createElement('h6');
  dateElem.id = 'date';
  dateElem.textContent = date;

  // Create the content paragraph element
  let contentElem = document.createElement('p');
  contentElem.id = 'content';
  contentElem.textContent = feeling;

  // Create the temperature paragraph element
  let tempElem = document.createElement('p');
  tempElem.id = 'temp';
  tempElem.textContent = temp;

  // Append the elements to their respective parent elements
  cardContent.appendChild(locationElem);
  cardContent.appendChild(dateElem);
  cardContent.appendChild(contentElem);
  cardContent.appendChild(tempElem);
  weatherCard.appendChild(cardContent);
  return weatherCard
}


document.addEventListener("DOMContentLoaded", async () => {
  await getData().then(res => {
    jsonData = res;
    displayRecords(currentPage, pageSize);
    updatePaginationButtons();;
  }).catch(error => {
    console.error(error);
  });
});


// Function to display the records
function displayRecords(pageNum, pageSize) {
  let container = document.getElementById('json-container');
  container.innerHTML = ''; // Clear previous content

  let startIndex = (pageNum - 1) * pageSize;
  let endIndex = startIndex + pageSize;
  let recordsToDisplay = jsonData.slice(startIndex, endIndex);

  recordsToDisplay.forEach(function (record) {
    let card = createCard(record.name, record.date, record.icon, record.temp, record.feeling)
    container.appendChild(card);
  });
}

// Function to update the pagination buttons
function updatePaginationButtons() {
  let prevButton = document.getElementById('prev-button');
  let nextButton = document.getElementById('next-button');

  prevButton.style.visibility = currentPage > 1 ? 'visible' : 'hidden';
  nextButton.style.visibility = currentPage < Math.ceil(jsonData.length / pageSize) ? 'visible' : 'hidden';
}

// Update pagination buttons on page load
updatePaginationButtons();

// Handle previous button click
document.getElementById('prev-button').addEventListener('click', function (event) {
  event.preventDefault();
  currentPage--;
  displayRecords(currentPage, pageSize);
  updatePaginationButtons();
});

// Handle next button click
document.getElementById('next-button').addEventListener('click', function (event) {
  event.preventDefault();
  currentPage++;
  displayRecords(currentPage, pageSize);
  updatePaginationButtons();
});

// Set the page size based on the screen width
displayRecords(currentPage, pageSize);

// Handle window resize
window.addEventListener('resize', function () {
  pageSize = window.innerWidth >= 768 ? 5 : 2;
  currentPage = 1;
  displayRecords(currentPage, pageSize);
  updatePaginationButtons();
});


function updateTime() {
  let currentTime = new Date();
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let seconds = currentTime.getSeconds();

  // Format the time as HH:MM:SS
  let formattedTime = hours.toString().padStart(2, '0') + ':' +
    minutes.toString().padStart(2, '0') + ':' +
    seconds.toString().padStart(2, '0');

  // Update the time in the HTML element
  let timeElement = document.getElementById('time');
  timeElement.textContent = formattedTime;
}

// Update the time immediately
updateTime();

// Update the time every second (1000 milliseconds)
setInterval(updateTime, 1000);


// Update weather

// Add event listener to the button
document.getElementById("updateButton").addEventListener("click", updateWeather);

// Function to fetch weather data and update the content
async function updateWeather(serverURL = "http://localhost:3000/") {
  try {
    getWeatherByCoordinates();
    let response = await fetch(serverURL+ "/check");
    let data = await response.json();
    updateContent(data);
  } catch (error) {
    console.error(error);
  }
}

// Function to update the content with weather data
function updateContent(weatherData) {
  let locationElement = document.getElementById("location");
  let dateElement = document.getElementById("date");
  let descriptionElement = document.getElementById("description");
  let temperatureElement = document.getElementById("temperature");
  let weatherIconElement = document.getElementById("weather-icon");
  let humidityElement = document.getElementById("humidity");
  let windSpeedElement = document.getElementById("wind-speed");
  let sunriseElement = document.getElementById("sunrise");
  let sunsetElement = document.getElementById("sunset");

  // Update the elements with weather data
  locationElement.textContent = weatherData.name;
  dateElement.textContent = new Date().toDateString();
  descriptionElement.textContent = weatherData.weather[0].description;
  temperatureElement.textContent = weatherData.main.temp + "°C";
  weatherIconElement.src = "http://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png";
  humidityElement.textContent = "Humidity: " + weatherData.main.humidity + "%";
  windSpeedElement.textContent = "Wind Speed: " + weatherData.wind.speed + " km/h";
  sunriseElement.textContent = "Sunrise: " + new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
  sunsetElement.textContent = "Sunset: " + new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
}
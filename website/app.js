/* Global letiables */

// variables
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
let hour = d.getHours()
let lat = 0;
let lon = 0;
let jsonData = [];
let serverURL = "http://localhost:3000/";
if (hour < 6 || hour >= 18) {
  document.body.classList.toggle("night");
  document.getElementById("entryHolder").style.background = "#ffffff47";
}

// UI variables
let currentPage = 1;
let pageSize = window.innerWidth >= 768 ? 5 : 2;


/* Helper functions */ 

// Get weather co-ordinates
function getWeatherByCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setLocation);
  }
  else {
    alert('Geolocation is not supported by this browser.');
  }
}

// update co-ordinates through getWeatherByCoordinates()
function setLocation(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  document.getElementById('zip').required = false;
  document.getElementById('country').required = false;
  document.getElementById('curr_loc_btn').innerText = `lat: ${lat}  lon: ${lon}`;
  console.log(lat, lon);
}

// create new weather card element
function createCard(name, date, icon, temp, feeling) {
  let weatherCard = document.createElement('div');
  weatherCard.className = 'weather-card';
  weatherCard.id = 'card';
  weatherCard.style.backgroundImage = `url(./img/${icon}.png)`
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


/* API request and response */ 

// Add new entry API
async function postReqest() {
  const zip = document.getElementById("zip").value;
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
// Get entries API
async function getData() {
  const res = await fetch(serverURL + "all");
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
}

// fetch weather data and update the content
async function updateWeather() {
  try {
    getWeatherByCoordinates();
    let response = await fetch(serverURL+ "check",{
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"lat":lat, "lon":lon}),
    });
    let data = await response.json();
    updateContent(data);
  } catch (error) {
    console.error(error);
  }
}

/* UI related functions */ 

// Update the UI with results
function updateUI(res) {
  console.log(res);
  jsonData.unshift({ name: res.name, date: new Date().toDateString(), feeling: res.feeling, temp: res.temp, icon: res.icon });
  currentPage = 1;
  displayRecords(currentPage, pageSize);
  updatePaginationButtons();
}

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

/* Time related functions*/

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


/* Event listener to handle pagination buttons*/ 

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


// Handle window resize
window.addEventListener('resize', function () {
  pageSize = window.innerWidth >= 768 ? 5 : 2;
  currentPage = 1;
  displayRecords(currentPage, pageSize);
  updatePaginationButtons();
});




/* Button invoked functions */ 

// Submit new entry
async function submit() {
  await postReqest().then(res => { updateUI(res.userData); updateContent(res.weatherData)  })
}

// Update weather
document.getElementById("updateButton").addEventListener("click", updateWeather);




/* Initialize the page */ 

// Update pagination buttons on page load
// updatePaginationButtons();

// Set the page size based on the screen width
// displayRecords(currentPage, pageSize);


// Update time and interval
updateTime();
setInterval(updateTime, 1000);

// Update the page with the GET data on load
document.addEventListener("DOMContentLoaded", async () => {
  await getData().then(res => {
    jsonData = res;
    displayRecords(currentPage, pageSize);
    updatePaginationButtons();;
  }).catch(error => {
    console.error(error);
  });
});




// Function to update the content with weather data
function updateContent(weatherData) {
  let locationElement = document.querySelector(".main_container #location");
  let dateElement = document.querySelector(".main_container #date");
  let descriptionElement = document.querySelector(".main_container #content");
  let temperatureElement = document.querySelector(".main_container #temperature");
  let weatherIconElement = document.querySelector(".main_container #weather-icon");
  let humidityElement = document.querySelector(".main_container #humidity");
  let windSpeedElement = document.querySelector(".main_container #wind-speed");
  let sunriseElement = document.querySelector(".main_container #sunrise");
  let sunsetElement = document.querySelector(".main_container #sunset");

  // Update the elements with weather data
  locationElement.textContent = weatherData.name;
  dateElement.textContent = new Date().toDateString();
  descriptionElement.textContent = weatherData.weather[0].description;
  temperatureElement.textContent = weatherData.main.temp + "°C";
  weatherIconElement.src =  `./img/${weatherData.weather[0].icon }.png`
  humidityElement.textContent = "Humidity: " + weatherData.main.humidity + "%";
  windSpeedElement.textContent = "Wind Speed: " + weatherData.wind.speed + " km/h";
  sunriseElement.textContent = "Sunrise: " + new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
  sunsetElement.textContent = "Sunset: " + new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
}
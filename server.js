// Setup empty JS object to act as endpoint for all routes
let projectData = {
    0 :{
        name: 'City 85',
        temp: 39,
        feeling: 'Happy',
        date: 'Sat Jun 05 2023',
        icon: '01d'
      },
      1: {
        name: 'City 32',
        temp: 21,
        feeling: 'Tired',
        date: 'Sat Jun 05 2023',
        icon: '01d'
      },
      2: {
        name: 'City 42',
        temp: 16,
        feeling: 'Sad',
        date: 'Sat Jun 05 2023',
        icon: '01d'
      },
      3: {
        name: 'City 77',
        temp: 47,
        feeling: 'Calm',
        date: 'Sat Jun 05 2023',
        icon: '01d'
      },
      4: {
        name: 'City 68',
        temp: 36,
        feeling: 'Excited',
        date: 'Sat Jun 05 2023',
        icon: '03n'
      }
};
require('dotenv').config();
const API_KEY = process.env["API_KEY"];
// Express to run server and routes
const express = require('express');

//Start up an instance of app
const app = express();

// Dependencies
const bodyParser = require('body-parser')

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

//Initialize the main project folder
app.use(express.static('website'));

const port = 3000;
//Spin up the server
const server = app.listen(port, listening);

function listening() {
    console.log(`running on localhost: ${port}`);
};

// GET route
app.get('/all', sendData);

function sendData(request, response) {
    response.send(Object.values(projectData).reverse());
};

// POST route
app.post('/add', addNewEntry);

async function addNewEntry(request, response) {
    let data = request.body;
    // console.log(request.body);
    try{
    let weather_data = await getCurrentWeather(data.isZip, data.lat, data.lon, data.zip, data.CC);
    if(weather_data.cod == 400){
        throw new Error("Not found")
    }
    let uniqueID = Object.keys(projectData).length;

    let userData = {
        name: weather_data.name,
        temp: (( weather_data.main.temp  - 32) * 5 / 9).toFixed(1),
        feeling: data.feeling,
        date: new Date().toDateString(),
        icon: weather_data.weather[0].icon
    };
    
    projectData[uniqueID] = userData;
    response.send({"weatherData":weather_data ,"userData":userData});
    }
    catch (error) {
    console.log(error);
    }
    
}


// For weather check API
app.post('/check', checkWeather);

async function checkWeather(request, response){
    let data = request.body;
    try{
    let weather_data = await getCurrentWeather(false, data.lat, data.lon, "", "");
    if(weather_data.cod == 400){
        throw new Error("Not found")
    }
    response.send(weather_data);
    }
    catch (error) {
    console.log(error);
    }
}

// API's
async function getCurrentWeather (isZip, lat, lon, zip, cc) {

    // Personal API Key for OpenWeatherMap API
    let baseURL = ""
    if (!isZip){
     baseURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=`;
    }
    else{
     baseURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}`+","+`${cc}&appid=`;
    }
    const apiKey = API_KEY;
    const apiURL = baseURL + apiKey + "&units=imperial";
    
    const res = await fetch(apiURL)
    try {

        const data = await res.json();
        console.log(data)
        return data

    } catch (error) {
        console.log("error", error);
        throw error;

    }
}



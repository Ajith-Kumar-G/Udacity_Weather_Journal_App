# Weather Journal Web App

This is a simple web application built using Express.js, HTML, and CSS that allows you to record and view weather entries. The app utilizes the OpenWeatherMap API to fetch weather data based on the provided location.

## Prerequisites

Before running the application, make sure you have completed the following steps:

1. Create a `.env` file in the root directory of the project.
2. In the `.env` file, add the following line:

   ```
   API_KEY=<your_api_key>
   ```
   Replace `<your_api_key>` with your actual API key obtained from OpenWeatherMap.
3. Run `npm i` to install the required dependencies.
4. Start the application by running `npm start`.

## Pre-recorded Weather Entries

The application comes with some pre-recorded weather entries to demonstrate its functionality. Each entry has the following data:

- Name
- Temperature
- Feeling
- Date
- Icon

## Adding an Entry

To add a new weather entry, follow these steps:

1. Click on the plus button (`+`) located on the page.
2. A modal will appear with options to enter a zip code and select a country or enable automatic loading of latitude and longitude.
3. Fill in the required information and click the "Save" button to add the entry.

## Updating Weather Details

To update the weather details with the current weather data and location access enabled, follow these steps:

1. Click on the "Update Weather" button on the home page.
2. The application will retrieve the current weather details based on your location access.

Note: Please ensure that you have granted location access to the web application for accurate weather information.

## License

This project is licensed under the [MIT License](LICENSE).

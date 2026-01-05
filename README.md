# Weather Dashboard

A responsive web application that allows users to search for current weather and a 5-day forecast for any city, or use their current location to get weather data. Powered by the OpenWeatherMap API.

## Features
- Search weather by city name
- Get weather for your current location (using browser geolocation)
- View current temperature, wind speed, humidity, and weather icon
- See a 5-day forecast with daily summaries
- Responsive design for desktop and mobile

## Project Structure

- `index.html` – Main HTML file, contains the app structure and links to CSS/JS
- `style.css` – Stylesheet for layout and responsive design
- `script.js` – Handles API calls, DOM updates, and app logic

## Setup Instructions

1. **Clone or Download** this repository to your local machine.
2. **Obtain an OpenWeatherMap API Key:**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api) and get a free API key.
   - Replace the value of `API_KEY` in `script.js` with your own key if needed.
3. **Open `index.html` in your browser.**
   - No build step or server is required; this is a static web app.

## Usage

- Enter a city name (e.g., "New York") and click **Search** or press **Enter**.
- Or, click **Use Current Location** to get weather for your current position (requires browser permission).
- The dashboard will display the current weather and a 5-day forecast.

## Notes
- The app uses the [OpenWeatherMap Current Weather](https://openweathermap.org/current) and [5 Day / 3 Hour Forecast](https://openweathermap.org/forecast5) APIs.
- Geolocation is optional and only used if the user clicks the location button.
- The UI shows example data on first load for demonstration.

## License
This project is for educational/demo purposes. 
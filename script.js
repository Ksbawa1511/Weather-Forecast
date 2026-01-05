// OpenWeatherMap API key and base URL
const API_KEY = 'f6bc8b764efe1fd9ea13e12ab40918e0';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

// DOM element references
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const locateBtn = document.getElementById('locate-btn');
const currentCity = document.getElementById('current-city');
const currentTemp = document.getElementById('current-temp');
const currentWind = document.getElementById('current-wind');
const currentHumidity = document.getElementById('current-humidity');
const currentIcon = document.getElementById('current-icon');
const currentDesc = document.getElementById('current-desc');
const forecastRow = document.getElementById('forecast-row');
const currentWeatherCard = document.getElementById('current-weather');

// Fetch current weather data for a given city
async function getWeather(city) {
    try {
        const response = await fetch(`${BASE_URL}weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }
        const data = await response.json();
        console.log('Weather data:', data); // Process the weather data
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch weather data. See console for details.');
        return null;
    }
}

// Format a Unix timestamp to YYYY-MM-DD
function formatDate(dt) {
  const d = new Date(dt * 1000);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// Update the current weather card with API data
function updateCurrentWeather(data) {
  currentCity.textContent = `${data.name} (${formatDate(data.dt)})`;
  currentTemp.textContent = `Temperature: ${data.main.temp.toFixed(2)}℃`;
  currentWind.textContent = `Wind: ${data.wind.speed.toFixed(2)} M/S`;
  currentHumidity.textContent = `Humidity: ${data.main.humidity}%`;
  currentIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  currentIcon.alt = data.weather[0].description;
  currentDesc.textContent = data.weather[0].main;
}

// Helper to extract one forecast per day (closest to 12:00)
function extractDailyForecasts(list) {
  const daily = [];
  const seen = {};
  list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!seen[date] && item.dt_txt.includes('12:00:00')) {
      daily.push(item);
      seen[date] = true;
    }
  });
  // Fallback: if less than 5, fill with next available
  if (daily.length < 5) {
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!seen[date]) {
        daily.push(item);
        seen[date] = true;
      }
    });
  }
  return daily.slice(0, 5);
}

// Render the 5-day forecast cards
function updateForecast(daily) {
  forecastRow.innerHTML = '';
  daily.forEach(day => {
    const d = new Date(day.dt * 1000);
    const dateStr = `(${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')})`;
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <time>${dateStr}</time>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="icon" />
      <div class="temp">Temp: ${day.main.temp.toFixed(2)}℃</div>
      <div class="wind">Wind: ${day.wind.speed.toFixed(2)} M/S</div>
      <div class="humidity">Humidity: ${day.main.humidity}%</div>
    `;
    forecastRow.appendChild(card);
  });
}

// Fetch and display weather for a city (current + 5-day forecast)
async function fetchWeather(city) {
  if (!city || city.trim().length === 0) return;
  try {
    const currentData = await getWeather(city);
    if (currentData) {
      const { lat, lon } = currentData.coord;
      // Use the free 5-day/3-hour forecast API
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      if (!forecastRes.ok) throw new Error('Forecast not found');
      const forecastData = await forecastRes.json();
      updateCurrentWeather(currentData);
      const daily = extractDailyForecasts(forecastData.list);
      updateForecast(daily);
    }
  } catch (e) {
    console.error('Weather API error:', e);
    // Reset UI on error
    currentCity.textContent = 'City (YYYY-MM-DD)';
    currentTemp.textContent = 'Temperature: --℃';
    currentWind.textContent = 'Wind: -- M/S';
    currentHumidity.textContent = 'Humidity: --%';
    currentIcon.src = 'https://openweathermap.org/img/wn/10d@2x.png';
    currentDesc.textContent = 'Description';
    forecastRow.innerHTML = '';
    alert('Unable to get weather data. Please try again. See console for details.');
  }
}

// Event listeners for search and location buttons
searchBtn.addEventListener('click', () => {
  fetchWeather(cityInput.value.trim());
});
cityInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    fetchWeather(cityInput.value.trim());
  }
});
locateBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      const { latitude, longitude } = position.coords;
      // Reverse geocode to get city name from coordinates
      const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`);
      if (!geoRes.ok) throw new Error('Unable to get your location city');
      const geoData = await geoRes.json();
      if (!geoData.length) throw new Error('No location data found');
      const city = geoData[0].name;
      cityInput.value = city;
      fetchWeather(city);
    } catch (error) {
      alert(error.message);
    }
  }, () => {
    alert('Permission to access location was denied.');
  });
});

// Remove or comment out the initial dummy data for UI preview
// updateCurrentWeather({
//   name: 'London',
//   dt: Math.floor(Date.now()/1000),
//   main: { temp: 7.06, humidity: 88, pressure: 1012 },
//   wind: { speed: 2.85 },
//   weather: [{ icon: '10d', main: 'Light Rain', description: 'light rain' }],
//   sys: { country: 'GB' }
// });
// updateForecast([
//   {dt: 1713916800, main: {temp: 5.67, humidity: 76}, wind: {speed: 2.77}, weather: [{icon:'04d'}], dt_txt: '2025-04-24 12:00:00'},
//   {dt: 1714003200, main: {temp: 5.23, humidity: 71}, wind: {speed: 1.46}, weather: [{icon:'04d'}], dt_txt: '2025-04-25 12:00:00'},
//   {dt: 1714089600, main: {temp: 7.66, humidity: 91}, wind: {speed: 1.87}, weather: [{icon:'04d'}], dt_txt: '2025-04-26 12:00:00'},
//   {dt: 1714176000, main: {temp: 9.09, humidity: 95}, wind: {speed: 3.77}, weather: [{icon:'04d'}], dt_txt: '2025-04-27 12:00:00'},
//   {dt: 1714262400, main: {temp: 8.46, humidity: 94}, wind: {speed: 4.23}, weather: [{icon:'04d'}], dt_txt: '2025-04-28 12:00:00'},
// ]);

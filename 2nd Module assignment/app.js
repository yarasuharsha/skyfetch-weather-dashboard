// ===============================
// SkyFetch - OOP Version
// ===============================

// Your OpenWeatherMap API Key
const API_KEY = '45b8616cf45c81210572ab008b47b747';
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// ===============================
// Constructor Function
// ===============================
function WeatherApp() {
    // Store DOM references
    this.cityInput = document.getElementById("city-input");
    this.searchBtn = document.getElementById("search-btn");
    this.weatherDisplay = document.getElementById("weather-display");
}

// ===============================
// Initialize App
// ===============================
WeatherApp.prototype.init = function () {
    this.showWelcome();

    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

    this.cityInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            this.handleSearch();
        }
    });
};

// ===============================
// Welcome Message
// ===============================
WeatherApp.prototype.showWelcome = function () {
    this.weatherDisplay.innerHTML = `
        <div class="welcome-message">
            Enter a city name to get weather data.
        </div>
    `;
};

// ===============================
// Handle Search
// ===============================
WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("⚠️ Please enter a city name.");
        return;
    }

    this.getWeather(city);
    this.cityInput.value = "";
};

// ===============================
// Get Weather + Forecast
// ===============================
WeatherApp.prototype.getWeather = async function (city) {
    const currentWeatherURL = `${CURRENT_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastURL = `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        this.showLoading();
        this.searchBtn.disabled = true;

        const [weatherResponse, forecastResponse] = await Promise.all([
            axios.get(currentWeatherURL),
            axios.get(forecastURL)
        ]);

        this.displayWeather(weatherResponse.data);

        const processedForecast = this.processForecastData(forecastResponse.data);
        this.displayForecast(processedForecast);

    } catch (error) {
        if (error.response && error.response.status === 404) {
            this.showError("❌ City not found. Please enter a valid city name.");
        } else {
            this.showError("⚠️ Something went wrong. Please try again.");
        }
    } finally {
        this.searchBtn.disabled = false;
    }
};

// ===============================
// Display Current Weather
// ===============================
WeatherApp.prototype.displayWeather = function (data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    this.weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2>${cityName}</h2>
            <img src="${iconUrl}" alt="${description}">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
};

// ===============================
// Process Forecast Data
// ===============================
WeatherApp.prototype.processForecastData = function (forecastData) {
    // Get forecasts for 12:00 PM only
    const dailyForecasts = forecastData.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    return dailyForecasts.slice(0, 5);
};

// ===============================
// Display Forecast
// ===============================
WeatherApp.prototype.displayForecast = function (forecastArray) {
    let forecastHTML = `<div class="forecast-container">`;

    forecastArray.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        const temp = Math.round(day.main.temp);
        const description = day.weather[0].description;
        const icon = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        forecastHTML += `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="${iconUrl}" alt="${description}">
                <p class="forecast-temp">${temp}°C</p>
                <p class="forecast-desc">${description}</p>
            </div>
        `;
    });

    forecastHTML += `</div>`;

    this.weatherDisplay.innerHTML += forecastHTML;
};

// ===============================
// Show Loading
// ===============================
WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Fetching weather data...</p>
        </div>
    `;
};

// ===============================
// Show Error
// ===============================
WeatherApp.prototype.showError = function (message) {
    this.weatherDisplay.innerHTML = `
        <div class="error">
            ${message}
        </div>
    `;
};

// ===============================
// Create Instance
// ===============================
const app = new WeatherApp();
app.init();

// Your OpenWeatherMap API Key
const API_KEY = '45b8616cf45c81210572ab008b47b747';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherDisplay = document.getElementById('weather-display');

// Async function to fetch weather
async function getWeather(city) {
    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        showLoading();
        searchBtn.disabled = true;

        const response = await axios.get(url);

        console.log("Weather Data:", response.data);

        displayWeather(response.data);

    } catch (error) {
        console.error("Error fetching weather:", error);

        if (error.response && error.response.status === 404) {
            showError("❌ City not found. Please enter a valid city name.");
        } else {
            showError("⚠️ Something went wrong. Please try again.");
        }
    } finally {
        searchBtn.disabled = false;
    }
}

// Display weather
function displayWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const weatherHTML = `
        <div class="weather-info">
            <h2>${cityName}</h2>
            <img src="${iconUrl}" alt="${description}">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;

    weatherDisplay.innerHTML = weatherHTML;
}

// Show error
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error">
            ${message}
        </div>
    `;
}

// Show loading
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Fetching weather data...</p>
        </div>
    `;
}

// Search button click
searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();

    if (city === "") {
        showError("⚠️ Please enter a city name.");
        return;
    }

    getWeather(city);
    cityInput.value = "";
});

// Enter key support
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

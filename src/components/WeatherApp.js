import React, { useState } from "react";
import { cityList } from "./cityList";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";
import "./css/WeatherApp.css";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  // Helper functions
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const handleCityChange = (e) => {
    const input = e.target.value.toLowerCase();
    setCity(input);
  
    if (input) {
      const filteredSuggestions = cityList
        .map((city) => city.toLowerCase())
        .filter((city) => city.startsWith(input)) // Changed from includes to startsWith
        .slice(0, 5);
      setSuggestions(filteredSuggestions.map(capitalizeFirstLetter));
    } else {
      setSuggestions([]);
    }
  };
  

  const fetchWeather = async (cityName) => {
    if (!cityName) return alert("Please enter a city!");

    setError("");
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      if (data.cod !== "200") {
        setError(data.message || "City not found!");
      } else {
        setWeather(data);
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Error fetching weather data!");
    }
  };

  const getWeatherIcon = (weatherMain) => {
    const iconMap = {
      Clear: <WiDaySunny className="text-5xl text-yellow-500" />,
      Clouds: <WiCloud className="text-5xl text-gray-500" />,
      Rain: <WiRain className="text-5xl text-blue-500" />,
      Snow: <WiSnow className="text-5xl text-blue-300" />,
      Thunderstorm: <WiThunderstorm className="text-5xl text-yellow-700" />,
      Mist: <WiFog className="text-5xl text-gray-300" />,
      Fog: <WiFog className="text-5xl text-gray-300" />,
    };
    return iconMap[weatherMain] || <WiCloud className="text-5xl text-gray-400" />;
  };

  const clearInput = () => {
    setCity("");
    setSuggestions([]);
  };

  const WeatherCard = ({ forecast }) => (
    <div className="p-6 bg-white text-gray-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200">
      <div className="flex items-center">
        {getWeatherIcon(forecast.weather[0].main)}
        <div className="ml-4">
          <h3 className="text-lg font-bold">
            {new Date(forecast.dt_txt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </h3>
          <p className="text-sm">
            <strong>Weather:</strong>{" "}
            {forecast.weather[0].description.toLowerCase().includes("cloud")
              ? "cloudy"
              : forecast.weather[0].description}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p>
          <strong>Temp:</strong> {forecast.main.temp}°C
        </p>
        <p>
          <strong>Humidity:</strong> {forecast.main.humidity}%
        </p>
      </div>
    </div>
  );
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-300 to-blue-200 flex flex-col items-center p-6">
      <h1 className="text-6xl font-extrabold text-white mb-8 drop-shadow-lg">
        Weather Forecast
      </h1>

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          className="w-full p-4 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 text-gray-700"
          placeholder="Enter city name"
          value={city}
          onChange={handleCityChange}
        />
        {city && (
          <button
            onClick={clearInput}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
        {suggestions.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => fetchWeather(suggestion)}
                className="p-4 hover:bg-gray-200 cursor-pointer text-gray-800"
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fetch Weather Button */}
      <button
        onClick={() => fetchWeather(city)}
        className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
      >
        Get Weather
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-md">
          {error}
        </div>
      )}

      {/* Weather Forecast */}
      {weather && weather.list && (
        <div className="mt-8 w-full max-w-4xl">
          <div className="flex justify-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
  Weather Forecast for{" "}
  <span className="text-outline">{weather.city.name}</span>
</h2>

</div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {weather.list.slice(0, 9).map((forecast, index) => (
              <WeatherCard key={index} forecast={forecast} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;

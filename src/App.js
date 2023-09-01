import React, { useState, useEffect } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureHalf,
  faLocationDot,
  faDroplet,
  faWind,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
    setErrorMessage(""); // Clear the error message when the user interacts with the input
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (location.trim() === "") {
        setErrorMessage("Please enter a city name first");
        return;
      }
      setErrorMessage("");
      fetchWeatherData();
    }
  };

  const fetchWeatherData = async () => {
    try {
      // Fetch weather data from the API based on the location input
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=b39a0b524275183afbf205727b93609d`
      );

      if (response.ok) {
        // If the response status is OK, proceed to parse and set the weather data
        const data = await response.json();
        setWeatherData(data); // Update weatherData state with the retrieved weather data
        setErrorMessage(""); // Clear any previous error message
      } else {
        // If the response status is not OK, display an error message
        setErrorMessage("City not found. Please enter a valid city name.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          try {
            // Fetch weather data based on device's latitude and longitude

            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b39a0b524275183afbf205727b93609d`
            );
            const data = await response.json();
            console.log(data);
            setWeatherData(data); // Update weatherData state with the retrieved weather data

            setLocation(`${data.name}, ${data.sys.country}`); // Update the location state based on the retrieved data
          } catch (error) {
            console.error("Error fetching weather data:", error);
          }
        },
        (error) => {
          console.error("Error getting device location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  function refreshPage() {
    setErrorMessage("");
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
        <div className="weather-card">
          {weatherData ? (
            <div className="weather-details">
              <div className="back-icon" onClick={() => setWeatherData(null)}>
                <button className="back-button" onClick={refreshPage}>
                  <span>&#x2190;</span>
                </button>
              </div>

              <p className="Location">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ color: "blue" }}
                />{" "}
                {location}
              </p>

              <div className="weather-columns">
                <div className="weather-column1">
                  {" "}
                  <div className="centerRow1">
                    <p>min:</p>
                    <p className="center">
                      {Math.round(weatherData.main.temp_min - 273.15)}°C
                    </p>
                    <p style={{ margin: "0 8px 0 9px" }}>max:</p>{" "}
                    {/* Add margin to create space */}
                    <p className="center">
                      {Math.round(weatherData.main.temp_max - 273.15)}°C
                    </p>
                  </div>
                  {/* Reverse the order of columns */}
                  <p className="centerTemp">
                    {/* <FontAwesomeIcon icon={faTemperatureHalf} style={{ color: "orange" }} /> */}
                    {Math.round(weatherData.main.temp - 273.15)}°C
                  </p>
                  <div className="centerRow">
                    <p>Feels Like:</p>
                    <p className="center">
                      {Math.round(weatherData.main.feels_like - 273.15)}°C
                    </p>
                  </div>
                </div>
                <div className="weather-column2">
                  {" "}
                  {/* Reverse the order of columns */}
                  <div className="weather-icon">
                    <img
                      src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                      alt="Weather Icon"
                    />
                  </div>
                  <p className="centerMain">{weatherData.weather[0].main}</p>
                </div>
              </div>

              <hr />
              <p className="center">
                <FontAwesomeIcon icon={faWind} style={{ color: "Blue" }} />{" "}
                Wind: {weatherData.wind.speed}km/h
              </p>

              <p className="center">
                <FontAwesomeIcon icon={faDroplet} style={{ color: "blue" }} />{" "}
                Humidity: {weatherData.main.humidity}%
              </p>
            </div>
          ) : (
            <div className="input-container">
              <div className="inputbox-container">
                <input
                  className="inputbox"
                  type="text"
                  placeholder="Enter City Name and Hit Enter"
                  value={location}
                  onChange={handleLocationChange}
                  onKeyPress={handleKeyPress}
                  required
                />
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="divider">
                <p className="para">or</p>
              </div>
              <button id="button" onClick={getLocation}>
                Get Device Location
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;

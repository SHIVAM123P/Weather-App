import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHalf, faLocationDot, faDroplet } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
    setErrorMessage(''); // Clear the error message when the user interacts with the input
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (location.trim() === '') {
        setErrorMessage('Please enter a city name first');
        return;
      }
      setErrorMessage('');
      fetchWeatherData();
    }
  };

  const fetchWeatherData = async () => {
    try {
      // Fetch weather data from the API based on the location input
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=b39a0b524275183afbf205727b93609d`);
      const data = await response.json();
      setWeatherData(data); // Update weatherData state with the retrieved weather data
    } catch (error) {
      console.error('Error fetching weather data:', error);
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
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b39a0b524275183afbf205727b93609d`);
            const data = await response.json();
            setWeatherData(data); // Update weatherData state with the retrieved weather data
            setLocation(`${data.name}, ${data.sys.country}`); // Update the location state based on the retrieved data
          } catch (error) {
            console.error('Error fetching weather data:', error);
          }
        },
        (error) => {
          console.error('Error getting device location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  // // Automatically refresh the page when navigating back from a second page
  // useEffect(() => {
  //   const handlePopState = () => {
  //     window.location.reload();
  //   };
  //   window.addEventListener('popstate', handlePopState);
  //   return () => {
  //     window.removeEventListener('popstate', handlePopState);
  //   };
  // }, []);

  function refreshPage(){
    setErrorMessage(''); 
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
        <div className="weather-card">
          {weatherData ? (
            <div className="weather-details">
              <div className="back-icon" onClick={() => setWeatherData(null)}>
              <button><span onClick={refreshPage}>&#x2190;</span></button>
              </div>
              <div className="weather-icon">
                <img src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="Weather Icon" />
              </div>
              <p className="center">
                <FontAwesomeIcon icon={faTemperatureHalf} style={{ color: 'orange' }} />
                {Math.round(weatherData.main.temp - 273.15)}°C
              </p>
              <p className="center">{weatherData.weather[0].description}</p>
              <p className="center">
                <FontAwesomeIcon icon={faLocationDot} style={{ color: 'blue' }} /> {location}
              </p>
              <hr />
              <p className="center">
                <FontAwesomeIcon icon={faTemperatureHalf} style={{ marginLeft: '8px', color: 'orange' }} />
                Feels Like: {Math.round(weatherData.main.feels_like - 273.15)}°C
              </p>
              <p className="center">
                <FontAwesomeIcon icon={faDroplet} style={{ color: 'blue' }} /> Humidity: {weatherData.main.humidity}%
              </p>
            </div>
          ) : (
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter City Name and Hit Enter"
                value={location}
                onChange={handleLocationChange}
                onKeyPress={handleKeyPress}
                required
              />
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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

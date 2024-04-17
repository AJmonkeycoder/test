import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherComponent({ latitude, longitude }) {
  const [temperature, setTemperature] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/weather', {
          params: {
            lat: latitude,
            lon: longitude
          }
        });

        setTemperature(response.data.temperature);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [latitude, longitude]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>Temperature: {temperature}°C</p>
      )}
    </div>
  );
}

export default WeatherComponent;

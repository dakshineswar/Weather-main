import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '1635890035cbba097fd5c26c8ea672a1';
const API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const WeatherApp = () => {
  const [searchCity, setSearchCity] = useState('');
  const [location, setLocation] = useState({});
  const [groupedWeatherData, setGroupedWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (location.lat && location.lon) {
        try {
          setLoading(true);
          const weatherResponse = await axios.get(API_URL, {
            params: {
              lat: location.lat,
              lon: location.lon,
              appid: API_KEY,
              cnt: 24 * 5, 
              units: 'metric',
            },
          });

          const groupedData = {};
          weatherResponse.data.list.forEach((data) => {
            const date = data.dt_txt.split(' ')[0];
            if (!groupedData[date]) {
              groupedData[date] = {
                minTemp: data.main.temp_min,
                maxTemp: data.main.temp_max,
                pressure: data.main.pressure,
                humidity: data.main.humidity,
              };
            }
          });

          setGroupedWeatherData(groupedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWeatherData();
  }, [location]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const locationResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct`,
        {
          params: {
            q: searchCity,
            limit: 1,
            appid: API_KEY,
          },
        }
      );

      setLocation({
        lat: locationResponse.data[0].lat,
        lon: locationResponse.data[0].lon,
      });
    } catch (error) {
      console.error('Error fetching location:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>5-Day Weather Forecast</h1>
      <div className='search-box'>
        <input
          type="text"
          placeholder="Enter city name"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className='weather-section'>
      {loading ? (
        <p className='loader'>Loading...</p>
      ) : (
        
        Object.keys(groupedWeatherData).map((date) => (
            <div key={date} className="weather-item">
           
            <div className='item-one'>
                 <h3 colspan="2">Date: {date}</h3>
             </div>
             <div className='item-one'>
                 <h4>Temperature</h4>
             </div>
           <div className='item-two'>
             <div>Min Temp</div>
             <div>{groupedWeatherData[date].minTemp}</div>
           </div>
           <div className='item-two'>
             <div>Max Temp</div>
             <div>{groupedWeatherData[date].maxTemp}</div>
             </div>
           <div className='item-two'>
             <div>Pressure</div>
             <div>{groupedWeatherData[date].pressure}</div>
             </div>
           <div className='item-two'>
             <div>Humidity</div>
             <div>{groupedWeatherData[date].humidity}</div>
             </div>
        
       </div>
        ))
      )}
      </div>
    </div>
  );
};

export default WeatherApp;

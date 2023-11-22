import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const api = {
  key: "933181e294a6f7e2c88dd3537b50b75d",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather , setWeather] = useState({});
  const [map, setMap] = useState(null);


  const search = evt => {
    if(evt.key == "Enter"){
      fetch(`${api.base}weather?q=${query}&units=metrics&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result)
        setQuery('');
        console.log(result);

        if (result.coord) {
          initMap(result.coord.lat, result.coord.lon);
        }
      });
    }
  };

  const dateBuilder = (d) => { 
    let months = ["January", "February", "March", "April", "May", "June", "July", 
    "August", "September", "October", "November", "December"]; 
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", 
    "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];  
    let year = d.getFullYear();
    return `${day} ${date} ${month} ${year}`
  }
  
  const initMap = (lat, lon) => {
    if (map) {
      map.setView([lat, lon], 10);
    } else {
      const myMap = L.map('map').setView([lat, lon], 10);
      L.tileLayer('https://tile.openweathermap.org/map/temp_new/{1}/{3}/{3}.png?appid=933181e294a6f7e2c88dd3537b50b75d'
      ).addTo(myMap);
      setMap(myMap);
    }
  };
  
  


  // Inside the App component
    // const [backgroundClass, setBackgroundClass] = useState('');

    // // Inside the fetch callback where you set the weather state
    // fetch(`${api.base}weather?q=${query}&units=metrics&APPID=${api.key}`)
    // .then(result => {
    //   setWeather(result);
    //   setQuery('');
    //   setBackgroundClass(getBackgroundClass(result)); // Call a function to determine the background class
    //   console.log(result);
    // });

    // const getBackgroundClass = (weather) => {
    //   if (weather.weather && weather.weather[0].main === 'Clear') {
    //     return 'clear-sky'; // Define this class in your CSS
    //   } else if (weather.weather && weather.weather[0].main === 'Rain') {
    //     return 'rainy'; // Define this class in your CSS
    //   }
      
    //   // Add more conditions as needed
    //   return '';
    // };


  return (
    <div className="app">
      <main>
        <div className="search-box">
          <input 
          type='text'
          className='search-bar'
          placeholder='Search...'
          onChange={e => setQuery(e.target.value)}
          value={query}
          onKeyPress={search}
          />
        </div>
        {(typeof weather.main!="undefined") ?(
        <div>
          <div className="location-box">
          <div className="location">{weather.name}, {weather.sys.country} </div>
          <div className='date '>{dateBuilder(new Date())}</div>
        </div>
        <div className='weather-box'>
          <div className='temp'>
            {Math.round(weather.main.temp)-273}°c
          </div>
          <div className='weather'>
            {weather.weather[0].main}
          </div>
        </div>
          </div>
        ) : ('')}

        {(typeof weather.main!="undefined") ?(
        <div className='bottom'>
          <div className='feels'>
            {weather.weather ? <p>{Math.round(weather.main.feels_like)-273}°c</p> : null}
            <p>Feels Like</p>
          </div>
          <div className='humidity'>
            {weather.weather ? <p>{weather.main.humidity}%</p> : null}
          <p>Humidity</p>
          </div>
          <div className='speed'>
          {weather.weather ? <p>{Math.round(weather.wind.speed)} Km/h</p> : null}
          <p>Wind speed</p>
          </div>
        </div>
        ) : ('')}

        <div className="map-container" id="map"></div>


      </main>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import axios from "axios";
import './style.css'
function WeatherApp() {
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const savedSearchValue = localStorage.getItem("searchValue");
    if (savedSearchValue) {
      setSearchValue(savedSearchValue);
      fetchWeatherData(savedSearchValue);
    }
  }, []);

  const fetchWeatherData = (city) => {
    const apiKey = "5fef4e8da5fbdf404ceb1c7cb11becab";
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      )
      .then((response) => {
        setData(response.data);
        localStorage.setItem("searchValue", city);
        fetchForecastData(city);
      })
      .catch((error) => {
        console.error("City not found. Please try again.", error);
      });
  };

  const fetchForecastData = (city) => {
    const apiKey = "5fef4e8da5fbdf404ceb1c7cb11becab";
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
      )
      .then((response) => {
        setForecast(response.data.list.slice(0, 5));
      })
      .catch((error) => console.error("Error fetching forecast data:", error));
  };

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchValue) {
      fetchWeatherData(searchValue);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center m-4 weather-title">Weather App</h1>
      <form className="d-flex" onSubmit={handleSubmit}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Enter city name"
          value={searchValue}
          onChange={handleChange}
        />
        <button className="btn btn-danger" type="submit">
          Search
        </button>
      </form>

      {data && (
        <div className="mt-5 border border-1 rounded-pill w-25 m-auto text-center p-3 ">
          <div>
           <p>
           <span className="fw-bold text-danger">city:</span>
           <span className="ms-2">{data.name}</span>
 
            </p> 
         </div>
          <div>
            <p>
              <span className="fw-bold text-danger">description:</span> 
            <span className="ms-2">{data.weather[0].description}</span>
            </p>
          
          </div>


          <div>
           <p>
           <span className="fw-bold text-danger">Temperature:</span>
           <span className="ms-2">{(data.main.temp - 273.15).toFixed(2)}°C</span>
 
            </p> 
         </div>

          
        </div>
      )}

      {forecast.length > 0 && (
        <div className="text-center mt-5 mb-5">
          <div>
            <h4 className="mb-5 m-auto  w-50 ">5-Day Forecast</h4>
          </div>
          <div className="d-flex justify-content-between">
            {forecast.map((item, index) => (
              <div key={index} >
                <div>
                  <span className="me-1 fw-bold text-danger">date:</span>
                  <span>{new Date(item.dt_txt).toLocaleDateString()}</span></div>

                  <div>
                  <span className="me-1 fw-bold text-danger">forecast:</span>
                  <span>{item.weather[0].description}</span>
                  </div>

                  <div>
                  <span className="me-1 fw-bold text-danger">Temp:</span>
                  <span>{(item.main.temp - 273.15).toFixed(2)}°C</span>
                  </div>

                <img
                  src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt="Weather icon"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;

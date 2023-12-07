"use strict";

require("dotenv").config();
const weatherData = require("./data/weather.json");
const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
const app = express();
const WEATHER_KEY = process.env.WEATHER_KEY;
const PORT = process.env.PORT || 3000;

app.use(cors());

class Forecast {
  constructor( date, highTemp, lowTemp) {
    this.date = date;
    this.highTemp = highTemp;
    this.lowTemp = lowTemp;
  }
}

app.get("/", async (request, response) => {
  // console.log(request.query);
  // chatGPT helped with this
  let userLat = request.query.latitude;
  let userLon = request.query.longitude;
  let weatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_KEY}&lat=${userLat}&lon=${userLon}&units=I&days=7`;
  // http://api.weatherbit.io/v2.0/forecast/daily?key=86ce6a03e5ab4ffdaaf5b467eb10fb9c&lat=47.603832&lon=-122.330062&units=I&days=16
  let weatherResponse = await axios.get(weatherURL);

  // console.log(weatherResponse.data);
  if(weatherResponse){
    const forecastArray = weatherResponse.data.data.map(day => {
      const date = day.datetime;
      const highTemp = day.high_temp;
      const lowTemp = day.low_temp;
      return new Forecast(date, highTemp, lowTemp);
    });
    response.json({Forecast: forecastArray});
  }

});
//   if (userLat && userLon) {
//     let userCity = weatherData.find(
//       (city) => city.lon == userLon && city.lat == userLat
//     );
//     if (userCity) {
//       // console.log(userCity.data);

//       const forecastArray = userCity.data.map((day) => {
//         const date = day.valid_date;

//         const description = day.weather.description;
//         return new Forecast(date, description);
//       });
//       response.json({ CityName: userCity.city_name, forecast: forecastArray });
//     }
//   } else {
//     response.status(404).json({ error: "City not found" });
//   }
// });

// app.get("/", getWeatherFromSite);

// async function getWeatherFromSite(request, response, latitude, longitude) {
//   let weatherResponse = await axios.get(
//     "http://api.weatherbit.io/v2.0/current",
//     {
//       params: {
//         key: process.env.WEATHER_KEY,
//         lang: "en",
//         latitude: latitude,
//         longitude: longitude,
//       },
//     }
//   );

//   console.log(weatherResponse);
// }
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

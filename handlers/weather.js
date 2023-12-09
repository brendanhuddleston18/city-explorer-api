"use strict";

const axios = require("axios");
const WEATHER_KEY = process.env.WEATHER_KEY;
// const timer = require('./timer');

class Forecast {
  constructor(date, highTemp, lowTemp) {
    this.date = date;
    this.highTemp = highTemp;
    this.lowTemp = lowTemp;
  }
}

let cache = {};

async function getWeather(request, response) {
  // chatGPT helped with this

  let userLat = request.query.latitude;
  let userLon = request.query.longitude;
  let key = `${userLat},${userLon}`;
  let weatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_KEY}&lat=${userLat}&lon=${userLon}&units=I&days=7`;

  if (! cache[key] || (Date.now() - cache[key].timestamp > 50000)) {
    try {
      console.log(`getting weather results for ${userLat} ${userLon}`);
      let weatherResponse = await axios.get(weatherURL);
      console.log("getting data for weather");
      const forecastArray = weatherResponse.data.data.map((day) => {
        const date = day.datetime;
        const highTemp = day.high_temp;
        const lowTemp = day.low_temp;
        return new Forecast(date, highTemp, lowTemp);
      });
      cache[key]={};
      cache[key]=forecastArray;
      cache[key].timestamp=Date.now();

      // weatherCache[key] = forecastArray;
    } catch (error) {
      let errorMessage = error.message;
      console.error(errorMessage);
    }
  } else {
    console.log("we have weather in the cache");
  }
  response.json({ Forecast: cache[key] });
}

module.exports = getWeather;

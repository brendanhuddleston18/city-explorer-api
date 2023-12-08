'use strict';

const axios  = require("axios");
const WEATHER_KEY = process.env.WEATHER_KEY;

class Forecast {
  constructor(date, highTemp, lowTemp) {
    this.date = date;
    this.highTemp = highTemp;
    this.lowTemp = lowTemp;
  }
}

async function getWeather(request, response) {
  // chatGPT helped with this
  let userLat = request.query.latitude;
  let userLon = request.query.longitude;
  let weatherURL = `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_KEY}&lat=${userLat}&lon=${userLon}&units=I&days=7`;

  try {
    let weatherResponse = await axios.get(weatherURL);
    const forecastArray = weatherResponse.data.data.map((day) => {
      const date = day.datetime;
      const highTemp = day.high_temp;
      const lowTemp = day.low_temp;
      return new Forecast(date, highTemp, lowTemp);
    });

    response.json({ Forecast: forecastArray });
  } catch (error) {
    let errorMessage = error.message;
    console.error(errorMessage);
  }
};

module.exports = getWeather;
"use strict";

require("dotenv").config();
const weatherData = require("./data/weather.json");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

const PORT = process.env.PORT || 3000;

app.get("/", (request, response) => {
  console.log(request.query);
  // chatGPT helped with this
  let userLat = request.query.latitude;
  let userLon = request.query.longitude;
  console.log(typeof(userLat));

  if (userLat && userLon) {
    let userCity = weatherData.find(
      (city) => city.lon == userLon && city.lat == userLat
    );
    if (userCity) {
      console.log(userCity.data);

      const forecastArray = userCity.data.map((day) => {
        const date = day.valid_date;

        const description = day.weather.description;
        return new Forecast(date, description);
      });
      response.json({ "CityName": userCity.city_name, "forecast": forecastArray });
    }
  } else {
    response.status(404).json({ error: "City not found" });
  }
});

// app.get('/', (request, response) => {
//   response.send("Hello World");
// })

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

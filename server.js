"use strict";

require("dotenv").config();
const weatherData = require("./data/weather.json");
const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
const app = express();
const WEATHER_KEY = process.env.WEATHER_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const MOVIE_READ = process.env.MOVIE_READ_ACCESS;
const PORT = process.env.PORT || 3000;

app.use(cors());

class Forecast {
  constructor(date, highTemp, lowTemp) {
    this.date = date;
    this.highTemp = highTemp;
    this.lowTemp = lowTemp;
  }
}

class Movie {
  constructor(name, description, voteAvg) {
    this.name = name;
    this.description = description;
    this.voteAvg = voteAvg;
  }
}

app.get("/", async (request, response) => {
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
});

app.get("/movies", async (request, response) => {
  let city = request.query.city;
  console.log(city);
  let movieURL =
    "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1";
  if (city) {
    let movieResponse = await axios.get(movieURL, {
      params: { query: `${city}` },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${MOVIE_READ}`,
      },
    });
    if (movieResponse) {
      const movieArray = movieResponse.data.results.sort(
        (a, b) => b.vote_average - a.vote_average
      );
      console.log(movieArray);
      const sortedMovies = movieArray.map((value) => {
        const name = value.original_title;
        const description = value.overview;
        const voteAvg = value.vote_average;
        return new Movie(name, description, voteAvg);
      });

      response.json(sortedMovies);
    } else {
      console.log("No movies found");
    }
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

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
  constructor(name, description, voteAvg){
    this.name = name;
    this.description = description;
    this.voteAvg = voteAvg;
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
  if (weatherResponse) {
    const forecastArray = weatherResponse.data.data.map((day) => {
      const date = day.datetime;
      const highTemp = day.high_temp;
      const lowTemp = day.low_temp;
      return new Forecast(date, highTemp, lowTemp);
    });
    response.json({ Forecast: forecastArray });
  }

});
//   if (userLat && userLon) {

app.get('/movies', async (request, response) => {
  let city = request.query.city;
  console.log(city);
  let movieURL = "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1";
  if(city){
    let movieResponse = await axios.get(movieURL, {
      params: {query: `${city}`},
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${MOVIE_READ}`,
      },
    });
    if(movieResponse) {
      const movieArray = movieResponse.data.results.sort((a,b)=> b.vote_average - a.vote_average);
      console.log(movieArray);
      const sortedMovies = movieArray.map(value => {
        const name = value.original_title;
        const description = value.overview;
        const voteAvg = value.vote_average;
        return new Movie(name, description, voteAvg);

      });
      //  .map((movie)=> {
      
      // })
      // console.log(movieResponse);
      response.json(sortedMovies);
    } else {
      console.log("No movies found");
    }

  }
});
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

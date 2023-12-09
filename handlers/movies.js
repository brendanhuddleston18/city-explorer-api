"use strict";

const axios = require("axios");
const MOVIE_READ = process.env.MOVIE_READ_ACCESS;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

class Movie {
  constructor(name, description, voteAvg) {
    this.name = name;
    this.description = description;
    this.voteAvg = voteAvg;
  }
}

let movieCache = {};

async function getMovies(request, response) {
  let city = request.query.city;
  // console.log(request.query);

  let movieURL =
    "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1";
  if (!movieCache[city] || (Date.now() - movieCache[city].timestamp > 50000)) {
    try {
      let movieResponse = await axios.get(movieURL, {
        params: { query: `${city}` },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${MOVIE_READ}`,
        },
      });
      const movieArray = movieResponse.data.results.sort(
        (a, b) => b.vote_average - a.vote_average
      );
      // console.log(movieArray);
      const sortedMovies = movieArray.map((value) => {
        const name = value.original_title;
        const description = value.overview;
        const voteAvg = value.vote_average;
        return new Movie(name, description, voteAvg);
      });
      movieCache[city] = {};
      movieCache[city] = sortedMovies;
      movieCache[city].timestamp = Date.now();
    } catch (error) {
      let errorMessage = error.message;
      console.error(errorMessage);
    }
  } else {
    console.log(`We have ${city} at home`);
  }
  response.json(movieCache[city]);
}

module.exports = getMovies;

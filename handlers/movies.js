'use strict';

const axios  = require("axios");
const MOVIE_READ = process.env.MOVIE_READ_ACCESS;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

class Movie {
  constructor(name, description, voteAvg) {
    this.name = name;
    this.description = description;
    this.voteAvg = voteAvg;
  }
}

const movieCache = {};


async function getMovies (request, response) {
  let city = request.query.city;
  // console.log(city);

  if (! movieCache[city]){
    
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
        // console.log(movieArray);
        const sortedMovies = movieArray.map((value) => {
          const name = value.original_title;
          const description = value.overview;
          const voteAvg = value.vote_average;
          return new Movie(name, description, voteAvg);
        });
        movieCache[city] = sortedMovies;
        response.json(sortedMovies);
      } else {
        console.log("No movies found");
      }
    }
  } else {
    console.log(`We have ${city} at home`);
  }
};

module.exports = getMovies;

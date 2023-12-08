"use strict";

/*-----------------Imports-----------------------------------------------------------------*/ 

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const getWeather = require("./handlers/weather");
const getMovies = require('./handlers/movies')

app.use(cors());


/*------------------Handle Functions---------------------------------------------------- */

function handleHomePage (request, response){
  response.status(200).send('Connection Succesful');
}

function handleNotFound( request, response){
  response.status(404).send("Not found")
}


/*-----------------Gets---------------------------------------------------------------- */

app.get('/', handleHomePage);

app.get("/weather", getWeather);

app.get("/movies", getMovies);

app.get('*', handleNotFound);


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

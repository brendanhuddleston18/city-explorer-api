'use strict';

require('dotenv').config();
const weatherData = require('./data/weather.json');
const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/weather', (request, response) => {
  // chatGPT helped with this
let userLat = request.query.latitude;
let userLon = request.query.longitude;

  
  
  if(userLat && userLat){
    // 
    // response.json(weatherData[cityData]);
    response.send(`your longitude is ${userLon} and latitude is ${userLat}`);
  }else {
    console.log("didn't work bro");
  }
})

// app.get('/', (request, response) => {
//   response.send("Hello World");
// })

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

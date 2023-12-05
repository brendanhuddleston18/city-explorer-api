'use strict';

require('dotenv').config();
const weatherData = require('./data/weather.json');
const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/', (request, response) => {
  response.send("hello world"); 
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.get('/', (request, response) => {
  response.send("Hello World");
});
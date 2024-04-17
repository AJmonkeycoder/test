const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/dbConnection');
const {errorHandler} = require("./middleware/errorMiddleware");
const Machine= require("./models/machineModel");
const moment = require('moment');


dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
const app = express();


// Middleware
app.use(express.json());
app.use(cors()); // Apply CORS middleware
app.use(bodyParser.urlencoded({ extended: false }));
// Error Handling Middleware
app.use(errorHandler);
// app.use(notFound);

async function importData() {
  try {
    

    // Fetch data from the "wathare" Database
    const data = await Machine.find({}); 

    console.log("Data fetched from wathare collection:", data);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

app.get('/api/lastdata', async (req, res) => {
  try {
  
    const lastdata = await Machine.find({  }).sort({_id:-1}).limit(1);;
    

    res.json(lastdata);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});


app.get('/api/data', async (req, res) => {
  try {
  
    const data = await Machine.find({ });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query; // Latitude and longitude of the location

    // Make request to OpenWeatherMap API
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHERMAP_API_KEY, // API key from environment variables
        units: 'metric' // Specify units as metric for Celsius temperature
      }
    });

    
    const temperature = response.data.main.temp;
    
    
    res.json({ temperature });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


module.exports = server;

const { response } = require("express");
const express = require("express");
const https = require("https");
const app = express();
var bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.set("views",__dirname+"/view");
app.set("view engine", "pug");
app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/static/weather.html");
  console.log("yes1");
});

app.post("/", (req, res) => {
  let lat = req.body.lat;
  let lon = req.body.lon;
  let Weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=493dbfc804b222f2e32572f513f7c8e2&units=metric`;
  https.get(Weather_url, (respond) => {
    respond.on("data", (d1) => {
      let WeatherData = JSON.parse(d1);
      https.get(
        `https://restcountries.com/v3.1/alpha?codes=${WeatherData.sys.country}`,
        (res2) => {
          res2.on("data", (d2) => {
            let country_data = JSON.parse(d2);
            var param = {
              city_name: WeatherData.name.toUpperCase(),
              country_name: country_data[0].name.common.toUpperCase(),
              time_zone: `${parseInt(WeatherData.timezone / 3600)}:${
                (WeatherData.timezone % 3600) / 60
              } GMT`,
              curr_temp: WeatherData.main.temp.toFixed(1),
              img_src: `http://openweathermap.org/img/wn/${WeatherData.weather[0].icon}@2x.png`,
              weather_cond: `${WeatherData.weather[0].main}, ${WeatherData.weather[0].description}`,
              feel_like: WeatherData.main.feels_like.toFixed(1),
              maxmin_temp: `${WeatherData.main.temp_max.toFixed(
                1
              )}/${WeatherData.main.temp_min.toFixed(1)}`,
              humidity_per: WeatherData.main.humidity,
              cloud_per: WeatherData.clouds.all,
              wind_speed: WeatherData.wind.speed,
              wind_direction: "NE",
              press: WeatherData.main.pressure,
              visibility: (WeatherData.visibility / 1000).toFixed(1),
            };
            console.log(Weather_url);
            res.render("WeatherHere", param);
          });
        }
      );
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

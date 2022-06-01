var today = moment().format("dddd MMMM Do, YYYY");
var currenthour = moment().format("HH");
var weathertoday = $("#weather-today");
// console.log(weathertoday);


//Display Date and Time above the Header Section
$("#date-section").text(today);
$("#date-section").css("font-size",'24px');
$("#clock-section").css("font-size",'24px');
function UPDATETIME() {
  rightnow = moment().format('hh:mm:ss:a');
  $("#clock-section").text(rightnow);
  var timerInterval = setInterval(updatetime,1000);
  function updatetime() {
      rightnow = moment().format('hh:mm:ss:a');
      $("#clock-section").text(rightnow);
  };
};
UPDATETIME();

// Grabbing Cities from the Local Storage
var cities = [];
function GRABALLCITIES() {
  cities = JSON.parse(localStorage.getItem("listofcities"));
  if (cities) {
    GRABWEATHERTODAY(cities[cities.length -1]);
  } else {
    cities = [];
    $(".mainbar").css("visibility",'hidden');
  }
}
GRABALLCITIES();

// Generate Buttons for Each City in the List
function SHOWCITIES() {
  $("#citiesList").empty();
  var count = 0;
  for (var i = cities.length-1; i >= 0; i--) {
    if (count++ < 9) {
      var newBtn = $("<button>").attr("class", "btn-warning btn").attr("city", cities[i]).text(cities[i]);
    $("#citiesList").append(newBtn);
    }
  }
  $(".btn-warning").on("click", function (event) {
    var city = $(this).text();
    GRABWEATHERTODAY(city);
  })
}
SHOWCITIES();

// Get User Input of the City Name
var city = "";
$("#search-button").on("click", function (event) {
  event.preventDefault();
  city = $("#searched-city").val().trim();
  if (city === "") {
    return;
  }
  
  if (cities.length < 9) {
    if (cities.includes(city) === false) {
      cities.push(city);
      localStorage.setItem("listofcities", JSON.stringify(cities));  
    }
  } else if (cities.length >= 9) {
    if (cities.includes(city) === false) {
      var num = cities.length - 9 + 1
      cities.splice(0, num);
      cities.push(city);
      localStorage.setItem("listofcities", JSON.stringify(cities));  
    }
  }
  $("#searched-city").val("");
  SHOWCITIES();
  GRABWEATHERTODAY(city);
});


function GRABWEATHERTODAY(city) {
  $(".mainbar").css("visibility",'visible');
  var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=208c92a14cc1f9c42c03ca9c7b03be6f";
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      timeupdated = moment.unix(data.dt).format("MM/DD/YYYY");
      $("#name").text(data.name);
      GRABWEATHERFORECAST(data.name);
      $("#date").text(" (" + timeupdated + ")");
      var iconURL = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
      $("#condition").text("weather: " + data.weather[0].description);
      $("#condition").append(`<img src=${iconURL}>`);
      $("#temp").text("temperature: " + data.main.temp + " \u00B0C");
      $("#temp-today").text(data.main.temp + " \u00B0C");
      $("#humidity").text("humidity: " + data.main.humidity + "%");
      $("#wind").text("wind speed: " + data.wind.speed + " m/s");
      $('#uv-index').text("uv index: ");
      var lon = data.coord.lon;
      var lat = data.coord.lat;
      GRABUVINDEX(lat, lon);
    })
};

function GRABUVINDEX(lat, lon) {
  requestURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=208c92a14cc1f9c42c03ca9c7b03be6f";
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      uvindex = data.value;
      // console.log(uvindex);
      var UV = $(document.createElement('button'));
      UV.attr("class", "btn");
      UV.attr("id", "uv-btn");
      UV.text(uvindex);

      if (uvindex <= 3) {
        UV.css("background-color", "green");
      } else if (uvindex > 3 && uvindex <= 6) {
        UV.css("background-color", "yellow");
      } else if (uvindex > 6 && uvindex <= 9) {
        UV.css("background-color", "orange");
      } else if (uvindex > 9 && uvindex <= 12) {
        UV.css("background-color", "purple");
      }
      $('#uv-index').append(UV);
    })
}



function GRABWEATHERFORECAST(city) {
  $("#weather-forecast").empty();
  var requestURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=208c92a14cc1f9c42c03ca9c7b03be6f";
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt[11] === "1" && data.list[i].dt_txt[12] === "2") {
          // console.log(data.list[i]);
          var forecastDate = moment.unix(data.list[i].dt).format("MM/DD/YYYY");
          var forecastIcon = data.list[i].weather[0].icon;
          var forecastIconURL = "https://openweathermap.org/img/w/" + forecastIcon + ".png";
          var forecastTemperature = data.list[i].main.temp;
          var forecastHumidity =  data.list[i].main.humidity;
          $("#weather-forecast").append(
          `<div class="col running card-parent">
            <div class="card">
              <div>
                <h5>${forecastDate}</h5>
                <img alt="forecast" src="${forecastIconURL}"> <hr>
                <p>temperature:<br> ${forecastTemperature} \u00B0C</p> <hr>
                <p>humidity:<br> ${forecastHumidity}%</p> <hr>
              </div>
            </div>
          </div>`
          );
        }
      }
    })
  }








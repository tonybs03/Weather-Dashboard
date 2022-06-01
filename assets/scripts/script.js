var today = moment().format("dddd MMMM Do, YYYY");
var currenthour = moment().format("HH");


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
    // getweatherdata
  } else {
    cities = [];
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
  $(".listBtn").on("click", function (event) {
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
  // GRABWEATHERTODAY(city);
});






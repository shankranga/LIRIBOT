require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var axios = require("axios");

var moment = require("moment");

var fs = require("fs");

// empty variable to take in command
var action = process.argv[2];

var userInput = process.argv.slice(3).join("+");

console.log("Type 'start' for instructions");
runFunctions(action);

// Switch Case
function runFunctions(action) {
  switch (action) {
    case "start":
      liriInstructions(userInput);
      break;

    case "concert-this":
      concertThis(userInput);
      break;

    case "movie-this":
      movieThis(userInput);
      break;

    case "spotify-this-song":
      spotifyThis(userInput);
      break;
  }
}
//Movie This
function movieThis() {
  var userInput = process.argv.slice(3).join("+");
  var movie = userInput || "Mr. Nobody";
  axios
    .get(
      "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy"
    )
    .then(function(response) {
      var title = response.data.Title;
      var rating = response.data.imdbRating;
      var year = response.data.Released;
      var country = response.data.Country;
      var language = response.data.Language;
      var plot = response.data.Plot;
      var cast = response.data.Actors;

      console.log(response.data);

      console.log("Movie Title: " + title);
      console.log("Rating: " + rating);
      console.log("Year:" + year);
      console.log("Country: " + country);
      console.log("Language: " + language);
    });
}
//BandsinTown
function concertThis() {
  var artist = userInput || "Drake";
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        artist +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      var results = response.data;

      for (var i = 3; i < response.data.length; i++) {
        var lineup = results[i].lineup;
        var venue = results[i].venue.name;
        var location = results[i].venue.city;
        var date = results[i].datetime;
        var dateOf = moment(date).format("MM/DD/YYYY");
        console.log("Artist: " + lineup);
        console.log("Venue: " + venue);
        console.log("Location: " + location);
        console.log("Date: " + dateOf);
      }
    })
    .catch(function(error) {
      return console.log(error);
    });
}
//Spotify Function
function spotifyThis() {
  var song = userInput;
  var spotify = new Spotify(keys.spotify);

  spotify
    .search({
      type: "track",
      query: song,
      limit: 1
    })
    .then(function(response) {
      var songInfo = response.tracks.items[0];
      var artist = songInfo.album.artists[0].name;
      var song = songInfo.name;
      var preview = songInfo.preview_url;
      var album = songInfo.album.name;

      console.log("Artist: " + artist);
      console.log("Song Title: " + song);
      console.log(" Preview Song: " + preview);
      console.log("Album: " + album);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function liriInstructions() {
  console.log("Welcome to Liri, to use run one of the three commands given:");
  console.log("spotify-this-song \nconcert-this \nmovie-this");
  console.log(
    "Your command line should start with 'node liri + one of the above commands + what you want to search"
  );
}

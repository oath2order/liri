var request = require('request');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var fs = require('fs')
process.argv.shift();
process.argv.shift();
var command = process.argv[0];
process.argv.shift();
var userArr = process.argv;

init(command);

function init(command) {
  if (command === "movie-this") {
    omdb();
  } else if (command === "my-tweets") {
    tweetGet();
  } else if (command === "spotify-this-song") {
    spotifyThis();
  } else if (command === "do-what-it-says") {
    readText();
  } else {
    console.log("Please Enter a Valid Command")
  }
}

function readText() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var output = data.split(",");
    if (output[1] != undefined) {
      var fileTitle = output[1].replace(/"/g, '');
      userArr = fileTitle.split(" ");
    }
    init(output[0]);
  });
}

//function for spotify api calls
function spotifyThis() {
  var songTitle = "";
  var spotifyAPI = new spotify({
    id: "fdbeb7f0d7314475963bbc0d41b27b0e",
    secret: "e31c48e1d77a4c8fb7830517793ac252"
  });
  for (var i = 0; i < userArr.length; i++) {
    songTitle += userArr[i] + " ";
  }
  spotifyAPI.search({ type: 'track', query: songTitle, limit: 1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log(data.tracks.items[0].name);
    console.log(data.tracks.items[0].album.name);
    console.log(data.tracks.items[0].artists[0].name);
    console.log(data.tracks.items[0].preview_url);
  });
}

//function for twitter API calls
function tweetGet() {
  var twitterKeys = require("./key.js")
  var client = new twitter({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
    access_token_key: twitterKeys.access_token_key,
    access_token_secret: twitterKeys.access_token_secret
  });
  var params = { screen_name: 'JKhomework' };
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i in tweets) {
        console.log(tweets[i].text);
      }
    } else {
      console.log(error);
    }
  });
}

//function for movie calls
function omdb() {
  var movieEndPoint = "http://www.omdbapi.com/?t=";
  var movieParams = "&y=&plot=short&apikey=40e9cece";
  var movieTitle = "";
  for (var i = 0; i < userArr.length; i++) {
    if (i === userArr.length - 1) {
      movieTitle += (userArr[i])
    } else {
      movieTitle += (userArr[i] + "+")
    }
  }
  if (userArr.length == 0) {
    movieTitle = "Mr.+Nobody";
  }
  var movieApiCall = movieEndPoint + movieTitle + movieParams;
  request(movieApiCall, function(error, response, body) {
    // If the request was successful...
    if (!error && response.statusCode === 200) {
      // Then log the body from the site!
      console.log("The Title of the movie is " + JSON.parse(body).Title);
      console.log("The Year of the movie was released " + JSON.parse(body).Year);
      console.log("The IMBD Rating of the movie is " + JSON.parse(body).imdbRating);
      console.log("The Rotten Tomatos score of the movie is " + JSON.parse(body).Metascore);
      console.log("This movie was produced in " + JSON.parse(body).Country);
      console.log("The Language of this movie is " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
  });
}
//code to read and set any environment variables with the dotenv package
require("dotenv").config();
//access your keys information
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userInput = process.argv[2];

// my-tweets

// spotify-this-song

// movie-this

// do-what-it-says
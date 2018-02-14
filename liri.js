//code to read and set any environment variables with the dotenv package
require("dotenv").config();
// get request npm package 
var request = require("request");
// Load the fs package to read and write
var fs = require("fs");
//get spotify package
var Spotify = require('node-spotify-api');
//get twitter package
var Twitter=require('twitter');
//keys for Twitter & Spotify credentials
var keys = require("./keys.js");
//access your keys information
var spotify = new Spotify({
	id : keys.spotify.id,
  secret : keys.spotify.secret,
});



var client = new Twitter({
	consumer_key:keys.twitter.consumer_key,
	consumer_secret: keys.twitter.consumer_secret,
  	access_token_key: keys.twitter.access_token_key,
  	access_token_secret: keys.twitter.access_token_secret
	});


var userInput = process.argv[2];
//console.log(userInput);
// my-tweets
//show your last 20 tweets and when 
//they were created at in your terminal/bash window.
function myTweets()
{
	client.get('statuses/user_timeline/', {q: 'node.js'}, function(error, tweets, response) 
	{
		console.log(tweets[0].text);
		//console.log(tweets.statuses[0].text);
		//console.log(tweets.statuses[0].created_at);  
	});
}
// spotify-this-song <song name>
function spotifyThisSong(song)
{
	var mySong=song.trim();
	//if there is no user input for the spotifyThisSOng, default it to "The Sign"
	if(mySong=="")
	{
		mySong="The Sign";
	}
	console.log(mySong);

	spotify.search({ type: "track", query: mySong, limit:1 }, function(err, data) {
  if (err) {
    return console.log("Error occurred: " + err);
  }
  console.log(JSON.stringify(data, null, 2));

 //link of song
//console.log(data.tracks.href); 
//console.log(data.tracks.items[0].artist[0].name); 
//console.log(data.tracks.items[0]);
//console.log("Name: "+data.tracks.items[0].name);
//console.log("Preview Link: "+data.tracks.items[0].album.artists.external_urls);
//console.log("Album: "+data.tracks.items[0].external_urls);
console.log("Artist: "+JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 2));

console.log("Preview Link: "+JSON.stringify(data.tracks.items[0].album.artists[0].external_urls.spotify, null, 2));
console.log("Song: "+JSON.stringify(data.tracks.items[0].name, null, 2));
console.log("Album: "+JSON.stringify(data.tracks.items[0].album.name, null, 2));

});

	//Artist(s)
//The song's name
// A preview link of the song from Spotify
// The album that the song is from

}




// movie-this <movie name>
function movieThis(movieName)
{
	var myMovie=movieName.trim();
	//if there is no user input for the movieThis, default it to Mr.Nobody
	if(myMovie=="")
	{
		movieName="Mr.Nobody";
	}
	// Then run a request to the OMDB API with the specified movie
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
	console.log(queryUrl);
	request(queryUrl, function(error, response, body) 
	{
	  // If the request is successful lets display the info
	  	if (!error && response.statusCode === 200) 
		{
	    	console.log("* Title of the movie. " + JSON.parse(body).Title);
	    	console.log("* Year the movie came out " + JSON.parse(body).Year);
	    	console.log("* IMDB Rating of the movie. " + JSON.parse(body).imdbRating);
	    	console.log("* Rotten Tomatoes Rating of the movie. " + JSON.parse(body).Ratings[2].Value);
	    	console.log("* Country where the movie was produced. " + JSON.parse(body).Country);
	    	console.log("* Language of the movie. " + JSON.parse(body).Language);
	    	console.log("* Plot of the movie. " + JSON.parse(body).Plot);
	    	console.log("* Actors in the movie. " + JSON.parse(body).Actors);
  		}
	});
}


// do-what-it-says
//use node package
//takes the text inside of random.txt and 
//use to call one of LIRI's commands
  // We will read the existing bank file
  function doWhatItSays()
  {


  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) 
    {
      return console.log(err);
    }
    /*
    // Break down all the numbers inside
    data = data.split(", ");
    var result = 0;

    // Loop through those numbers and add them together to get a sum.
    for (var i = 0; i < data.length; i++) {
      if (parseFloat(data[i])) {
        result += parseFloat(data[i]);
      }
    }
	*/
    // We will then print the final balance rounded to two decimal places.
    console.log(data);
  });
}
//doWhatItSays();
//myTweets();
//movieThis("");
spotifyThisSong("");


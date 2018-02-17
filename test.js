//code to read and set any environment variables with the dotenv package
require("dotenv").config();
// get request npm package 
var request = require("request");
//get inquirer npm package
var inquirer = require("inquirer");
// Load the fs package to read and write
var fs = require("fs");
//get spotify package
var Spotify = require('node-spotify-api');
//get twitter package
var Twitter=require('twitter');
//keys for Twitter & Spotify credentials
var keys = require("./keys.js");
//access your keys information
//***USER INQUIRER
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

function start()
{
  inquirer.prompt([

  {
    type: "list",
    name: "action",
    message: "-----Main Menu-----\n please select an option:",
    choices: ["Get my Tweets", "Get a Spotify Song", "Get a Movie", "Read a file & Do What it Says"]
  },
  /*{
      name: "twitter",
      message: "Do you want to get the Tweets?",
      type: "confirm",
      when: function(user) {
          return user.action === "Get my Tweets"
      }
  },*/
  {
      name: "spotify",
      message: "What song are you looking for?",
      when: function(user) {
          return user.action === "Get a Spotify Song"
      }
  },
  {
      name: "movie",
      message: "What movie are you thinking of?",
      when: function(user) {
          return user.action ===  "Get a Movie"
      }
  },
  ]).then(function(user) {
  console.log(user.action);

  // If the user guesses the password...
  if(user.action=== "Get my Tweets") 
  {
    console.log("inside my tweets dummy");
    myTweets();
  }
  else if(user.action.includes("Spotify"))
  {
    console.log("inside spotify this song dummy");
   //findName();
   //console.log(user.spotify);
   spotifyThisSong(user.spotify);
  }
  else if(user.action.includes("Movie"))
  {
    console.log("inside movie this dummy");
    movieThis(user.movie);
  }
  else if(user.action === "Read a file & Do What it Says")
  {
    console.log("inside dowhat it says dummy");
    doWhatItSays();
  }
  //calling restart function asynchronously to ask user to restart
  //after doing all actions
  setTimeout(restart, 3000);
  });
 

}
//restart function will ask user to restart or terminate the program
function restart()
{
  inquirer
  .prompt([
    {
      type: "confirm",
      message: "Do you want to run this program, again?",
      name: "confirm",
      default: true
    }
      ])
  .then(function(response) {
    if(response.confirm)
    {
      start();
    }
    else
    {
      console.log("You exited out of the game.\nGoodbye!");
    }
  });
}
//console.log(userInput);
// my-tweets
//show your last 20 tweets and when 
//they were created at in your terminal/bash window.
function myTweets()
{
  client.get('statuses/user_timeline/', {q: 'node.js'}, function(error, tweets, response) 
  {
    console.log("--------------------");
    for(var x=0; x<20; x++)
    {

      console.log((x+1)+" "+ tweets[x].text);
      console.log(tweets[x].created_at);
      console.log("--------------------");
    }
  });
}

//spotify-this-song <song name>
//update spotify
function spotifyThisSong(song)
{
  var mySong=song.trim();
  //if there is no user input for the spotifyThisSOng, default it to "The Sign"
  if(mySong=="")
  {
    mySong="The+Sign";
  }
  //console.log(mySong);

  spotify.search({ type: "track", query: mySong, limit:1 }, function(err, data) 
  {
    if (err) 
    {
      return console.log("Error occurred: " + err);
    }
      //console.log(JSON.stringify(data, null, 2));
    //artist info
    console.log("Artist: "+JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 2));
    //song name
    console.log("Song: "+JSON.stringify(data.tracks.items[0].name, null, 2));
    //preview link from the spotify song
    console.log("Preview Link: "+JSON.stringify(data.tracks.items[0].album.artists[0].external_urls.spotify, null, 2));
    //album of the song
    console.log("Album: "+JSON.stringify(data.tracks.items[0].album.name, null, 2));
  });
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
  //console.log(queryUrl);
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

//use node package
//takes the text inside of random.txt and 
//use to call one of LIRI's commands
  // We will read the existing bank file
  function doWhatItSays()
  {

      
    fs.readFile("random.txt", "utf8", function(err, data) 
    {
      if (err) 
      {
        return console.log(err);
      }
      console.log("reading files");
      //console.log(data);
      // splits the text data 
      //data=data.remove(",");
      data = data.split(",");
       //console.log("data after splitting: "+data.length);

      var name = "";
    var action=data[0];
    //console.log("action: "+action);
    if(action.includes(","))
        {
          action=action.replace(",","");
        }
        //console.log(action)
      // Loop through those numbers and add them together to get a sum.
      for (var i = 1; i < data.length; i++) 
      {
      data[i]=data[i].replace('"', '');
          name += data[i];
      }
      name=name.replace('"', "");
    //console.log("name concat"+name);
      // We will then print the final balance rounded to two decimal places.
      whatToDo(action, name);
    });
}
///replace fx
//function for name concatation***
//function for case statement***
function whatToDo(action, myString)
{
  //console.log(action);
  //console.log(action.includes("spotify-this-song"));

  if(action.includes("spotify-this-song"))
  {
    console.log("inside spotify this song dummy");
    spotifyThisSong(myString);
  }
  else if(action.includes("my-tweets"))
  {
    console.log("inside my tweets dummy");
    myTweets();
  }
  else if(action.includes("movie-this"))
  {
    console.log("inside movie this dummy");
    movieThis(myString);
  }
  else if(action.includes("do-what-it-says"))
  {
    console.log("inside dowhat it says dummy");
    doWhatItSays();
  }
}
start();



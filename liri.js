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
//access spotify key information
var spotify = new Spotify({
  id : keys.spotify.id,
  secret : keys.spotify.secret,
});
//access spotify key information
var client = new Twitter({
  consumer_key:keys.twitter.consumer_key,
  consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
  });

//start function. This the first menu when liri.js 
//runs to display the option menu
//first asks user for an action and based on action will either 
//call a function to do an action such as get tweets or read and do what it says
// or asks for a name to pass the name to get a spotify song or get a movie
function start()
{
  //using inquirer as a form of input validation
  inquirer.prompt([
  //first prompt displays the menu options
  {
    type: "list",
    name: "action",
    message: "-----Main Menu-----\n please select an option:",
    choices: ["Get my Tweets", "Get a Spotify Song", "Get a Movie", "Read a file & Do What it Says"]
  },
  //if the user clicks on spotify ask user for song name
  //and set to user.action
  {
      name: "spotify",
      message: "Please input song name: ",
      when: function(user) {
          return user.action === "Get a Spotify Song"
      }
  },
  //if the user clicks on movie ask user for movie 
  //name set to user.action
  {
      name: "movie",
      message: "Please input movie name: ",
      when: function(user) {
          return user.action ===  "Get a Movie"
      }
  },
  //then pass the user object to preform actions
  ]).then(function(user) {
  //if the user clicks on tweets call myTweets function
  if(user.action=== "Get my Tweets") 
  {
    myTweets();
  }
  //if the user clicks on spotify call spotifyThisSong function
  else if(user.action.includes("Spotify"))
  {
   spotifyThisSong(user.spotify);
  }
  //if the user clicks on movie call movieThis function
  else if(user.action.includes("Movie"))
  {
    movieThis(user.movie);
  }
  //if the user clicks on do what it says, call doWhatItSays function
  else if(user.action === "Read a file & Do What it Says")
  {
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
  //ask the user if the way to run the program again
  .prompt([
    {
      type: "confirm",
      message: "\nDo you want to run this program, again?",
      name: "confirm",
      default: true
    }
      ])
  .then(function(response) {
  	//if yes, call the start function to run again
    if(response.confirm)
    {
      start();
    }
    //else terminate the program and tell the user goodbye!
    else
    {
      console.log("\nYou exited out of the game.\nGoodbye!");
    }
  });
}

//myTweets() function calls for twitter and gets the last 20 tweets to 
//display
function myTweets()
{
  client.get('statuses/user_timeline/', {q: 'node.js'}, function(error, tweets, response) 
  {
    console.log("\n--------------------");
    for(var x=0; x<20; x++)
    {
      console.log("Tweet: "+tweets[x].text);
      console.log("Date:  "+tweets[x].created_at);
      console.log("--------------------");
    }
  });
}

//the spotifyThisSong takes in a song name and creates a call to spotify
//to get and display song information
function spotifyThisSong(song)
{
  var mySong=song.trim();
  //if there is no user input for the spotifyThisSOng, default it to "The Sign"
  if(mySong=="")
  {
    mySong="The+Sign";
  }
  spotify.search({ type: "track", query: mySong, limit:1 }, function(err, data) 
  {
  	//if there is an error display error
    if (err) 
    {
      return console.log("Error occurred: " + err);
    }
    //else display the song information
    console.log("\n---------------------------------------");
    //artist info
    console.log("Artist: "+JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 2));
    //song name
    console.log("Song: "+JSON.stringify(data.tracks.items[0].name, null, 2));
    //preview link from the spotify song
    console.log("Preview Link: "+JSON.stringify(data.tracks.items[0].album.artists[0].external_urls.spotify, null, 2));
    //album of the song
    console.log("Album: "+JSON.stringify(data.tracks.items[0].album.name, null, 2));
  	console.log("---------------------------------------\n");
  });
}

// movieThis function takes in a movie name and creates  call to get movie
//information
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
  request(queryUrl, function(error, response, body) 
  {
    // If the request is successful lets display the info
      if (!error && response.statusCode === 200) 
    {
    	console.log("\n---------------------------------------");
        console.log("* Title of the movie. " + JSON.parse(body).Title);
        console.log("* Year the movie came out " + JSON.parse(body).Year);
        console.log("* IMDB Rating of the movie. " + JSON.parse(body).imdbRating);
        console.log("* Rotten Tomatoes Rating of the movie. " + JSON.parse(body).Ratings[2].Value);
        console.log("* Country where the movie was produced. " + JSON.parse(body).Country);
        console.log("* Language of the movie. " + JSON.parse(body).Language);
        console.log("* Plot of the movie. " + JSON.parse(body).Plot);
        console.log("* Actors in the movie. " + JSON.parse(body).Actors);
      	console.log("---------------------------------------\n");
      }
  });
}

//takes the text inside of random.txt and use to call one of LIRI's commands
  function doWhatItSays()
  {
    fs.readFile("random.txt", "utf8", function(err, data) 
    {
    	//if the file does not read display error msg
      if (err) 
      {
        return console.log(err);
      }
      //else read the file and split the words into an array
      data = data.split(",");

      var name = "";
      //first word is the action call
    var action=data[0];
    //remove the commas
    if(action.includes(","))
        {
          action=action.replace(",","");
        }
      // Loop through to concatinate word from the file to create the name
      for (var i = 1; i < data.length; i++) 
      {
      data[i]=data[i].replace('"', '');
          name += data[i];
      }
      //for some reason there is a difference of end quotes for the front and back for me
      //had thus why had to replace with a different quote
      name=name.replace('"', "");
      // We will then print the final balance rounded to two decimal places.
      whatToDo(action, name);
    });
}

//complementary function with doWhatItSays() creates the action and string
//passes to whatToDo to determie what actions to run
function whatToDo(action, myString)
{
  if(action.includes("spotify-this-song"))
  {
    spotifyThisSong(myString);
  }
  else if(action.includes("my-tweets"))
  {
    myTweets();
  }
  else if(action.includes("movie-this"))
  {
    movieThis(myString);
  }
  else if(action.includes("do-what-it-says"))
  {
    doWhatItSays();
  }
}
//when liri.js is opened via terminal / bash.. calls start function
start();
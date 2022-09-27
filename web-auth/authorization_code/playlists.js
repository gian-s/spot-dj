
const express = require("express"); // Express web server framework
const router = express.Router(); //
const request = require("request"); // "Request" library
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
var addLogin = require('./login');




app
.use(express.static(__dirname + "/public"))
.use(cors())
.use(cookieParser());


const client_id = ""; // Your client id
const client_secret= ""; // Your secret
const redirect_uri =  "http://localhost:8888/callback/";

addLogin(router,client_id,client_secret,redirect_uri);


app.use('./login',addLogin);



var SpotifyWebApi = require('spotify-web-api-node');



//const loginRoute = require('./app');
// credentials are optional
var spotifyApi = new SpotifyWebApi({
    client_id: client_id,
    client_secret: client_secret, // Your secret
    redirect_uri:  redirect_uri // Your redirect uri
});




spotifyApi.setAccessToken('');


spotifyApi.getUserPlaylists('')
.then(function(data) {
  console.log('Retrieved playlists');
  var playlists  = data.body.items;
  var len_playlists = Object.keys(playlists).length;

  
  for(let i = 0; i < len_playlists; i++){
    console.log(playlists[i].id, playlists[i].name)
  }
  

  


},function(err) {
  console.log('Something went wrong!', err);
});



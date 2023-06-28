const express = require("express");
const fs = require("fs");
const cors = require("cors");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
require("dotenv").config();
const { parse, stringify } = require("envfile");
const pathToenvFile = "../client/.env";
const asyncHandler = require("express-async-handler");
require("dotenv").config({ path: pathToenvFile });
const app = express();
app.use(cors());
app.use(bodyParser.json());

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var scopes = process.env.VITE_SCOPES.split(" "),
  redirectUri = process.env.VITE_REDIRECT_URI,
  clientId = process.env.VITE_CLIENT_ID,
  state = generateRandomString(16);

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
const spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId,
});

// Create the authorization URL
const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

function setEnv(key, value) {
  fs.readFile(pathToenvFile, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = parse(data);
    result[key] = value;
    //console.log(result);
    fs.writeFile(pathToenvFile, stringify(result), function (err) {
      if (err) {
        return console.log(err);
      }
      //console.log("File Saved"); // Can be commented or deleted
    });
  });
}
//Calls function and sets environment variables needed to call Spotify's API
setEnv("REACT_APP_APP_URL", authorizeURL);

//Handles login route
app.post(
  "/login",
  asyncHandler(async (req, res) => {
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.VITE_REDIRECT_URI,
      clientId: process.env.VITE_CLIENT_ID,
      clientSecret: process.env.VITE_CLIENT_SECRET,
    });

    const code = req.body.code;
    spotifyApi.authorizationCodeGrant(code).then((data) => {
      console.log(data.body.access_token);
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    });
  })
);

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.VITE_REDIRECT_URI,
    clientId: process.env.VITE_CLIENT_ID,
    clientSecret: process.env.VITE_CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      console.log(data.body);
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });
      //update access token to our database
      // Save the access token so that it's used in future calls
      //spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.listen(3001);

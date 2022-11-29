const express = require("express");
const fs = require("fs");
const cors = require("cors");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
require("dotenv").config();
const User = require("./model/userModel");
const connectDB = require("./config/db");
const { parse, stringify } = require("envfile");
const pathToenvFile = "../.env";

//const { getData } = require("./get_data");

const asyncHandler = require("express-async-handler");

require("dotenv").config({ path: pathToenvFile });

//console.log(process.env.SCOPES.split(' '));
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

//.env file located in parent directory edit this location path if moved

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var scopes = process.env.REACT_APP_SCOPES.split(" "),
  redirectUri = process.env.REACT_APP_REDIRECT_URI,
  clientId = process.env.REACT_APP_CLIENT_ID,
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
setEnv("REACT_APP_APP_URL", authorizeURL);

console.log(process.env.REACT_APP_APP_URL);

app.post(
  "/login",
  asyncHandler(async (req, res) => {
    const user_id = process.env.REACT_APP_USER;
    const userExists = await User.findOne({ user_id });

    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REACT_APP_REDIRECT_URI,
      clientId: process.env.REACT_APP_CLIENT_ID,
      clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    });

    const code = req.body.code;
    spotifyApi
      .authorizationCodeGrant(code)
      .then((data) => {
        console.log(data.body.access_token);
        res.json({
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token,
          expiresIn: data.body.expires_in,
        });
        if (userExists) {
          const update_access = { user_access_token: data.body.access_token };
          const update_refresh = {
            user_refresh_token: data.body.refresh_token,
          };
          (async function () {
            let doc1 = await User.findOneAndUpdate(user_id, update_access);
            let doc2 = await User.findOneAndUpdate(user_id, update_refresh);
          })();
        } else {
          (async function () {
            await User.create({
              user_id: user_id,
              user_access_token: data.body.access_token,
              user_refresh_token: data.body.refresh_token,
            });
          })();
        }
        //add/update access token to our database
        //call playlistController to populate database or do nothing
      })
      .catch(() => {
        res.sendStatus(400);
        //console.log('Something went wrong!', err);
      });
  })
);

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
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

      //console.log('Something went wrong!', err);
    });
});

app.listen(3001);

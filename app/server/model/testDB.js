const connectDB = require("../config/db");
const express = require("express");
const Playlist = require("../model/playlistModel");
const User = require("../model/userModel");

connectDB();

var a = {
  user: null,
  playlist_id: "37i9dQZF1F0sijgNaJdgit",
  playlist_name: "Testing Mongo DB",

  track: {
    track_name: ["Efecto", "YOUNG LUV", "Pensándote", "Party"],
    track_id: [
      "5Eax0qFko2dh7Rl2lYs3bx",
      "7HGKvoju3ucB7UqVt1GoJu",
      "2wnhst8yHA4gKuojAgZedh",
      "4tYFy8ALRjIZvnvSLw5lxN",
    ],
    track_duration: [213061, 206080, 216413, 227628],
    artists: [
      ["Bad Bunny"],
      ["STAYC"],
      ["Rauw Alejandro", "Tainy"],
      ["Bad Bunny", "Rauw Alejandro"],
    ],
    added_at: [
      "1970-01-01T00:00:00Z",
      "1970-01-01T00:00:00Z",
      "1970-01-01T00:00:00Z",
      "1970-01-01T00:00:00Z",
    ],
  },
};

const app = express();

(async function () {
  //code
  const test_user = await User.findOne({ user_id: "1225657860" }).exec();

  a.user = test_user._id;

  var playlist = await new Playlist({
    playlist: {
      user: a.user,
      playlist_id: a.playlist_id,
      playlist_name: a.playlist_name,
      track: {
        artists: a.track.artists,
        added_at: a.track.added_at,
        track_duration: a.track.track_duration,
        track_id: a.track.track_id,
        track_name: a.track.track_name,
      },
    },
  });
  await playlist.save(function (error) {
    if (!error) {
      Playlist.find({})
        .populate("user")
        .exec(function (error, posts) {
          console.log(JSON.stringify(playlist, null, "\t"));
        });
    }
  });
})();

app.listen(3001);

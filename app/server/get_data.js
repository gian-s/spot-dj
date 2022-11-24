const express = require("express");
const fs = require("fs");
const cors = require("cors");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
require("dotenv").config();

const { parse, stringify } = require("envfile");
const { features } = require("process");

const pathToenvFile = "../.env";

require("dotenv").config({ path: pathToenvFile });
async function getPlaylist(access_token, user_id, limit, offset) {
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  });
  spotifyApi.setAccessToken(access_token);

  const res = await spotifyApi.getUserPlaylists(user_id, {
    limit: limit,
    offset: offset,
  });
  return res.body.items.map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });
}

async function getPlaylists(access_token, MAX_PLAYLISTS) {
  var ret = [];
  for (let i = 0; i < MAX_PLAYLISTS; i += 50) {
    const arr1 = await getPlaylist(
      access_token,
      process.env.REACT_APP_USER,
      50,
      i
    );
    //console.log(arr1)
    //arr1.push.apply(arr1,ret)
    //console.log(ret)
    ret.push.apply(ret, arr1);
  }
  //console.log(ret);
  return ret;
}

async function getTrackList(access_token, playlist_id, limit, offset) {
  //var ret = [];
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  });

  spotifyApi.setAccessToken(access_token);

  var tracks = await spotifyApi.getPlaylistTracks(playlist_id, {
    limit: limit,
    offset: offset,
  });
  tracks = tracks.body;

  const track_name = tracks.items.map(({ track }) => track.name);

  const added_at = tracks.items.map(({ added_at }) => added_at);

  const track_id = tracks.items.map(({ track }) => track.id);

  const track_duration = tracks.items.map(({ track }) => track.duration_ms);

  const artist_name = tracks.items.map(({ track }) => track.artists);

  const artist_arr = [];
  for (let i = 0; i < artist_name.length; i++) {
    artist_arr.push(artist_name[i].map(({ name }) => name));
  }
  var ret = {
    track_name: track_name,
    track_id: track_id,
    track_duration: track_duration,
    artists: artist_arr,
    added_at: added_at,
  };
  return ret;
}

async function allTracks(access_token, playlist_id, MAX_PLAYLISTS) {
  const features = {
    track_name: [],
    track_id: [],
    track_duration: [],
    artists: [],
    added_at: [],
  };

  for (let i = 0; i < MAX_PLAYLISTS; i += 50) {
    var iter_feat = await getTrackList(access_token, playlist_id, 50, i);
    //console.log(iter_feat);
    features.track_name = features.track_name.concat(iter_feat.track_name);
    features.track_id = features.track_id.concat(iter_feat.track_id);
    features.track_duration = features.track_duration.concat(
      iter_feat.track_duration
    );
    features.artists = features.artists.concat(iter_feat.artists);
    features.added_at = features.added_at.concat(iter_feat.added_at);
  }
  return features;
}

async function returnTracks(access_token) {
  const names = await getPlaylists(access_token, 200);
  const playlists = names.map(async (item) => {
    const tracks = await allTracks(access_token, item.id, 200);
    //console.log(tracks);
    return {
      playlist_id: item.id,
      playlist_name: item.name,
      track: tracks,
    };
  });
  return await Promise.all(playlists);
}

module.exports.returnTracks = returnTracks;

import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";

import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.REACT_APP_REDIRECT_URI,
  clientId: process.env.REACT_APP_CLIENT_ID,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
});

export default function Dashboard(code) {
  const accessToken = useAuth(code);
  const [playlists, setPlaylists] = useState([]);
  //const [tracks, setTracks] = useState({});

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const MAX_PLAYLISTS = 200;

    async function getPlaylist(user_id, limit, offset) {
      //var to_ret = [];

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

    const getPlaylists = async () => {
      var ret = [];
      for (let i = 0; i < MAX_PLAYLISTS; i += 50) {
        const arr1 = await getPlaylist(process.env.REACT_APP_USER, 50, i);
        //console.log(arr1)
        //arr1.push.apply(arr1,ret)
        //console.log(ret)
        ret.push.apply(ret, arr1);
      }

      return ret;
    };
    async function getTrackList(playlist_id, limit, offset) {
      //var ret = [];

      const tracks = await spotifyApi.getPlaylistTracks(playlist_id, {
        limit: limit,
        offset: offset,
      });

      //console.log(tracks);
      //return tracks.body.items;

      return tracks.body.items.map((item) => {
        return {
          track_id: item.track.id,
          track_name: item.track.name,
        };
      });
    }

    async function allTracks(playlist_id) {
      var ret = [];
      for (let i = 0; i < MAX_PLAYLISTS; i += 50) {
        const arr1 = await getTrackList(playlist_id, 50, i);
        //console.log(arr1)
        //arr1.push.apply(arr1,ret)
        //console.log(ret)
        ret.push.apply(ret, arr1);
      }

      return ret;
    }

    (async () => {
      const names = await getPlaylists();
      const toRet = names.map(async (item) => {
        const tmp = await allTracks(item.id);
        return {
          playlist_id: item.id,
          playlist_name: item.name,
          tracks: tmp,
        };
      });

      const total = await Promise.all(toRet);
      //console.log(total);
      //setPlaylists(names);
      setPlaylists(total);
    })();

    //memory address of where the array should be stored
    //ASYNC AWAIT
    //.then only returns when something is
    //once it gets a result then
  }, [accessToken]);

  //console.log(playlists);

  return playlists;
}

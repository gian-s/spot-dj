import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
  clientId: import.meta.env.VITE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_CLIENT_SECRET,
});

export default function Dashboard(code) {
  const accessToken = useAuth(code);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);


  useEffect(() => {
    if (!accessToken) return;

    const MAX_PLAYLISTS = 200;

    async function getPlaylist(user_id, limit, offset) {
      const res = await spotifyApi.getUserPlaylists(user_id, {
        limit: limit,
        offset: offset,
      });

      return res.body.items.filter((item) => {
        if(item.name.slice(0,7) === 'spot-dj'){
          console.log(item.name);
          return {
            id: item.id,
            name: item.name,
          };
        }
      });
      
    }

    const getPlaylists = async () => {
      const ret = await getPlaylist(import.meta.env.VITE_USER, 50, 0);

      return ret;
    };

    async function getTrackList(playlist_id, limit, offset) {
      //var ret = [];
      const tracks = await spotifyApi.getPlaylistTracks(playlist_id, {
        limit: limit,
        offset: offset,
      });
      console.log(tracks);
      return tracks.body.items.map(async (item) => {
        try {
          const audio_feature = await spotifyApi.getAudioFeaturesForTrack(item.track.id);
          
        return {
          track_id: item.track.id,
          track_name: item.track.name,
          track_tempo: audio_feature.body.tempo,
          track_key: audio_feature.body.key
        };
        } catch (error) {
          const audio_feature = {body:{tempo:-1,key:-1}}
        return {
          track_id: item.track.id,
          track_name: item.track.name,
          track_tempo: audio_feature.body.tempo,
          track_key: audio_feature.body.key
        };
        }
      });
    }
    async function allTracks(playlist_id) {
      var ret = [];
      for (let i = 0; i < MAX_PLAYLISTS; i += 50) {
        var arr1 = await getTrackList(playlist_id, 50, i);
        ret.push.apply(ret, arr1);
      }
      return Promise.all(ret);
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
      console.log(total);
      setPlaylists(total);
    })();
  }, [accessToken]);
  return playlists;
}

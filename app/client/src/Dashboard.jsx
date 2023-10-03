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

  const pitch = {
    'minor':{
      0:'8B',
      1:'3B',
      2:'10B',
      3:'5B',
      4:'12B',
      5:'7B',
      6:'2B',
      7:'9B',
      8:'4B',
      9:'11B',
      10:'6B',
      11:'1B',
    },
    'major': {
      //major key
      0: '5A',
      1: '12A',
      2: '7A',
      3: '2A',
      4: '9A',
      5: '4A',
      6: '11A',
      7: '6A',
      8: '1A',
      9: '8A',
      10: '3A',
      11: '10A'
    }
  }


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
      //console.log(tracks);
      return tracks.body.items.map(async (item) => {
        try {
          const audio_feature = await spotifyApi.getAudioFeaturesForTrack(item.track.id);


          
        return {
          track_id: item.track.id,
          track_name: item.track.name,
          track_tempo: audio_feature.body.tempo,
          track_key:audio_feature.body.mode?pitch.major[audio_feature.body.key]:pitch.minor[audio_feature.body.key],
          track_energy:audio_feature.body.energy
        };

        
        } catch (error) {
          const audio_feature = {body:{tempo:-1,key:-1,energy:-1}}
        return {
          track_id: item.track.id,
          track_name: item.track.name,
          track_tempo: audio_feature.body.tempo,
          track_key: audio_feature.key,
          track_energy: audio_feature.energy
        }
    }});
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





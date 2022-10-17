import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.REACT_APP_REDIRECT_URI,
  clientId: process.env.REACT_APP_CLIENT_ID,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
});

export default function Dashboard({ code }) {
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

    (async () => {
      var ret = [];
      for (let i = 0; i < MAX_PLAYLISTS; i += 50) {
        const arr1 = await getPlaylist(process.env.REACT_APP_USER, 50, i);
        //console.log(arr1)
        //arr1.push.apply(arr1,ret)
        //console.log(ret)
        ret.push.apply(ret, arr1);
      }

      setPlaylists(ret);
    })();
    //memory address of where the array should be stored
    //ASYNC AWAIT
    //.then only returns when something is
    //once it gets a result then
  }, [accessToken]);

  return (
    <div>
      {playlists.map((item) => {
        return <pre> {JSON.stringify(item)} </pre>;
      })}
    </div>
  );
}

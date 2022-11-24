const fs = require("fs");

function test_dates() {
  const ayo = fs.readFile("response.json", (err, data) => {
    if (err) throw err;
    const tracks = JSON.parse(data);
    //console.log(tracks);

    function get_dates(tracks) {
      //const dates = [];
      const track_name = tracks.items.map(({ track }) => track.name);
      const added_at = tracks.items.map(({ added_at }) => added_at);
      const track_id = tracks.items.map(({ track }) => track.id);
      const track_duration = tracks.items.map(({ track }) => track.duration_ms);
      const artist_name = tracks.items.map(({ track }) => track.artists);
      const artist_arr = [];
      for (let i = 0; i < artist_name.length; i++) {
        artist_arr.push(artist_name[i].map(({ name }) => name));
      }

      return {
        track_name: track_name,
        track_id: track_id,
        track_duration: track_duration,
        artists: artist_arr,
        added_at: added_at,
      };
    }

    let ret = get_dates(tracks);

    console.log(ret);
  });
  return ayo;
}

const ret = test_dates();

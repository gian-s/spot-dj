const mongoose = require("mongoose");

const playlistSchema = mongoose.Schema({
  playlist: {
    user: String,
    playlist_id: String,
    playlist_name: String,
    track: {
      artists: [[String]],
      added_at: [String],
      track_duration: [Number],
      track_id: [String],
      track_name: [String],
    },
    audio_features: [
      {
        danceability: Number,
        energy: Number,
        key: Number,
        loudness: Number,
        mode: Number,
        speechiness: Number,
        acousticness: Number,
        instrumentalness: Number,
        liveness: Number,
        valence: Number,
        tempo: Number,
        id: String,
        duration_ms: Number,
        time_signature: Number,
      },
    ],
  },
});

module.exports = mongoose.model("Playlist", playlistSchema);

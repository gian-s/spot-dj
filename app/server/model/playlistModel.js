const mongoose = require("mongoose");

const goalSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  playlist: {
    playlist_id: String,
    playlist_name: String,
    track: {
      added_at: [String],
      artists: [[String]],
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
          type: String,
          id: String,
          uri: String,
          track_href: String,
          analysis_url: String,
          duration_ms: Number,
          time_signature: Number,
        },
      ],
      track_duration: [Number],
      track_id: [String],
      track_name: [String],
    },
  },
});

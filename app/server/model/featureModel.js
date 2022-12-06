const mongoose = require("mongoose");

const featureSchema = mongoose.Schema({
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
  },

  audio_features: {
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
});

module.exports = mongoose.model("Feature", featureSchema);

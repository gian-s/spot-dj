const mongoose = require("mongoose");

const playlistSchema = mongoose.Schema({
  playlist: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    playlist_id: String,
    playlist_name: String,

    tracks: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
    },

    added_at: [String],
  },
});

module.exports = mongoose.model("Playlist", playlistSchema);

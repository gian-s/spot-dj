const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  user_id: String,
  user_access_token: String,
  user_refresh_token: String,
});

module.exports = mongoose.model("User", userSchema);

// in user.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  email: {
    type: String,
    index: true
  }
});

module.exports = mongoose.model("User", UserSchema);
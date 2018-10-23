// in user.js
const uniqueValidator = require("mongoose-unique-validator");

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true
  },
  email: {
    type: String,
    index: true,
    unique: true
  }
});

UserSchema.plugin(uniqueValidator, { message: "should be unique" });

module.exports = mongoose.model("User", UserSchema);

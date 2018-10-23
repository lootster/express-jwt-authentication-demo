// in user.js
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: true,
    lowercase: true
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    lowercase: true
  },
  passwordHash: String,
  passwordSalt: String
});

UserSchema.methods.validPassword = function(password) {
  return this.passwordHash === hashPassword(password, this.passwordSalt);
};

UserSchema.methods.setPassword = function(password) {
  this.passwordSalt = generateSalt();
  this.passwordHash = hashPassword(password, this.passwordSalt);
};

function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");
}

UserSchema.plugin(uniqueValidator, { message: "should be unique" });

module.exports = mongoose.model("User", UserSchema);

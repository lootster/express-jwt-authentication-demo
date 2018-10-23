// in user.js
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { secret } = require("../../config/jwt");

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

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      userid: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
};

UserSchema.methods.verifyJWT = function(token) {
  try {
    jwt.verify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
};

UserSchema.plugin(uniqueValidator, { message: "should be unique" });

module.exports = mongoose.model("User", UserSchema);

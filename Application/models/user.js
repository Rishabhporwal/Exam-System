const mongoose = require("mongoose");
const schema = mongoose.Schema;
const crypto = require("crypto");

// candidate Schema
const userSchema = new schema(
  {
    name: {
      type: String,
      trim: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
    },
    salt: String,
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Virtual Fields
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword; // true false
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports = mongoose.model("users", userSchema);

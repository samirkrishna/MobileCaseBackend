const mongoose = require("mongoose");
const crypto = require("crypto");
import { v4 as uuidv4 } from "uuid";

var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastName: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    userInfo: {
      type: String,
      trim: true,
    },
    encryPassword: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (plainPassword) {
    this._password = plainPassword;
    this.salt = uuidv4();
    this.encryPassword = securePassword(plainPassword);
  })
  .get(function () {
    return this._password;
  });

userSchema.method({
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.encryPassword;
  },
  securePassword: function (plainPassword) {
    if (!plainPassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
});

module.exports = mongoose.model("User", userSchema);

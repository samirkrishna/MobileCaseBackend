var mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv1 } = require('uuid');

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    userinfo: {
      type: String,
      trim: true
    },
    encry_password: {
      type: String,
      required: true
    },
    salt: String,
    role: {
      type: Number,
      default: 0
    },
    purchases: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  authenticate: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function(plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");
// const crypto = require("crypto");
// const { v4: uuidv4 } = require('uuid');

// var userSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//       maxlength: 32,
//       trim: true,
//     },
//     lastName: {
//       type: String,
//       maxlength: 32,
//       trim: true,
//     },
//     email: {
//       type: String,
//       trim: true,
//       required: true,
//       unique: true,
//     },
//     userInfo: {
//       type: String,
//       trim: true,
//     },
//     encryPassword: {
//       type: String,
//       required: true,
//     },
//     salt: String,
//     role: {
//       type: Number,
//       default: 0,
//     },
//     purchases: {
//       type: Array,
//       default: [],
//     },
//   },
//   { timestamps: true }
// );

// userSchema
//   .virtual("password")
//   .set(function(plainPassword) {
//     this._password = plainPassword;
//     this.salt = uuidv4();
//     this.encryPassword = this.securePassword(plainPassword);
//   })
//   .get(function(){
//     return this._password;
//   });

// userSchema.methods = {
//   authenticate: function(plainPassword) {
//     console.log(plainPassword+" ss "+this.encryPassword)
//     return this.securePassword(plainPassword) === this.encryPassword;
//   },
//   securePassword: function (plainPassword) {
//     if (!plainPassword) return "";
//     try {
//       return crypto
//         .createHmac("sha256", this.salt)
//         .update(plainPassword)
//         .digest("hex");
//     } catch (err) {
//       return "";
//     }
//   }
// };

// module.exports = mongoose.model("User", userSchema);

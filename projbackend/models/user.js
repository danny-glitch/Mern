

var mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

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

/*
    ___________
               
               VIRTUALS    [ https://mongoosejs.com/docs/tutorials/virtuals.html ]
    ____________
    * they are not stored in the database 
    * used for computed properties on documents
    * they have getters and setters for computing properties 
    
*/


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
/* 
 Methods in Mongoose  :  https://mongoosejs.com/docs/2.7.x/docs/methods-statics.html
 
*/

  userSchema.methods = {
    autheticate: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },
/*        
   https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
   https://www.reddit.com/r/node/comments/hnjohu/password_usecase_with_expressjs_crypto_module/
   password hasing in express js 
   https://www.geeksforgeeks.org/node-js-password-hashing-crypto-module/
*/
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

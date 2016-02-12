var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  _id: Number,
  username: String,
  password: String
});

userSchema.methods.initialize = function () {
  this.on('creating', this.hashPassword);
};


userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword= function() {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.get('password'), null, null).bind(this)
    .then(function(hash) {
      this.set('password', hash);
    });
};

var User = mongoose.model("User", userSchema);

module.exports = User;

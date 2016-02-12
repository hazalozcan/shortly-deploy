var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Promise = require('bluebird');

var userSchema = mongoose.Schema({
  _id: Number,
  username: String,
  password: String
});

userSchema.methods.initialize = function (callback) {
  this.hashPassword(callback);
};


userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    console.log('attempted:', attemptedPassword, 'compared against', this.password);
    callback(isMatch);
  }.bind(this));
};

userSchema.methods.hashPassword= function(callback) {
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      callback();
    });
};

var User = mongoose.model("User", userSchema);

module.exports = User;

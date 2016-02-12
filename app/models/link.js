var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var linkSchema = mongoose.Schema({
  _id: Number,
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number
});

linkSchema.methods.initialize = function() {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
};

var Link = mongoose.model("Link", linkSchema);

module.exports = Link;

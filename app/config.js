var path = require('path');
// var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

var url = 'mongodb://127.0.0.1';
mongoose.connect(url);
// var assert = require('assert');

// MongoClient.connect(url, function (err, db) {
//   assert.equal(null, err);
//   console.log("You have successfully become friends with Kevin");
//   db.close();
// });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("You have successfully become friends with Kevin");
});




module.exports = db;

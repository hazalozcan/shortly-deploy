var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Links.reset(function(err, links) {
    if(err) {
      console.error(err);
    }
    res.send(200, links.models);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({ url: uri }, function(err, link) {
    if(err) {
      console.error(err);
    } else if (link.length) {
      console.log('FOUND YO LINK! ITS RIGHT HURRR:', link);
      res.send(200, link.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = new Link({
          _id: Math.floor(Math.random() * 10000000000),
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newLink.save(function(err, newLink) {
          if(err) {
            console.error(err);
          }
          // Links.add(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
    if(err) {
      console.error(err);
    } if (!user) {
        res.redirect('/login');
      } else {
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username: username }, function(err, user) {
      if(err) {
        console.error(err);
      }
      if (!user) {
        var newUser = new User({
          _id: Math.floor(Math.random() * 10000000000),
          username: username,
          password: password
        });
        newUser.save(function(err, newUser) {
          if(err) {
            console.error(err);
          }
          // Users.add(newUser);
          util.createSession(req, res, newUser);
        });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function(err, link) {
    if(err) {
      console.error(err);
    } if (!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&:",link, link.vists, link.save);
      link.save(function(err) {
        if(err) {
          console.error(err);
        }
        console.log('FDDFDFDFDFDFDFDFDFDFDFDFDFDFD',link.url);
        return res.redirect(link.url);
      });
    }
  });
};
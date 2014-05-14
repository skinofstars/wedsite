'use strict';

var User  = require('./user.schema'),
    _     = require('lodash'),
    utils = require('../config/utils'),
    users = {}; // bit hacky, sticking it here so i can update it in User.find()

exports.show = function(req, res) {
  var user  = req.user;

  // find the group members
  User.find({group:user.group}, function(err, rels) {
    users = rels;
  });

  // bit of security cleanup
  user.password = '';
  users = _.map(users, function(u) { u.password = ''; return u })

  // determine response
  if (utils.reqIsXhr(req)) {
    res.send(200, { user: user, users: users })
  } else {
    res.render('rsvp', {
      user : user
    });
  }
}

exports.update = function(req, res) {

  // if req includes multiple users
  //   lookup all family users
  // else
  //   update single user

  // User.findOne({ '_id' :  req.user._id }, function(err, user) {
  //   console.log('rsvp user', user)
  // });

  var user = req.user;
  var message = null;

  if (user) {
    // user = _.extend(user, req.body)
    user.rsvp = _.extend(user.rsvp, req.body);
    user.updated = Date.now();

    user.save(function(err) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        console.log('rsvp saved')
        req.login(user, function(err) {
          if (err) {
            res.send(400, err);
          } else {
            res.jsonp(user);
          }
        });
      }
    });

  } else {
    res.send(400, {
      message: 'User is not signed in'
    });
  }

}

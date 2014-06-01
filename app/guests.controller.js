'use strict';

var mongoose  = require('mongoose'),
    User      = require('./user.schema'),
    _         = require('lodash'),
    utils     = require('../config/utils');

exports.list = function(req, res) {

  // find all admin users
  User.find({ isAdmin: true }, function(err, users) {

    // if there aren't any admins.
    //   show create
    if (users.length === 0) {
      res.render('create.ejs', { message: req.flash('createMessage') });
    } else {

      // otherwise, we have an admin, so let's do our normal shit
      isAdmin(req, res, function() {

        // load all users
        User.find({}, function(err, users) {
          if (utils.reqIsXhr(req)) {
            res.send(200, {users: users});
          } else {
            res.render('create.ejs', { message: req.flash('createMessage'), users: users });
          }
        });

      });

    }
  });

};

exports.create = function(req, res) {

};

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    // FIXME this kinda assumes they passed in the req.user object right
    // DON@T HAX MAI WEDDIN!!1!
    return next();
  }
  res.redirect('/');
}

'use strict';

var User  = require('./user.schema'),
    _     = require('lodash'),
    utils = require('../config/utils'),
    groupies;

exports.show = function(req, res) {
  var user  = req.user;
  user.password = '';

  // find the group members
  User.find({group:user.group}, function(err, records) {
    // TODO: remove =current user from group
    var users = cleanUsers(records);

    // determine response
    if (utils.reqIsXhr(req)) {
      res.send(200, { user: user, users: users });
    } else {
      res.render('rsvp', {
        user : user
      });
    }

  });

};


exports.update = function(req, res) {

  var user = req.user;
  var message = null;

  // checks we're logged in
  if (user) {

    // submitted users
    groupies = req.body;

    User.find({ group : user.group }, function (err, records) {

      // iterate through db returned records
      _.forEach(records, function(record) {
        // find the groupy that matches the record
        var groupy = _.where(groupies, { username : record.username })[0];
        if (typeof groupy !== "undefined") {
          record.rsvp = _.extend(record.rsvp, groupy.rsvp);
          record.updated = Date.now();
          record.save();
        }
      });

      // tidy and respond with set
      var users = cleanUsers(records);
      res.send(200, { users: users, message: "RSVP updated" });

    });


  } else {
    res.send(400, { message: 'User is not signed in' });
  }

};


var cleanUsers = function(users) {
  var users = _.map(users, function(u) {

    // convert to a normal object, so we can more freely manipulate it
    u = u.toObject();
    u.password = '';

    // remove invite options here rather than doing checks in the view
    for (var key in u.invite) {
      switch (key) {
        case 'ceremony':
        case 'reception':
        case 'party':
          if (u.invite[key] === false)
            delete u.invite[key];
          break;
      }
    }

    return u;
  });

  return users;
}

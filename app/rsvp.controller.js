'use strict';

var User  = require('./user.schema'),
    _     = require('lodash'),
    utils = require('../config/utils'),
    users = {}, // bit hacky, sticking it here so i can update it in User.find()
    groupies;

exports.show = function(req, res) {
  var user  = req.user;

  // find the group members
  User.find({group:user.group}, function(err, rels) {
    // TODO: remove =current user from group
    users = rels;
  });

  // bit of security cleanup
  user.password = '';
  users = _.map(users, function(u) {

    // convert to a normal object, so we can more freely manipulate it
    u = u.toObject();

    u.password = '';

    // remove invite options here rather than doing checks in the view
    for (var key in u.invite) {
      switch (key) {
        case 'ceremony':
        case 'reception':
        case 'party':
          if (u.invite[key] == false)
            delete u.invite[key];
          break;
      }
    }

    return u
  })

  // determine response
  if (utils.reqIsXhr(req)) {
    res.send(200, { user: user, users: users });
  } else {
    res.render('rsvp', {
      user : user
    });
  }
}


exports.update = function(req, res) {

  var user = req.user;
  var message = null;

  // checks we're logged in
  if (user) {

    groupies = req.body

    // get users from db
    User.find().where('_id').in(_.pluck(groupies, '_id')).exec(function (err, records) {
      users = records;

      // update each user
      for (var i in users) {

        // console.log('user._id', users[i]._id)

        // double check using right groupy to merge with
        var groupy = _.where(groupies, {username: users[i].username})[0];

        users[i].rsvp = _.extend(users[i].rsvp, groupy.rsvp);
        users[i].updated = Date.now();
        users[i].save(function(err) {
          if (err) {
            console.log(err);
            res.send(400, {
              message: "error saving user"
            });
          }
        });

        // clear the password as we're going to return this user
        users[i].password = '';
      }

      res.send(200, { user: user, users: users });
    });

  } else {
    res.send(400, {
      message: 'User is not signed in'
    });
  }

}

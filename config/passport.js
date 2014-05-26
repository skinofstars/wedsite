'use strict';

var LocalStrategy = require('passport-local').Strategy;
var User          = require('../app/user.schema');
var utils         = require('./utils');

module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  // we are using named strategies since we have one for login and one for create
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-create', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, username, password, done) {
    console.log('create user '+username)
    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

      // we are checking to see if the user already exists
      User.findOne({ 'username' :  username }, function(err, user) {
        // if there are any errors, return the error
        if (err) {
          return done(err);
        }

        // check to see if theres already a user with that username
        if (user) {
          return done(null, false, req.flash('createMessage', 'That username is already taken.'));
        } else {

          // if there is no user with that username
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.username = username;
          newUser.password = newUser.generateHash(password);

          if (req.body.email.length > 0) {
            newUser.email = req.body.email;
          }

          newUser.group = req.body.group;
          newUser.isAdmin = utils.checkToBool(req.body.isAdmin);

          newUser.invite.ceremony   = utils.checkToBool(req.body.ceremony)
          newUser.invite.reception  = utils.checkToBool(req.body.reception)
          newUser.invite.party      = utils.checkToBool(req.body.party)

          // save the user
          newUser.save(function(err) {
              if (err)
                  throw err;
              return done(null, null);
          });
        }

      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) { // callback with username and password from our form

    console.log('signin '+username)

    // find a user whose username is the same as the forms username
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'username' :  username }, function(err, user) {
      // if there are any errors, return the error before anything else
      if (err) {
        console.log('err')
        return done(err);
      }

      // if no user is found, return the message
      if (!user) {
        console.log('!user')
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
      }

      // if the user is found but the password is wrong
      if (!user.validPassword(password)) {
        console.log('!pass')
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
      }

      // all is well, return successful user
      return done(null, user);
    });



  }));

};

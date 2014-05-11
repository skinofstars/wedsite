'use strict';

var rsvpcontroller    = require('./rsvp.controller'),
    guestscontroller  = require('./guests.controller');

module.exports = function(app, passport) {

  // # public pages

  // basic landing page
  app.get('/', function(req, res) {
    res.render('index.ejs', {
      message: req.flash('message')
    })
  });


  // # authorised user pages

  // login: POST
  // app.post('/signin', do all our passport stuff here);
  app.post('/signin', passport.authenticate('local-login', {
    successRedirect : '/rsvp',
    failureRedirect : '/',
    failureFlash : true
  }));

  // rsvp: PUT
  // rsvp self
  // rsvp family

  app.get('/rsvp', isLoggedIn, function(req, res) {
    rsvpcontroller.show(req, res);
  });

  app.post('/rsvp', isLoggedIn, function(req, res) {
    rsvpcontroller.update(req, res);
  });


  // for creating and listing
  app.get('/create', function(req, res) {
    guestscontroller.list(req, res);
  });

  // process the create form
  app.post('/create', passport.authenticate('local-create', {
    successRedirect : '/rsvp',
    failureRedirect : '/create',
    failureFlash : true
  }));

  // our bank details for gifting
  // btc wallet, for lulz

  // logout
  app.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // # admin page
  // rsvp list

}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

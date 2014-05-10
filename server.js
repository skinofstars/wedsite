'use strict';

var express  = require('express'),
    app      = express(),
    port     = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash    = require('connect-flash'),
    partials = require('express-partials'),
    config   = require('./config/config.js');

var db       = require('./config/database.js')(mongoose, config.db);

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

  app.use(express.logger('dev')); // log requests
  app.use(express.cookieParser()); // nom nom cookies

  app.use(express.json());
  app.use(express.urlencoded());

  app.use(partials());
  app.set('view engine', 'ejs');

  // required for passport
  app.use(express.session({ secret: 'c38218d0e08be83b88e14bf6075414cc' }));
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions

  app.use(flash());

});

var routes = require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Listening on port ' + port);

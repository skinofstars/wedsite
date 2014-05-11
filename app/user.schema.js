'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs');


var rsvpConcerns = {
  ceremony: {
    type: Boolean,
    default: false
  },
  reception: {
    type: Boolean,
    default: false
  },
  party: {
    type: Boolean,
    default: false
  }
}

var userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    trim: true,
    default: '',
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    default: '',
  },
  salt: {
    type: String
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  invite: rsvpConcerns,
  rsvp: rsvpConcerns,
  isAdmin: {
    type: Boolean,
    default: false
  },
  group: {
    type: String
  }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

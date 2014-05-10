'use strict';

module.exports = function(mongoose, config) {

  mongoose.connect('mongodb://'+config.db_host+'/'+config.db_name);
  var db = mongoose.connection;

  db.on('error', function callback () {
    console.log("Connection error");
  });

  db.once('open', function callback () {
    console.log("Mongo working!");
  });

}

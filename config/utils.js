'use strict';

exports.stringToBoolean = function(string) {
  switch(string.toLowerCase()){
    case "true": case "yes": case "1": return true;
    case "false": case "no": case "0": case null: case undefined: return false;
    default: return Boolean(string);
  }
};

exports.checkToBool = function(val) {
  return (val !== undefined);
};

// this is pretty hacky!
// angular don't send no XHR header, so figure it from Content-type:
exports.reqIsXhr = function(req) {
  return /application\/json/.test(req.get('accept'));
};

'use strict';

angular.module('Towed', ['ngResource']);

function RsvpCtrl($scope, $resource) {
  $scope.foo = "foo!";

  window.deb = $scope.rsvp = $resource('/rsvp');

  console.log($scope.rsvp.get())

  // get invite data

  // load for user and related users

  // on save, return data
    // update success

}

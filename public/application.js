'use strict';

angular.module('Towed', ['ngResource']);

function RsvpCtrl($scope, $resource) {
  $scope.asyncData = $resource('/rsvp');

  $scope.asyncData.get(function(a,b) {
    // user is the logged in
    // users are those relatedby group
    $scope.user   = a.user;
    $scope.users  = a.users;
  });

  // get invite data

  // on save, return data
    // update success

}

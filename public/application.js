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

  $scope.update = function(users) {
    $scope.master = angular.copy(users);
    $scope.asyncData.save(users);
  };

  $scope.isUnchanged = function(users) {
    return angular.equals(users, $scope.master);
  };

}

function SigninCtrl($scope, $resource) {
  $scope.signinResource = $resource('/signin');
  $scope.signoutResource = $resource('/signout');

  $scope.signin = function(user) {
    $scope.signin.save(a, b)
  }

}

'use strict';

angular.module('Towed', ['ngResource']);

function RsvpCtrl($scope, $resource, $http) {
  $scope.rsvpResource     = $resource('/rsvp');
  $scope.signinResource   = $resource('/signin');
  $scope.signoutResource  = $resource('/signout');

  $scope.users;

  $scope.rsvpResource.get(function(a,b) {
    // user is the logged in
    // users are those relatedby group
    $scope.user   = a.user;
    $scope.users  = a.users;
  });

  $scope.update = function(users) {
    $scope.master = angular.copy(users);
    $scope.rsvpResource.save(users, function(res) {
      console.log('yooyoyoy', res);
      $scope.users = res.users;
    });
  };

  $scope.isUnchanged = function(users) {
    return angular.equals(users, $scope.master);
  };


  $scope.signin = function(user) {
    $http.post('/signin', user).
      success(function(data, status, headers, config) {
        $scope.users = data.users;
      }).
      error(function(data, status, headers, config) {

      });

  }

}

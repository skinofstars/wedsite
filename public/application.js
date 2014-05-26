'use strict';

angular.module('Towed', ['ngResource']);

function RsvpCtrl($scope, $resource, $http) {
  $scope.rsvpResource     = $resource('/rsvp');
  $scope.signinResource   = $resource('/signin');
  $scope.signoutResource  = $resource('/signout');

  // state
  // 0 = new visit
  // 1 = request login
  // 2 = logged in
  $scope.state = 0;

  $scope.users;

  $scope.rsvpGet = function(){
    $scope.rsvpResource.get(function(a,b) {
      // user is the logged in
      // users are those relatedby group
      $scope.user   = a.user;
      $scope.users  = a.users;

      if (typeof $scope.users !== "undefined") {
        $scope.state = 2;
      }
    });
  }

  // try on first load
  $scope.rsvpGet();

  $scope.showSigninForm = function() {
    $scope.state = 1;
  }

  $scope.update = function(users) {
    $scope.master = angular.copy(users);
    $scope.rsvpResource.save(users, function(res) {
      return $scope.users = res.users;
    });
  };

  $scope.isUnchanged = function(users) {
    return angular.equals(users, $scope.master);
  };


  $scope.signin = function(user) {
    $http.post('/signin', user).
      success(function(data, status, headers, config) {
        $scope.state = 2;
        $scope.rsvpGet();
      }).
      error(function(data, status, headers, config) {

      });
  }

}

L.mapbox.map('map', 'skinofstars.ibhbkgn1').setView([51.681, -1.13], 16);

'use strict';

angular.module('Towed', ['ngResource', 'angularMoment']);

var userState = 0;

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

// check for map element before adding to page
var mapElem = document.getElementById('map');
if (mapElem !== null) {
  L.mapbox.map('map', 'skinofstars.ibhbkgn1').setView([51.681, -1.13], 16);
}

String.prototype.capitalise = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

// make time pretty.
// this is only really useful for the create listing. use angular-moment for rsvp
var nodeList = document.querySelectorAll('.time'),
    then;
for (var i = 0, length = nodeList.length; i < length; i++) {
  then = moment(nodeList[i].innerHTML);

  if (then.isValid()) {
    nodeList[i].innerHTML = then.fromNow().capitalise();
  }
}


'use strict';

/**
 * @ngdoc function
 * @name leagueApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the leagueApp
 */
angular.module('leagueApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

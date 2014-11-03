'use strict';

/**
 * @ngdoc function
 * @name leagueApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the leagueApp
 */
var summonerId;
var apiKey = '85df569c-14df-466c-966b-81f186ed0940';
var gameInfo;

angular.module('leagueApp')
  .controller('MainCtrl', function ($scope, $http) {
  	$scope.apiCall = function() {
		console.log($scope.summonerName)
		$http.get('https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + $scope.summonerName + '?api_key=' + apiKey).
		success (function(json) {
			var summonerNameMinusSpaces = $scope.summonerName.replace(" ", "");
			summonerNameMinusSpaces = summonerNameMinusSpaces.toLowerCase().trim();
			summonerId = json[summonerNameMinusSpaces].id;
			console.log(summonerId);
			$scope.matchLookUp();


		}).
		error (function() {
			alert('not ok');

			})
		};

	$scope.matchLookUp = function() {
		$http.get('https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/' + summonerId + '/recent' + '?api_key=' + apiKey).
		success (function(json) {
			gameInfo = json.games;
			$scope.gameInfo = gameInfo;
		}).
		error (function() {
			alert('not ok');
		})
	};




  });

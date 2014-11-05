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
var champNames = [];
var champImages = [];
var spellNames = [];
var spellImages = [];


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
			console.log($scope.gameInfo);
			$scope.championIdNameMap(gameInfo);
			$scope.spellIdNameMap(gameInfo);
		}).
		error (function() {
			alert('not ok');
		})
	};

	$scope.championIdNameMap = function(data) {
		for (var i = 0; i < 10; i++) {
        	champNames[i] = champSelect(data[i].championId);
        	$scope.gameInfo[i].champNames = champNames[i];
        	champImages[i] = '/images/champion/' + champNames[i] + '.png'
        	$scope.gameInfo[i].champImages = champImages[i];
        	console.log($scope.gameInfo[i].champImages);
        }
	};

	$scope.spellIdNameMap = function(data) {
		for (var i = 0; i < 10; i++) {
			spellNames[i] = [spellSelect(data[i].spell1), spellSelect(data[i].spell2)];
			$scope.gameInfo[i].spellNames = spellNames[i];
			spellImages[i] = ['/images/spells/' + spellNames[i][0] + '.png' , '/images/spells/' + spellNames[i][1] + '.png']
			$scope.gameInfo[i].spellImages = spellImages[i];
		}
	}




  });

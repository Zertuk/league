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
var teamColor = [];
var teamChamps = [];
var teamNames = [];
var enemyChamps = [];
var itemInfo = [];
var testingHere;
var statInfo = [];
var leagueInfo = [];


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
			$scope.teamColor(gameInfo);
			$scope.itemFix(gameInfo);
			$scope.teamChampMap(gameInfo);
			$scope.statLookUp();
			$scope.leagueLookUp();
		}).
		error (function() {
			alert('not ok');
		})
	};

	$scope.statLookUp = function() {
		$http.get('https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/' + summonerId + '/ranked?season=SEASON4&api_key=' + apiKey).
		success (function(json) {
			statInfo = json;
			var i = 0;
			while (statInfo.champions[i].id != undefined) {
				i = i + 1;
				if (statInfo.champions[i] === undefined) {
					statInfo.champions[0].champName = champSelect(statInfo.champions[0].id);
					$scope.gameInfo.statInfo = statInfo;
					return;
				}
				else {
				statInfo.champions[i].champName = champSelect(statInfo.champions[i].id);
				
				}
			}
			

		}).
		error (function() {
			alert('not ok');
		})
	}

	$scope.leagueLookUp = function() {
		$http.get('https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/' + summonerId + '/entry?api_key=' + apiKey).
		success (function(json) {
			leagueInfo = json[summonerId];
			$scope.gameInfo[0].leagueInfo = leagueInfo;

		}).
		error (function() {
			alert('not ok');
		})
	}

	$scope.championIdNameMap = function(data) {
		for (var i = 0; i < 10; i++) {
			// for (var j = 0; j < 10; j++) {
   //      		teamChamps[i] = data[i].fellowPlayers[j].championId;
   //      	}
        	champNames[i] = champSelect(data[i].championId);
        	$scope.gameInfo[i].champNames = champNames[i];
        	champImages[i] = '/images/champion/' + champNames[i] + '.png'
        	$scope.gameInfo[i].champImages = champImages[i];
        	console.log($scope.gameInfo[i].champImages);
	       	$scope.gameInfo[i].toolTip = '<div class = "itemToolTip"><p class = "itemName">{{itemInfo.name}}</p><p class = "itemDescription" ng-bind-html = "itemInfo.description"></p><p class = "itemText">{{itemInfo.plaintext}}</p></div>';
       	       	
        }
	};

	$scope.spellIdNameMap = function(data) {
		for (var i = 0; i < 10; i++) {
			spellNames[i] = [spellSelect(data[i].spell1), spellSelect(data[i].spell2)];
			$scope.gameInfo[i].spellNames = spellNames[i];
			spellImages[i] = ['/images/spells/' + spellNames[i][0] + '.png' , '/images/spells/' + spellNames[i][1] + '.png']
			$scope.gameInfo[i].spellImages = spellImages[i];
			$scope.gameInfo[i].itemName = "/images/item/" + data[i].stats.item0 + ".png";
		}
	}
	$scope.teamChampMap = function(data) {
		for (var j = 0; j < 10; j++) {
			teamChamps[0] = champSelect(data[j].championId);
			var k = 1;
			var l = 0;
			for (var i = 0; i < 9; i++) {
				if (data[j].fellowPlayers[i] == undefined) {
        			console.log('done')
        		}
        		else {
					if (data[j].fellowPlayers[i].teamId == data[j].teamId) {
						teamChamps[k] = champSelect(data[j].fellowPlayers[i].championId);
						k++;
					}
					else {
						enemyChamps[l] = champSelect(data[j].fellowPlayers[i].championId);
						l++;
					}
				}
				data[j].fellowPlayers.teamChamps = teamChamps;
				data[j].fellowPlayers.enemyChamps = enemyChamps;
			}
			enemyChamps = [];
			teamChamps = [];
		}
	}
	$scope.teamColor = function(data) {
		for (var i = 0; i < 10; i++) {
			if (data[i].stats.win != true) {
				teamColor[i] = '#f9bcbc';
			}
			else {
				teamColor[i] = '#bddfeb';
			}

			$scope.gameInfo[i].color = teamColor[i];
		}
	}
	$scope.itemFix = function(data) {
		for (var i = 0; i < 10; i++) {
			if (data[i].stats.item0 == undefined) {
				data[i].stats.item0 = 'empty';
			}
			if (data[i].stats.item1 == undefined) {
				data[i].stats.item1 = 'empty';
			}
			if (data[i].stats.item2 == undefined) {
				data[i].stats.item2 = 'empty';
			}
			if (data[i].stats.item3 == undefined) {
				data[i].stats.item3 = 'empty';
			}
			if (data[i].stats.item4 == undefined) {
				data[i].stats.item4 = 'empty';
			}
			if (data[i].stats.item5 == undefined) {
				data[i].stats.item5 = 'empty';
			}
			if (data[i].stats.item6 == undefined) {
				data[i].stats.item6 = 'empty';
			}
			console.log(data[i].stats.item5)
		}
	}
	$scope.itemHover = function(item) {
		if (item == 'empty') {
			return;
		}
		$http.get('https://na.api.pvp.net/api/lol/static-data/na/v1.2/item/' + item + '?api_key=' + apiKey).
		success (function(json) {
			console.log(json);
			itemInfo = json;
			$scope.itemInfo = itemInfo;
		}).
		error (function() {
			alert('not ok');
		})
	}
	$scope.itemLeave = function() {
		// itemInfo = [];
		// $scope.itemInfo = itemInfo;
		console.log('OK');
	}
  });

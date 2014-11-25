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
var enemyChamps = [];
var itemInfo = [];
var statInfo = [];
var leagueInfo = [];
var killAverage;
var csAverage;
var assistAverage;
var deathAverage;
var test;
var arr = new Array;


angular.module('leagueApp')
  .controller('MainCtrl', function ($scope, $http) {
  	//api call for the summoner id by name, changes summoner name to not include spaces to prevent errors
  	//runs matchLookUp api call to continue
  	$scope.apiCall = function() {
		console.log($scope.summonerName);
		$http.get('https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + $scope.summonerName + '?api_key=' + apiKey).
		success (function(json) {
			var summonerNameMinusSpaces = $scope.summonerName.replace(' ', '');
			summonerNameMinusSpaces = summonerNameMinusSpaces.toLowerCase().trim();
			summonerId = json[summonerNameMinusSpaces].id;
			console.log(summonerId);
			$scope.matchLookUp();


		}).
		error (function() {
			alert('Summoner Name not Found(Supports NA Only)');
			});
		};

	//api call for match look up using summoner Id, also runs a mass function call for all information extracted from gameInfo and runs other api calls
	$scope.matchLookUp = function() {
		$http.get('https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/' + summonerId + '/recent' + '?api_key=' + apiKey).
		success (function(json) {
			gameInfo = json.games;
			$scope.gameInfo = gameInfo;
			$scope.massFunctionCall();
			$('.hideAtStart').show();
		}).
		error (function() {
			console.log('Match history not found');
		});
	};

	//function run all other api calls and extract other game info
	$scope.massFunctionCall = function() {
			$scope.championIdNameMap(gameInfo);
			$scope.spellIdNameMap(gameInfo);
			$scope.teamColor(gameInfo);
			$scope.itemFix(gameInfo);
			$scope.teamChampMap(gameInfo);
			$scope.statLookUp();
			$scope.leagueLookUp();
			$scope.gameAverages(gameInfo);
	};

	//api call for summoner champion stats by summoner id, also sets champion names
	$scope.statLookUp = function() {
		$http.get('https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/' + summonerId + '/ranked?season=SEASON4&api_key=' + apiKey).
		success (function(json) {
			statInfo = json;
			var i = 0;
			while (statInfo.champions[i].id !== undefined) {
				//adds i value here so that if the next value is undefined we dip out so it doesnt break
				i = i + 1;
				if (statInfo.champions[i] === undefined) {
					//adds 0 value since we skippde it earlier
					statInfo.champions[0].champName = champSelect(statInfo.champions[0].id);
					$scope.gameInfo.statInfo = statInfo;
					return;
				}
				else {
				//sets our champion name if value exists
				statInfo.champions[i].champName = champSelect(statInfo.champions[i].id);
				}
			}
			

		}).
		error (function() {
			console.log('Champion Info not found');
		});
	};

	//api call for league info using summoner Id
	$scope.leagueLookUp = function() {
		$http.get('https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/' + summonerId + '/entry?api_key=' + apiKey).
		success (function(json) {
			leagueInfo = json[summonerId];
			$scope.gameInfo[0].leagueInfo = leagueInfo;

		}).
		error (function() {
			console.log('Summoner has no league info');
		});
	};

	//maps all champion id for summoners previous 10 games / assigns image location
	$scope.championIdNameMap = function(data) {
		for (var i = 0; i < 10; i++) {
        	champNames[i] = champSelect(data[i].championId);
        	$scope.gameInfo[i].champNames = champNames[i];
        	champImages[i] = '/images/champion/' + champNames[i] + '.png';
        	$scope.gameInfo[i].champImages = champImages[i];
        	console.log($scope.gameInfo[i].champImages);
       	       	
        }
	};

	//summoner spell map using spellSelect function, assigns image location
	$scope.spellIdNameMap = function(data) {
		for (var i = 0; i < 10; i++) {
			spellNames[i] = [spellSelect(data[i].spell1), spellSelect(data[i].spell2)];
			$scope.gameInfo[i].spellNames = spellNames[i];
			spellImages[i] = ['/images/spells/' + spellNames[i][0] + '.png' , '/images/spells/' + spellNames[i][1] + '.png'];
			$scope.gameInfo[i].spellImages = spellImages[i];
			$scope.gameInfo[i].itemName = '/images/item/' + data[i].stats.item0 + '.png';
		}
	};

	//maps champion names for all teammates in each game
	//j controls the match index
	//i controls the player index inside of each match
	//k represents the position that the player is added at on their respective team
	$scope.teamChampMap = function(data) {
		for (var j = 0; j < 10; j++) {
			//this is the player case, it is not included in the fellowPlayers so we add it here
			teamChamps[0] = champSelect(data[j].championId);

			var k = 1;
			var l = 0;
			for (var i = 0; i < 9; i++) {
				//if there is only 1 player in a custom game, fellowPlayers doesnt exist
				//so we check to make sure it does to prevent error
				if (data[j].fellowPlayers) {
					//checking this makes sure we dont check an index that doesnt exist (if there are less than 9 teammates in a game)
					if (data[j].fellowPlayers[i] !== undefined) {
						//sorts to each team
						if (data[j].fellowPlayers[i].teamId === data[j].teamId) {
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
			}
			enemyChamps = []; 
			teamChamps = [];
		}
	};
	//assigns color based on win/loss result
	$scope.teamColor = function(data) {
		$scope.gameInfo.lose = 0;
		$scope.gameInfo.win = 0;
		for (var i = 0; i < 10; i++) {
			if (data[i].stats.win !== true) {
				teamColor[i] = '#f9bcbc';
				$scope.gameInfo.lose = $scope.gameInfo.lose + 1;
			}
			else {
				teamColor[i] = '#bddfeb';
				$scope.gameInfo.win = $scope.gameInfo.win + 1;
			}

			$scope.gameInfo[i].color = teamColor[i];
		}
	};

	$scope.gameAverages = function(data) {
		killAverage = 0;
		deathAverage = 0;
		assistAverage = 0;
		csAverage = 0;
		for (var i = 0; i < 10; i++) {
			if (data[i].stats.championsKilled !== undefined) {
				killAverage = killAverage + data[i].stats.championsKilled;
			}
			if (data[i].stats.numDeaths !== undefined) {
				deathAverage = deathAverage + data[i].stats.numDeaths;
			}
			if (data[i].stats.assists !== undefined) {
				assistAverage = assistAverage + data[i].stats.assists;
			}
			if (data[i].stats.minionsKilled !== undefined) {
				if (data[i].stats.neutralMinionsKilled !== undefined) {
					csAverage = csAverage + data[i].stats.minionsKilled + data[i].stats.neutralMinionsKilled;
				}
				else {
					csAverage = csAverage + data[i].stats.minionsKilled;
				}
			}
		}
		$scope.gameInfo.killAverage = killAverage/10;
		$scope.gameInfo.deathAverage = deathAverage/10;
		$scope.gameInfo.assistAverage = assistAverage/10;
		$scope.gameInfo.csAverage = csAverage/10;
	};
	//goes through each item in each game to get rid of the undefined values and set to 'empty' which provides a 1x1 transparent image
	$scope.itemFix = function(data) {
		//need to do this in a not awful way
		for (var i = 0; i < 10; i++) {
			if (data[i].stats.item0 === undefined) {
				data[i].stats.item0 = 'empty';
			}
			if (data[i].stats.item1 === undefined) {
				data[i].stats.item1 = 'empty';
			}
			if (data[i].stats.item2 === undefined) {
				data[i].stats.item2 = 'empty';
			}
			if (data[i].stats.item3 === undefined) {
				data[i].stats.item3 = 'empty';
			}
			if (data[i].stats.item4 === undefined) {
				data[i].stats.item4 = 'empty';
			}
			if (data[i].stats.item5 === undefined) {
				data[i].stats.item5 = 'empty';
			}
			if (data[i].stats.item6 === undefined) {
				data[i].stats.item6 = 'empty';
			}
		}
	};
	$scope.itemHover = function(event, item) {
		if (item === 'empty') {
			return;
		}
		$http.get('https://na.api.pvp.net/api/lol/static-data/na/v1.2/item/' + item + '?api_key=' + apiKey).
		success (function(json) {
			console.log(json);
			itemInfo = json;
			$scope.itemInfo = itemInfo;
			$('.itemToolTip').hide();
		    $('.itemToolTip').css({'top': event.pageY + 20, 'left': event.pageX + 5, 'position':'absolute'});
		    $('.itemToolTip').show();
		}).
		error (function() {
			console.log(item + ': Item not found');
		});
	}
	$scope.itemLeave = function() {
		$('.itemToolTip').hide();
	}
	//default search!
	$scope.defaultSearch = function() {
		$scope.summonerName = 'Dyrus';
		$scope.apiCall();
	};
	// $scope.defaultSearch();
  });

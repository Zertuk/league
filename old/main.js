var summonerName = "";
var summonerId = "";
var apiKey = "85df569c-14df-466c-966b-81f186ed0940";



function summonerLookUp() {
	summonerName = "";
	summonerId = "";

	summonerName = $("#user_name").val();


	$.ajax({
		url: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + summonerName + '?api_key=' + apiKey,
		type: 'GET',
		dataType: 'json',
		data: {

		},
		success: function(json) {
			var summonerNameMinusSpaces = summonerName.replace(" ", "");
			summonerNameMinusSpaces = summonerNameMinusSpaces.toLowerCase().trim();
			summonerId = json[summonerNameMinusSpaces].id;
			console.log(summonerId);
			creepScoreLookUp();

		},
		error: function(XMLHttpRequest, testStatus, errorThrown) {
			alert('error');
		}
	})
}
var testage;
function creepScoreLookUp() {
	$.ajax({
		url: 'https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/' + summonerId + '/recent' + '?api_key=' + apiKey,
		type: 'GET',
		dataType: 'json',
		data: {

		},

		success: function(json) {
			testage = json;
			console.log('yay');
		},

		error: function(XMLHttpRequest, testStatus, errorThrown) {
			alert('error');
		}
	})


}
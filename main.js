var summonerName = "";
var summonerId = "";
var apiKey = "";



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

function creepScoreLookUp() {
	var creepScore = "";

	$.ajax({
		url: 'https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/' + summonerId + '?api_key=' + apiKey,
		type: 'GET',
		dataType: 'json',
		data: {

		},

		success: function(json) {
			creepscore = json[summonerId].stats;
			// creepScore = json['matches'][0].participants.stats.minionsKilled + json['matches'][0].participants.stats.neutralMinionsKilled;

			console.log(creepScore);
		},

		error: function(XMLHttpRequest, testStatus, errorThrown) {
			alert('error');
		}
	})


}
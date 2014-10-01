
function summonerLookUp() {
	var summonerName = "";
	var summonerId = "";

	summonerName = $("#user_name").val();

	var apiKey = '';

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

		},
		error: function(XMLHttpRequest, testStatus, errorThrown) {
			alert('error');
		}
	})

}
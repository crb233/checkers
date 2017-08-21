	
/**
@function
@name startGame
@description Populate the page with the form to submit in order to start a new game
*/
function hostGameForm() {
    //var url = "/gameStartReq";
	
	document.getElementById("mainMenu").style.display = "none";
	document.getElementById("joinGameDiv").style.display = "none";
	//document.getElementById("games").style.display = "none";
	document.getElementById("newGameForm").style.display = "block";
	
}

/**
@function
@name hostGame
@description Send data to the server (username of host and game mode) to add
new game to the database
*/
function hostGame() {
	var username = document.getElementById("username").value;
	
	// value is 1 for private, and 0 for a public game
	var mode = document.querySelector('input[name="mode"]:checked').value
	
	// is it public?
	if (mode === "0") {
		var is_public = true;
	} else {
		var is_public = false;
	}
	
	//alert("Username: " +  username);
	
	//Construct JSON object to send  to the  server
	//@Curtis: JSON OBJECT?
	
	var url = "/new-game"
	
	$.ajax({
        type: "POST",
        data: JSON.stringify({
            "player_name": username,
			"public": is_public
        }),
        url: url,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
			//var obj =  JSON.parse(msg);
            //console.log(msg)
            //var len = 0;
			objplayer = msg.player.player_name;
			alert("successfully created the game, game_id: " + msg.game.game_id);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            document.getElementById("content").innerHTML = "Error Fetching " + URL;
        }
    });
}
	
/**
@function
@name hidegames
@description Hides the list of public games
*/
function hidegames() {

}

/**
@function
@name joinGame
@description Populate the page with the form to submit in order to join a game
and calls showgames() to display the list of games available to join
*/
function joinGameForm(){
	
	document.getElementById("mainMenu").style.display = "none";
	document.getElementById("newGameForm").style.display = "none";
	document.getElementById("games").innerHTML = "";
	document.getElementById("games").style.display = "block";
	document.getElementById("joinGameDiv").style.display = "block";
	
	//showGames is called in order to display the list of public games available
	showGames();
}

/**
@function
@name joinGameServer
@description Sends information to the server to add a 2nd player to the game,
according to their selection(Game and username)
*/
function joinGameServer(){
	var game;
	
	//Check if player selected a public game
	if ( document.getElementById('gameID').value == '' ) {
		
		//game = document.getElementById('gameID').value
		document.getElementById('gameID').value = document.querySelector('input[name=game]:checked').value
	}
		
	game = document.getElementById('gameID').value
	var username = document.getElementById('username').value

	//for debugging purposes
	//alert("Game selected has ID: " + game )

	var url = "/join-game"
	$.ajax({
        type: "POST",
        data: JSON.stringify({
			"player_name": username,
			"game_id": game
        }),
        url: url,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
            alert("You have joined the game successfully. Show me what you got!");
			document.location.href = "../html/board.html"
        },
        error: function(xhr, ajaxOptions, thrownError) {
            document.getElementById("content").innerHTML = "Error Fetching " + URL;
        }
    });
	
}

/**
@function
@name showGames
@description Gets the list of public active games
*/
function showGames() {
    var url = "/get-games"
	var numGames = 0;
	
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
		success: function(msg) {
            console.log(msg)
			if  (msg.length == 0){
				document.getElementById("content").innerHTML = "There are currently no public games available. You can start one by hosting your own game!";
				
			}
			
			else {
				for (var i = 0; i < msg.length; i++) {
					var game = msg[i];
					$('#games').append(newGames(game, i));
					
					// If property names are known beforehand, you can also just do e.g.
					// alert(object.id + ',' + object.Title);
				}
			}
				
			//how many games? Retrieve from object length
        },
        error: function(xhr, ajaxOptions, thrownError) {
            document.getElementById("content").innerHTML = "Error Fetching " + URL;
        }
    });
	
	
}

/**
@function
@name newGames
@description TODO
*/
function newGames(myHtml, i) {
    var gui = myHtml['game_id'];
	var host = myHtml['player_names'][0];
    //var level = myHtml[i].level;
    
    // Generate the game
    var game = '<li class="game">';
    game += '<input type="radio" name="game" value="' + gui + '" onClick="joinGame()"><article>';
    game += '<b>Game Level: </b><u>Intermediate</u>';
	game += '<p><b>Game ID: </b>' + gui + '</p>';
    game += '<p><b>Host: </b>' + host + '</p>';
    game += '</article></input>';
    game += '</li>';
    return game;
}

//Go back to the main menu/page
function backMain (){
    document.getElementById("newGameForm").style.display = "none";
	document.getElementById("joinGameDiv").style.display = "none";
	document.getElementById("mainMenu").style.display = "block";
	
}


/**
Request a draw: Opponent will get a message and be prompted to accept or decline the draw
*/
function requestDraw() {
	var url = "/send-message"
	var data;
	
	$.ajax({
        type: "POST",
        data: {
            player_id: player_id,
			message: {"type":"request_draw" , "text":"Your opponent is requesting a draw."}
        },
        url: url,
        dataType: "json",
        success: function(msg) {
			//TO DO
			
			//message should be the opponent's final decision: Accepted or declined
			//based on message: continure or end game
			//alert (msg);
            
        },
        error: function(xhr, ajaxOptions, thrownError) {
            document.getElementById("content").innerHTML = "Error Fetching " + URL;
        }
    });
}

/**
Forfeit the game by sending a message to the server with text for the opponent
*/
function forfeitGame() {
	var url = "/send-message"
	var data;
	
	$.ajax({
        type: "POST",
        data: {
            player_id: player_id,
			message: {"type":"forfeit" , "text":"Your opponent forfeited the game. You win!"}
        },
        url: url,
        dataType: "json",
        success: function(msg) {
			
			//Game ends....
			
			//TO DO
			//alert (msg);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            document.getElementById("content").innerHTML = "Error Fetching " + URL;
        }
    });
}


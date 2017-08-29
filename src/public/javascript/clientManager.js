var gameBoard = [];

/**
@function
@name startGame
@description Populate the page with the form to submit in order to start a new game
*/
function hostGameForm() {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("joinGameForm").style.display = "none";
    document.getElementById("gameList").style.display = "none";
    document.getElementById("newGameForm").style.display = "block";
}

/**
@function
@name hostGame
@description Send data to the server (username of host and game mode) to add
new game to the database
*/
function hostGame() {
    var username = document.getElementById("usernameHost").value;

    // value is 1 for private, and 0 for a public game
    var mode = document.querySelector('input[name="mode"]:checked').value;

    // is it public?
    var is_public = mode === "0";

		if (document.getElementById('usernameHost').value == '') {
			alert ("Enter your username.");
			return;
		}

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
            // put player and game into local storage
            localStorage.setItem("player", JSON.stringify(msg.player));
            localStorage.setItem("game", JSON.stringify(msg.game));
            document.location.href = "/board.html";
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.error("Error fetching " + url);
            document.getElementById("content").innerHTML = "Error Fetching " + url;
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

    document.getElementById("joinGameForm").style.display = "block";
    document.getElementById("gameList").style.display = "block";

    //showGames is called in order to display the list of public games available
    getGames();
}

/**
@function
@name joinGameServer
@description Sends information to the server to add a 2nd player to the game,
according to their selection(Game and username)
*/
function joinGameServer(){
    //Check if player selected a public game
    if ( document.getElementById('gameID').value == '' ) {
        //game = document.getElementById('gameID').value
        document.getElementById('gameID').value = document.querySelector('input[name=game]:checked').value
    }

		if (document.getElementById('usernameJoin').value == '') {
			alert ("Enter your username.");
			return;
		}

    var game_id = document.getElementById('gameID').value
    var username = document.getElementById('usernameJoin').value
    var url = "/join-game"

    $.ajax({
        type: "POST",
        data: JSON.stringify({
            "player_name": username,
            "game_id": game_id
        }),
        url: url,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
            // put player and game into local storage
            localStorage.setItem("player", JSON.stringify(msg.player));
            localStorage.setItem("game", JSON.stringify(msg.game));
            document.location.href = "/board.html";
						
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.error("Error fetching " + url);
            alert("ID not valid. Please enter a valid Game-ID");
						document.getElementById('gameID').value == ''

        }
    });
}


/**
@function
@name showGames
@description Gets the list of public active games
*/
function getGames() {
    var url = "/get-games"
    var numGames = 0;
    //empty content of games
    document.getElementById("gameList").innerHTML = "";

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
            if  (msg.length == 0){
                document.getElementById("error").innerHTML = "There are currently no public games available.</p>You can start one by hosting your own game!";

            } else {
                document.getElementById("error").innerHTML = "";
                for (var i = 0; i < msg.length; i++) {
                    var game = msg[i];
                    $('#gameList').append(newGames(game, i));
                }

                $('#gameList').append('<li class="game" style="display:block"><article>Stuff</article></li>');
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            document.getElementById("content").innerHTML = "Error Fetching " + URL;
        }
    });


}

/**
@function
@name newGames
@description Creates a new game element to be displayed in the games list
*/
function newGames(myHtml, i) {
    var gui = myHtml['game_id'];
    var host = myHtml['player_names'][0];
    //var level = myHtml[i].level;
    // Generate the game
    var game = '<li class="game">';
    game += '<input type="radio" name="game" value="' + gui + '" onClick="myf(\''+gui+'\')"><article>';
		game += '<p><b>Host: </b>' + host + '</p>';
    game += '<p><b>Game ID: </b>' + gui + '</p>';
    game += '</article></input>';
    game += '</li>';
    return game;
}

//Go back to the main menu/page
function backMain (){
    document.getElementById("error").innerHTML = "";
    document.getElementById("newGameForm").style.display = "none";
    document.getElementById("joinGameForm").style.display = "none";
    document.getElementById("gameList").style.display = "none";
    document.getElementById("mainMenu").style.display = "block";

}


/**
Request a draw: Opponent will get a message and be prompted to accept or decline the draw
*/
function requestDraw() {
    var url = "/send-message"
    var data = {
        player_id: player.player_id,
        message: {"type":"request_draw" , "text":"Your opponent is requesting a draw."}
    };

    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
            alert ("Your request has been sent.. Waiting on opponent's answer.");
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert ("Error sending message");
        }
    });
}

/**
Forfeit the game by sending a message to the server with text for the opponent
*/
function forfeitGame() {
    var url = "/send-message"
    var data = {
        player_id: player.player_id,
        message: {
            "type": "forfeit",
            "text": "Your opponent forfeited the game. You win!"
        }
    };

    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
            alert ("Thanks for using our checkers app! K bye");
            document.location.href = "/index.html";
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert ("Error sending message");
        }
    });
}

//Fill Game ID by clicking on the game
function myf(gui){
    document.getElementById('gameID').value= gui;
}

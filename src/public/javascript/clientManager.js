	
/**
@function
@name startGame
@description Populate the page with the form to submit in order to start a new game
*/	
    function hostGameForm() {
        //var url = "/gameStartReq";

		document.getElementById("joinGameForm").style.display = "none";
		document.getElementById("games").style.display = "none";
		document.getElementById("newGameForm").style.display = "block";
		
         }
/**
@function
@name hostGame
@description Send data to the server (username of host and game mode) to add new game to the database

*/

	function hostGame() {
		var username = document.getElementById("username").value;
		
		//value is 1 for private, and 0 for a public game
		var mode = document.querySelector('input[name="mode"]:checked').value
		if (mode=="0"){
			mode = true;
		}
		else 
			mode = false;
			
		//alert("Username: " +  username);
		
		//Construct JSON object to send  to the  server
		//@Curtis: JSON OBJECT?
			
		var data;
		var url= "/new-game"
		$.ajax({
            type: "POST",
            data: {
                player_name: username,
				public: mode
            },
            url: url,
            dataType: "json",
            success: function(msg) {
				var obj =  JSON.stringify(msg);
                //console.log(msg)
                //var len = 0;
				alert ("successfully created the game, player_id: " + obj["player"]["player_id"] );
                
            },
            error: function(xhr, ajaxOptions, thrownError) {
                document.getElementById("content").innerHTML = "Error Fetching " + URL;
            }
        });
	}
	
	/**
@function 
@name hidegames
@description Hide the list of public games

*/

    function hidegames() {

    }

	/**
@function
@name joinGame
@description Populate the page with the form to submit in order to join a game and calls showgames() to display the list of games available to join

*/

	function joinGame(){
		document.getElementById("newGameForm").style.display = "none";
		document.getElementById("games").style.display = "block";
		document.getElementById("joinGameForm").style.display = "block";
		
		
		//prototype for a game
		//this section is dummy hardcoded data
				
		var game = '<li class="game">';
        game += '<article><input type="radio" name="game" value="8ACC6999-BEF1">';
        game += '<header><h2>Game Level:<b><u> Beginner </b></u><i></h2></header>';
        game += '<b>Host: HKaroui</b>';
		game += '<p><b>GameID: 8ACC6999-BEF1</b><br>'
        game += '</input></article>';
        game += '</li>';
		
		$('#games').append(game);
		
		//showGames is called in order to display the list of public games available
		//showGames();
	}
	
	/**
@function
@name joinGameServer
@description Sends information to the server to add a 2nd player to the game, according to their selection(Game and username)

*/
    
	function joinGameServer(){
	
	var game;
	//Check if player selected a public game
	if ( document.getElementById('gameID').value == '' ) {
		
		//game = document.getElementById('gameID').value
		document.getElementById('gameID').value = document.querySelector('input[name=game]:checked').value
	}
		
	game = document.getElementById('gameID').value
	
	//for debugging purposes
	//alert("Game selected has ID: " + game )
	
	var url = "/join-game"
	$.ajax({
            type: "POST",
            data: {
                player2: username,
				gameid: game
            },
            url: url,
            dataType: "json",
            success: function(msg) {
                console.log(msg)
                var len = 0;
                
            },
            error: function(xhr, ajaxOptions, thrownError) {
                document.getElementById("content").innerHTML = "Error Fetching " + URL;
            }
        });
		
	}
	
		/**
@function
@name showGames
@description Get the list of public games

*/

    function showGames() {
        var url = "/get-games";
		var numGames = 0;
		
        $.ajax({
            tpye: "POST",
            url: url,
            dataType: "json",
			
            success: function(msg) {
                console.log(msg)
				//how many games? Retrieve from object length
                var len = 0;
                for (var i = 0; i < numGames; i++) {
                    $('#games').append(newgames(msg, i));
                }
                
            },
            error: function(xhr, ajaxOptions, thrownError) {
                document.getElementById("content").innerHTML = "Error Fetching " + URL;
            }
        });
    }
	
	function newGames(myHtml, i) {
        var host = myHtml.games[i].player1;
   
        var level = myHtml.games[i].level;
        
 
        // Generate the game
        var game = '<li class="game">';
        game += '<input type="radio" name="game" value="'+i+'" onClick="joinGame()"><article>';
        game += '<header>Game Level:<h2><b><u>' + level + '</b></u><i></h2></header>';
        game += '<b>Host: ' + host + '</b>';
        game += '</article></input>';
        game += '</li>';
        return game;
    }


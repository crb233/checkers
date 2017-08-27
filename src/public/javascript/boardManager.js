
const player = JSON.parse(localStorage.getItem("player"));

// the current game object
var game = JSON.parse(localStorage.getItem("game"));

// stores the visual state of the board (including unfinished moves)
var currentBoard = copyBoard(game.board);

// the matrix of html squares (each of which is a div)
var squares = [];

// current move
var move = [];

// currently selected piece
var selected = null;

//variables used for the timer
var timer;
var value = "00:00";




// build the board HTML
buildBoard();

// create a new board and draw the pieces
drawPieces(currentBoard);



// post("/new-game", {}, function(msg) {
//     // success
// }, function(xhr, ajaxOptions, thrownError) {
//     // error
// });

function post(endpoint, data, success, error) {
    $.ajax({
        "type": "POST",
        "url": endpoint,
        "data": JSON.stringify(data),
        "dataType": "json",
        "contentType": "application/json; charset=utf-8",
        "success": success,
        "error": error
    });
}

// Returns the parity of the given position as a string
function getParityString(r, c) {
    if ((r + c) % 2 === 0) {
        return "even";
    } else {
        return "odd";
    }
}

// Returns the address of the image representing the given piece
function getPieceImage(piece) {
    return "images/"
        + (piece.king ? "king" : "piece")
        + (piece.player === 0 ? "0" : "1")
        + ".png";
}

// Builds the HTML for the board object
function buildBoard() {
	document.getElementById("game_info").innerHTML = game.game_id;
	
    var board_elem = document.getElementById("board");

    // create a row
    for (var r = 0; r < board_size; r++) {
        var row_elem = document.createElement("div");
        var row = [];

        // create a square
        for (var c = 0; c < board_size; c++) {
            var square_elem = document.createElement("div");
            row.push(square_elem);

            square_elem.setAttribute("onclick", "clickSquare(" + r + "," + c + ")");
            square_elem.classList.add("square");
            square_elem.classList.add(getParityString(r, c));
            row_elem.appendChild(square_elem);
        }

        // add row element to board element
        row_elem.classList.add("row");
        board_elem.appendChild(row_elem);

        // add squares to list
        squares.push(row);
    }
}

function swapPieces(p0, p1) {
	var r0 = p0[0];
    var c0 = p0[1];
    var r1 = p1[0];
    var c1 = p1[1];
	
    var s0 = squares[r0][c0];
    var s1 = squares[r1][c1];

    var temp = s0.innerHTML;
    s0.innerHTML = s1.innerHTML;
    s1.innerHTML = temp;

	
	//After making the move, enable the "Undo Move" and Send Move button
	document.getElementById("undo").disabled = false;
	document.getElementById("send").disabled = false;
    
	//change color
	document.getElementById("undo").className = "button btn-block";
	//change color
	document.getElementById("send").className = "button btn-block";
}

function drawPieces(board) {
    for (var r = 0; r < board_size; r++) {
        for (var c = 0; c < board_size; c++) {
            var square_elem = squares[r][c];

            // clear all children
            square_elem.innerHTML = "";

            // set the piece
            var piece = board[r][c];
            if (piece !== null) {
                var piece_elem = document.createElement("img");
                piece_elem.setAttribute("src", getPieceImage(piece))
                piece_elem.setAttribute("width", "100%");
                piece_elem.setAttribute("height", "auto");
                square_elem.appendChild(piece_elem);
            }
        }
    }
}

function clickSquare(r, c) {
    
    move.push([r, c]);
    if (move.length === 1) {
        var piece = game.board[r][c];
        
        if (piece === null) {
            alert("Please select a piece");
            move.pop();
            
        } else if (piece.player !== player.player_number) {
            alert("This isn't your piece, dummy");
            move.pop();
            
        } else if (piece.player !== game.turn) {
            alert("It's not your turn, dummy");
            move.pop();
            
        } else {
            selected = squares[r][c];
            selected.classList.add("selected");
        }
        
    } else if (validateMove(game, move)) {
        selected.classList.remove("selected");
        selected = squares[r][c];
        selected.classList.add("selected");
        
        var tempGame = copyGame(game);
        makeMove(tempGame, move);
        drawPieces(tempGame.board);
        
        // make send-move and undo-move buttons clickable
        
    } else {
        move.pop();
        // tell the user move was invalid
    }
}

function undoMove() {
    resetBoard();
}

function sendMove() {
	//If move is validated, send the new board object
	
	$.ajax({
        type: "POST",
        data: JSON.stringify({
            "player_id": player.player_id,
			"move": move
        }),
        url: "/make-move",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
            // On success update the board
            game = msg.game;
            resetBoard();
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(JSON.stringify(thrownError));
            alert("Move failed to send.");
            //document.getElementById("content").innerHTML = "Error Fetching " + URL;
        }
    });
    
    // reset move
    move = [];
}

function resetBoard() {
    if (selected !== null) {
        selected.classList.remove("selected");
    }
    
    selected = null;
    move = [];
    drawPieces(game.board);
}





/**
TODO
*/
function receiveMessage(msg) {
    // TODO
    switch (msg.type) {
        case "join":
            break;
        case "forfeit":
            break;
        case "request_draw":
            break;
        case "accept_draw":
            break;
        case "reject_draw":
            break;
        default:
            console.error("Unknown message type");
    }
}

//See if there are any updates from the server (messages) every 6 seconds
loop = setInterval(function(){
	$.ajax({
        type: "POST",
        data: JSON.stringify({
            player_id: player.player_id
        }),
        url: "/get-updates",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {
            if (game.turn !== player.player_number) {
                game = msg.game;
                resetBoard();
            }
            for (var i = 0; i < msg.messages.length; i++) {
                receiveMessage(msg.messages[i]);
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
           // document.getElementById("content").innerHTML = "Error Fetching " + URL;
        }
    });
}, 6000);



//SIDE MENU FUNCTIONS
/**
Start timer for the player when page first loads
@param {} minutes - how many minutes for countdown
@param {} seconds - how minutes seconds for countdown
*/

function startTimer(m, s) {
	document.getElementById("timer").innerHTML = m + ":" + s;
	if (s == 0) {
		if (m == 0) {
			document.getElementById("timer").innerHTML = "<font color='red'>EXPIRED</font>";
			//timeExpired();
			return;
		} else if (m != 0) {
			m = m - 1;
			s = 60;
		}
	}
    
	s = s - 1;
	timer = setTimeout(function() {
		startTimer(m, s)
	}, 1000);
}

/**
Send message to the server when time expires
*/
function timeExpired() {
	//send message to the server "Expired"? with player_id who lost
	var url ="/send-message"
	var data;

	$.ajax({
        type: "POST",
        data: JSON.stringify({
            player_id: player.player_id,
			message: {"type":"lose-game" , "text":"Opponent's time expired. You win!"}
        }),
        url: url,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(msg) {

			alert ("Your time expired. You lose! ");

        },
        error: function(xhr, ajaxOptions, thrownError) {
            //document.getElementById("content").innerHTML = "Error Fetching " + URL;
        }
    });
    
}

/**
Overlay screen after pausing the game
@return: false - Prevent page from refreshing
*/

function openNav() {
	//pauseTimer();
	document.getElementById("myNav").style.width = "100%";
	
	return false;
}


/**
Closing the overlay screen after pausing the game
*/
function closeNav() {

	document.getElementById("myNav").style.width = "0%";
	//resumeTimer();
}

/**
Pause the timer and open the overlay screen
*/
function pauseTimer() {
	value = document.getElementById("timer").innerHTML;
	clearTimeout(timer);
	openNav();
}


/**
Resume the timer
*/
function resumeTimer() {
	var t = value.split(":");
	closeNav();
	startTimer(parseInt(t[0], 10), parseInt(t[1], 10));
}


/**
Display Help Menu	with game rules. Might not be needed since we will show the menu regardless
*/
function helpMenu(){
	pauseTimer();
	var gameRules = "<article class='games-style'><ol>"
	gameRules += "<li><b style='font-size: 30px;'>GAME RULES</b></p>"
	gameRules += "1. Black moves first. Players then alternate moves.</p>"
	gameRules += "2. Moves are allowed only on the dark squares, so pieces always move diagonally. Single pieces are always limited to forward moves (toward the opponent).</p>"
	gameRules += "3. A piece making a non-capturing move (not involving a jump) may move only one square</p>."
	gameRules += "4. A piece making a capturing move (a jump) leaps over one of the opponent's pieces, landing in a straight diagonal line on the other side. Only one piece may be captured in a single jump; however, multiple jumps are allowed during a single turn.</p>"
	gameRules += "5. When a piece is captured, it is removed from the board.</p>"
	gameRules += "6. If a player is able to make a capture, there is no option -- the jump must be made. If more than one capture is available, the player is free to choose whichever he or she prefers.</p>"
	gameRules += "7. When a piece reaches the furthest row from the player who controls that piece, it is crowned and becomes a king. One of the pieces which had been captured is placed on top of the king so that it is twice as high as a single piece.</p>"
	gameRules += "8. Kings are limited to moving diagonally, but may move both forward and backward. (Remember that single pieces, i.e. non-kings, are always limited to forward moves.)</p>"
	gameRules += "9. Kings may combine jumps in several directions -- forward and backward -- on the same turn. Single pieces may shift direction diagonally during a multiple capture turn, but must always jump forward (toward the opponent).</p>"
	gameRules += "10. A player wins the game when the opponent cannot make a move. In most cases, this is because all of the opponent's pieces have been captured, but it could also be because all of his pieces are blocked in.</p>"
	gameRules += '<b><p style="font-size: 25px; color: red">If your time expires, you lose the game! Think fast.</p></b></li>'
	gameRules += "</ol></article>"
	document.getElementById("overlay-cnt").innerHTML =  gameRules;

}








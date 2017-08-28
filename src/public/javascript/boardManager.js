
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

// button html elements
var sendButton = document.getElementById("send");
var undoButton = document.getElementById("undo");
enableButtons(false);



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
  document.getElementById("game_info2").innerHTML = game.game_id;

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

        updateTable();


    }

	//Pause timer and open screen overlay if 2nd player has not joined yet.
	if (game.player_names.length !== 2) {
		pauseTimer();
	}
}

/**
Draws the pieces contained in the given board object to the client screen.
@param {} board - the board object to be drawn
*/
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

    if (player.player_number === 0) {
      var boardGUI = document.getElementById('board');
      var deg = 180;
      boardGUI.style.webkitTransform = 'rotate('+deg+'deg)';
      boardGUI.style.mozTransform    = 'rotate('+deg+'deg)';
      boardGUI.style.msTransform     = 'rotate('+deg+'deg)';
      boardGUI.style.oTransform      = 'rotate('+deg+'deg)';
      boardGUI.style.transform       = 'rotate('+deg+'deg)';

    }
}

/**
Enables (or disables) the send and undo buttons.
@param {boolean} enabled - whether the buttons should be enabled or disabled
*/
function enableButtons(enabled) {
    if (typeof enabled === "undefined") {
        enabled = true;
    }

    sendButton.disabled = !enabled;
    undoButton.disabled = !enabled;

    if (enabled) {
        sendButton.classList.remove("button3");
        undoButton.classList.remove("button3");
        sendButton.classList.add("button5");
        undoButton.classList.add("button5");
    } else {
        sendButton.classList.remove("button5");
        undoButton.classList.remove("button5");
        sendButton.classList.add("button3");
        undoButton.classList.add("button3");
    }
}

/**
Returns true if two arrays are equal and false otherwise
@param {} a - the first array object
@param {} b - the second array object
@return whether the arrays are equal
*/
function arraysEqual(a, b) {
    if (a === b) {
        return true;
    }

    if (a == null || b == null || a.length !== b.length) {
        return false;
    }

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

/**
Returns true if the first array contains the seocond array as one of its
elements. Otherwise, returns false.
@param {} list - the first array object
@param {} obj - the second array object
@return whether the first array contains the second
*/
function containsArray(list, obj) {
    for (var i = 0; i < list.length; i++) {
        if (arraysEqual(list[i], obj)) {
            return true;
        }
    }
    return false;
}

/**
Sets the selected board on the client's screen.
@param {integer} r - the row number of the square to be selected
@param {integer} c - the column number of the square to be selected
*/
function setSelected(r, c) {
    unsetSelected();
    selected = squares[r][c];
    selected.classList.add("selected");
}

/**
Unselects the currently selected square, so that no squares are selected.
*/
function unsetSelected() {
    if (selected != null) {
        selected.classList.remove("selected");
    }
    selected = null;
}

/**
Called when the user clicks on a board square. This method determines how to
react to the player selecting a square. It also constructs the current move
object and updates the board to reflect the current (unfinished) move.
@param {integer} r - the row number of the selected square (0 indexed)
@param {integer} c - the column number of the selected square (0 indexed)
*/
function clickSquare(r, c) {

    if (squares[r][c] !== selected) {

        move.push([r, c]);
        if (move.length === 1) {
            enableButtons(false);

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
                setSelected(r, c);
            }

        } else if (validateMove(game, move)) {
            enableButtons(true);
            setSelected(r, c);

            var tempGame = copyGame(game);
            makeMove(tempGame, move);
            drawPieces(tempGame.board);

        } else {
            var piece = game.board[r][c];
            if (piece === null) {
                move.pop();

            } else if (piece.player !== player.player_number) {
                move.pop();

            } else if (piece.player !== game.turn) {
                move.pop();

            } else if (containsArray(move.slice(0, move.length - 1), [r, c])) {
                move.pop();

            } else {
                move = [];
                move.push([r, c]);

                setSelected(r, c);
                drawPieces(game.board);
            }
        }
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
    unsetSelected();
    move = [];
    drawPieces(game.board);
    enableButtons(false);
}


/**
Message received from the server/opponent
*/
function receiveMessage(msg) {
    game = msg.game;
    switch (msg.type) {
        case "join":
            alert(msg.text);
            closeNav();
            startTimer(2,0);
            updateTable();
            break;
        case "forfeit":
            alert(msg.text);
            document.location.href = "/index.html";
            break;
        case "request_draw":
            var r = confirm(msg.text+". Click OK to accept or CANCEL to keep playing.");
            if (r == true) {
                txt = "Cool";
            } else {
                txt = "You win. Thanks for playing!";
                accept_draw();
            }
            break;
        case "accept_draw":
            alert(msg.text);
            document.location.href = "/index.html";
            break;
        case "reject_draw":
          reject_draw();
            break;
        case "pause":
          pauseTimer();
          break;
        case "resume":
          resumeTimer();
          break;
        case "expired":
          timeExpired();
          break;
        default:
            console.error("Unknown message type");
            alert("Unknown message type");
            break;
    }
}


function accept_draw(){
    var data = {
        player_id: player.player_id,
        message: {"type":"accept_draw" , "text":"Draw accepted: no winners!"}
    };

    post("/send-message", data, function(msg) {
        document.location.href = "/index.html";

    }, function(xhr, ajaxOptions, thrownError) {
        //document.getElementById("content").innerHTML = "Error Fetching " + URL;
    });

}

function reject_draw() {
    var data = {
        player_id: player.player_id,
        message: {
            "type": "accept_draw",
            "text": "Draw rejected: keep playing."
        }
    };

    post("/send-message", data, function(msg) {
        //do nothing?

    }, function(xhr, ajaxOptions, thrownError) {
        alert ("Error sending message");

    });
}

/**
Request a draw: Opponent will get a message and be prompted to accept or decline the draw
*/
function requestDraw() {
    var data = {
        player_id: player_id,
        message: {
            "type": "request_draw",
            "text": "Your opponent is requesting a draw."
        }
    };

    post("/send-message", data, function(msg) {
        //TODO
        //message should be the opponent's final decision: Accepted or declined
        //based on message: continure or end game
        //alert (msg);

    }, function(xhr, ajaxOptions, thrownError) {
        document.getElementById("content").innerHTML = "Error Fetching " + URL;
    });
}

/**
Forfeit the game by sending a message to the server with text for the opponent
*/
function forfeitGame() {
    var data = {
        player_id: player_id,
        message: {
            "type": "forfeit",
            "text": "Your opponent forfeited the game. You win!"
        }
    };

    post("/send-message", data, function(msg) {
        //Game ends....

        // TODO
        // alert (msg);
    }, function(xhr, ajaxOptions, thrownError) {
        document.getElementById("content").innerHTML = "Error Fetching " + URL;
    });
}
/**
Forfeit the game by sending a message to the server with text for the opponent
*/
function forfeitGame() {
    var data = {
        player_id: player_id,
        message: {
            "type": "forfeit",
            "text": "Your opponent forfeited the game. You win!"
        }
    };

    post("/send-message", data, function(msg) {
        //Game ends....

        // TODO
        // alert (msg);
    }, function(xhr, ajaxOptions, thrownError) {
        document.getElementById("content").innerHTML = "Error Fetching " + URL;
    });
}


function pauseGame() {
    var data = {
        player_id: player.player_id,
        message: {
            "type": "pause",
            "text": "Your opponent paused the game."
        }
    };

    post("/send-message", data, function(msg) {
        //do nothing?

    }, function(xhr, ajaxOptions, thrownError) {
        alert ("Error sending message");
    });
}

//Resume Game
function resumeGame() {
    var data = {
        player_id: player.player_id,
        message: {
            "type": "resume",
            "text": ""
        }
    };

    post("/send-message", data, function(msg) {
        //do nothing?

    }, function(xhr, ajaxOptions, thrownError) {
        alert ("Error sending message");
    });
}

//See if there are any updates from the server (messages) every 6 seconds
loop = setInterval(function(){
    var data = {
        player_id: player.player_id
    };

    post("/get-updates", data, function(msg) {
        // success
        
        if (game.turn !== player.player_number) {
            game = msg.game;
            resetBoard();
        }

        game = msg.game;
        updateTable();

        for (var i = 0; i < msg.messages.length; i++) {
            receiveMessage(msg.messages[i]);
        }

    }, function(xhr, ajaxOptions, thrownError) {
        // failure
        // document.getElementById("content").innerHTML = "Error Fetching " + URL;
    });
}, 1000);


//function to udpate the table with the appropriate info after getting new game object

function updateTable () {

  //Show timer only for the player whose turn it is
  if (game.turn !== player.player_number) {
      document.getElementById("timer").style.display = "none";
      document.getElementById("timerInfo").style.display = "block";
  }

  else {
    document.getElementById("timer").style.display = "block";
    document.getElementById("timerInfo").style.display = "none";
  }

  if (game.turn === 0) {
      document.getElementById("player1row").style.background = "#b4eeb4";

  }
  else {
    document.getElementById("player2row").style.background = "#b4eeb4";
  }
  document.getElementById("player1name").innerHTML = game.player_names[0];
  document.getElementById("player2name").innerHTML = game.player_names[1];
  document.getElementById("player1pieces").innerHTML=  game.player_pieces[0];
  document.getElementById("player2pieces").innerHTML=  game.player_pieces[1];
}


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
      if (game.turn === player.player_number) {
          timeExpired();
      }

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

  return false;
}

/**
Send message to the server when time expires
*/
function timeExpired() {
	//send message to the server "Expired"? with player_id who lost
	var data = {
        player_id: player.player_id,
        message: {"type":"forfeit" , "text":"Opponent's time expired. You win!"}
    };

    post("/send-message", data, function(msg) {
		// success
        alert ("Your time expired. You lose! ");
        document.location.href = "/index.html";

    }, function(xhr, ajaxOptions, thrownError) {
        // failure
        //document.getElementById("content").innerHTML = "Error Fetching " + URL;
    });

}

/**
Overlay screen after pausing the game
@return: false - Prevent page from refreshing
*/

function openNav() {
	document.getElementById("myNav").style.width = "100%";
	return false;
}


/**
Closing the overlay screen after pausing the game
*/
function closeNav() {
	document.getElementById("myNav").style.width = "0%";
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

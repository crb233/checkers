
// CONSTANTS

// the delay between get-update requests in milliseconds
const UPDATE_LOOP_TIME = 1000;

// the player object representing the current user
const player = JSON.parse(localStorage.getItem("player"));




// VARIABLES

// the current game object
var game = JSON.parse(localStorage.getItem("game"));

// the matrix of html squares (each of which is a div)
var squares = [];

// current move object (updated as the player selects squares)
var move = [];

// currently selected piece
var selected = null;

//variables used for the timer
var clock_timer;
var time_remaining;

// button html elements
var sendButton = document.getElementById("send");
var undoButton = document.getElementById("undo");





// STARTUP FUNCTION CALLS

function startup() {
    // create board elements and draw initial board state
    buildBoard();
    drawPieces(game.board);

    // disable send-move and undo-move buttons
    enableButtons(false);

    // start get-updates loop
    startUpdateLoop();
}





// FUNCTIONS

/**
Sends a post request containing JSON data to the given endpoint. Calls one of
two callback functions depending on the success/error status of the request.
*/
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

/**
Returns the parity of the given board position as a string
*/
function getParityString(r, c) {
    if ((r + c) % 2 === 0) {
        return "even";
    } else {
        return "odd";
    }
}

/**
Returns the address of the image representing the given piece
*/
function getPieceImage(piece) {
    return "images/"
        + (piece.king ? "king" : "piece")
        + (piece.player === 0 ? "0" : "1")
        + ".png";
}

/**
Builds the HTML for the board object
*/
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
        //sendButton.classList.add("button5");
        //undoButton.classList.add("button5");
    } else {
        //sendButton.classList.remove("button5");
        //undoButton.classList.remove("button5");
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

/**
Called when the player presses the "Undo Move" button
*/
function undoMove() {
    resetBoard();
}

/**
Resets the game board by unselecting any selected pieces, resetting the move
object, redrawing the board in its current configuration, and disabling the
undo and send buttons
*/
function resetBoard() {
    unsetSelected();
    move = [];
    drawPieces(game.board);
    enableButtons(false);
}


/**
Receives message objects from the server and acts according to their content
*/
function receiveMessage(msg) {
    switch (msg.type) {
        case "join":
            alert(msg.text);
            closeNav();
            startTimer(game.timer);
            updateTable();
            break;

        case "forfeit":
            alert(msg.text);
            document.location.href = "/index.html";
            break;

        case "request_draw":
            if (confirm(msg.text + ".\nClick Ok to accept or Cancel to keep playing.")) {
                accept_draw();
            } else {
                rejectDraw();
            }
            break;

        case "accept_draw":
            alert(msg.text);
            document.location.href = "/index.html";
            break;

        case "reject_draw":
            alert(msg.text);
            break;

        case "pause":
            alert(msg.text);
            pauseTimer();
            break;

        case "resume":
            resumeTimer();
            break;

        case "expired":
            alert(msg.text);
            break;

        default:
            console.error("Unknown message type");
            alert("Unknown message type");
            break;
    }
}

/**
Sends the current move to the opponent
*/
function sendMove() {
  var winner;
	var data = {
        "player_id": player.player_id,
        "move": move
    };

    // stop the timer
    time_remaining = -1;
    clearInterval(clock_timer);

    post("/make-move", data, function(msg) {
        // On success update the board
        game = msg.game;
        resetBoard();
    }, function(xhr, ajaxOptions, thrownError) {
        console.log(JSON.stringify(thrownError));
        alert("Move failed to send.");
    });

    // reset move
    move = [];

}

/**
Requests a draw. Opponent will receive a message and be prompted to accept or
decline the draw
*/
function request_draw() {
    var data = {
        player_id: player.player_id,
        message: {
            "type": "request_draw",
            "text": "Your opponent is requesting a draw."
        }
    };

    post("/send-message", data, function(msg) {
        // nothing to do
    }, function(xhr, ajaxOptions, thrownError) {
        alert("Failed to send draw request to opponent.");
    });
}


/**
Accepts a draw. Game will end such that there are no winners
*/
function accept_draw(){
    var data = {
        player_id: player.player_id,
        message: {
            "type": "accept_draw",
            "text": "Draw accepted! There are no winners"
        }
    };

    post("/send-message", data, function(msg) {
        alert("The game is declared a draw. No winners!");
        document.location.href = "/index.html";
    }, function(xhr, ajaxOptions, thrownError) {
        alert("Failed to accept the opponent's draw request.");
    });
}

/**
Rejects a draw. Reject the opponent's draw proposal and the game continues.
*/
function rejectDraw() {
    var data = {
        player_id: player.player_id,
        message: {
            "type": "reject_draw",
            "text": "Draw rejected. The game continues..."
        }
    };

    post("/send-message", data, function(msg) {
        // do nothing
    }, function(xhr, ajaxOptions, thrownError) {
        alert("Failed to reject the opponent's draw request.");
    });
}


/**
Forfeits the game by sending a forfeit message to the server, which will be
passed on to the opponent
*/
function forfeitGame() {
    var data = {
        player_id: player.player_id,
        message: {
            "type": "forfeit",
            "text": "Your opponent forfeited the game. You win!"
        }
    };

    post("/send-message", data, function(msg) {
        alert("You forfeited the game. You lose!");
        document.location.href = "/index.html";
    }, function(xhr, ajaxOptions, thrownError) {
        alert("Error sending message");
    });
}

/**
Pauses the game
*/
function pauseGame() {
    var data = {
        player_id: player.player_id,
        message: {
            "type": "pause",
            "text": "Your opponent paused the game."
        }
    };

    post("/send-message", data, function(msg) {
        // do nothing
    }, function(xhr, ajaxOptions, thrownError) {
        alert("Error sending message");
    });
}

/**
Resumes the game (if it has been paused)
*/
function resumeGame() {
    var data = {
        player_id: player.player_id,
        message: {
            "type": "resume",
            "text": ""
        }
    };

    post("/send-message", data, function(msg) {
        // do nothing
    }, function(xhr, ajaxOptions, thrownError) {
        alert("Error sending message");
    });
}

/**
Starts an infinite loop of requesting updates from the server in intervals
determined by the constant UPDATE_LOOP_TIME
*/
var loop;
function startUpdateLoop() {
    loop = setInterval(function(){

        var data = {
            player_id: player.player_id
        };

        post("/get-updates", data, function(msg) {
            // success

            //check if there are any winners
            var winner = isGameOver(msg.game);

            //1st player wins
            if (winner === player.player_number) {
              alert (game.player_names[winner] + ", you collected 12 pieces. WINNER!");
            } else if (winner !== -1) {
              alert ("You lose! " + game.player_names[winner] + " collected 12 pieces.");

            }

            // if it was your opponent's turn
            if (game.turn !== player.player_number) {
                game = msg.game;
                resetBoard();

                // if it's now your turn
                if (game.turn === player.player_number) {
                    startTimer(game.timer);
                }
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
    }, UPDATE_LOOP_TIME);
}

/**
Udpates the information table after getting a new game object
*/
function updateTable () {
    //Show timer only for the player whose turn it is
    if (game.turn !== player.player_number) {
        document.getElementById("timer").style.display = "none";
        document.getElementById("timerInfo").style.display = "block";
    } else {
        document.getElementById("timer").style.display = "block";
        document.getElementById("timerInfo").style.display = "none";
    }

    if (game.turn === 0) {
        document.getElementById("player1row").style.background = "#b4eeb4";
        document.getElementById("player2row").style.background = "#ffffff";
    } else {
        document.getElementById("player2row").style.background = "#b4eeb4";
        document.getElementById("player1row").style.background = "#ffffff";
    }

    document.getElementById("player1name").innerHTML = game.player_names[0];
    document.getElementById("player2name").innerHTML = game.player_names[1];
    document.getElementById("player1pieces").innerHTML=  game.player_pieces[0];
    document.getElementById("player2pieces").innerHTML=  game.player_pieces[1];
}

// SIDE MENU FUNCTIONS

/**
Returns a string representing the given time in minutes and seconds
*/
function formatTime(time) {
    if (time < 0) time = 0;

    var min = Math.floor(time / 60);
    var sec = time % 60;

    if (sec < 10) {
        return min + ":0" + sec;
    } else {
        return min + ":" + sec;
    }
}

/**
Start timer for the player when page first loads
@param {} minutes - how many minutes for countdown
@param {} seconds - how minutes seconds for countdown
*/
function startTimer(starting_time) {
	time_remaining = starting_time;

    var timer_elem = document.getElementById("timer");
    timer_elem.innerHTML = formatTime(time_remaining);

	clock_timer = setInterval(function() {
        if (time_remaining > 0) {
            time_remaining -= 1;
            timer_elem.innerHTML = formatTime(time_remaining);
        } else if (time_remaining === 0) {
            time_remaining = -1;
            clearInterval(clock_timer);
            timer_elem.innerHTML = "<font color='red'>" + formatTime(time_remaining) + "</font>";
            timeExpired();
        }
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
        message: {
            "type": "forfeit",
            "text": "Opponent's time expired. You win!"
        }
    };

    post("/send-message", data, function(msg) {
		// success
        alert ("Your time expired. You lose!");
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
Closes the overlay screen after pausing the game
*/
function closeNav() {
	document.getElementById("myNav").style.width = "0%";
}

/**
Pauses the timer and opens the overlay screen
*/
function pauseTimer() {
	clearInterval(clock_timer);
	openNav();
}

/**
Resumes the timer
*/
function resumeTimer() {
	closeNav();
	startTimer(time_remaining);
}

/**
Displays the help menu with game rules.
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


// the matrix of html squares (each of which is a div)
var squares = [];

//variables used for the timer
var id;
var value = "00:00";
const player_id = localStorage.getItem("player_id");
var gameBoard = localStorage.getItem("gameBoard");

//store previous move coordinates

var cur_c = 0;
var cur_r = 0;

// Creates the piece initially found at the given position on the board
function newDefaultPiece(r, c) {
    if ((c + r) % 2 == 1) {
        // we're on an odd board square
        return null;

    } else if (r < board_player_rows) {
        // player 0 side
        return {"player": 0, "king": false};

    } else if (r >= board_size - board_player_rows) {
        // player 1 side
        return {"player": 1, "king": false};

    } else {
        // in the middle
        return null;
    }
}

// Creates a bard object with the default initial configuration
function newBoard() {
    var board = [];
    for (var r = 0; r < board_size; r++) {

        // build up a row of the board
        var row = [];
        for (var c = 0; c < board_size; c++) {
            row.push(newDefaultPiece(r, c));
        }

        board.push(row);
    }

    return board;
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
	document.getElementById("game_info").innerHTML = localStorage.getItem("game_id");
	
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

function swapPieces(r0, c0, r1, c1) {
	
	
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
	
	//update variables
	cur_r = r1;
	cur_c = c1;
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

var selected = null;
var last_r = 0;
var last_c = 0;

function clickSquare(r, c) {
    if ((r + c) % 2 == 0) {

        if (selected === null) {
            // we haven't selected a square yet
            // select the one we clicked
            last_r = r;
            last_c = c;
            selected = squares[r][c];
            selected.classList.add("selected");
        } else {
            // we have selected a square
            // swap the selected one with this one
            swapPieces(last_r, last_c, r, c);
            selected.classList.remove("selected");
            selected = null;
        }
    }
}

// build the board HTML
buildBoard();

// create a new board and draw the pieces
drawPieces(newBoard());

function undoMove (x,y) {
	swapPieces(cur_r, cur_c,last_r,last_c);	
}

function sendMove(){
	//If move is validated, send the new board object
	
	//move object??
	$.ajax({
        type: "POST",
        data: {
            player_id: player_id,
			move: [
				[last_r, last_c],
				[cur_r, cur_c],
				[0,0]
			
			]
        },
        url: "/make-move",
        dataType: "json",
        success: function(msg) {
			//On success update the move board
			if (msg.success) {
				drawPieces(msg.game.board);
			}
			
			else
				alert("Move unsuccessful.");
				swapPieces(cur_r,cur_c,last_r,last_c);
			
        },
        error: function(xhr, ajaxOptions, thrownError) {
            //document.getElementById("content").innerHTML = "Error Fetching " + URL;
        }
    });
}





//See if there are any updates from the server (messages) every 6 seconds
loop=setInterval(function(){
	
 $.ajax({
        type: "POST",
        data: {
            player_id: player_id			
        },
        url: "/get-updates",
        dataType: "json",
        success: function(msg) {
			
			//If there are no messages do nothing
			//else
				if (msg.length != 0)
				{
					//Depends ... Switch statement?
					//message: {"type":"forfeit" , "text":"Your opponent forfeited the game. You win!"}
					var ans = confirm(msg.type + ": " + msg.text);
					if (ans) {
						//if the opponent accepted (forfeit or draw) game ends
					}
					
					else {
						//Game goes on and and send a reject..
					}
				}
			
        },
        error: function(xhr, ajaxOptions, thrownError) {
           // document.getElementById("content").innerHTML = "Error Fetching " + URL;
        }
    });
},6000);



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
		id = setTimeout(function () {
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
            data: {
                player_id: player_id,
				message: {"type":"lose-game" , "text":"Opponent's time expired. You win!"}
            },
            url: url,
            dataType: "json",
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

			value =  document.getElementById("timer").innerHTML;
			clearTimeout(id);
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








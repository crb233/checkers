
/**
@module checkers
*/

/** the length and width of a standard game board */
const board_size = 8;

/** the number of rows of pieces that each player starts the game with */
const board_player_rows = 3;

/**
Creates the piece initially found at the given position on the board
*/
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

/**
Creates a board object with the default initial configuration
*/
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

/**
Creates and returns a new game object with the given specifications
@param {string} id - the unique identifier for this game
@param {boolean} is_public - whether this game is public
@param {boolean} is_active - whether this game is active
@return a game object representing a new game
*/
function newGame(id, is_public, is_active) {
    return {
        "game_id": id,
        "public": is_public,
        "active": is_active,
        "player_names": [],
        "player_time": [],
        "player_pieces": [],
        "turn": 0,
        "board": newBoard()
    };
}

/**
@function
@description Determines and returns the index of a player's king row (the last
row on their opponent's side)
@param {number} player - the player's number (either 0 or 1)
@return the index of the player's king row
*/
function getKingRow(player) {
    return (1 - player) * (board_size - 1);
}

/**
Creates and returns a move object which contains only the starting position
@param {number} row - the row number of the initial position
@param {number} col - the column number of the initial position
@return the new move object
*/
function newMove(row, col) {
    var move = [];
    addMovePosition(move, row, col);
    return move;
}

/**
Updates a move object to represent the next position for a piece to take
@param {} move - the move object to be updated
@param {number} row - the row number of the initial position
@param {number} col - the column number of the initial position
*/
function addMovePosition(move, row, col) {
    move.push([row, col]);
}

/**
Returns true if the move is valid for the given game, otherwise false.
@param {} game - the checkers game object
@param {} move - the move to validate
*/
function validateMove(game, move) {
	
	//board is inside boardManager already as a global variable
	
	var board = game.board;
    var initialPosition = move[0];
    var targetPosition = move[1];


    if(this.is_Empty(targetPosition) && is_Diagonal(initialPosition, targetPosition)) {

      if(board[initialPosition[0], initialPosition[1]].king == true){
			  if(validJump(game, move)){
				  return true;
			  } else if(findDistance(initialPosition, targetPosition) == 1){
				  return true;
			}else{
				return false;
			}

		  }else if(moveForward(game, move)){
			  //further testing
			if(validJump(game, move)){
				return true;
			}else if(findDistance(coordinate1, coordinate2) == 1){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}else{
		return false;
	}
}

/**
Checks if the selected space is empty
@param {} board - the checkers board object 
@param {} position - the selected position
*/
function is_Empty(board, position){

  var x0 = position[0];
  var y0 = position[1];

	if(board[x0][y0] == null){
		return true;
	} else {
		return false;
	}
}

/**
Checks if the second position is diagonal relative to the first position
@param {} position1 - the first given coordinate
@param {} position2 - the second given coordinate
*/
function is_Diagonal(position1, position2){
	var x0 = position1[0];
  var y0 = position1[1];

  var x1 = position2[0];
  var y1 = position2[1];

  if ((x1 - x0) == (y1 - y0)) {
   return true;
  } else {
    return false
  }
}

/**
Checks if the piece is moving forward relative to them
@param {} game - the checkers game object
@param {} move - the move to be made
*/
function moveForward(game, move){

  var position1 = move[0];
  var position2 = move[1];

  var x0 = position1[0];
  var y0 = position1[1];
  var x1 = position2[0];
  var y1 = position2[1];

  if(y1 > y0) {
    return true;
  } else {
    return false;
  }
  
}

/**
Finds the distance between two given positions
@param {} position1 - the first given coordinate
@param {} position2 - the second given coordinate
*/
function findDistance(postition1, position2){
    var y0 = position1[1];
	var y1 = position2[1];
	
	return Math.abs(y0 - y1);
	
}

/**
Checks to validate a "jump" move by making sure there's an opponent's piece between the two positions
@param {} game - the checkers game object
@param {} position1 - the initial position of the jump
@param {} position2 - the target position of the jump
*/
function validJump(game, position1, position2){
	
	if(findDistance(position1, position2) == 2){
		if(game.board[position2[0] - 1][position2[1] - 1].player != game.player){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}

/**
Updates the game state to reflect the changes caused by a move
@param {} game - the checkers game object
@param {} move - the move to be made
*/
function makeMove(game, move) {
    if(validateMove(game, move)){
		//TO DO
	}
}

/**
Updates the game state to reverse the changes caused by a move
@param {} game - the chckers game object
@param {} move - the move to undo
*/
function undoMove(game, move) {
    // TODO
	return false;
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



if (typeof module === "undefined") {
    var module = {};
}

module.exports = {
    "newDefaultPiece": newDefaultPiece,
    "newBoard": newBoard,
    "newGame": newGame,
    "getKingRow": getKingRow,
    "newMove": newMove,
    "addMovePosition": addMovePosition,
    "validateMove": validateMove,
    "is_Empty":is_Empty,
    "is_Diagonal":is_Diagonal,
    "moveForward":moveForward,
    "findDistance":findDistance,
    "validJump":validJump,
    "makeMove": makeMove,
    "undoMove": undoMove,
	"forfeitGame": forfeitGame,
	"requestDraw": requestDraw,
};

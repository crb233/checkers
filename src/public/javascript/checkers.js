
/**
@module checkersGame
*/

/** the length and width of a standard game board */
const board_size = 8;

/** the number of rows of pieces that each player starts the game with */
const board_player_rows = 3;

/**
Ceates and returns a piece object with the given specifications
@param {number} player - number describing which player (must be 0 or 1)
@param {boolean} king - is the piece a king (true) or a normal piece (false)
@return a piece object
*/
function newPiece(player, king) {
    return {
        "player": player,
        "king": king
    };
}

/**
Creates and returns a new game board object with the default initial
configuration of pieces.
@return a board object representing a new game
*/
function newBoard() {
    var board = [];
    for (var r = 0; r < board_size; r++) {
        
        // build up a row of the board
        var row = [];
        for (var c = 0; c < board_size; c++) {
            
            // place a single piece (null means no piece)
            var piece = null;
            if ((c + r) % 2 == 0) {
                // we're on an alternating board square
                
                if (c < board_player_rows) {
                    // player one's side
                    piece = newPiece(0, false);
                } else if (c >= board_size - board_player_rows) {
                    // player two's side
                    piece = newPiece(1, false);
                }
            }
            row.push(piece);
            
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
        "player_colors": [],
        "turn": 0,
        "board": newBoard()
    };
}

/**
Determines and returns the index of a player's home row
@param {number} player - the player's number (either 0 or 1)
@return the index of the player's home row
*/
function getHomeRow(player) {
    return player * (board_size - 1);
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
@param {} game - the chckers game object
@param {} move - the move to validate
*/
function validateMove(game, move) {
    // TODO
}

/**
Updates the game state to reflect the changes caused by a move
@param {} game - the chckers game object
@param {} move - the move to be made
*/
function makeMove(game, move) {
    // TODO
	
	
}

/**
Updates the game state to reverse the changes caused by a move
@param {} game - the chckers game object
@param {} move - the move to undo
*/
function undoMove(game, move) {
    // TODO
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




var module = {};
module.exports = {
    "newPiece": newPiece,
    "newBoard": newBoard,
    "newGame": newGame,
    "getHomeRow": getHomeRow,
    "newMove": newMove,
    "addMovePosition": addMovePosition,
    "validateMove": validateMove,
    "makeMove": makeMove,
    "undoMove": undoMove,
	"forfeitGame": forfeitGame,
	"requestDraw": requestDraw,
};

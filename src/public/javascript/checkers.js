
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
Creates a bard object with the default initial configuration
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
        "player_colors": [],
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
	//split move into coordinate1 & coordinate2
    if(is_Empty() && is_Diagonal()){
		if(game.board[coordinate1][coordinate2].king){
			//further testing
			if(validJump){
				return true;
			}else if(validStep){
				return true;
			}else{
				return false;
			}
			
		}else if(moveForward(game, move)){
			//further testing
			if(validJump){
				return true;
			}else if(validStep){
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

/*

//is move the move object or just the move in the makemove request
function is_Empty(board, move){
		//checks all coordinates given
		for(int i = 0; i < 8; i++){
			for(int j = 0; j < 8; j++){
				if(move[i][j]== null){
					return true;
				}else{
					return false;
				}
			}
		}
}

function is_Diagonal(coordinate1, coordinate2){ 
	//is the space on a diagonal
	//explore further into, is it an attainable diagonal
	game.board[row][column]
}

//if moveForward is true, then you can validate a piece, if not you have to check if its a king but if its not a king its invalid

function moveForward(game, move){
	//checks if the move is moving forward as opposed to backwards
	//if the previous move is bigger than the current room, then it's going backwards.
	//if a previous room is smaller, it's going forward because from the first player's perspective that would be the half section at the bottom of the screen, the coordinates up above (or going forward) are smaller 
	if(move[i-1] > move[i]){
		return true;
	}else{
		return false;
	}
}

function validStep(game, move){
	//if the diagonal is right next to the piece
	
}

//this can include multiple jumps
function validJump(game, move){
	//if the diagonal selected has an occupied space between them
	//loop through depending on how many entries in the moves (how long will the move list be?)
	
}
*/

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
	return false;
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
    "makeMove": makeMove,
    "undoMove": undoMove
};

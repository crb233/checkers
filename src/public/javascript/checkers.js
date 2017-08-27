
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
TODO
*/
function copyBoard(oldBoard) {
    var board = [];
    for (var r = 0; r < board_size; r++) {
        // build up a row of the board
        var row = [];
        for (var c = 0; c < board_size; c++) {
            // copy a single piece
            var oldPiece = oldBoard[r][c];
            if (oldPiece === null) {
                row.push(null);
                
            } else {
                row.push({
                    "player": oldPiece.player,
                    "king": oldPiece.king
                });
            }
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
TODO
*/
function copyGame(game) {
    return {
        "game_id": game.id,
        "public": game.public,
        "active": game.active,
        "player_names": game.player_names.slice(),
        "player_time": game.player_time.slice(),
        "player_pieces": game.player_pieces.slice(),
        "turn": game.turn,
        "board": copyBoard(game.board)
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
TODO
*/
function getPiece(board, pos) {
    return board[pos[0]][pos[1]];
}

/**
TODO
*/
function setPiece(board, pos, piece) {
    board[pos[0]][pos[1]] = piece;
}

/**
Checks if the selected space is empty
@param {} board - the checkers board object
@param {} position - the selected position
*/
function isEmpty(board, position){
    return getPiece(board, position) === null;
}

/**
Returns true if the move is valid for the given game, otherwise false.
@param {} game - the checkers game object
@param {} move - the move to validate
*/
function validateMove(game, move) {
    if (move.length <= 1) {
        return false;
    }
    
    var board = game.board;
    
    var curr = move[0];
    var next = move[1];
    
    if (isEmpty(board, curr)) {
        return false;
    }
    
    if (getPiece(board, curr).player !== game.turn) {
        return false;
    }
    
    var dist = findDistance(curr, next);
    if (dist === 2) {
        // move is a jump
        for (var i = 0; i < move.length - 1; i++) {
            if (!validJump(game, move[i], move[i + 1])) {
                return false;
            }
        }
        return true;
        
    } else if (dist === 1) {
        // move is a step
        return validStep(game, move[0], move[1]) && move.length == 2;
        
    } else {
        return false;
    }
}

/**
Checks if the second position is diagonal relative to the first position
@param {} pos1 - the first given coordinate
@param {} pos2 - the second given coordinate
*/
function isDiagonal(pos1, pos2){
    var r0 = pos1[0];
    var c0 = pos1[1];
    
    var r1 = pos2[0];
    var c1 = pos2[1];
    
    return Math.abs(r1 - r0) === Math.abs(c1 - c0);
}

/**
TODO
*/
function correctDirection(game, pos1, pos2) {
    var piece = getPiece(game.board, pos1);
    
    if (piece === null) {
        return false;
        
    } else if (piece.king) {
        return true;
        
    } else if (piece.player === 0) {
        return pos2[0] > pos1[0];
        
    } else {
        return pos2[0] < pos1[0];
    }
}

/**
Finds the distance between two given positions
@param {} pos1 - the first given coordinate
@param {} pos2 - the second given coordinate
*/
function findDistance(pos1, pos2){
    var r0 = pos1[1];
    var r1 = pos2[1];
    
    return Math.abs(r0 - r1);
}

/**
Checks to validate a "jump" move by making sure there's an opponent's piece between the two positions
@param {} game - the checkers game object
@param {} pos1 - the initial position of the jump
@param {} pos2 - the target position of the jump
*/
function validStep(game, pos1, pos2) {
    if (findDistance(pos1, pos2) === 1) {
        if (!isDiagonal(pos1, pos2)) {
            return false;
        }
        
        if (!isEmpty(game.board, pos2)) {
            return false;
        }
        
        return correctDirection(game, pos1, pos2);
    } else {
        return false;
    }
}

/**
Checks to validate a "jump" move by making sure there's an opponent's piece between the two positions
@param {} game - the checkers game object
@param {} pos1 - the initial position of the jump
@param {} pos2 - the target position of the jump
*/
function validJump(game, pos1, pos2){
    if (findDistance(pos1, pos2) === 2) {
        var mid_row = (pos1[0] + pos2[0]) / 2;
        var mid_col = (pos1[1] + pos2[1]) / 2;
        var mid = game.board[mid_row][mid_col];
        
        if (mid === null || mid.player === game.turn) {
            return false;
        }
        
        if (!isDiagonal(pos1, pos2)) {
            return false;
        }
        
        if (!isEmpty(game.board, pos2)) {
            return false;
        }
        
        return correctDirection(game, pos1, pos2);
    } else {
        return false;
    }
}

/**
Updates the game state to reflect the changes caused by a move
@param {} game - the checkers game object
@param {} move - the move to be made
*/
function makeMove(game, move) {
    if (validateMove(game, move)) {
        if (findDistance(move[0], move[1]) === 1) {
            var p0 = move[0];
            var p1 = move[1];
            
            setPiece(game.board, p1, getPiece(game.board, p0));
            setPiece(game.board, p0, null);
            
            if (p1[0] === getKingRow(game.turn)) {
                getPiece(game.board, p1).king = true;
            }
            
        } else {
            var p0 = move[0];
            var pn = move[move.length - 1];
            
            game.player_pieces[game.turn] += move.length - 1;
            
            setPiece(game.board, pn, getPiece(game.board, p0));
            setPiece(game.board, p0, null);
            for (var i = 0; i < move.length - 1; i++) {
                var r = (move[i][0] + move[i + 1][0]) / 2;
                var c = (move[i][1] + move[i + 1][1]) / 2;
                setPiece(game.board, [r, c], null);
            }
            
            if (pn[0] === getKingRow(game.turn)) {
                getPiece(game.board, pn).king = true;
            }
        }
        
        game.turn = 1 - game.turn;
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
    "getPiece": getPiece,
    "setPiece": setPiece,
    "isEmpty": isEmpty,
    "isDiagonal": isDiagonal,
    "correctDirection": correctDirection,
    "findDistance": findDistance,
    "validJump": validJump,
    "validStep": validStep,
    "makeMove": makeMove,
    "undoMove": undoMove,
    "forfeitGame": forfeitGame,
    "requestDraw": requestDraw,
};

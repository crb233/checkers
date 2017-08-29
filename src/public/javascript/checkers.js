
/**
@module checkers
*/

/** the length and width of a standard game board */
const board_size = 8;

/** the number of rows of pieces that each player starts the game with */
const board_player_rows = 3;

/**
Creates the piece initially found at the given position on the board
@return the default piece for that position
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
Creates and returns a board object with the default initial configuration
@return a standard board object
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
Creates and returns a deep copy of the given checkers board object
@param {} oldBoard - the original board object
@return a deep copy of the original board
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
        "player_pieces": [],
        "timer": 120,
        "turn": 0,
        "board": newBoard()
    };
}

/**
Creates and returns a deep copy of the given game object
@param {} game - the game to be copied
@return a deep copy of the original game object
*/
function copyGame(game) {
    return {
        "game_id": game.game_id,
        "public": game.public,
        "active": game.active,
        "player_names": game.player_names.slice(),
        "player_pieces": game.player_pieces.slice(),
        "timer": game.timer,
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
Returns the piece at the given position on the board, assuming that pos
represents a valid board position.
@param {} board - the board object
@param {} pos - where to get the piece (as a coordinate array [row, column])
@return the piece a the given position on the board
*/
function getPiece(board, pos) {
    return board[pos[0]][pos[1]];
}

/**
Sets the piece at the given position on the board, assuming that pos represents
a valid board position.
@param {} board - the board object
@param {} pos - where to set the piece (as a coordinate array [row, column])
@param {} piece - the piece to be added to the board
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

    var initial = move[0];
    var second = move[1];

    if (isEmpty(board, initial)) {
        return false;
    }

    if (getPiece(board, initial).player !== game.turn) {
        return false;
    }

    var dist = findDistance(initial, second);
    if (dist === 2) {
        // move is a jump
        var piece = getPiece(game.board, initial);
        for (var i = 0; i < move.length - 1; i++) {
            if (!validJump(game, piece, move[i], move[i + 1])) {
                return false;
            }
        }
        return true;

    } else if (dist === 1) {
        // move is a step
        var piece = getPiece(game.board, initial);
        return validStep(game, piece, move[0], move[1]) && move.length == 2;

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
Determines if the given piece can move in the direction indicated by the
starting and ending positions.
@param {} piece - the moving piece
@param {} pos1 - the initial position
@param {} pos2 - the target position
*/
function correctDirection(piece, pos1, pos2) {
    if (piece === null) {
        return false;

    } else if (piece.king) {
        return true;

    } else if (piece.player === 0) {
        return pos1[0] < pos2[0];

    } else {
        return pos1[0] > pos2[0];
    }
}

/**
Finds the diagonal distance between two given positions. If the positions are
not diagonal to each other, this method is not guaranteed to return a meaningful
result.
@param {} pos1 - the first coordinate
@param {} pos2 - the second coordinate
*/
function findDistance(pos1, pos2){
    var r0 = pos1[1];
    var r1 = pos2[1];

    return Math.abs(r0 - r1);
}

/**
Checks to validate a "jump" move by making sure there's an opponent's piece between the two positions
@param {} game - the checkers game object
@param {} piece - the checkers piece making the jump
@param {} pos1 - the initial position of the jump
@param {} pos2 - the target position of the jump
*/
function validStep(game, piece, pos1, pos2) {
    if (findDistance(pos1, pos2) === 1) {
        if (!isDiagonal(pos1, pos2)) {
            return false;
        }

        if (!isEmpty(game.board, pos2)) {
            return false;
        }

        return correctDirection(piece, pos1, pos2);
    } else {
        return false;
    }
}

/**
Checks is a jump move is valid by making sure that the positions have a diagonal
distance of two and that there's an opponent's piece in between
between the two positions
@param {} game - the checkers game object
@param {} piece - the checkers piece making the jump
@param {} pos1 - the initial position of the jump
@param {} pos2 - the target position of the jump
*/
function validJump(game, piece, pos1, pos2){
    if (findDistance(pos1, pos2) === 2) {
        var mid_row = (pos1[0] + pos2[0]) / 2;
        var mid_col = (pos1[1] + pos2[1]) / 2;
        var mid = game.board[mid_row][mid_col];

        if (mid === null || mid.player === piece.player) {
            return false;
        }

        if (!isDiagonal(pos1, pos2)) {
            return false;
        }

        if (!isEmpty(game.board, pos2)) {
            return false;
        }

        return correctDirection(piece, pos1, pos2);
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

            // move the piece
            setPiece(game.board, p1, getPiece(game.board, p0));
            setPiece(game.board, p0, null);

            // change it to a king if neccessary
            if (p1[0] === getKingRow(game.turn)) {
                getPiece(game.board, p1).king = true;
            }

        } else {
            var p0 = move[0];
            var pn = move[move.length - 1];

            // add the jumber of pieces captures to the player's total
            game.player_pieces[game.turn] += move.length - 1;

            // move the jumping piece
            setPiece(game.board, pn, getPiece(game.board, p0));
            setPiece(game.board, p0, null);

            // remove jumped over pieces
            for (var i = 0; i < move.length - 1; i++) {
                var r = (move[i][0] + move[i + 1][0]) / 2;
                var c = (move[i][1] + move[i + 1][1]) / 2;
                setPiece(game.board, [r, c], null);
            }

            // change it to a king if neccessary
            if (pn[0] === getKingRow(game.turn)) {
                getPiece(game.board, pn).king = true;
            }
        }

        // turn is over, switch to other player's turn
        game.turn = 1 - game.turn;
    }
}


function isGameOver(game) {

  if (game.player_pieces[0] === 12) {
    return 0;
  }
  else if (game.player_pieces[1] === 12) {
    return 1;
  }
  else {
    return -1;
  }
}


if (typeof module === "undefined") {
    var module = {};
}

module.exports = {
    "newDefaultPiece": newDefaultPiece,
    "newBoard": newBoard,
    "newGame": newGame,
    "copyGame": copyGame,
    "copyBoard": copyBoard,
    "getKingRow": getKingRow,
    "validateMove": validateMove,
    "getPiece": getPiece,
    "setPiece": setPiece,
    "isEmpty": isEmpty,
    "isDiagonal": isDiagonal,
    "correctDirection": correctDirection,
    "findDistance": findDistance,
    "validJump": validJump,
    "validStep": validStep,
    "makeMove": makeMove
};

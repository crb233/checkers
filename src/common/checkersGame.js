
/**
@module checkersGame
*/

/** The length and width of a game board */
const board_size = 8;

/** The number of rows of pieces that each player starts the game with */
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
};

/**
Creates and returns a new game board object
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
                    piece = game.newPiece(0, false);
                } else if (c >= board_size - board_player_rows) {
                    // player two's side
                    piece = game.newPiece(1, false);
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
@param {boolean} is_public - whether this game is public (true) or privae (false)
@return a game object representing a new game
*/
function newGame(id, is_public) {
    return {
        "game_id": id,
        "public": is_public,
        "player_names": [],
        "player_colors": [],
        "turn": 0,
        "board": game.newBoard()
    };
};

/**
Determines and returns the index of a player's home row
@param {number} player - number describing which player (must be 0 or 1)
@return {number} the index of the player's home row
*/
function getHomeRow(player) {
    if (player == 0) {
        return 0;
    } else {
        return board_size - 1;
    }
}

module.exports = {
    newPiece: newPiece,
    newBoard: newBoard,
    newGame: newGame,
    getHomeRow: getHomeRow
};

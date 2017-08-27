var assert = require("assert");
var checkers = require("../../../src/public/javascript/checkers");

// should be initially empty squares
const emptyPos1 =                   [0, 1];
const emptyPos2 =                   [5, 2];
const emptyPos3 =                   [3, 4];

// should be initially non-empty
const nonEmptyPos1 =                [0, 0];
const nonEmptyPos2 =                [2, 6];
const nonEmptyPos3 =                [7, 5];

// vertical and horizonal moves
const forwardMove =                 [[0,0], [2,0]]
const backwardMove =                [[2,0], [0,0]]
const rightwardMove =               [[0,0], [0,2]]
const leftwardMove =                [[0,2], [0,0]]

// disproportionate moves
const disproportionateMove1 =        [[0,0], [2,1]]
const disproportionateMove2 =        [[0,0], [4,3]]
const disproportionateMove3 =        [[0,0], [1,5]]

// diagonal moves
const diagonalForwardMove =         [[0,0], [1,1]] // Diagonal forward 1 unit
const diagonalForward2UnitsMove =   [[0,0], [2,2]] // Diagonal forward 2 units
const diagonalBackwardsMove =       [[1,1], [0,0]] // Diagonal backward 1 unit
const diagonalBackwards2UnitsMove = [[2,2], [0,0]] // Diagonal backward 2 units

// moves of different distances
const distance0move =               [[0,0], [0,0]]
const distance1move =               [[0,0], [1,1]]
const distance2move =               [[0,0], [2,2]]
const distance3move =			    [[0,0], [3,3]]



function newBasicGame() {
    game = checkers.newGame(1, true, true);
    game.player_names = ["Curtis", "Sam"];
    return game;
}

function newKingsGame() {
    game = checkers.newGame(1, true, true);
    game.player_names = ["Curtis", "Sam"];
    for (var r = 0; r < game.board.length; r++) {
        for (var c = 0; c < game.board[r].length; c++) {
            if (game.board[r][c] !== null) {
                game.board[r][c].king = true;
            }
        }
    }
    return game;
}

describe("checkers.js", function() {
    
    describe("isEmpty()", function() {
        
        var basicGame = newBasicGame();
        var kingsGame = newKingsGame();
        
        it("should return true for empty squares", function() {
            assert(checkers.isEmpty(basicGame.board, emptyPos1) === true);
            assert(checkers.isEmpty(basicGame.board, emptyPos2) === true);
            assert(checkers.isEmpty(basicGame.board, emptyPos3) === true);
        });
        
        it("should return false for non-empty squares", function() {
            assert(checkers.isEmpty(basicGame.board, nonEmptyPos1) === false);
            assert(checkers.isEmpty(basicGame.board, nonEmptyPos2) === false);
            assert(checkers.isEmpty(basicGame.board, nonEmptyPos3) === false);
        });
        
    });
    
    describe("isDiagonal()", function() {
        
        var basicGame = newBasicGame();
        var kingsGame = newKingsGame();
        
        it("should should return false for horizontal and vertical moves", function() {
            assert(checkers.isDiagonal(forwardMove[0], forwardMove[1]) === false);
            assert(checkers.isDiagonal(rightwardMove[0], rightwardMove[1]) === false);
        });
        
        it("should should return false for disproportionate moves", function() {
            assert(checkers.isDiagonal(disproportionateMove1[0], disproportionateMove1[1]) === false);
            assert(checkers.isDiagonal(disproportionateMove2[0], disproportionateMove2[1]) === false);
            assert(checkers.isDiagonal(disproportionateMove3[0], disproportionateMove3[1]) === false);
        });
        
        it("should should return true for diagonal moves", function() {
            assert(checkers.isDiagonal(diagonalForwardMove[0], diagonalForwardMove[1]) === true);
            assert(checkers.isDiagonal(diagonalForward2UnitsMove[0], diagonalForward2UnitsMove[1]) === true);
            assert(checkers.isDiagonal(diagonalBackwardsMove[0], diagonalBackwardsMove[1]) === true);
            assert(checkers.isDiagonal(diagonalBackwards2UnitsMove[0], diagonalBackwards2UnitsMove[1]) === true);
        });
        
    });
    
    describe("correctDirection()", function() {
        
        var basicGame = newBasicGame();
        var kingsGame = newKingsGame();
        
        it("should return false for a normal piece moving backward", function() {
            assert(checkers.correctDirection(basicGame, backwardMove[0], backwardMove[1]) === false);
        });
        
        it("should return true for a normal piece moving forward", function() {
            assert(checkers.correctDirection(basicGame, forwardMove[0], forwardMove[1]) === true);
            assert(checkers.correctDirection(basicGame, diagonalForwardMove[0], diagonalForwardMove[1]) === true);
        });
        
        it("should return true for kings moving in any direction", function() {
            assert(checkers.correctDirection(kingsGame, diagonalForwardMove[0], diagonalForwardMove[1]) === true);
            assert(checkers.correctDirection(kingsGame, forwardMove[0], forwardMove[1]) === true);
            assert(checkers.correctDirection(kingsGame, backwardMove[0], backwardMove[1]) === true);
        });
        
    });
    
    describe("findDistance()", function() {
        
        var basicGame = newBasicGame();
        var kingsGame = newKingsGame();
        
        it("should test if findDistance function works properly", function() {
            assert(checkers.findDistance(distance0move[0], distance0move[1]) === 0);
            assert(checkers.findDistance(distance1move[0], distance1move[1]) === 1);
            assert(checkers.findDistance(distance2move[0], distance2move[1]) === 2);
            assert(checkers.findDistance(distance3move[0], distance3move[1]) === 3);
        });
        
    });
    
    describe("validJump()", function() {
        
        var basicGame = newBasicGame();
        var kingsGame = newKingsGame();
        
        it("should test if validJump function works properly", function() {
            assert(checkers.validJump(basicGame, distance2move[0], distance2move[1]) === false);
            assert(checkers.validJump(basicGame, distance3move[0], distance3move[1]) === false);
        });
        
    });
    
});

/* VALID MOVES:
 *
 *
 *
 *
 */
// isEmpty
// Checks if target space is empty
/*
 * basicGame = newGame()
 *
 * // EMPTY SPACE
 * move1 = [[0,0], [0,0]]
 * // NON-EMPTY SPACE
 * move2 = [[0,1], [0,0]]
 *
 */

// isDiagonal
// Checks if diagonal to selected space
/*
 * basicGame = newGame()
 *
 * // NON-DIAGONAL
 * move1 = [[0,0], [0,1]] // Horizontal
 * move2 = [[3,3], [2,3]] // Vertical
 * move2 = [[0,0], [2,1]] // Disproportionate
 *
 * // DIAGONAL
 * move = [[0,0], [1,1]] // Diagonal forward 1 unit
 * move = [[0,0], [2,2]] // Diagonal forward > 1 unit
 * move = [[1,1], [0,0]] // Diagonal backward 1 unit
 * move = [[2,2], [0,0]] // Diagonal backward > 1 unit
 *
 */

// correctDirection
// checks if piece is going "forward" or "backward", relative to the player
/*
 * basicGame = newGame()
 *
 * // FORWARD
 * move2 = [[0,0], [1,1]] // Forward Diagonal
 * // NON-FORWARD
 * move1 = [[0,0], [0,1]] // Horizontal
 * move2 = [[3,3], [2,3]] // Backwards
 */

// findDistance
// checks diagonal distance (self is zero)
/*
 * basicGame = newGame()
 *
 * //Distance of 0
 * position = [0, 2]
 *
 * //Distance of 1
 * position1 = [1,3]
 * position2 = [1,4]
 *
 * //Distance of 2
 * position1 = [1,3]
 * position2 = [1,5]
 *
 * //Distance of 3
 * position1 = [5,3]
 * position2 = [5,0]
 */

// validJump
// checks to make sure there is a piece between initial space and target space
/*
 * // Distance between positions is 2
 * position1 = [1,3]
 * position2 = [1,5]
 *
 * // Distance between position is 3
 * position1 = [5,3]
 * position2 = [5,0]
 *
 * // Piece between positions is opponent's piece
 *
 *
 *
 * // Piece between positions is current player's piece
 *
 *
 *
 * // No piece between positions
 *
 *
 *
 */

// validateMove
// puts validation pieces together
/*
 *
 *
 *
 */

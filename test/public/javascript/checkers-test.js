var assert = require("assert");
var checkers = require("../../../src/public/javascript/checkers");

const emptyInitialMove =            [[0,0], [0,0]] // Empty initial
const nonEmptyInitialMove =         [[0,1], [0,0]] // Non-empty initial

const verticalMove =                [[0,0], [1,0]] // Vertical
const horizontalMove =              [[0,0], [0,1]] // Horizontal
const disproportionateMove =        [[0,0], [2,1]] // Disproportionate
const diagonalForwardMove =         [[0,0], [1,1]] // Diagonal forward 1 unit
const diagonalForward2UnitsMove =   [[0,0], [2,2]] // Diagonal forward > 1 unit
const diagonalBackwardsMove =       [[1,1], [0,0]] // Diagonal backward 1 unit
const diagonalBackwards2UnitsMove = [[2,2], [0,0]] // Diagonal backward > 1 unit

const backwardsMove =               [[3,3], [2,3]] // Backwards


function newBasicGame() {
  game = checkers.newGame(1, true, true);
  game.turn = 0;
  game.player_names = ["Curtis", "Sam"];

  return game;
}

describe("checkers.js", function() {

  describe("testIsEmpty()", function() {

    var game = newBasicGame();

    it("should test if isEmpty function works properly", function() {

      assert(checkers.is_Empty(game.board, emptyInitialMove) == true);
      assert(checkers.is_Empty(game.board, nonEmptyInitialMove) == false);

    });

  });

  describe("testIsDiagonal()", function() {

    var game = newBasicGame();

    it("should test that isDiagonalFunction works properly", function() {

      assert(checkers.is_Diagonal(verticalMove[0], verticalMove[1]) == false);
      assert(checkers.is_Diagonal(horizontalMove[0], horizontalMove[1]) == false);
      assert(checkers.is_Diagonal(disproportionateMove[0], disproportionateMove[1]) == false);

      assert(checkers.is_Diagonal(diagonalForwardMove[0], diagonalForwardMove[1]) == true);
      assert(checkers.is_Diagonal(diagonalForward2UnitsMove[0], diagonalForward2UnitsMove[1]) == true);
      assert(checkers.is_Diagonal(diagonalBackwardsMove[0], diagonalBackwardsMove[1]) == true);
      assert(checkers.is_Diagonal(diagonalBackwards2UnitsMove[0], diagonalBackwards2UnitsMove[1]) == true);

      assert(true);
    });

  });

  describe("testIsMoveForward()", function() {

    var game = newBasicGame();

    it("should test if isMoveForward works properly", function() {

      assert(checkers.moveForward(game, diagonalForwardMove) == true);
      assert(checkers.moveForward(game, verticalMove) == false);
      assert(checkers.moveForward(game, backwardsMove) == false);

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
 * game = newGame()
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
 * game = newGame()
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

// moveForward
// checks if piece is going "forward" or "backward", relative to the player
/*
 * game = newGame()
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
 *
 *
 *
 */

// validJump
// checks to make sure there is a piece between initial space and target space
/*
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

var assert = require("assert");
var checkers = require("../../../src/public/javascript/checkers");

const emptyInitialMove =            [[0,1], [0,0]] // Empty initial
const nonEmptyInitialMove =         [[0,0], [0,0]] // Non-empty initial

const verticalMove =                [[0,0], [1,0]] // Vertical
const horizontalMove =              [[0,0], [0,1]] // Horizontal
const disproportionateMove =        [[0,0], [2,1]] // Disproportionate
const diagonalForwardMove =         [[0,0], [1,1]] // Diagonal forward 1 unit
const diagonalForward2UnitsMove =   [[0,0], [2,2]] // Diagonal forward > 1 unit
const diagonalBackwardsMove =       [[1,1], [0,0]] // Diagonal backward 1 unit
const diagonalBackwards2UnitsMove = [[2,2], [0,0]] // Diagonal backward > 1 unit

const backwardsMove =               [[3,3], [2,3]] // Backwards

const distance0position =			[0,2] // Distance of zero, first given position
const distance1position1 =			[1,3] // Distance of one, first position
const distance1position2 = 			[1,4] // Distance of one, second position
const distance2position1 =			[1,3] // Distance of two, first position
const distance2position2 = 			[1,5] // Distance of two, second position
const distance3position1 =			[5,0] // Distance of five, first position
const distance3position2 = 			[5,3] // Distance of five, second position


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

      assert(checkers.is_Empty(game.board, emptyInitialMove[0]) == true);
      assert(checkers.is_Empty(game.board, nonEmptyInitialMove[0]) == false);

    });

  });

  describe("testIsDiagonal()", function() {

    var game = newBasicGame();

    it("should test that isDiagonalFunction works properly", function() {

      assert.equal(checkers.is_Diagonal(verticalMove[0], verticalMove[1]), false, "vertical fail");
      assert.equal(checkers.is_Diagonal(horizontalMove[0], horizontalMove[1]), false, "hoirzontal fail");
      assert.equal(checkers.is_Diagonal(disproportionateMove[0], disproportionateMove[1]), false, "disproportionate fail");

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
  
  describe("findDistance()", function() {
 
    var game = newBasicGame();

    it("should test if findDistance function works properly", function() {

      assert(checkers.findDistance(distance0position, distance0position) == 0);
      assert(checkers.findDistance(distance1position1, distance1position2) == 1);
	  assert(checkers.findDistance(distance2position1, distance2position2) == 2);
	  assert(checkers.findDistance(distance3position1, distance3position2) == 5);

    });
 });
 
  describe("validJump()", function() {
 
    var game = newBasicGame();

    it("should test if validJump function works properly", function() {

	  assert(checkers.validJump(game, distance2position1,distance2position2) == true);
      assert(checkers.validJump(game, distance3position1,distance3position2) == false);

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
 * game = newGame()
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

var assert = require("assert");
var checkers = require("../../../src/public/javascript/checkers");

describe("checkers.js", function() {

  describe("makeMove()", function() {

    test_game = checkers.newGame(1, true, true);
    test_game.turn = 0;
    test_game.player_names = ["Curtis", "Sam"];

    test_game.board[0][1];

    it("should test if ", function() {
      console.log("TEST BOARD: " + JSON.stringify(test_game.board));
      assert(true);
    });

  });

});


// isEmpty
// Checks if target space is empty
/*
 *
 *
 *
 */

// isDiagonal
// Checks if diagonal to selected space
/*
 *
 *
 *
 */

// moveForward
// checks if piece is going "forward" or "backward"
/*
 *
 *
 *
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

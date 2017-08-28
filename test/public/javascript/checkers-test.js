var assert = require("assert");
var checkers = require("../../../src/public/javascript/checkers");

// should be initially empty squares
const emptyPos1 =                   [0,1];
const emptyPos2 =                   [5,2];
const emptyPos3 =                   [3,4];

// should be initially non-empty
const nonEmptyPos1 =                [0,0];
const nonEmptyPos2 =                [2,6];
const nonEmptyPos3 =                [7,5];

// move from empty square
const emptyMove =                   [[3,4], [4,5]];

// vertical and horizonal moves
const forwardMove =                 [[0,0], [2,0]];
const backwardMove =                [[2,0], [0,0]];
const rightwardMove =               [[0,0], [0,2]];
const leftwardMove =                [[0,2], [0,0]];

// disproportionate moves
const disproportionateMove1 =       [[0,0], [2,1]];
const disproportionateMove2 =       [[0,0], [4,3]];
const disproportionateMove3 =       [[0,0], [1,5]];

// diagonal moves
const diagonalForwardMove =         [[0,0], [1,1]]; // Diagonal forward 1 unit
const diagonalForward2UnitsMove =   [[0,0], [2,2]]; // Diagonal forward 2 units
const diagonalBackwardMove =        [[1,1], [0,0]]; // Diagonal backward 1 unit
const diagonalBackward2UnitsMove =  [[2,2], [0,0]]; // Diagonal backward 2 units

// moves of different distances
const distance0move =               [[0,0], [0,0]];
const distance1move =               [[0,0], [1,1]];
const distance2move =               [[0,0], [2,2]];
const distance3move =			    [[0,0], [3,3]];

// valid jumps
const jump1 =                       [[2,0], [4,2]];
const jump2 =                       [[5,7], [3,5]];

// valid steps
const step1 =                       [[3,1], [2,2]];
const step2 =                       [[4,6], [5,5]];

// valid moves
const move1 =                       [[2,0], [4,2]];
const move2 =                       [[5,7], [3,5]];
const move3 =                       [[3,1], [2,2]];
const move4 =                       [[4,6], [5,5]];

// invalid moves
const invalidMove1 =                [[0,0]];
const invalidMove2 =                [[0,0], [0,1]];
const invalidMove3 =                [[2,0], [4,2], [5,3]];

//validating Jumps
const positions = [[4,3],[2,5]]

var validJump = newBasicGame(); //valid Jump
validJump.turn = 1;
validJump.board[3][4] = {player:0, king:false};

var invalidJumpOwnPiece = newBasicGame(); //piece jumping over is its own
invalidJumpOwnPiece.turn = 1;
invalidJumpOwnPiece.board[3][4] = {player:1, king:false};

var invalidJumpNoPiece = newBasicGame(); //no piece to jump over
invalidJumpNoPiece.turn = 1;
invalidJumpNoPiece.board[3][4] = null;

function newBasicGame() {
    game = checkers.newGame("1", true, true);
    game.player_names = ["Curtis", "Sam"];
    return game;
}

function newKingsGame() {
    game = checkers.newGame("2", true, true);
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

function newSpecialGame() {
    game = checkers.newGame("3", true, true);
    game.player_names = ["Curtis", "Sam"];
    for (var r = 0; r < game.board.length; r++) {
        for (var c = 0; c < game.board[r].length; c++) {
            game.board[r][c] = null;
        }
    }
    game.board[2][0] = {"player": 0, "king": false};
    game.board[3][1] = {"player": 1, "king": false};
    
    game.board[4][6] = {"player": 0, "king": false};
    game.board[5][7] = {"player": 1, "king": false};
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
            assert(checkers.isDiagonal(diagonalBackwardMove[0], diagonalBackwardMove[1]) === true);
            assert(checkers.isDiagonal(diagonalBackward2UnitsMove[0], diagonalBackward2UnitsMove[1]) === true);
        });
        
    });
    
    describe("correctDirection()", function() {
        
        var basicGame = newBasicGame();
        var kingsGame = newKingsGame();
        var piece = checkers.getPiece(basicGame.board, nonEmptyPos1);
        var kingPiece = checkers.getPiece(kingsGame.board, nonEmptyPos1);
        
        if ("should return false for a null (non-existant) piece", function() {
            assert(checkers.correctDirection(piece, emptyMove[0], emptyMove[1]) === false);
        });
        
        it("should return false for a normal piece moving backward", function() {
            assert(checkers.correctDirection(piece, backwardMove[0], backwardMove[1]) === false);
            assert(checkers.correctDirection(piece, diagonalBackwardMove[0], diagonalBackwardMove[1]) === false);
        });
        
        it("should return true for a normal piece moving forward", function() {
            assert(checkers.correctDirection(piece, forwardMove[0], forwardMove[1]) === true);
            assert(checkers.correctDirection(piece, diagonalForwardMove[0], diagonalForwardMove[1]) === true);
        });
        
        it("should return true for kings moving in any direction", function() {
            assert(checkers.correctDirection(kingPiece, diagonalForwardMove[0], diagonalForwardMove[1]) === true);
            assert(checkers.correctDirection(kingPiece, forwardMove[0], forwardMove[1]) === true);
            assert(checkers.correctDirection(kingPiece, backwardMove[0], backwardMove[1]) === true);
        });
        
    });
    
    describe("findDistance()", function() {
        
        var basicGame = newBasicGame();
        var kingsGame = newKingsGame();
        
        it("should return 0 for a distance 0 move", function() {
            assert(checkers.findDistance(distance0move[0], distance0move[1]) === 0);
        });
        
        it("should return 0 for a distance 1 move", function() {
            assert(checkers.findDistance(distance1move[0], distance1move[1]) === 1);
        });
        
        it("should return 0 for a distance 2 move", function() {
            assert(checkers.findDistance(distance2move[0], distance2move[1]) === 2);
        });
        
        it("should return 0 for a distance 3 move", function() {
            assert(checkers.findDistance(distance3move[0], distance3move[1]) === 3);
        });
        
    });
    
    describe("validJump()", function() {
        
        var game = newSpecialGame();
        var piece1 = {"player": 0, "king": false};
        var piece2 = {"player": 1, "king": false};
        
        it("should return false when the jump is the wrong distance", function() {
            assert(checkers.validJump(game, piece1, distance0move[0], distance0move[1]) === false);
            assert(checkers.validJump(game, piece1, distance1move[0], distance1move[1]) === false);
            assert(checkers.validJump(game, piece1, distance3move[0], distance3move[1]) === false);
        });
        
        it("should return false when there is no piece to jump over", function() {
            assert(checkers.validJump(game, piece1, distance2move[0], distance2move[1]) === false);
        });
        
        it("should return true for valid jumps by normal pieces", function() {
            assert(checkers.validJump(game, piece1, jump1[0], jump1[1]) === true);
            assert(checkers.validJump(game, piece2, jump2[0], jump2[1]) === true);
        });
        
    });
    
    describe("validStep()", function() {
        
        var game = newSpecialGame();
        var piece1 = {"player": 0, "king": false};
        var piece2 = {"player": 1, "king": false};
        
        it("should return false when the step is the wrong distance", function() {
            assert(checkers.validStep(game, piece1, distance0move[0], distance0move[1]) === false);
            assert(checkers.validStep(game, piece1, distance2move[0], distance2move[1]) === false);
            assert(checkers.validStep(game, piece1, distance3move[0], distance3move[1]) === false);
        });
        
        // it("should return true for valid steps by normal pieces", function() {
        //     assert(checkers.validStep(game, piece1, step1[0], step1[1]) === true);
        //     assert(checkers.validStep(game, piece2, step2[0], step2[1]) === true);
        // });
        
    });
    
    describe("validateMove()", function() {
        
        var game = newSpecialGame();
        
        it("should return false when the first move is the wrong distance", function() {
            assert(checkers.validateMove(game, distance0move) === false);
            assert(checkers.validateMove(game, distance1move) === false);
            assert(checkers.validateMove(game, distance3move) === false);
        });
        
        it("should return false when there is no piece to jump over", function() {
            assert(checkers.validateMove(game, distance2move) === false);
        });
        
        it("should return false for a move with only 1 position", function() {
            assert(checkers.validateMove(game, invalidMove1) === false);
        });
        
        it("should return false for a move which is not diagonal", function() {
            assert(checkers.validateMove(game, invalidMove2) === false);
        });
        
        it("should return false for a move which has a step after a valid jump", function() {
            assert(checkers.validateMove(game, invalidMove3) === false);
        });
        
        it("should return true for valid jumps by normal pieces", function() {
            assert(checkers.validateMove(game, move1) === true);
            // assert(checkers.validateMove(game, move2) === true);
            // assert(checkers.validateMove(game, move3) === true);
            assert(checkers.validateMove(game, move4) === true);
        });
        
    });
    
    describe("copyGame()", function() {
        
        it("should correctly copy details of a game object", function() {
            var orig = newSpecialGame();
            var copy = checkers.copyGame(orig);
            
            assert(orig.turn === copy.turn);
            assert(orig.game_id === copy.game_id);
            assert(orig.public === copy.public);
            assert(orig.active === copy.active);
            assert(orig.player_names[0] === copy.player_names[0]);
        });
        
    });
    
    describe("makeMove()", function() {
        
        it("should fail when it's not the player's turn", function() {
            var game = newSpecialGame();
            game.turn = 1;
            checkers.makeMove(game, move1);
            assert(checkers.getPiece(game.board, move1[1]) === null);
            assert(checkers.getPiece(game.board, move1[0]) !== null);
            assert(checkers.getPiece(game.board, move1[0]).player === 0);
            assert(checkers.getPiece(game.board, move1[0]).king === false);
        });
        
        it("should move a piece when making a valid jump", function() {
            var game = newSpecialGame();
            checkers.makeMove(game, move1);
            assert(checkers.getPiece(game.board, move1[0]) === null);
            assert(checkers.getPiece(game.board, move1[1]) !== null);
            assert(checkers.getPiece(game.board, move1[1]).player === 0);
            assert(checkers.getPiece(game.board, move1[1]).king === false);
        });
        
        it("should move a piece when making a valid jump", function() {
            var game = newSpecialGame();
            game.turn = 1;
            checkers.makeMove(game, move2);
            assert(checkers.getPiece(game.board, move2[0]) === null);
            assert(checkers.getPiece(game.board, move2[1]) !== null);
            assert(checkers.getPiece(game.board, move2[1]).player === 1);
            assert(checkers.getPiece(game.board, move2[1]).king === false);
        });
        
    });
    
});

const assert = require("assert");
const rm = require("../../src/server/requestManager");
const checkers = require("../../src/public/javascript/checkers");

function expectError(done) {
    return function(err) {
        if (err) {
            done();
        } else {
            done(new Error("No error where one was expected"));
        }
    }
}

function expectSuccess(done) {
    return function(err) {
        if (err) {
            done(new Error(err));
        } else {
            done();
        }
    }
}

// player objects
const player1 = {
    "player_id": null,
    "player_name": "name1",
    "player_number": 0,
    "game_id": null,
    "last_request": null,
    "new_messages": []
};
const player2 = {
    "player_id": null,
    "player_name": "name2",
    "player_number": 1,
    "game_id": null,
    "last_request": null,
    "new_messages": []
};
const game = {
    "game_id": null,
    "public": true,
    "active": true,
    "player_names": [player1.player_name, player2.player_name],
    "player_pieces": [0, 0],
    "timer": 120,
    "turn": 0,
    "board": checkers.newBoard()
}

// invalid messages
const messageInvalid = {};

// valid messsages
const messageJoin = { "type": "join", "text": "" };
const messageForfeit = { "type": "forfeit", "text": "" };
const messageRequestDraw = { "type": "request_draw", "text": "" };
const messageAcceptDraw = { "type": "accept_draw", "text": "" };
const messageRejectDraw = { "type": "reject_draw", "text": "" };

before(function(done) {
    done = expectSuccess(done);
    
    rm.connect(function(err) {
        if (err) return done(true);
        
        rm.dbm.addGame(game, function(err, res) {
            if (err) return done(true);
            
            var game_id = game.game_id;
            player1.game_id = game_id;
            player2.game_id = game_id;
            
            rm.dbm.addPlayer(player1, function(err, res) {
                if (err) return done(true);
                
                rm.dbm.addPlayer(player2, function(err, res) {
                    if (err) return done(true);
                    
                    rm.dbm.addOpponent(game_id, player1.player_id, function(err, res) {
                        if (err) return done(true);
                        
                        rm.dbm.addOpponent(game_id, player2.player_id, done);
                    });
                });
            });
        });
    });
});

describe("requestManager.js", function() {
    
    describe("sendMesssage()", function() {
        
        it("should fail if player_id is not a string", function(done) {
            done = expectError(done);
            
            rm.sendMesssage(0, messageJoin, done);
        });
        
        it("should fail if message is not in the valid message format", function(done) {
            done = expectError(done);
            
            rm.sendMesssage(player1.player_id, messageInvalid, done);
        });
        
        it("should add the given message to the opponents inbox", function(done) {
            done = expectSuccess(done);
            
            rm.sendMesssage(player1.player_id, messageJoin, function(err, res) {
                if (err) return done(true);
                
                rm.dbm.getPlayer(player2.player_id, function(err, player) {
                    if (err) return done(true);
                    
                    if (player.new_messages.length > 0 || player.new_messages[0].type !== "join") {
                        done(false);
                    } else {
                        done(true);
                    }
                });
            });
        });
        
    });
    
    describe("newGame()", function() {
        
        it("should fail if player_name isn't a string", function(done) {
            done = expectError(done);
            
            rm.newGame(0, true, done);
        });
        
        it("should fail if is_public isn't a boolean", function(done) {
            done = expectError(done);
            
            rm.newGame("player name", 0, done);
        });
        
        it("should create and return a new game and player object", function(done) {
            done = expectSuccess(done);
            
            rm.newGame("player name", true, function(err, res) {
                if (err) return done("newGame returned an error");
                
                if ("player" in res && "game" in res) {
                    done();
                } else {
                    done("failed to return a player and game");
                }
            });
        });
        
    });
    
    describe("joinGame()", function() {
        
        it("should fail if player_name isn't a string", function(done) {
            done = expectError(done);
            
            rm.joinGame(0, "12345678912", done);
        });
        
        it("should fail if game_id isn't a string", function(done) {
            done = expectError(done);
            
            rm.joinGame("player name", 0, done);
        });
        
        it("should fail if game_id isn't a valid game ID", function(done) {
            done = expectError(done);
            
            rm.joinGame("player name", "not a valid game id", done);
        });
        
        it("should create and return a new player object and the old game object", function(done) {
            done = expectSuccess(done);
            
            rm.newGame("player 1", true, function(err, res) {
                if (err) return done("newGame returned an error");
                
                var game = res.game;
                rm.joinGame("player 2", game.game_id, function(err, res) {
                    if (err) return done("joinGame returned an error");
                    
                    if ("player" in res && "game" in res) {
                        done();
                    } else {
                        done("failed to return a player and game");
                    }
                });
            });
        });
        
    });
    
    describe("makeMove()", function() {
        
        it("should fail if player_id isn't a string", function(done) {
            done = expectError(done);
            
            rm.makeMove(0, [[0, 1], [1, 2]], done);
        });
        
        it("should fail if move isn't a valid move object", function(done) {
            done = expectError(done);
            
            rm.makeMove(player1.player_id, 0, done);
        });
        
        it("should return the game unchanged if the move isn't valid for the current board configuration", function(done) {
            done = expectError(done);
            
            rm.makeMove(player1.player_id, [[0, 0], [7, 0]], done);
        });
        
        it("should update the game object and return the new object to the player", function(done) {
            done = expectSuccess(done);
            
            rm.makeMove(player1.player_id, [[2, 0], [3, 1]], function(err, res) {
                if (err) return done(err);
                
                if ("game" in res) {
                    done();
                } else {
                    done("failed to return game object");
                }
            });
        });
        
    });
    
    describe("getUpdates()", function() {
        
        it("should fail if player_id isn't a string", function(done) {
            done = expectError(done);
            
            rm.getUpdates(0, done);
        });
        
        it("should fail if player_id isn't a valid player ID", function(done) {
            done = expectError(done);
            
            rm.getUpdates("not a valid player ID", done);
        });
        
        it("should return the current state of the game and any new messages", function(done) {
            done = expectSuccess(done);
            
            rm.getUpdates(player1.player_id, function(err, res) {
                if (err) return done(err);
                
                if ("game" in res && "messages" in res) {
                    done();
                } else {
                    done("failed to return game and messages");
                }
            });
        });
        
    });
    
});

after(function(done) {
    rm.dbm.deleteAll(player1.game_id, function(err, res) {
        done();
    });
});

const assert = require("assert");
const rm = require("../../src/server/requestManager");

function expectError(done) {
    return function(err) {
        if (err) {
            done();
        } else {
            done(new Error(err));
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
    "board": null
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
    
    describe("sendMesssage", function() {
        
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
    
});

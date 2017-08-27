const assert = require("assert");
const rm = require("../../src/server/requestManager");

function doneError(err, res) {
    done(!err, res);
}

// valid player ids
const playerId1 = "0";
const playerId2 = "11";
const playerId3 = "abc";

// invalid messages
const messageInvalid1 = [0, 1];
const messageInvalid2 = {};
const messageInvalid3 = { "type" : "" };
const messageInvalid4 = { "text" : "" };

// valid messsages
const messageJoin = { "type": "join", "text": "" };
const messageForfeit = { "type": "forfeit", "text": "" };
const messageRequestDraw = { "type": "request_draw", "text": "" };
const messageAcceptDraw = { "type": "accept_draw", "text": "" };
const messageRejectDraw = { "type": "reject_draw", "text": "" };

describe("requestManager.js", function() {
    return;
    
    describe("sendMesssage", function() {
        
        it("should fail if player_id is not a string", function() {
            rm.sendMesssage(0, messageJoin, doneError);
            rm.sendMesssage(true, messageJoin, doneError);
            rm.sendMesssage(false, messageJoin, doneError);
            rm.sendMesssage(['abc'], messageJoin, doneError);
        });
        
        it("should fail if message is not in the valid message format", function() {
            
        });
        
        it("should add the given message to the opponents inbox", function() {
            
        });
        
    });
    
});

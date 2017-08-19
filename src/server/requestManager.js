
/**
@module request-manager
@description Receives requests from app.js and determines how to proceed with
processing each request.
*/

/** an instance of the Path module for file paths */
const path = require("path").join;

/** an instance of the databaseManager module for connecting to the database */
const db = require(path(__dirname, "databaseManager"));

/** an instance of the checkersGame module */
const checkers = require(path(__dirname, "../public/javascript/checkers"));

// Initialize the database-manager object
db.connect(function(err) {
    if (err) {
        console.error("Failed to connect to database.\nExiting...");
        process.exit(1);
    } else {
        console.log("Connected to databse.");
    }
});

/**
TODO
@param {} callback - the function to be called when this operation has completed
*/
function getGames(callback) {
    //db.getGamesList(callback);
	
    // sample response
	callback(false, 
		[ {
            "game_id": "0gid0",
            "player_names": ["hajerkr"],
            "player_colors": ["black"],
            "turn": 0,
            "public": true,
            "active": true,
            "board": [
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 0, "king": false}],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 1, "king": true}],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 0, "king": false}],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 1, "king": true}],
            ]
        },
		{
            "game_id": "2gid2",
            "player_names": ["CurtisB"],
            "player_colors": ["black"],
            "turn": 0,
            "public": true,
            "active": true,
            "board": [
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 0, "king": false}],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 1, "king": true}],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 0, "king": false}],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 1, "king": true}],
            ]
        },
		{
            "game_id": "3gid3",
            "player_names": ["Bwayne"],
            "player_colors": ["black"],
            "turn": 0,
            "public": true,
            "active": true,
            "board": [
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 0, "king": false}],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 1, "king": true}],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 0, "king": false}],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 1, "king": true}],
            ]
        }
		]);
}

function newPlayer(player_name, player_number, game_id) {
    return {
        "player_id": "",
        "player_name": player_name,
        "player_number": player_number,
        "game_id": game_id,
        "opponent_id": "",
        "last_request": 0,
        "new_messages": []
    };
}

/**
TODO
@param {} callback - the function to be called when this operation has completed
*/
function newGame(player_name, is_public, callback) {
    var game = checkers.newGame("", is_public);
    
    db.addGame(game, function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        
        game = res;
        var player = newPlayer(player_name, 0, game.game_id);
        
        db.addPlayer(player, function(err, res) {
            if (err) {
                callback(err);
                return;
            }
            
            callback(false, {
                "player": res,
                "game": game
            });
        });
    });
}

/**
TODO
@param {} callback - the function to be called when this operation has completed
*/
function joinGame(player_name, game_id, callback) {
    // TODO
    // sample response
    callback(false, {
        "player": {
            "player_id": "0pid0",
            "player_name": player_name,
            "player_number": 1,
            "game_id": game_id,
            "opponent_id": "0oid0",
            "last_request": 0,
            "new_messages": []
        },
        "game": {
            "game_id": game_id,
            "player_names": [player_name],
            "player_colors": ["red"],
            "turn": 0,
            "public": true,
            "active": false,
            "board": [
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 0, "king": false}],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 1, "king": true}],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 0, "king": false}],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, {"player": 1, "king": true}],
            ]
        }
    });
}

/**
TODO
@param {} callback - the function to be called when this operation has completed
*/
function makeMove(player_id, move, callback) {
    // TODO
}

/**
TODO
@param {} callback - the function to be called when this operation has completed
*/
function getUpdates(player_id, callback) {
    // TODO
}

/**
TODO
@param {} callback - the function to be called when this operation has completed
*/
function sendMesssage(player_id, message, callback) {
    // TODO
}

module.exports = {
    "getGames": getGames,
    "newGame": newGame,
    "joinGame": joinGame,
    "makeMove": makeMove,
    "getUpdates": getUpdates,
    "sendMesssage": sendMesssage
};

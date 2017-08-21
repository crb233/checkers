
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
        console.log("Connected to database.");
    }
});

/**
TODO
*/
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
function getGames(callback) {
    db.getGamesList(callback);
}

/**
TODO
@param {} callback - the function to be called when this operation has completed
*/
function newGame(player_name, is_public, callback) {
    var game = checkers.newGame("", is_public, true);
    game.player_names.push(player_name);
    game.player_colors.push("");
    db.addGame(game, function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        
        var player = newPlayer(player_name, 0, game.game_id);
        db.addPlayer(player, function(err, res) {
            if (err) {
                callback(err);
                return;
            }
            
            console.log(JSON.stringify({
                "player": player,
                "game": game
            }));
            
            callback(false, {
                "player": player,
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
    db.getGame(game_id, function(err, game) {
        if (err) {
            callback(err);
            return;
        }
        
        if (game.active || player_names.length != 1) {
            callback("This game is no longer available");
            return;
        }
        
        game.active = true;
        game.player_names.push(player_name);
        game.player_colors.push("");
        db.updateGame(game, function(err, res) {
            if (err) {
                callback(err);
                return;
            }
            
            // TODO set opponent_id
            
            var player = newPlayer(player_name, 1, game.game_id);
            db.addPlayer(player, function(err, res) {
                if (err) {
                    callback(err);
                    return;
                }
                
                callback(false, {
                    "player": player,
                    "game": game
                });
            });
        });
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

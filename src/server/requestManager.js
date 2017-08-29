
/**
@module request-manager
@description Receives requests from app.js and determines how to proceed with
processing each request.
*/

const default_player_time = 120;
const default_player_pieces = 0;

/** an instance of the Path module for file paths */
const path = require("path").join;

/** an instance of the databaseManager module for connecting to the database */
const dbm = require(path(__dirname, "databaseManager"));

/** an instance of the checkersGame module */
const checkers = require(path(__dirname, "../public/javascript/checkers"));

// Initialize the database-manager object
function connect(callback) {
    dbm.connect(callback);
}



// INTERNAL METHODS



/**
TODO
*/
function newPlayer(player_name, player_number, game_id) {
    return {
        "player_id": "",
        "player_name": player_name,
        "player_number": player_number,
        "game_id": game_id,
        "last_request": null,
        "new_messages": []
    };
}

function isBoolean(obj) {
    return typeof obj === "boolean";
}

function isString(obj) {
    return typeof obj === "string" || obj instanceof String;
}

function isMove(obj) {
    if (!Array.isArray(obj)) {
        return false;
    }

    for (var i = 0; i < obj.length; i++) {
        if (!Array.isArray(obj[i])) {
            return false;
        }
        if (obj[i].length !== 2) {
            return false;
        }
    }

    return true;
}

function isMessage(obj) {
    return typeof obj === "object" && isString(obj.type) && isString(obj.text);
}



// EXTERNAL METHODS



/**
TODO
@param {} callback - the function to be called when this operation has completed
*/
function getGames(callback) {
    dbm.getGamesList(callback);
}

/**
TODO
@param {} callback - the function to be called when this operation has completed
*/
function newGame(player_name, is_public, callback) {
    if (!isString(player_name)) {
        callback("Parameter player_name must be a string");
        return;
    }

    if (!isBoolean(is_public)) {
        callback("Parameter is_public must be a boolean");
        return;
    }

    var game = checkers.newGame("", is_public, false);
    game.player_names.push(player_name);
    game.player_pieces.push(default_player_pieces);
    dbm.addGame(game, function(err, res) {
        if (err) {
            callback(err);
            return;
        }

        var player = newPlayer(player_name, 0, game.game_id);
        player.last_request = new Date().getTime();
        dbm.addPlayer(player, function(err, res) {
            if (err) {
                callback(err);
                return;
            }

            dbm.addOpponent(game.game_id, player.player_id, function(err, res) {
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
function joinGame(player_name, game_id, callback) {
    
    if (!isString(player_name)) {
        callback("Parameter player_name must be a string");
        return;
    }

    if (!isString(game_id)) {
        callback("Parameter game_id must be a string");
        return;
    }

    dbm.getGame(game_id, function(err, game) {
        if (err) return callback(err);
        
        if (!game) return callback("Requested game is unavailable");
        
        if (game.active || game.player_names.length != 1) {
            callback("This game is no longer available");
            return;
        }
        
        var player = newPlayer(player_name, 1, game.game_id);
        player.last_request = new Date().getTime();
        dbm.addPlayer(player, function(err, res) {
            if (err) {
                callback(err);
                return;
            }

            game.active = true;
            game.player_names.push(player_name);
            game.player_pieces.push(default_player_pieces);
            dbm.updateGame(game, function(err, res) {
                if (err) {
                    callback(err);
                    return;
                }

                dbm.addOpponent(game.game_id, player.player_id, function(err, res) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    var message = {
                        "type": "join",
                        "text": "Player " + player_name + " has joined your game!"
                    };
                    sendMesssage(player.player_id, message, function(err, res) {
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
        });
    });
}

/**
TODO
@param {} callback - the function to be called when this operation has completed
*/
function makeMove(player_id, move, callback) {
    if (!isString(player_id)) {
        callback("Parameter player_id must be a string");
        return;
    }

    if (!isMove(move)) {
        callback("Parameter move is in an unexpected format");
        return;
    }

    dbm.getPlayer(player_id, function(err, player) {
        if (err) {
            callback(err);
            return;
        }

        dbm.getGame(player.game_id, function(err, game) {
            if (err) {
                callback(err);
                return;
            }

            if (game.turn != player.player_number) {
                callback("It is not your turn to make a move");
                return;
            }

            if (!checkers.validateMove(game, move)) {
                callback("The attempted move was invalid");
                return;
            }

            checkers.makeMove(game, move);
            dbm.updateGame(game, function(err, res) {
                if (err) {
                    callback(err);
                    return;
                }

                callback(false, {
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
function getUpdates(player_id, callback) {
    if (!isString(player_id)) {
        callback("Parameter player_id must be a string");
        return;
    }

    dbm.getPlayer(player_id, function(err, player) {
        if (err) {
            callback(err);
            return;
        }

        var messages = player.new_messages;
        player.new_messages = [];
        player.last_request = new Date().getTime();
        dbm.updatePlayer(player, function(err, res) {
            if (err) {
                callback(err);
                return;
            }

            dbm.getGame(player.game_id, function(err, game) {
                if (err) {
                    callback(err);
                    return;
                }
                
                for (var i = 0; i < messages.length; i++) {
                    var m = messages[i];
                    switch (m.type) {
                        case "lose":
                        case "accept_draw":
                        case "forfeit":
                            dbm.deleteAll(player.game_id, function() {});
                    }
                }
                
                callback(false, {
                    "game": game,
                    "messages": messages
                });
            });
        });
    });
}

/**
TODO
@param {} callback - the function to be called when this operation has completed
*/
function sendMesssage(player_id, message, callback) {
    if (!isString(player_id)) {
        callback("Parameter player_id must be a string");
        return;
    }

    if (!isMessage(message)) {
        callback("Parameter message is in an unexpected format");
        return;
    }

    dbm.getPlayer(player_id, function(err, player) {
        if (err) {
            callback(err);
            return;
        }

        dbm.getOpponent(player.game_id, function(err, opps) {
            if (err) {
                callback(err);
                return;
            }

            if (opps.player_ids[player.player_number] !== player_id) {
                callback("Player IDs do not match in database");
                return;
            }

            var opp_id = opps.player_ids[1 - player.player_number];
            dbm.getPlayer(opp_id, function(err, opponent) {
                if (err) {
                    callback(err);
                    return;
                }

                opponent.new_messages.push(message);
                dbm.updatePlayer(opponent, callback);
            });
        });
    });
}

module.exports = {
    "dbm": dbm,
    "connect": connect,
    "getGames": getGames,
    "newGame": newGame,
    "joinGame": joinGame,
    "makeMove": makeMove,
    "getUpdates": getUpdates,
    "sendMesssage": sendMesssage
};

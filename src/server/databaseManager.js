
/**
@module database-manager
*/

// Load required modules
const client = require("mongodb").MongoClient;
// const async = require("async");

/** Indexes for the players collection */
const playerIndexes = [
    {
        "player_id": 1
    },
    {
        "game_id": 1
    }
];

/** Indexes for the games collection */
const gameIndexes = [
    {
        "game_id": 1
    }
];

/** Indexes for the opponents collection */
const opponentsIndexes = [
    {
        "player_id": 1
    }
];

/** The set of valid characters from which IDs should be created. */
const id_chars = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
The number of characters in each ID string.
Using 12 characters from a 36 character set produces ln(36 ^ 12) / ln(2) = 62
bits of information, which nearly guarantees very few ID collisions.
*/
const id_length = 12;

/**
Creates and returns a random ID
*/
function createRandomID() {
    var arr = [];
    for (var i = 0; i < id_length; i++) {
        var index = Math.floor(Math.random() * id_chars.length);
        arr.push(id_chars.charAt(index));
    }
    return arr.join("");
}

/**
Creates and returns the MongoDB connection URL
@param {string} username - the MongoDB account username
@param {string} password - the MongoBD account password
@param {string} address - the address of the MongoDB database
@param {string} database - the name of the database to be used
@return the database connection URL
*/
function createUrl(username, password, address, database) {
    return "mongodb://"
        + username + ":" + password + "@"
        + address + "/" + database;
}



/** The database object (null if not connected to a database) */
var db = null;

/** The set of collections in the current database (players and games) */
var colls = {};

/**
Determines if this manager has connected to the database
@return true if it is connected, otherwise false
*/
function isConnected() {
    return db !== null;
}

/**
Loads a collection from the database into the manager. If the collection doesn't
exist, create it with the given indexes.
@param {string} name - the name of the database
@param {} indexed - an object containing the indexing options for the collection
@param {} callback - the function to be called when this operation has completed
*/
function loadCollection(name, indexes, callback) {
    db.collection(name, function(err, coll) {
        if (err) {
            // failed to load collection
            // try creating a new one
            db.createCollection(name, {}, function(err, coll) {
                if (err) {
                    callback(err);
                    return;
                }

                // create collection indexed
                coll.createIndexes(indexes, function(err) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    colls[name] = coll;
                    callback(false);
                });
            });
            return;
        }

        colls[name] = coll;
        callback(false);
    });
}

/**
Connects to the database specified by the environment variables DB_USER,
DB_PASS, DB_ADDR, and DB_NAME. This also loads the database's collections.
@param {} callback - the function to be called when this operation has completed
*/
function connect(callback) {
    // get database url from environment variables
    const url = createUrl(
        process.env.DB_USER, process.env.DB_PASS,
        process.env.DB_ADDR, process.env.DB_NAME
    );

    client.connect(url, function(err, db_object) {
        // failed to connect
        if (err) {
            callback(err);
            return;
        }

        db = db_object;
        loadCollection("players", playerIndexes, function(err) {
            if (err) {
                callback(err);
                return;
            }

            loadCollection("games", gameIndexes, function(err) {
                if (err) {
                    callback(err);
                    return;
                }

                loadCollection("opponents", opponentsIndexes, callback);
            });
        });
    });
}

/**
Creates a new player with the given username and player number by querying the
database until it generates a unique player ID.
@param {} callback - the function to be called when this operation has completed
*/
function addPlayer(player, callback) {
    if (typeof colls.players === "undefined") {
        callback("Server has not yet connected to the database.");
        return;
    }
    
    // Queries database with newly generated player ID
    (function getID() {
        var id = createRandomID();
        colls.players.findOne({ "player_id": id }, {}, function(err, res) {
            if (err) {
                callback(err);
                return;
            }

            // ID is not unique, try again
            if (res) {
                getID();
                return;
            }

            // ID is unique
            player.player_id = id;
            colls.players.insertOne(player, {}, function(err, res) {
                if (err) {
                    callback(err);
                    return;
                }

                callback(false, player);
            });
        });
    })();
}

/**
Adds the given game to the database after selecting a new and unique game_id
for it
@param {} callback - the function to be called when this operation has completed
*/
function addGame(game, callback) {
    if (typeof colls.players === "undefined") {
        callback("Server has not yet connected to the database.");
        return;
    }
    
    // Queries database with newly generated game ID
    (function getID() {
        var id = createRandomID();
        colls.games.findOne({ "game_id": id }, {}, function(err, res) {
            if (err) {
                callback(err);
                return;
            }

            // ID is not unique, try again
            if (res) {
                getID();
                return;
            }

            // ID is unique
            game.game_id = id;
            colls.games.insertOne(game, {}, function(err, res) {
                if (err) {
                    callback(err);
                    return;
                }

                callback(false, game);
            });
        });
    })();
}

function addOpponent(game_id, player_id, callback) {
    if (typeof colls.players === "undefined") {
        callback("Server has not yet connected to the database.");
        return;
    }
    
    colls.opponents.findOne({ "game_id": game_id }, {}, function(err, opps) {
        if (err) {
            callback(err);
            return;
        }

        if (opps) {
            opps.player_ids.push(player_id);
            colls.opponents.replaceOne({ "game_id": game_id }, opps, {}, function(err, res) {
                if (err) {
                    callback(err);
                    return;
                }

                callback(false, opps);
            });

        } else {
            opps = {
                "game_id": game_id,
                "player_ids": [player_id]
            };
            colls.opponents.insertOne(opps, {}, function(err, res) {
                if (err) {
                    callback(err);
                    return;
                }

                callback(false, opps);
            })
        }
    });
}

/**
Retrieves the player with the given ID from the database and passes it as the
second parameter to the callback function.
@param {string} player_id - the unique ID of the player
@param {} callback - the function to be called when this operation has completed
*/
function getPlayer(player_id, callback) {
    if (typeof colls.players === "undefined") {
        callback("Server has not yet connected to the database.");
        return;
    }
    
    colls.players.findOne({ "player_id": player_id }, {}, function(err, res) {
        if (err) {
            callback(err);
            return;
        }

        if (res === null || typeof res === undefined) {
            callback(true);
            return;
        }

        callback(false, res);
    });
}

/**
Retreives the game with the given ID from the database and passes it as the
second parameter to the callback function.
@param {string} game_id - the unique ID of the game
@param {} callback - the function to be called when this operation has completed
*/
function getGame(game_id, callback) {
    if (typeof colls.players === "undefined") {
        callback("Server has not yet connected to the database.");
        return;
    }
    
    colls.games.findOne({ "game_id": game_id }, {}, callback);
}

/**
Retrieves and returns the opponents object with the given game_id
*/
function getOpponent(game_id, callback) {
    if (typeof colls.players === "undefined") {
        callback("Server has not yet connected to the database.");
        return;
    }
    
    colls.opponents.findOne({ "game_id": game_id }, {}, callback);
}

/**
Updates a player object in the database
@param {} player - the player object to be updated in the database
@param {} callback - the function to be called when this operation has completed
*/
function updatePlayer(player, callback) {
    if (typeof colls.players === "undefined") {
        callback("Server has not yet connected to the database.");
        return;
    }
    
    colls.players.replaceOne({ "player_id": player.player_id }, player, {}, callback);
}

/**
Updates a game object in the database
@param {} game - the game object to be updated in the database
@param {} callback - the function to be called when this operation has completed
*/
function updateGame(game, callback) {
    if (typeof colls.players === "undefined") {
        callback("Server has not yet connected to the database.");
        return;
    }
    
    colls.games.replaceOne({ "game_id": game.game_id }, game, {}, callback);
}

/**
Retreives a list of all new public games from the database and passes it as
the second parameter to the callback function
@param {} callback - the function to be called when this operation has completed
*/
function getGamesList(callback) {
    if (typeof colls.players === "undefined") {
        callback("Server has not yet connected to the database.");
        return;
    }
    
    colls.games.find({"public": true, "active": false}).toArray(callback);
}

/**
Deletes the game object, both player objects, and the opponents object from the
database. If any one fails to be deleted, an error message will be logged and it
will still try to delete other objects
*/
function deleteAll(game_id, callback) {
    console.log("Deleting game " + game_id);
    
    getOpponent(game_id, function(err, opps) {
        if (err) return callback(err);
        
        var p1_id = opps.player_ids[0];
        var p2_id = opps.player_ids[1];
        colls.players.deleteOne({ "player_id": p1_id }, {}, function(err, opps) {
            if (err) console.log(err);
            
            colls.players.deleteOne({ "player_id": p2_id }, {}, function(err, opps) {
                if (err) console.log(err);
                
                colls.games.deleteOne({ "game_id": game_id }, {}, function(err, opps) {
                    if (err) console.log(err);
                    
                    colls.opponents.deleteOne({ "player_id": game_id }, {}, function(err, opps) {
                        if (err) console.log(err);
                        
                        callback(false);
                    });
                });
            });
        });
    });
}

/**
Returns a list of players who haven't responded in the given time
*/
function getUnresponsivePlayers(difference, callback) {
    time = new Date().getTime() - difference;
    
    colls.players.find({ "last_request": { "$lt": time } }).toArray(callback);
}

module.exports = {
    "createRandomID": createRandomID,
    "createUrl": createUrl,
    "isConnected": isConnected,
    "loadCollection": loadCollection,
    "connect": connect,
    "addPlayer": addPlayer,
    "addGame": addGame,
    "addOpponent": addOpponent,
    "getPlayer": getPlayer,
    "getGame": getGame,
    "getOpponent": getOpponent,
    "updatePlayer": updatePlayer,
    "updateGame": updateGame,
    "getGamesList": getGamesList,
    "deleteAll": deleteAll,
    "getUnresponsivePlayers": getUnresponsivePlayers
};

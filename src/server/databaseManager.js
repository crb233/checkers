
/**
@module database-manager
*/

// Load required modules
const client = require("mongodb").MongoClient;
// const async = require("async");

/** Indexes for the players collection */
const playerIndexes = [
    {
        "name": "player_id",
        "key": {"player_id": 1},
        "unique": true
    },
    {
        "name": "game_id",
        "key": {"game_id": 1},
        "unique": false
    }
];

/** Indexes for the games collection */
const gameIndexes = [
    {
        "name": "game_id",
        "key": {"game_id": 1},
        "unique": true
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
            
            loadCollection("games", gameIndexes, callback);
        });
    });
}

/**
Creates a new player with the given username and player number by querying the
database until it generates a unique player ID.
@param {string} username -
@param {number} number -
@param {} callback - the function to be called when this operation has completed
*/
function newPlayer(username, number, callback) {
    // Queries database with newly generated player ID
    (function getID() {
        var id = createRandomID();
        colls.players.findOne({ "player_id": id }, {}, function(err, res) {
            if (err) {
                callback(true);
                return;
            }
            
            // ID is not unique, try again
            if (res) {
                getID();
                return;
            }
            
            // ID is unique
            var player = {
                "player_id": id,
                "player_name": username,
                "player_number": number,
            };
            colls.players.insertOne(player, {}, callback);
        });
    })();
}

/**

@param {} callback - the function to be called when this operation has completed
*/
function newGame(is_public, callback) {
    // Queries database with newly generated game ID
    (function getID() {
        var id = createRandomID();
        colls.games.findOne({ "game_id": id }, {}, function(err, res) {
            if (err) {
                callback(true);
                return;
            }
            
            // ID is not unique, try again
            if (res) {
                getID();
                return;
            }
            
            // ID is unique
            var game = newGame(id, is_public);
            colls.players.insertOne(game, {}, callback());
        });
    })();
}

/**
Retrieves the player with the given ID from the database and passes it as the
second parameter to the callback function.
@param {string} player_id - the unique ID of the player
@param {} callback - the function to be called when this operation has completed
*/
function getPlayer(player_id, callback) {
    // TODO
}

/**
Updates a player object in the database
@param {} player - the player object to be updated in the database
@param {} callback - the function to be called when this operation has completed
*/
function updatePlayer(player, callback) {
    // TODO
}

/**
Retreives the game with the given ID from the database and passes it as the
second parameter to the callback function.
@param {string} game_id - the unique ID of the game
@param {} callback - the function to be called when this operation has completed
*/
function getGame(game_id, callback) {
    // TODO
}

/**
Updates a game object in the database
@param {} game - the game object to be updated in the database
@param {} callback - the function to be called when this operation has completed
*/
function updateGame(game, callback) {
    // TODO
}

/**
Retreives a list of all active public games from the database and passes it as
the second parameter to the callback function
@param {} callback - the function to be called when this operation has completed
*/
function getGamesList(callback) {
    // TODO
}

/**
Sends a message to a player's opponent by storing it in their opponent's list
of messages
@param {} callback - the function to be called when this operation has completed
*/
function sendMessage(player_id, message, callback) {
    // TODO
}

module.exports = {
    "isConnected": isConnected,
    "loadCollection": loadCollection,
    "connect": connect,
    "newPlayer": newPlayer,
    "getPlayer": getPlayer,
    "updatePlayer": updatePlayer,
    "newGame": newGame,
    "getGame": getGame,
    "updateGame": updateGame,
    "getGamesList": getGamesList,
    "sendMessage": sendMessage
};
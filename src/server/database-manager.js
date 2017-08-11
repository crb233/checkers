
// Get the MongoDB client
const client = require("mongodb").MongoClient;
const async = require("async");

// Indexes for the players collection
const playerIndexes = [
    {
        name: "player_id",
        key: {"player_id": 1},
        unique: true
    },
    {
        name: "game_id",
        key: {"game_id": 1},
        unique: false
    }
];

// Indexes for the games collection
const gameIndexes = [
    {
        name: "game_id",
        key: {"game_id": 1},
        unique: true
    }
];

// ID character set and length of generated IDs
// Using 12 characters from a 36 character set produces ln(36 ^ 12) / ln(2) = 62
// bits of information, which nearly guarantees very few ID collisions.
const id_chars = "abcdefghijklmnopqrstuvwxyz0123456789";
const id_length = 12;

// Creates and returns a random ID
function createRandomID() {
    var arr = [];
    for (var i = 0; i < id_length; i++) {
        var index = Math.floor(Math.random() * id_chars.length);
        arr.push(id_chars.charAt(index));
    }
    return arr.join("");
}

// Creates and returns the MongoDB connection URL
function createUrl(username, password, address, database) {
    return "mongodb://"
        + username + ":" + password + "@"
        + address + "/" + database;
}



// Initialize the database manager
var manager = {};
manager.db = null;

// Returns true if this manager has connected to the database, false otherwise
manager.isConnected = function() {
    return manager.db !== null;
};

// Loads a collection from the database into the manager
// If the collection doesn't exist, create it with the given indexes
manager.loadCollection = function(name, indexes, callback) {
    manager.db.collection(name, function(err, coll) {
        if (err) {
            // failed to load collection
            // try creating a new one
            manager.db.createCollection(name, {}, function(err, coll) {
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
                    
                    manager[name] = coll;
                    callback(false);
                });
            });
            return;
        }
        
        manager.db[name] = coll;
        callback(false);
    });
};

// Connects to the database
manager.connect = function(callback) {
    
    // get database url from environment variables
    const url = manager.createUrl(
        process.env.DB_USER, process.env.DB_PASS,
        process.env.DB_ADDR, process.env.DB_NAME
    );
    
    client.connect(url, function(err, db) {
        // failed to connect
        if (err) {
            callback(err);
            return;
        }
        
        manager.db = db;
        manager.loadCollection("players", playerIndexes, function(err) {
            if (err) {
                callback(err);
                return;
            }
            
            manager.loadCollection("games", gameIndexes, callback);
        });
    });
};

manager.newPlayer = function(username, number, callback) {
    // Queries database with newly generated player ID
    function getID() {
        var id = createRandomID();
        manager.players.findOne({ "player_id": id }, {}, function(err, res) {
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
            manager.players.insertOne(player, {}, callback());
        });
    }
};

manager.newGame = function(callback) {
    // Queries database with newly generated game ID
    function getID() {
        var id = createRandomID();
        manager.games.findOne({ "game_id": id }, {}, function(err, res) {
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
            manager.players.insertOne(player, {}, callback());
        });
    }
};

manager.getPlayer = function(callback) {
    callback(true);
};

manager.getGame = function(callback) {
    callback(true);
};

manager.getGamesList = function(callback) {
    callback(true);
};

manager.newMessage = function(callback) {
    callback(true);
};

module.exports = manager;

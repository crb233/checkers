
// get mongo client
const client = require("mongodb").MongoClient;

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



// database manager
var manager = {};
manager.db = null;
manager.collections = null;

// Returns true if this manager has connected to the database, false otherwise
manager.isConnected = function() {
    return manager.db !== null;
};

// Creates and returns the MongoDB connection URL
manager.createUrl = function(username, password, address, database) {
    return "mongodb://"
        + username + ":" + password + "@"
        + address + "/" + database;
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
                    
                    manager.db[name] = coll;
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

manager.newPlayer = function(callback) {
    callback(true);
};

manager.newGame = function(callback) {
    callback(true);
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

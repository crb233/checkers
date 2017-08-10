
// get mongo client
const client = require("mongodb").MongoClient;

// get database uri from environment variables
const uri = "mongodb://"
    + process.env.DB_USER + ":"
    + process.env.DB_PASS + "@"
    + process.env.DB_ADDR + "/"
    + process.env.DB_NAME;

var manager = {};

// database object
manager.db = null;

manager.connect = function(callback) {
    client.connect(uri, function(err, db) {
        if (!err) {
            manager.db = db;
        }
        callback(err);
    });
}

module.exports = manager;

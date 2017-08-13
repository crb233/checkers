
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
    db.getGamesList(callback);
}

/**
TODO
@param {} callback - the function to be called when this operation has completed
*/
function newGame(player_name, is_public, callback) {
    // TODO
}

/**
TODO
@param {} callback - the function to be called when this operation has completed
*/
function joinGame(player_name, game_id, callback) {
    // TODO
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

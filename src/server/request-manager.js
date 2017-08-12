
/**
@module request-manager
*/

// Create and initialize a database-manager object
const db = require("./database-manager");
db.connect(function(err) {
    if (err) {
        console.err("Failed to connect to database.\nExiting...");
        process.exit(1);
    } else {
        console.log("Connected to databse.");
    }
});

function getGames(callback) {
    db.getGamesList(callback);
}

function newGame(player_name, is_public, callback) {
    // TODO
}

function joinGame(player_name, game_id, callback) {
    // TODO
}

function makeMove(player_id, move, callback) {
    // TODO
}

function getUpdates(player_id, callback) {
    // TODO
}

function sendMesssage(player_id, message, callback) {
    // TODO
}

module.exports = {
    getGames: getGames,
    newGame: newGame,
    joinGame: joinGame,
    makeMove: makeMove,
    getUpdates: getUpdates,
    sendMesssage: sendMesssage
};

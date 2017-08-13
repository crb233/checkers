
/**
@module app
*/

/** an instance of the Express module for routing requests to endpoints
asynchrnonously */
const express = require("express");

/** an instance of the BodyParser module for parsing the POST requests into
JSON */
const body_parser = require("body-parser");

/** an instance of the RequestManager local module for managing different
kinds of requests */
const requests = require("./requestManager");

/** the port number for this server to use. It is set to the value of the
environment variable PORT, or 8080 if PORT isn't set. */
const port = process.env.PORT || 8080;

/** the directory for files with public access such as static HTML and CSS
files. These will be served statically from the server to the client. */
const public_dir = "src/client";

/** an instance of the Express server application for automatic HTTP routing.
It is initialized with BodyParser and static serving of public files */
const app = express();

app.use(express.static(public_dir));
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));



/**
@function
@name get/
@description Redirects requests for the root page to index.html
@param {} req - request data
@param {} res - response object
*/
app.get("/", function(req, res) {
    res.redirect(public_dir + "/public/index.html");
});

/**
@function
@name get/*
@description Redirects requests for unknown pages to index.html
@param {} req - request data
@param {} res - response object
*/
app.all("*", function(req, res) {
    res.redirect(public_dir + "/public/index.html");
});



/**
Creates and returns a callback function for automatically sending a HTTP
response containing an error code and an object
@param {} res - the HTTP response object
*/
function returnResponse(res) {
    return function(err, result) {
        res.send({
            "error": err,
            "result": result
        });
    };
}

/**
@function
@name post/get-games
@description Route for the client to get a list of public and active games
@param {} req - request data
@param {} res - response object
*/
app.post("/get-games", function(req, res) {
    requests.getGames(
        returnResponse(res)
    );
});

/**
@function
@name post/new-game
@description Route for the client to request the creation of a new game
@param {} req - request data
@param {} res - response object
*/
app.post("/new-game", function(req, res) {
    requests.newGame(
        req.body.player_name,
        req.body.public,
        returnResponse(res)
    );
});


/**
@function
@name post/new-game
@description Route for the client to request to join an active and public game
@param {} req - request data
@param {} res - response object
*/
app.post("/join-game", function(req, res) {
    requests.joinGame(
        req.body.player_name,
        req.body.game_id,
        returnResponse(res)
    );
});


/**
@function
@name post/new-game
@description Route for the client to make a move and update the game state
@param {} req - request data
@param {} res - response object
*/
app.post("/make-move", function(req, res) {
    requests.makeMove(
        res.body.player_id,
        res.body.move,
        returnResponse(res)
    );
});

/**
@function
@name post/get-updates
@description Route for the client to request updates on the state of the game
@param {} req - request data
@param {} res - response object
*/
app.post("/get-updates", function(req, res) {
    requests.getUpdates(
        res.body.player_id,
        returnResponse(res)
    );
});

/**
@function
@name post/send-message
@description Route for the client to send messages to an opponent
@param {} req - request data
@param {} res - response object
*/
app.post("/send-message", function(req, res) {
    requests.sendMesssage(
        res.body.player_id,
        res.body.message,
        returnResponse(res)
    );
});





// start the server on port 8080
app.listen(port, function() {
    console.log("Started server on port " + port + ".");
});

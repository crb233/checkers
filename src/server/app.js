
/**
@module app
*/

/** an instance of the Path module for file paths */
const path = require("path").join;

/** an instance of the Express module for routing requests to endpoints
asynchrnonously */
const express = require("express");

/** an instance of the BodyParser module for parsing the POST requests into
JSON */
const body_parser = require("body-parser");

/** an instance of the RequestManager local module for managing different
kinds of requests */
const requests = require(path(__dirname, "requestManager"));
requests.connect(function(err) {
    if (err) {
        console.error("Failed to connect to database.\nExiting...");
        process.exit(1);
    } else {
        console.log("Connected to database.");
    }
});

/** the port number for this server to use. It is set to the value of the
environment variable PORT, or 8080 if PORT isn't set. */
const port = process.env.PORT || 8080;

/** the directory for files with public access such as static HTML and CSS
files. These will be served statically from the server to the client. */
const public_dir = path(__dirname, "../public");

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
    res.redirect(path(public_dir, "index.html"));
});



/**
Creates and returns a callback function for automatically sending a HTTP
response containing an error code and an object
@param {} res - the HTTP response object
*/
function createErrorCheckCallback(res) {
    return function(err, result) {
        if (typeof err === "string") {
            res.status(500);
            res.send({
                "error": err
            });
            
        } else if (err || typeof result === "undefined" || result === null) {
            res.status(500);
            res.send({
                "error": "Unknown server error"
            });
            
        } else {
            res.status(200);
            res.send(result);
        }
    };
}

/**
@function
@name post/get-games
@description Route for the client to get a list of new public games
@param {} req - request data
@param {} res - response object
*/
app.post("/get-games", function(req, res) {
    requests.getGames(
        createErrorCheckCallback(res)
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
        createErrorCheckCallback(res)
    );
});


/**
@function
@name post/new-game
@description Route for the client to request to join a new public game
@param {} req - request data
@param {} res - response object
*/
app.post("/join-game", function(req, res) {
    requests.joinGame(
        req.body.player_name,
        req.body.game_id,
        createErrorCheckCallback(res)
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
        req.body.player_id,
        req.body.move,
        createErrorCheckCallback(res)
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
        req.body.player_id,
        createErrorCheckCallback(res)
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
        req.body.player_id,
        req.body.message,
        createErrorCheckCallback(res)
    );
});



// start the server on port 8080
app.listen(port, function() {
    console.log("Started server on port " + port + ".");
});

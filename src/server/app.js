// required modules and controllers
const express = require("express");
const body_parser = require("body-parser");
const requests = require("./request-manager");

// important values
const port = process.env.PORT || 8080;
const public_dir = "src/client/public";



// Initialize express app with body-parser and static file serving
const app = express();
app.use(body_parser.urlencoded({
    extended: true
}));
app.use(body_parser.json());
app.use(express.static(public_dir));



// redirect root page to to index.html
app.get("/", function(req, res) {
    res.redirect(public_dir + "/index.html");
});



function returnResult(res) {
    return function(err, result) {
        res.send({
            "error": err,
            "result": result
        });
    };
}

// get a list of all games
app.post("/get-games", function(req, res) {
    requests.getGames(
        returnResult(res)
    );
});

// new game requests
app.post("/new-game", function(req, res) {
    requests.newGame(
        req.body.player_name,
        req.body.public,
        returnResult(res)
    );
});

// join game requests
app.post("/join-game", function(req, res) {
    requests.joinGame(
        req.body.player_name,
        req.body.game_id,
        returnResult(res)
    );
});

// make move requests
app.post("/make-move", function(req, res) {
    requests.makeMove(
        res.body.player_id,
        res.body.move,
        returnResult(res)
    );
});

// get updates requests
app.post("/get-updates", function(req, res) {
    requests.getUpdates(
        res.body.player_id,
        returnResult(res)
    );
});

// send message requests
app.post("/send-message", function(req, res) {
    requests.sendMesssage(
        res.body.player_id,
        res.body.message,
        returnResult(res)
    );
});



// if there's no endpoint for request, default to the home page
app.all("*", function(req, res) {
    res.redirect(public_dir + "/index.html");
});



// start the server on port 8080
app.listen(port, function() {
    console.log("Started server on port " + port + ".");
});

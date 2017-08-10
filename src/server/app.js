// required modules and controllers
const express = require("express");
const body_parser = require("body-parser");
const db_manager = require("database-manager.js");

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



// Initialize db_manager by connecting to the database
db_manager.connect(function(err) {
    if (err) {
        console.err("Failed to connect to database.\nExiting...");
        process.exit(1);
    } else {
        console.log("Connected to databse.");
    }
});



// redirect root page to to index.html
app.get("/", function(req, res) {
    res.redirect(public_dir + "/index.html");
});



// new game requests
app.post("/new-game", function(req, res) {
    console.log(req.body);
    res.send();
});

// join game requests
app.post("/join-game", function(req, res) {
    console.log(req.body);
    res.send();
});

// get a list of all games
app.post("/get-games", function(req, res) {
    console.log(req.body);
    res.send();
});

// make move requests
app.post("/make-move", function(req, res) {
    console.log(req.body);
    res.send();
});

// get updates requests
app.post("/get-updates", function(req, res) {
    console.log(req.body);
    res.send();
});

// send message requests
app.post("/send-message", function(req, res) {
    console.log(req.body);
    res.send();
});



// if there's no endpoint for request, default to the home page
app.all("*", function(req, res) {
    res.redirect(public_dir + "/index.html");
});



// start the server on port 8080
app.listen(port, function() {
    console.log("Started server on port " + port + ".");
});

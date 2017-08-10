// required modules
const express = require("express");
const body_parser = require("body-parser");

// important values
const port = process.env.PORT || 8080;
const public_dir = "src/client/public";



// create express app with body-parser
const app = express();
app.use(body_parser.urlencoded({
	extended: true
}));
app.use(body_parser.json());



// serve public files
app.use(express.static(public_dir));

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

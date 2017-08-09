// required modules
const express = require('express');
const body_parser = require('body-parser');



// create express app with body-parser
var app = express();
app.use(body_parser);

// serve static files in src/client/public
app.use(express.static(__dirname + '../client/public'));


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



// if an invalid page was requested, redirect to index.html
app.all('*', function(req, res) {
	res.redirect('./index.html');
});



// start the server on port 8080
app.listen(8080, function() {
	console.log('Started server on port 8080.');
});

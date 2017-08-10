const port = 80;

// required modules
const express = require('express');
const body_parser = require('body-parser');



// create express app with body-parser
var app = express();
app.use(body_parser);



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

// if there's no endpoint for request, default to the home page
app.all('*', function(req, res) {
	res.redirect(__dirname + '/src/client/html/index.html');
});



// start the server on port 8080
app.listen(port, function() {
	console.log('Started server on port ' + port + '.');
});

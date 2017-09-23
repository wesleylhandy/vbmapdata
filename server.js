const express = require("express");
const path = require("path");
const fs = require('fs');
const app = express();
// Specify the port.
var port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/base', function(req, res) {
	var map = fs.readFile('doc.geojson');
  res.json(path.join(__dirname, 'doc.geojson'));
});

app.get('/', function(req, res) {
 res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, function(){
	console.log('app is listening on ', port);
});
const express = require("express");
const path = require("path");
const app = express();
// Specify the port.
var port = process.env.PORT || 3000;

app.get('/base', function(req, res) {
  res.json(path.join(__dirname, 'doc.geojson'));
});

app.get('/', function(req, res) {
 res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, function(){
	console.log('app is listening on ', port);
});
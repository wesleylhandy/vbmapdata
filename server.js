const express = require("express");
const path = require("path");
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

// Specify the port.
var port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/base', function(req, res) {
	var map = fs.readFileSync('doc.geojson', 'utf-8');
  res.json(JSON.parse(map));
});

app.get('/', function(req, res) {
 res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, function(){
	console.log('app is listening on ', port);
});
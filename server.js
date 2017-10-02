const express = require("express");
const path = require("path");
require('dotenv').config();

const app = express();

var assert = require('assert');
var mongo = require('mongodb').MongoClient;

var uri = 'mongodb://' + process.env.MLAB_USER + ':' + process.env.MLAB_PASS + '@ds135983.mlab.com:35983/devserver';

mongo.connect(uri, function(err, db){
  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");
  var collection = db.collection('neighborhoods');

  //seed the DB if empty
  require('./config/seedMongo.js')(collection);

	// Specify the port.
	var port = process.env.PORT || 3000;

	app.use(express.static('public'));

	app.get('/', function(req, res) {
	 res.sendFile(path.join(__dirname, 'index.html'));
	});

// listen for requests :)
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
  
});
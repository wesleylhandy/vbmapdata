const express = require("express");
const path = require("path");
const axios = require('axios');
require('dotenv').config();

const app = express();

var assert = require('assert');
var mongo = require('mongodb').MongoClient;

var uri = 'mongodb://' + process.env.MLAB_USER + ':' + process.env.MLAB_PASS + '@ds135983.mlab.com:35983/devserver';

mongo.connect(uri, function(err, db) {
    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    //927 neighborhoods have valid geometries, 4 do not
    var collection = db.collection('neighborhoods');
    var geoErrors = db.collection('geo-errors')

    /**** DATA IMPORT FUNCTIONS ****/
    // call function seed the DB if empty
    //require('./config/seedMongo.js')(collection);

    // erroneous seeds don't follow right-hand rule. rewind and save to db
    //require('./config/unwind.js')(geoErrors); //DONE!

    //call function to import service calls into collection
    //require('./config/importServiceCalls')(collection, geoErrors);


    // Specify the port.
    var port = process.env.PORT || 3000;

    app.use(express.static('public'));

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    app.get('/latlon/:address', function(req, res) {
        var address = req.params.address;

        var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address},+Virginia+Beach,+VA&key=${process.env.GOOGLE_API}`
        axios.get(url).then(function(results) {
            res.json({
                type: "Point",
                coordinates: [results[0].geometry.lng, results[0].geometry.lat]
            });
        }).catch(function(err) {
            if (err) console.error(err);
            res.statusCode(500);
            res.send(err);
        });
    });

    // 	app.get('/generate_squares_json', function(req, res) {
    //  var generateSquaresJson = require('./generateSquaresJson.js');
    //  generateSquaresJson.generate();
    //  res.sendFile(path.join(__dirname, 'generate_squares_json.html'));
    // });


    // listen for requests :)
    var listener = app.listen(process.env.PORT, function() {
        console.log('Your app is listening on port ' + listener.address().port);
    });

});
const fs = require('fs');

module.exports = function(collection) {
    let unwritten = [];
    //create a new index, but only if it doesn't already exist
    collection.createIndex({ "location": "2dsphere", "name": 1 }, { "unique": true });

    //only seed neighborhood collection if it is empty
    collection.count().then(num => {
        if (!num) {
            fs.readFile('./json/neighborhoods.json', 'utf-8', (err, data) => {
                if (err) throw new Error(err);
                else {
                    const seeds = JSON.parse(data);
                    seeds.forEach(function(seed, index) {

                        collection.insertOne(seed,
                            function(err, data) {
                                if (err) {
                                    // could not write this seed to db since it does not fit index requirements
                                    console.error(err);
                                    unwritten.push(seed);
                                }
                                //when you get to the last seed, write any unwritten seeds to file
                                if (index === seeds.length - 1) {
                                    fs.writeFile('./json/coordinateErrors.json', JSON.stringify(unwritten, null, 2), 'utf-8', function(err) {
                                        if (err) console.error(err);
                                    });
                                }
                            });
                    });
                }
            });
        }
        console.log("Mongo Seeded");
    });
}
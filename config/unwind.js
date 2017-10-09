const fs = require('fs');

module.exports = function(collection) {
    let unwritten = [];
    //read the file that contains seeds who did not conform to index
    fs.readFile('./json/coordinateErrors.json', 'utf-8', (err, data) => {

        if (err) throw new Error(err);
        else {
            const seeds = JSON.parse(data);
            seeds.forEach(function(seed, index) {

                //based on research, the unwritable locations had coordinates who did not follow right-hand rule, need to be rewound in the opposite direction
                //seed.location.coordinates[0][0].reverse();

                //try to add to db
                collection.insertOne(seed,
                    function(err, data) {
                        if (err) {
                            console.error(err);
                            unwritten.push(seed);
                        }
                        if (index === seeds.length - 1) {
                            fs.writeFile('./json/unknownErrors.json', JSON.stringify(unwritten, null, 2), 'utf-8', function(err) {
                                if (err) console.error(err);
                            });
                        }
                    });
            });

        }
    });

}
//This can be used to convert any geojson to json for importing into MongoDB

const fs = require('fs');

var geoJson = fs.readFileSync('../public/doc.geojson', 'utf-8');

var parsed = JSON.parse(geoJson);

var converted = parsed.features.map(function(feature) {

    //neighborhoods geojson doc has an extra coordinate for each point, plus the order is lat/long
    var coordinates = feature.geometry.coordinates[0].map(function(set, ind, arr) {
        return set.map(function(coords) {
            return [coords[0], coords[1]];
        });
    });
    return {
        name: feature.properties.Name,
        category: 'neighborhoods',
        location: {
            type: feature.geometry.type,
            coordinates: [coordinates]
        }
    }
});

fs.writeFile('../json/neighborhoods.json', JSON.stringify(converted, null, 2), 'utf-8', function(err) {
    if (err) console.error(err);
});
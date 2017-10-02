//This can be used to convert any geojson to json for importing into MongoDB

const fs = require('fs');

var geoJson = fs.readFileSync('../public/doc.geojson', 'utf-8');

var parsed = JSON.parse(geoJson);

var converted = parsed.features.map(function(feature){
	return {name: feature.properties.Name, category: 'neighborhoods', location: {
		type: feature.geometry.type, coordinates: feature.geometry.coordinates
	}}
});

fs.writeFile('json/neighborhoods.json', JSON.stringify(converted, null, 5), 'utf-8', function(err) {
	if(err) console.error(err);
});

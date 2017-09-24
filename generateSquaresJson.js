module.exports.generate = function() {
	var fs = require('fs');
 
	fs.readFile('public/doc.geojson', 'utf8', function(err, contents) {
		if(err) {
			return console.log(err);
		}


		var data = JSON.parse(contents);

		var out_data = "[";
		for(i in data.features) {
			var top=0, bottom=0, left=0, right=0;
			top = bottom = data.features[i].geometry.coordinates[0][0][0][0];
			left = right = data.features[i].geometry.coordinates[0][0][0][1];
			for( j in data.features[i].geometry.coordinates[0][0]) {
				if(data.features[i].geometry.coordinates[0][0][j][0] > top) {
					top = data.features[i].geometry.coordinates[0][0][j][0];
				}
				else if (data.features[i].geometry.coordinates[0][0][j][0] < bottom) {
					bottom = data.features[i].geometry.coordinates[0][0][j][0];
				}
				if(data.features[i].geometry.coordinates[0][0][j][1] < left) {
					left = data.features[i].geometry.coordinates[0][0][j][1];
				}
				else if( data.features[i].geometry.coordinates[0][0][j][1] > right) {
					right = data.features[i].geometry.coordinates[0][0][j][1];
				}
			}
			out_data += "{\"Name\":\"" + data.features[i].properties.Name + "\", \"top\":\"" + top + "\", \"bottom\":\"" + bottom + "\",\"left\":\"" + left + "\",\"right\":\"" + right + "\"},";
		}
		out_data = out_data.slice(0, -1);
		out_data += "]";

		fs.writeFile("public/squares.json", out_data, function(err) {
			if(err) {
				return console.log(err);
	    		}

			console.log("The file was saved!");
		});
	});
};



const fs = require('fs');

module.exports = function(collection) {
	collection.count().then(num=>{
		if(!num) {
			fs.readFile('./json/neighborhoods.json', 'utf-8', (err, data)=>{
				if (err) throw new Error(err);
				else {
					const seeds = JSON.parse(data);
					try {
						collection.insertMany(seeds);
					} catch(err) {
						console.error(err);
					}
				}
			});
		}
	});
}
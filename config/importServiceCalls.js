const fs = require('fs');
const moment = require('moment');
const axios = require('axios');

function getGeometry(call) {
    return new Promise((resolve, reject)=> {
        if (call.geometry) {
            resolve({ type: call.geometry.type, coordinates: [call.geometry.coordinates[0], call.geometry.coordinates[1]] });

        } else {
            axios.get(`/latlon/${encodeURIComponent(call.properties.location_1_address)}`).then(response => {
                resolve(response.data);
            }).catch(err => resolve(null));
        }
    })
}

module.exports = function(collection, geoErrors) {
    let count = 0;

    fs.readdir('./geojson/Service-Calls', function(err, files) {
        files.forEach(function(file, fileNum) {
            if (fileNum === 0 ) {


                fs.readFile(`./geojson/Service-Calls/${file}`, 'utf-8', (err, data) => {
                    if (err) return console.error(err);
                    else {
                        var parsed = JSON.parse(data);
                        var calls = parsed.features;
                        var len = calls.length;
                        for(let i=0; i < len; i++) {
                            
                                

                                getGeometry(calls[i]).then(geometry=>{
                                
                                    var data = {
                                        geometry: geometry,
                                        category: calls[i].properties.call_type,
                                        year: calls[i].properties.call_date_time ? moment(calls[i].properties.call_date_time).year() : 'Missing',
                                        month: calls[i].properties.call_date_time ? moment(calls[i].properties.call_date_time).month() + 1 : 'Missing',
                                        day: calls[i].properties.call_date_time ? moment(calls[i].properties.call_date_time).isoWeekday() : 'Missing',
                                        // hour: calls[i].properties.call_date_time ? moment(calls[i].properties.call_date_time).hour() : 'Missing',
                                        // minute: calls[i].properties.call_date_time ? moment(calls[i].properties.call_date_time).minute() : 'Missing',
                                        response_time: calls[i].properties.call_date_time && calls[i].properties.on_scene_date_time ? moment(calls[i].properties.call_date_time).diff(moment(calls[i].properties.on_scene_date_time), 'minutes', true) : 'Missing',
                                    }

                                    if (geometry) {
                                        collection.find({ "location": { "$geoIntersects": { "$geometry": geometry } } }).toArray(function(err, neighborhood) {
                                            
                                            // console.log({ neighborhood: docs[0] });
                                            if (neighborhood[0] && neighborhood[0]._id && !err) {
                                                collection.updateOne({ _id: neighborhood[0]._id }, { $addToSet: { service_calls: data } });
                                                count++;
                                            } else {
                                                geoErrors.find({ "location": { "$geoIntersects": { "$geometry": geometry } } }).toArray(function(err, docs) {
                                                   
                                                    if (docs[0] && docs[0]._id && !err) {
                                                        geoErrors.updateOne({ _id: docs[0]._id }, { $addToSet: { service_calls: data } });
                                                        count++;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    if (i == len - 1) console.log(`File ${fileNum} is complete. ${count} records inserted.`);
                                });

                        }
                    }
                });
            }
        });

    })


}
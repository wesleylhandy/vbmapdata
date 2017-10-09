const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
const assert = require('assert');

module.exports = function(collection, geoErrors) {
    let notFound = [];

    fs.readdir('./geojson/Service-Calls', function(err, files) {
        files.forEach(function(file) {
            fs.readFile(`./geojson/Service-Calls/${file}`, 'utf-8', (err, data) => {
                if (err) throw new Error(err);
                else {
                    var parsed = JSON.parse(data);
                    var calls = parsed.features;
                    calls.forEach(function(call, index) {
                        var geometry;
                        if (call.geometry) {
                            geometry = { type: call.geometry.type, coordinates: [call.geometry.coordinates[1], call.geometry.coordinates[0]] };
                        } else {
                            axios.get(`/latlon/${encodeURIComponent(call.properties.location_1_address)}`).then(response => {
                                geometry = response.data;
                            }).catch(err => geometry = null);
                        }
                        var data = {
                            geometry: geometry,
                            address: call.properties.location_1_address ? call.properties.location_1_address : 'Missing',
                            category: call.properties.call_type,
                            year: call.properties.call_date_time ? moment(call.properties.call_date_time).year() : 'Missing',
                            month: call.properties.call_date_time ? moment(call.properties.call_date_time).month() + 1 : 'Missing',
                            day: call.properties.call_date_time ? moment(call.properties.call_date_time).isoWeekday() : 'Missing',
                            hour: call.properties.call_date_time ? moment(call.properties.call_date_time).hour() : 'Missing',
                            minute: call.properties.call_date_time ? moment(call.properties.call_date_time).minute() : 'Missing',
                            response_time: call.properties.call_date_time && call.properties.on_scene_date_time ? moment(call.properties.call_date_time).diff(moment(call.properties.on_scene_date_time), 'minutes', true) : 'Missing',
                            zone: call.properties.zone,
                            priority: call.properties.priority
                        }
                        console.log({ geometry });
                        if (geometry) {
                            collection.find({ "location": { "$geoIntersects": { "$geometry": geometry } } }).toArray(function(err, docs) {
                                assert.equal(null, err);
                                console.log({ neighborhood: docs[0] });
                                if (docs[0]._id) {
                                    collection.updateOne({ _id: docs[0]._id }, { $addToSet: { service_calls: data } });
                                }
                            });
                        }

                    });
                }
            });

        });

    })


}
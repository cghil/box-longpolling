const colors = require('colors');
const client = require('../client');
const developerToken = require('../config').developerToken;

// helper method for status code check
let statusChecker = function(statusCode, message) {
    console.log('Status Code : ' + statusCode);
    if (message) {
        console.log(message);
    }
    if (statusCode == 401) {
        console.log('Check access token');
    }
};

// getting current stream position and pass current stream to callback if 200
let getCurrentStreamPosition = function(callback) {

    let parseForNextStreamPosition = function(err, res, body) {
        if (res.statusCode === 200) {
            let json = JSON.parse(body);
            let currentStreamPosition = json.next_stream_position;
            callback(currentStreamPosition);
        } else {
        	statusChecker(res.statusCode, "Error occurred");
        }
    };

    client.getEventStreamNow({ developerToken: developerToken, callback: parseForNextStreamPosition });
};

// gets all events from a specific streamPosition
let getEventsInStream = function(streamPosition, callback) {

    // prints each event
    let printEachEvent = function(err, res, body) {
        if (res.statusCode === 200) {
            let json = JSON.parse(body);
            let events = json.entries;
            console.log(colors.red('Fetching Events...'));
            events.forEach(function(event) {
                console.log(colors.red('----------------------------------------'));
                console.log(event);
            });

            let nextPosition = json.next_stream_position;
            callback(nextPosition);
        } else {
        	statusChecker(res.statusCode, 'getting the events failed...');
        }

    };

    client.getEventFromStreamPosition({ developerToken: developerToken, streamPosition: streamPosition, callback: printEachEvent });

};

exports.getEventsInStream = getEventsInStream;
exports.getCurrentStreamPosition = getCurrentStreamPosition;
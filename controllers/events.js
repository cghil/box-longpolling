const client = require('../client');
const developerToken = require('../config').developerToken;
const colors = require('colors');

let getLongPollUrl = function(listenStream, callback) {
    let parseMessage = function(err, res, body) {
        if (res.statusCode === 200) {
            let json = JSON.parse(body);
            let longPollUrl = json.entries[0].url;
            callback(longPollUrl, listenStream);
        }
    };

    client.optionsLongPoll({ developerToken: developerToken, callback: parseMessage });
};

let getCurrentStreamPosition = function(callback) {

    let parseForNextStreamPosition = function(err, res, body) {
        if (res.statusCode === 200) {
            let json = JSON.parse(body);
            let currentStreamPosition = json.next_stream_position;
            callback(currentStreamPosition);
        } else {
            let status = res.statusCode;
            console.log('Status Code :' + status);
            if (status == 401) {
                console.log('Check access token');
            }
        }
    };

    client.getEventStreamNow({ developerToken: developerToken, callback: parseForNextStreamPosition });
};

let getEventsInStream = function(streamPosition, callback) {
    let printEachEvent = function(err, res, body) {
        if (res.statusCode === 200) {
            let json = JSON.parse(body);
            let events = json.entries;
            events.forEach(function(event) {
                console.log('Printing Event');
                console.log(colors.red('------------------------------'));
                console.log(event);
            });

            let nextPosition = json.next_stream_position;
            callback(nextPosition);
        } else {
            console.log('getting the events failed...')
        }

    };

    client.getEventFromStreamPosition({ developerToken: developerToken, streamPosition: streamPosition, callback: printEachEvent });

};

let parseLogicForRealtime = function(json, longPollUrl, streamPosition) {
    if (json.message === "new_change") {
        getEventsInStream(streamPosition, function(streamPosition) {
            // restart longPoll with new stream position
            console.log(colors.green("Pulling from stream: %s"), streamPosition);
            getLongPollUrl(streamPosition, useListenerUrl);
        });
    } else if (json.message === "reconnect") {
        // if the reconnect event happens... use the same real time url with same stream position
        console.log('Reconnecting');
        useListenerUrl(longPollUrl, streamPosition);
    } else {
        // outside of this excerise
        console.log('Not writing code for max retries...');
    }
};

let useListenerUrl = function(longPollUrl, streamPosition) {

    let callback = function(err, res, body) {
        let json = JSON.parse(body);
        parseLogicForRealtime(json, longPollUrl, streamPosition)
    }

    console.log('Listening...');

    client.getListener({ developerToken: developerToken, url: longPollUrl, streamPosition: streamPosition, callback: callback });

};

exports.getCurrentStreamPosition = getCurrentStreamPosition;
exports.getLongPollUrl = getLongPollUrl;
exports.useListenerUrl = useListenerUrl;

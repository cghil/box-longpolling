const colors = require('colors');
const client = require('../client');
const eventController = require('./event');
const developerToken = require('../config').developerToken;

// get realtime URL
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


// depending on what the response is from realtime URL handle logic
let parseLogicForRealtime = function(json, longPollUrl, streamPosition) {
    if (json.message === "new_change") {
        // print each event that is in the stream that changed
        eventController.getEventsInStream(streamPosition, function(streamPosition) {
            // restart longPoll with next stream position
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

// use the realtime URL with position to listen for events
let useListenerUrl = function(longPollUrl, streamPosition) {

    let messageReader = function(err, res, body) {
        if (err) {
            console.log(err)
        }
        if (body) {
            let json = JSON.parse(body);
            parseLogicForRealtime(json, longPollUrl, streamPosition);
        }
    };

    console.log(colors.green("Listening on stream: %s"), streamPosition);

    client.getListener({ developerToken: developerToken, url: longPollUrl, streamPosition: streamPosition, callback: messageReader });

};

exports.getLongPollUrl = getLongPollUrl;
exports.useListenerUrl = useListenerUrl;
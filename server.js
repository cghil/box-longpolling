const request = require('request');
const client = require('./client');
const eventsController = require('./controllers/events');
const developerToken = require('./config').developerToken;

function gettingLongPollUrl(currentStream) {

    let startListening = function(longPollUrl, currentStream) {
        eventsController.useListenerUrl(longPollUrl, currentStream);
    };
       
    eventsController.getLongPollUrl(currentStream, startListening);
};

eventsController.getCurrentStreamPosition(gettingLongPollUrl);
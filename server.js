const realtimeController = require('./controllers/realtime');
const eventController = require('./controllers/event');

function gettingLongPollUrl(currentStream) {

    function startListening(longPollUrl, currentStream) {
        // uses the realtime url with the stream position from current
        realtimeController.useListenerUrl(longPollUrl, currentStream);
    };

    // gets the realtime url for listening to events
    realtimeController.getLongPollUrl(currentStream, startListening);
};

// get stream position now, then get the realtime event url via callback function above
eventController.getCurrentStreamPosition(gettingLongPollUrl);

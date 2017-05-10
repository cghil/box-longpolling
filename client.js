const request = require('request');
const BASE = 'https://api.box.com/2.0/events';

let headers = function(developerToken){
	return {'Authorization': 'Bearer ' + developerToken};
};

function getEventStreamNow(args){
	let options = {
		method: 'GET',
		url: BASE,
		qs: {stream_position: 'now'},
		headers: headers(args.developerToken)
	};

	request(options, args.callback);
};

function optionsLongPoll(args){
	let options = {
		method: 'OPTIONS',
		url: BASE,
		headers: headers(args.developerToken)
	}

	request(options, args.callback);
};

function getEventFromStreamPosition(args){
	let options = {
		method: 'GET',
		url: BASE,
		qs: {stream_position: args.streamPosition},
		headers: headers(args.developerToken)
	}

	request(options, args.callback)
};

function getListener(args){
	let options = {
		method: 'GET',
		url: args.url,
		qs: {stream_position: args.streamPosition}
	}

	request(options, args.callback);
};

exports.getEventStreamNow = getEventStreamNow;
exports.optionsLongPoll = optionsLongPoll;
exports.getEventFromStreamPosition = getEventFromStreamPosition;
exports.getListener = getListener;
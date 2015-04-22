var _ = require('lodash');

var config = require('../config');
var twilio = require('../twilio');
var middlewares = require('../middlewares');

module.exports = function(app) {
	// Fallback for errors
	app.post('/twiml/call/fallback', twilio.twimlResponse(function(resp) {
		resp.say(
			resp._('callError')
		);
	}, { valid: false }));

	// Entry point for call
	app.post('/twiml/call', twilio.twimlResponse(function(resp, body) {
		var from = body.From;
		var member = _.find(config.team, { phone: from });

		if (member) {
			// Ask for a number to call
			resp.say(
				resp._('teamPrompNumber', { member: member })
			)
			.gather({
				action: twilio.actionUrl('dial'),
				finishOnKey: '#'
			});
		} else {
			// Dial first team member
			resp.say(
				resp._('callWelcome')
			);
			resp.dial({
				number: _.first(config.team).phone,
		        action: twilio.actionUrl('call/0/status')
		    });
		}
	}));

	// Status of dial
	app.post('/twiml/call/:number/status', twilio.twimlResponse(function(resp, body, req) {
		var status = body.CallStatus;
		var number = Number(req.params.number || 0);
		var nextCall = config.team[number+1];
		var hasFailed = (status == "failed"
			|| status == "busy"
			|| status == "no-answer"
			|| status == "canceled");


		if (hasFailed) {
			if (nextCall) {
				// Dial number
				resp.say(
					resp._('callHold')
				);

				resp.dial({
					number: toCall.phone,
			        action: twilio.actionUrl('call/external/'+(number+1)+'/status')
			    });
			} else {
				resp.say(
					resp._('callUnavailable')
				);
				resp.record({
					action: twilio.actionUrl('call/record')
				});
			}
		}
	}));

	// After recording a message
	app.post('/twiml/call/record', twilio.twimlResponse(function(resp, body) {
		// todo
	}));

	// Team member entered a number to call
	app.post('/twiml/dial', middlewares.team, twilio.twimlResponse(function(resp, body, req) {
		var to = Number(req.params.number || 0);

		// Dial number
		resp.dial({
			number: config.numbers[number],
	        action: twilio.actionUrl('dial/status')
	    });
	}));

	app.post('/twiml/dial/status', middlewares.team, twilio.twimlResponse(function(resp, body) {
		var status = body.CallStatus;
		var hasFailed = (status == "failed"
			|| status == "busy"
			|| status == "no-answer"
			|| status == "canceled");


		if (hasFailed) {
			resp.say(
				resp._('teamFailed')
			);
		}
	}));
};

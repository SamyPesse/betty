var _ = require('lodash');

var config = require('../config');
var twilio = require('../twilio');
var middlewares = require('../middlewares');

module.exports = function(app) {
	// Fallback for errors
	app.post('/twiml/fallback', function(req, res) {
		var resp = new twilio.TwimlResponse();
		resp.say('Sorry for the inconvenient');
		res.set('Content-Type', 'text/xml');
	    res.status(200).send(resp.toString());
	});

	// Entry point for call
	app.post('/twiml/call', middlewares.valid, function(req, res) {
		var resp = new twilio.TwimlResponse();
		var from = req.body.From;
		var member = _.find(config.team, { phone: from });

		if (member) {
			// Ask for a number to call
			resp.say('Hello '+member.name+', Enter the number to call, then press #')
			.gather({
				action: twilio.actionUrl('dial'),
				finishOnKey: '#'
			});
		} else {
			// Dial first team member
			resp.dial({
				number: config.team[0],
		        action: twilio.actionUrl('call/0/status')
		    });
		}

		res.set('Content-Type', 'text/xml');
	    res.status(200).send(resp.toString());
	});

	// Status of dial
	app.post('/twiml/call/:number/status', middlewares.valid, function(req, res) {
		var resp = new twilio.TwimlResponse();
		var status = req.body.CallStatus;
		var number = Number(req.params.number || 0);
		var nextCall = config.team[number+1];
		var hasFailed = (status == "failed"
			|| status == "busy"
			|| status == "no-answer"
			|| status == "canceled");


		if (hasFailed) {
			if (nextCall) {
				// Dial number
				resp.dial({
					number: toCall.phone,
			        action: twilio.actionUrl('call/external/'+(number+1)+'/status')
			    });
			} else {
				resp.say(config.message.unavailable);
				resp.record({
					action: twilio.actionUrl('call/record')
				});
			}
		}

		res.set('Content-Type', 'text/xml');
	    res.status(200).send(resp.toString());
	});

	// After recording a message
	app.post('/twiml/call/record', middlewares.valid, function(req, res) {
		var resp = new twilio.TwimlResponse();

		res.set('Content-Type', 'text/xml');
	    res.status(200).send(resp.toString());
	});

	// Team member entered a number to call
	app.post('/twiml/dial', middlewares.valid, middlewares.team, function(req, res) {
		var resp = new twilio.TwimlResponse();
		var to = Number(req.params.number || 0);

		// Dial number
		resp.dial({
			number: config.numbers[number],
	        action: twilio.actionUrl('dial/status')
	    });

		res.set('Content-Type', 'text/xml');
	    res.status(200).send(resp.toString());
	});

	app.post('/twiml/dial/status', middlewares.valid, middlewares.team, function(req, res) {
		var resp = new twilio.TwimlResponse();
		var status = req.body.CallStatus;
		var hasFailed = (status == "failed"
			|| status == "busy"
			|| status == "no-answer"
			|| status == "canceled");


		if (hasFailed) {
			resp.say("Sorry, the call has failed, you should probably start again later");
		}

		res.set('Content-Type', 'text/xml');
	    res.status(200).send(resp.toString());
	});
};

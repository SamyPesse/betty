var config = require('../config');
var twilio = require('../twilio');
var middlewares = require('../middlewares');

module.exports = function(app) {
	// Entry point for call
	app.post('/twiml/call/external', middlewares.valid, function(req, res) {
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
		        action: twilio.actionUrl('call/external/0/status')
		    });
		}

		res.set('Content-Type', 'text/xml');
	    res.status(200).send(twiml.toString());
	});

	// Status of dial
	app.post('/twiml/call/external/:number/status', middlewares.valid, function(req, res) {
		var resp = new twilio.TwimlResponse();
		var status = req.body.CallStatus;
		var number = Number(req.params.number || 0);
		var nextCall = config.team[number+1];
		var isFailed = (status == "failed"
			|| status == "busy"
			|| status == "no-answer"
			|| status == "canceled");


		if (isFailed) {
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
	    res.status(200).send(twiml.toString());
	});

	// After recording a message
	app.post('/twiml/call/record', middlewares.valid, function(req, res) {
		var resp = new twilio.TwimlResponse();

		res.set('Content-Type', 'text/xml');
	    res.status(200).send(twiml.toString());
	});

	// Team member entered a number to call
	app.post('/twiml/dial', middlewares.valid, middlewares.team, function(req, res) {
		var resp = new twilio.TwimlResponse();
		var to = Number(req.params.number || 0);

		// Dial number
		resp.dial({
			number: config.numbers[number],
	        action: twilio.actionUrl('call/external/'+number+'/status')
	    });

		res.set('Content-Type', 'text/xml');
	    res.status(200).send(twiml.toString());
	});
};

var config = require('../config');
var twilio = require('../twilio');
var middlewares = require('../middlewares');

module.exports = function(app) {
	// Answer to external call
	app.get('/twiml/call/external/:number?', middlewares.valid, function(req, res) {
		var resp = new twilio.TwimlResponse();
		var number = Number(req.params.number || 0);
		var from = req.body.From;
		var member = _.find(config.team, { phone: from});

		if (member) {
			// Ask for a number to call
			resp.say('Hello '+member.name+', Enter the number to call, then press #')
			.gather({
				action: twilio.actionUrl('dial'),
				finishOnKey: '#'
			});
		} else {
			// Welcome message
			resp.say(config.message.welcome);

			// Dial number
			resp.dial({
				number: config.numbers[number],
		        action: twilio.actionUrl('call/external/'+number+'/status')
		    });
		}

		res.set('Content-Type', 'text/xml');
	    res.status(200).send(twiml.toString());
	});

	// Team member entered a number to call
	app.get('/twiml/dial', middlewares.valid, middlewares.team, function(req, res) {
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

	// Status of dial
	app.get('/twiml/call/external/:number/status', middlewares.valid, function(req, res) {
		var resp = new twilio.TwimlResponse();
		var status = req.body.CallStatus;

		if (status == "failed") {
			resp.say("Sorry, the call did not complete successfully");
		} else if (status == "busy" || status == "no-answer" || status == "canceled") {
			resp.say("Our team member is currently busy, leave a message after the signal, then press #");
		}

		res.set('Content-Type', 'text/xml');
	    res.status(200).send(twiml.toString());
	});
};

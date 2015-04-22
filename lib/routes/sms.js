var twilio = require('../twilio');

module.exports = function(app) {

	// Receive an SMS
	app.post('/twiml/sms', twilio.twimlResponse(function(resp, body) {
		var from = body.From;
		var body = body.Body;

		resp.message(resp._('smsReceived'));
	}));

};

var _ = require('lodash');
var Q = require('q');
var url = require('url');
var Twilio = require('twilio');

var config = require('./config');
var profile = require('./profiles')[config.profile];

var client = Twilio(config.twilio.sid, config.twilio.token);

// Return an action url
function getActionUrl(action) {
	return config.host+'/twiml/'+action;
}

// TwilioML Response builder
function responseBuilder(fn, opts) {
	opts = _.defaults(opts || {}, {
		valid: true
	});

	return function(req, res, next) {
		var resp = new Twilio.TwimlResponse();
		var rurl = url.resolve(config.host, req.originalUrl);

		Q()
		.then(function() {
			if (!opts.valid) return;

			console.log(config.twilio.token, url)
			if (!Twilio.validateExpressRequest(req, config.twilio.token, { url: rurl })) {
				var e = new Error("Twilio Request Validation Failed.")
		        e.status = 403;
		        throw e;
		    }
		})
		.then(function() {
			return fn(resp, req.body, req, res);
		})
		.then(function() {
			res.set('Content-Type', 'text/xml');
	    	res.status(200).send(resp.toString());
		})
		.fail(next);
	};
}


module.exports = {
	twimlResponse: responseBuilder,
	actionUrl: getActionUrl
};

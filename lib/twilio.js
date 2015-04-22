var _ = require('lodash');
var Q = require('q');
var url = require('url');
var Twilio = require('twilio');

var config = require('./config');
var profile = require('./profiles')[config.profile];
var phone = require('./utils/phone');

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

		// Use profile to change 'say' method
		var say = resp.say.bind(resp);
		resp.say = function(msg, attrs) {
			attrs = attrs || {};
			attrs.voice = profile.voice;
			attrs.language = profile.language;

			return say(msg, attrs);
		};

		resp._ = function(msg, ctx) {
			var args = _.toArray(arguments);
			ctx = _.defaults(ctx || {}, {
				config: config
			});
			return _.template(profile.messages[msg] || msg)(ctx);
		};

		Q()
		.then(function() {
			if (!opts.valid) return;

			if (false && !Twilio.validateExpressRequest(req, config.twilio.token, { url: rurl })) {
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

// Send a text messages
function sendMessage(to, body) {
	return Q.nfcall(client.sendMessage.bind(client), {
	    to: to,
	    from: _.first(config.phones),
	    body: body
	});
}

// Normalize the source of a call
function normalizeCallNumber(num) {
	num = phone.normalize(num);
	var toMember = _.find(config.team, { phone: num });

	return {
		number: num,
		member: toMember
	};
}

// Normalize a twilio call
function normalizeCall(call) {
	console.log(call);
	return {
		// Unique id for the call
		id: call.sid,

		// From and To (number nd member)
		from: normalizeCallNumber(call.from),
		to: normalizeCallNumber(call.to),

		// Timestamps and duration
		startTime: call.startTime,
		endTime: call.endTime,
		duration: Number(call.duration),

		// Price of this call
		price: call.price,

		// Direction "inbound" or "outbound"
		direction: call.direction
	};
}

// List calls
function listCalls(opts) {
	return Q.nfcall(client.calls.list)
	.then(function(result) {
		return {
			list: _.map(result.calls, normalizeCall),
			total: result.end,
			start: result.page*result.pageSize
		};
	});
}

module.exports = {
	twimlResponse: responseBuilder,
	actionUrl: getActionUrl,
	sendMessage: sendMessage,

	calls: {
		list: listCalls
	}
};

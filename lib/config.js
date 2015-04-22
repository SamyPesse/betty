var _ = require('lodash');
var normalizePhone = require('phone');

var config = {
	'port': process.env.PORT || 3000,
	'host': process.env.HOST,

	// List of phone numbers
	'phones': _.map((process.env.PHONES || "").split(','), function(num) {
		return normalizePhone(num)[0]
	}),

	// Profile to use for conversation
	'profile': process.env.PROFILE || "betty",

	// List of team members
	'team': _.map((process.env.TEAM || "").split(','), function(t) {
		var parts = t.split(':');
		return {
			name: parts[0],
			phone: normalizePhone(parts[1])[0]
		};
	}),

	'twilio': {
		'sid': process.env.TWILIO_SID,
		'token': process.env.TWILIO_TOKEN
	}
};

config.host = config.host || "http://localhost:"+config.port;

module.exports = config;
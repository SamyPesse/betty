var _ = require('lodash');

module.exports = {
	'port': process.env.PORT || 3000,
	'host': process.env.HOST,
	'team': _.map(process.env.TEAM || "").split(','), function(t) {
		var parts = t.split(':');
		return {
			name: parts[0],
			phone: parts[1]
		};
	}),

	'twilio': {
		'sid': process.env.TWILIO_SID,
		'token': process.env.TWILIO_TOKEN
	},

	'message': {
		'welcome': process.env.MESSAGE_WELCOME || "Thanks for calling, your call will be transfered to one of our team members",
	}
};

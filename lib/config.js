module.exports = {
	'port': process.env.PORT || 3000,
	'host': process.env.HOST,

	'numbers': (process.env.NUMBERS || "").split(','),
	'secret': process.env.SECRET,

	'twilio': {
		'sid': process.env.TWILIO_SID,
		'token': process.env.TWILIO_TOKEN
	},

	'message': {
		'welcome': process.env.MESSAGE_WELCOME || "Thanks for calling, your call will be transfered to one of our team members",
	}
};

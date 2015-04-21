var twilio = require('twilio');
var _ = require('lodash');
var config = require('./config');


// Middleware to valid the request is coming from twilio
function validRequest(req, res, next) {
	if (!twilio.validateExpressRequest(req, config.twilio.token)) {
        next()
    } else {
        res.status(403).send('You are not Twilio!');
    }
}

// Block non team member
function teamMember(req, res, next) {
	var from = req.body.From;
	var member = _.find(config.team, { phone: from});

	if (member) {
		req.teamMember = member;
		next();
	} else {
		res.status(403).send('Limited to team member');
	}
}

module.exports = {
	valid: validRequest,
	team: teamMember
};

var Q = require('q');
var _ = require('lodash');

var twilio = require('../twilio');
var config = require('../config');

module.exports = function(app) {

    // Fallback for errors
    app.post('/twiml/call/fallback', twilio.twimlResponse(function(resp) {
        resp.say(
            resp._('smsError')
        );
    }, { valid: false }));

    // Receive an SMS
    app.post('/twiml/sms', twilio.twimlResponse(function(resp, body) {
        var from = body.From;
        var body = body.Body;

        // Forward message to all team members
        return Q.allSettled(
            _.map(config.team, function(member) {
                var msg = resp._('smsForward', {
                    member: member,
                    message: {
                        from: from,
                        body: body
                    }
                });
                return twilio.sms.send(member.phone, msg);
            })
        )
        .then(function(states) {
            var hasFailed = !_.every(state, { state: "fulfilled" });

            if (hasFailed) throw "Can't forward message to the team";

            // Signal that message has been forwarded
            resp.message(resp._('smsReceived'));
        });
    }));

};

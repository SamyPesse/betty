var Q = require('q');
var _ = require('lodash');

var twilio = require('../twilio');
var config = require('../config');
var phone = require('../utils/phone');
var team = require('../team');

module.exports = function(app) {

    // Fallback for errors
    app.post('/twiml/call/fallback', twilio.twimlResponse(function(resp) {
        resp.message(
            resp._('smsError')
        );
    }, { valid: false }));

    // Receive an SMS
    app.post('/twiml/sms', twilio.twimlResponse(function(resp, body) {
        var from = body.From || "+33638785837";
        var body = body.Body || "Hello World";
        var member = team.get(from);

        // Get session
        var originFrom = req.session.origin;
        var linkedTo = req.session.linkedTo? team.get(req.session.linkedTo) : null;

        // For member, parse message and play action
        if (member) {
            // Conversation with external number
            if (originFrom) {
                // Already started with someone else
                if (linkedTo && linkedTo.username != member.to) {
                    return resp.message(resp._('smsAlreadyHandled', {
                        by: linkedTo
                    }));
                }

                // Mark as linked to this member
                req.session.linkedTo = member.phone;

                // Forward message
                resp.message(body, {
                    to: originFrom
                });
            } else {
                // Conversation with Betty
            }
        } else {
            if (linkedTo) {
                // Forward message to team member
                resp.message(body, {
                    to: linkedTo.phone
                });
            } else {
                // Set session
                req.session.origin = from;
                req.session.linkedTo = null;

                // Forward message
                _.each(team.humans(), function(mb) {
                    var msg = resp._('smsForward', {
                        member: mb,
                        message: {
                            from: from,
                            body: body
                        }
                    });
                    resp.message(msg, {
                        to: mb.phone
                    });
                });

                // Signal that message has been forwarded
                resp.message(resp._('smsReceived'));
            }
        }
    }));

};

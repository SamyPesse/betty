var Q = require('q');
var _ = require('lodash');

var twilio = require('../twilio');
var config = require('../config');
var phone = require('../utils/phone');
var parser = require('../utils/parser');
var team = require('../team');

module.exports = function(app) {

    // Fallback for errors
    app.post('/twiml/call/fallback', twilio.twimlResponse(function(resp) {
        resp.message(
            resp._('smsError')
        );
    }, { valid: false }));

    // Receive an SMS
    app.post('/twiml/sms', twilio.twimlResponse(function(resp, body, req) {
        var from = body.From;
        var body = body.Body;
        var fromMember = team.get(from);

        // Get session
        var originFrom = req.session.origin;
        var linkedTo = req.session.linkedTo? team.get(req.session.linkedTo) : null;

        var stopConversation = function() {
            req.session.origin = null;
            req.session.linkedTo = null;
        };


        // For member, parse message and play action
        if (fromMember) {
            // Parse action
            var action = parser.parse(body, {
                receptionist: team.profile.name
            });

            // This is a message to betty
            if (action) {
                // Unknown action
                if (action.type == 'unknown') {
                    resp.message(resp._('smsActionUnknown'));
                } else {
                    // For all other action, stop current conversation
                    stopConversation();
                }

                // Stop current conversation
                if (action.type == 'stop') {

                    if (originFrom) resp.message(resp._('smsActionStop', {
                        member: fromMember,
                        to: originFrom
                    }));
                }

                // Text somebody
                if (action.type == 'text') {
                    req.session.origin = action.phone;
                    req.session.linkedTo = fromMember.phone;

                    resp.message(resp._('smsActionText', {
                        member: fromMember,
                        to: action.phone
                    }));
                }

                // Call somebody
                if (action.type == 'call') {
                    return twilio.calls.start(
                        fromMember.phone,
                        twilio.actionUrl('dial?Digits='+encodeURIComponent(action.phone))
                    )
                    .then(function () {
                        resp.message(resp._('smsActionCall', {
                            member: fromMember,
                            to: action.phone
                        }));
                    });
                }

                return;
            }


            // Conversation with external number
            if (originFrom) {
                // Already started with someone else
                if (linkedTo && linkedTo.username != fromMember.to) {
                    return resp.message(resp._('smsAlreadyHandled', {
                        by: linkedTo
                    }));
                }

                // Mark as linked to this member
                req.session.linkedTo = fromMember.phone;

                // Forward message
                resp.message(body, {
                    to: originFrom
                });
            } else {
                // Invalid Conversation with Betty
                resp.message(resp._('smsActionUnknown'));
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

var _ = require('lodash');

var config = require('../config');
var twilio = require('../twilio');
var team = require('../team');
var middlewares = require('../middlewares');

module.exports = function(app) {
    // Fallback for errors
    app.post('/twiml/call/fallback', twilio.twimlResponse(function(resp) {
        resp.say(
            resp._('callError')
        );
    }, { valid: false }));

    // Entry point for call
    app.post('/twiml/call', twilio.twimlResponse(function(resp, body) {
        var from = body.From;
        var member = team.get(from);

        if (member) {
            // Ask for a number to call
            resp.say(
                resp._('teamPrompNumber', { member: member })
            )
            .gather({
                action: twilio.actionUrl('dial'),
                finishOnKey: '#'
            });
        } else {
            // Dial first team member
            resp.say(
                resp._('callWelcome')
            );
            resp.dial(_.first(team.humans()).phone, {
                action: twilio.actionUrl('call/0/status'),
                timeout: config.call.timeout
            });
        }
    }));

    // Status of dial
    app.post('/twiml/call/:number/status', twilio.twimlResponse(function(resp, body, req) {
        var status = body.DialCallStatus;
        var number = Number(req.params.number || 0);
        var nextCall = team.humans()[number+1];
        var hasFailed = (status == "failed"
            || status == "busy"
            || status == "no-answer"
            || status == "canceled");


        if (hasFailed) {
            if (nextCall) {
                // Dial number
                resp.say(
                    resp._('callHold')
                );

                resp.dial(toCall.phone, {
                    action: twilio.actionUrl('call/external/'+(number+1)+'/status'),
                    timeout: config.call.timeout
                });
            } else {
                resp.say(
                    resp._('callUnavailable')
                );
                resp.record({
                    action: twilio.actionUrl('call/record')
                });
            }
        }
    }));

    // After recording a message
    app.post('/twiml/call/record', twilio.twimlResponse(function(resp, body) {
        resp.say(resp._('callRecord'));
        resp.hangup();
    }));

    // Team member entered a number to call
    app.post('/twiml/dial', middlewares.team, twilio.twimlResponse(function(resp, body, req) {
        // Dial number
        resp.dial(body.Digits, {
            action: twilio.actionUrl('dial/status')
        });
    }));

    app.post('/twiml/dial/status', middlewares.team, twilio.twimlResponse(function(resp, body) {
        var status = body.CallStatus;
        var hasFailed = (status == "failed"
            || status == "busy"
            || status == "no-answer"
            || status == "canceled");


        if (hasFailed) {
            resp.say(
                resp._('teamFailed')
            );
            resp.hangup();
        }
    }));
};

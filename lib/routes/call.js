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
        var tocall = body.tocall;
        var member = team.get(from);

        if (tocall) {
            resp.dial(tocall, {
                callerId: _.first(config.phones),
                action: twilio.actionUrl('dial/status')
            });
            return;
        }

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
            resp.dial({
                callerId: _.first(config.phones),
                action: twilio.actionUrl('call/status'),
                timeout: config.call.timeout
            }, function(node) {
                _.each(team.humans(), function(member) {
                    // todo: add "url" to say message before accepting the call
                    node.number(member.phone);
                    node.client(member.username);
                });
            });
        }
    }));

    // Confirm call
    app.post('/twiml/call/confirm', twilio.twimlResponse(function(resp, body, req) {
        var from = body.From;
        var tocall = body.tocall;
        var member = team.get(from);

        resp.say(
            resp._('callConfirm', {

            })
        );

        resp.gather();
    }));

    // Status of the call
    app.post('/twiml/call/status', twilio.twimlResponse(function(resp, body, req) {
        var status = body.DialCallStatus;
        var hasFailed = (status == "failed"
            || status == "busy"
            || status == "no-answer"
            || status == "canceled");


        if (hasFailed) {
            resp.say(
                resp._('callUnavailable')
            );
            resp.record({
                action: twilio.actionUrl('call/record')
            });
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
            callerId: _.first(config.phones),
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

var _ = require('lodash');

var config = require('../config');
var twilio = require('../twilio');
var team = require('../team');
var phone = require('../utils/phone');
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
            var phoneToCall = phone.normalize(tocall);
            var memberToCall = team.get(tocall);

            resp.dial({
                callerId: _.first(config.phones),
                action: twilio.actionUrl('dial/status')
            }, function(node) {
                if (phone.valid(tocall)) node.number(tocall)
                if (memberToCall) {
                    node.client(memberToCall.username);
                    if (phoneToCall != memberToCall.phone) node.number(memberToCall.phone);
                }
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
                    node.number(member.phone, {
                        url: twilio.actionUrl('call/confirm?origin='+encodeURIComponent(from))
                    });
                    node.client(member.username);
                });
            });
        }
    }));

    // Confirm call
    app.post('/twiml/call/confirm', twilio.twimlResponse(function(resp, body, req) {
        var origin = body.origin;
        var tocall = body.tocall;
        var Digits = body.Digits;
        var to = body.To;
        var member = team.get(to);

        // Already entered some digits
        if (Digits) return;

        // Ask to enter some digits
        resp.say(
            resp._('callConfirm', {
                member: member,
                from: origin
            })
        );

        resp.gather({
            finishOnKey: "#"
        });
        resp.hangup();
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
    app.post('/twiml/dial', twilio.twimlResponse(function(resp, body, req) {
        // Dial number
        resp.dial(body.Digits, {
            callerId: _.first(config.phones),
            action: twilio.actionUrl('dial/status')
        });
    }));

    app.post('/twiml/dial/status', twilio.twimlResponse(function(resp, body) {
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

var _ = require('lodash');
var Q = require('q');
var url = require('url');
var Twilio = require('twilio');

var config = require('../config');
var profile = require('../profiles')[config.profile];
var client = require('./client');

// Return an action url
function getActionUrl(action) {
    return '/twiml/'+action;
}

// TwilioML Response builder
function responseBuilder(fn, opts) {
    opts = _.defaults(opts || {}, {
        valid: true
    });

    return function(req, res, next) {
        var resp = new Twilio.TwimlResponse();
        var rurl = url.resolve(config.host, req.originalUrl);

        console.log("Request from twilio on ", req.path, req.body);

        // Use profile to change 'say' method
        var say = resp.say.bind(resp);
        resp.say = function(msg, attrs) {
            attrs = attrs || {};
            attrs.voice = profile.voice;
            attrs.language = profile.language;

            return say(msg, attrs);
        };

        resp._ = function(msg, ctx) {
            var args = _.toArray(arguments);
            ctx = _.defaults(ctx || {}, {
                config: config
            });
            return _.template(profile.messages[msg] || msg)(ctx);
        };

        Q()
        .then(function() {
            if (!opts.valid) return;

            if (false && !Twilio.validateExpressRequest(req, config.twilio.token, { url: rurl })) {
                var e = new Error("Twilio Request Validation Failed.")
                e.status = 403;
                throw e;
            }
        })
        .then(function() {
            var args = _.extend({}, req.query, req.body);

            return fn(resp, args, req, res);
        })
        .then(function() {
            res.set('Content-Type', 'text/xml');
            res.status(200).send(resp.toString());
        })
        .fail(next);
    };
}


// Create a capability and return the token
function createCapability(user) {
    var capability = new Twilio.Capability(config.twilio.sid, config.twilio.token);
    capability.allowClientOutgoing(config.twilio.app);
    capability.allowClientIncoming(user.username);
    return capability.generate();
}


module.exports = {
    twimlResponse: responseBuilder,
    actionUrl: getActionUrl,
    capability: createCapability,

    sms: require('./sms'),
    account: require('./account'),
    calls: require('./calls'),
    recordings: require('./recordings')
};

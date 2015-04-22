var _ = require('lodash');
var normalize = require('./twilio/normalize');

var config = {
    'port': process.env.PORT || 3000,
    'host': process.env.HOST,

    // List of phone numbers
    'phones': _.map((process.env.PHONES || "").split(','), function(num) {
        return normalize.phone(num);
    }),

    // Profile to use for conversation
    'profile': process.env.PROFILE || "betty",

    // List of team members
    'team': _.map((process.env.TEAM || "").split(','), function(t) {
        var parts = t.split(':');
        return {
            name: parts[0],
            phone: normalize.phone(parts[1])
        };
    }),

    // Organization infos
    'org': {
        'name': process.env.ORG_NAME
    },

    'twilio': {
        'sid': process.env.TWILIO_SID,
        'token': process.env.TWILIO_TOKEN
    },

    'call': {
        // Limit in seconds that Betty waits for the called party to answer the call.
        'timeout': Number(process.env.CALL_TIMEOUT || 10)
    }
};

config.host = config.host || "http://localhost:"+config.port;

module.exports = config;
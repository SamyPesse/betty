var _ = require('lodash');
var phone = require('./utils/phone');

function fail(msg) {
    console.error(msg);
    process.exit(1);
}

var config = {
    'port': process.env.PORT || 3000,
    'host': process.env.HOST,
    'secret': process.env.SECRET,

    // List of phone numbers
    'phones': _.map((process.env.PHONES || "").split(','), function(num) {
        return phone.normalize(num);
    }),

    // Profile to use for conversation
    'profile': process.env.PROFILE || "betty",

    // List of team members
    'team': _.map((process.env.TEAM || "").split(','), function(t) {
        var parts = t.split(':');
        return {
            name: parts[0],
            phone: phone.normalize(parts[1])
        };
    }),

    // Session configuration
    'session': {
        'secret': process.env.SESSION_SECRET || process.env.SECRET
    },

    // Organization infos
    'org': {
        'name': process.env.ORG_NAME
    },

    // Twilio API config
    'twilio': {
        'sid': process.env.TWILIO_SID,
        'token': process.env.TWILIO_TOKEN,
        'app': process.env.TWILIO_APPID
    },

    'call': {
        // Limit in seconds that Betty waits for the called party to answer the call.
        'timeout': Number(process.env.CALL_TIMEOUT || 10)
    }
};

config.host = config.host || "http://localhost:"+config.port;

// Valid configuration
if (!config.twilio.sid || !config.twilio.token || !config.twilio.app) {
    fail("Need TWILIO_SID, TWILIO_TOKEN and TWILIO_APPID environment variables");
}

module.exports = config;
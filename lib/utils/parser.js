var _ = require('lodash');
var phone = require('phone-regex');
var natural = require('natural');

var ACTIONS = {
    // Start a call with a specific number
    call: {
        keywords: ['call'],
        attributes: {
            phone: extractPhone
        }
    },

    // Start a text message with a specific number
    text: {
        keywords: ['text', 'sms'],
        attributes: {
            phone: extractPhone
        }
    },

    // Stop current sms conversation
    stop: {
        keywords: ['stop']
    }
};

// Extract a phone number from a message
function extractPhone(msg) {
    var phones = msg.match(phone());
    if (!phones || phones.length == 0) return null;
    return _.first(phones).trim();
}


// Parse a message to return an action or null
function parse(msg) {
    var tokenizer = new natural.WordTokenizer();
    var tokens = _.map(tokenizer.tokenize(msg), function(t) { return t.toLowerCase(); });

    // Check is a valid message for betty
    if (tokens[0] != 'betty') {
        return null;
    }

    return (_.reduce(ACTIONS, function(prev, action, actionType) {
        var r;

        if (prev) return prev;

        // Check if action is matching
        var matching = _.difference(tokens, action.keywords);
        if (matching.length == tokens.length) return null;

        // Action is matching
        r = {
            type: actionType,
        };

        // Extract attributes
        _.each(action.attributes || {}, function(fn, attr) {
            r[attr] = fn(msg);
        });

        return r;
    }, null) || { type: "unknown" });
}


module.exports = {
    parse: parse
};

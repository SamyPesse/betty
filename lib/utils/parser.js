var _ = require('lodash');
var natural = require('natural');

var phone = require('./phone');

var ACTIONS = {
    // Start a call with a specific number
    call: {
        keywords: ['call'],
        attributes: {
            phone: phone.extract
        }
    },

    // Start a text message with a specific number
    text: {
        keywords: ['text', 'sms'],
        attributes: {
            phone: phone.extract
        }
    },

    // Stop current sms conversation
    stop: {
        keywords: ['stop']
    }
};

// Parse a message to return an action or null
function parse(msg, opts) {
    opts = _.defaults(opts || {}, {
        receptionist: "betty"
    });

    var tokenizer = new natural.WordTokenizer();
    var tokens = _.map(tokenizer.tokenize(msg), function(t) { return t.toLowerCase(); });

    // Check is a valid message for betty
    if (tokens[0] != opts.receptionist.toLowerCase()) {
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
        return _.reduce(action.attributes || {}, function(_r, fn, attr) {
            if (!_r) return null;
            var value = fn(msg);
            if (value == undefined) return null;
            _r[attr] = value;
            return _r;
        }, r);
    }, null) || { type: "unknown" });
}


module.exports = {
    parse: parse
};

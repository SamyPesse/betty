var _ = require('lodash');
var Q = require('q');

var client = require('./client');
var config = require('../config');
var normalize = require('./normalize');

// Send a text messages
function sendMessage(to, body) {
    return Q.nfcall(client.sendMessage.bind(client), {
        to: to,
        from: _.first(config.phones),
        body: body
    });
}

// List SMS
function listSMS(opts) {
    return normalize.pagination(
        client.listMessages,
        'messages',
        normalize.sms,
        opts
    );
}


module.exports = {
    send: sendMessage,
    list: listSMS
};

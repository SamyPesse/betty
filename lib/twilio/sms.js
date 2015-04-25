var _ = require('lodash');
var Q = require('q');

var client = require('./client');
var config = require('../config');
var normalize = require('./normalize');

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
    list: listSMS
};

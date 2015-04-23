var _ = require('lodash');
var Q = require('q');

var client = require('./client');
var config = require('../config');
var normalize = require('./normalize');

// Get infos about the account
function getAccount(opts) {
    return Q.all([
        Q.nfcall(client.accounts(config.twilio.sid).get),
        Q.nfcall(client.usage.records.get)
    ])
    .spread(function(infos, usages) {
        return normalize.account(infos, usages);
    });
}


module.exports = {
    get: getAccount
};

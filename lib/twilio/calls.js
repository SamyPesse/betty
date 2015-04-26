var _ = require('lodash');
var Q = require('q');

var config = require('../config');
var client = require('./client');
var normalize = require('./normalize');

// List calls
function listCalls(opts) {
    return normalize.pagination(
        client.calls.list,
        'calls',
        normalize.call,
        opts
    );
}

// Get a specific call
function getCall(id) {
    return Q.nfcall(client.calls(id).get)
    .then(normalize.call);
}

// Start a call
function startCall(to, action) {
    return Q.nfcall(client.makeCall, {
        to: to,
        from: _.first(config.phones),
        url: action
    });
}

module.exports = {
    list: listCalls,
    get: getCall,
    start: startCall
};

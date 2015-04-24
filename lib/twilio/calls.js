var _ = require('lodash');
var Q = require('q');

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

module.exports = {
    list: listCalls,
    get: getCall
};

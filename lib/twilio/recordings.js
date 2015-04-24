var _ = require('lodash');
var Q = require('q');

var client = require('./client');
var config = require('../config');
var normalize = require('./normalize');

// List all recordings
function listRecordings(opts) {
    return normalize.pagination(
        client.recordings.list,
        'recordings',
        normalize.recording,
        opts
    );
}


module.exports = {
    list: listRecordings
};

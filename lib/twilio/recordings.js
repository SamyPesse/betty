var _ = require('lodash');
var Q = require('q');

var client = require('./client');
var config = require('../config');
var normalize = require('./normalize');

// List all recordings
function listRecordings(opts) {
    return Q.nfcall(client.recordings.list)
    .then(function(result) {
        return {
            list: _.map(result.recordings, normalize.recording),
            total: result.end,
            start: result.page*result.pageSize
        };
    });
}


module.exports = {
    list: listRecordings
};

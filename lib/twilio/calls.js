var _ = require('lodash');
var Q = require('q');

var client = require('./client');
var normalize = require('./normalize');

// List calls
function listCalls(opts) {
	return Q.nfcall(client.calls.list)
	.then(function(result) {
		return {
			list: _.map(result.calls, normalize.call),
			total: result.end,
			start: result.page*result.pageSize
		};
	});
}

module.exports = {
	list: listCalls
};

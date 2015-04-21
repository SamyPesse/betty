var _ = require('lodash');

var ROUTES = [
	require("./call"),
	require("./sms")
];

module.exports = function(app) {
	_.each(ROUTES, function(routes) {
		routes(app);
	});
};

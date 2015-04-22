var _ = require('lodash');

var ROUTES = [
    require("./call"),
    require("./sms"),
    require("./api")
];

module.exports = function(app) {
    _.each(ROUTES, function(routes) {
        routes(app);
    });
};

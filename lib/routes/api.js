var _ = require('lodash');
var Q = require('q');

var express = require('express');
var config = require('../config');

var middlewares = require('../middlewares');
var twilio = require('../twilio');
var team = require('../team');

module.exports = function(app) {
    var api = express.Router();
    var start = Date.now();

    function method(fn) {
        return function(req, res, next) {
            return Q()
            .then(function() {
                var args = [_.extend({}, req.query, req.body)];
                if (_.size(req.params) > 0) args = [req.params].concat(args);

                return fn.apply(null, args);
            })
            .then(function(data) {
                res.send(data);
            })
            .fail(next);
        };
    }

    // Service status
    api.get('/', method(function() {
        return {
            uptime: (Date.now() - start),
            phones: config.phones
        };
    }));

    // Team
    api.get('/team', method(function() {
        return team.list();
    }));

    // Calls API
    api.get('/calls', method(twilio.calls.list));
    api.get('/calls/:id', method(function(params) {
        return twilio.calls.get(params.id);
    }));

    // SMS API
    api.get('/sms', method(twilio.sms.list));


    app.use('/api', middlewares.admin, api);
};

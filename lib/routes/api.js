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
    api.get('/', method(twilio.account.get));

    // Team
    api.get('/team', method(function() {
        return team.list();
    }));
    api.get('/team/humans', method(function() {
        return team.humans();
    }));

    // Calls API
    api.get('/calls', method(twilio.calls.list));
    api.get('/calls/:id', method(function(params) {
        return twilio.calls.get(params.id);
    }));

    // SMS API
    api.get('/sms', method(twilio.sms.list));

    // Recordings
    api.get('/recordings', method(twilio.recordings.list));

    app.use('/api', middlewares.admin, api);
};

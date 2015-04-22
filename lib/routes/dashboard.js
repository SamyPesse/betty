var _ = require('lodash');
var Q = require('q');

var express = require('express');
var config = require('../config');

var middlewares = require('../middlewares');
var twilio = require('../twilio');

module.exports = function(app) {

    function view(tpl, fn) {
        return function(req, res, next) {
            Q()
            .then(function() {
                var args = [_.extend({}, req.query, req.body)];
                if (_.size(req.params) > 0) args = [req.params].concat(args);

                return fn.apply(null, args);
            })
            .then(function(data) {
                res.render(tpl, data);
            })
            .fail(next);
        };
    }

    // List calls
    app.get('/', middlewares.admin, view('homepage.html', function() {
        return twilio.calls.list()
        .then(function(calls) {
            return {
                tab: "calls",
                calls: calls
            };
        });
    }));

    // List team
    app.get('/team', middlewares.admin, view('team.html', function() {
        return {
            tab: "team",
            team: config.team
        };
    }));
};

var _ = require('lodash');
var Q = require('q');

var express = require('express');
var config = require('../config');

var middlewares = require('../middlewares');
var twilio = require('../twilio');
var team = require('../team');

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

    // Homepage
    app.get('/', middlewares.admin, function(req, res) {
        res.redirect('/calls');
    });

    // List calls
    app.get('/calls', middlewares.admin, view('calls.html', function() {
        return twilio.calls.list()
        .then(function(calls) {
            return {
                tab: "calls",
                calls: calls
            };
        });
    }));

    // List sms
    app.get('/sms', middlewares.admin, view('sms.html', function() {
        return twilio.sms.list()
        .then(function(messages) {
            return {
                tab: "sms",
                messages: messages
            };
        });
    }));

    // List recordings
    app.get('/recordings', middlewares.admin, view('recordings.html', function() {
        return twilio.recordings.list()
        .then(function(recordings) {
            return {
                tab: "recordings",
                recordings: recordings
            };
        });
    }));

    // List team
    app.get('/team', middlewares.admin, view('team.html', function() {
        return {
            tab: "team",
            team: team.list()
        };
    }));
};

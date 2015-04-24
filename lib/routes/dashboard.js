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
    app.get('/', middlewares.admin, view('status.html', function() {
        return twilio.account.get()
        .then(function(account) {
            return {
                tab: "status",
                account: account
            };
        })
    }));

    // List calls
    app.get('/calls', middlewares.admin, view('calls.html', function(args) {
        return twilio.calls.list(args)
        .then(function(calls) {
            return {
                tab: "calls",
                calls: calls
            };
        });
    }));

    // List sms
    app.get('/sms', middlewares.admin, view('sms.html', function(args) {
        return twilio.sms.list(args)
        .then(function(messages) {
            return {
                tab: "sms",
                messages: messages
            };
        });
    }));
    app.post('/sms', middlewares.admin, function(req, res, next) {
        var body = req.body.body;
        var to = req.body.to;

        Q()
        .then(function() {
            return twilio.sms.send(to, body);
        })
        .then(function() {
            res.redirect('/sms')
        })
        .fail(next);
    });

    // List recordings
    app.get('/recordings', middlewares.admin, view('recordings.html', function(args) {
        return twilio.recordings.list(args)
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

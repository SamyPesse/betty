var _ = require('lodash');
var Q = require('q');

var express = require('express');
var config = require('../config');

var middlewares = require('../middlewares');
var twilio = require('../twilio');

module.exports = function(app) {
	var api = express.Router();
	var start = Date.now();

	function method(fn) {
		return function(req, res, next) {
			return Q()
			.then(function() {
				return fn(req.body || req.query);
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
		return config.team;
	}));

	// List Calls
	api.get('/calls', method(function() {
		return twilio.calls.list();
	}));


	app.use('/api', middlewares.admin, api);
};

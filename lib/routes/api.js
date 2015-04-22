var express = require('express');
var config = require('../config');

var middlewares = require('../middlewares');

module.exports = function(app) {
	var api = express.Router();
	var start = Date.now();

	// Service status
	api.get('/', middlewares.admin, function(req, res) {
		res.send({
			uptime: (Date.now() - start),
			phones: config.phones
		});
	});

	// Team
	api.get('/team', middlewares.admin, function(req, res) {
		res.send(config.team);
	});


	app.use('/api', api);
};

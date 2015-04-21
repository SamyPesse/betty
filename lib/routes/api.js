var express = require('express');

module.exports = function(app) {
	var api = express.Router();
	var start = Date.now();

	// Service status
	app.get('/', function(req, res) {
		res.send({
			uptime: Date.now() - start
		})
	});


	app.use('/api', api);
};

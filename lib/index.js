var express = require('express');
var _ = require('lodash');
var bodyParser = require('body-parser');

var config = require('./config');
var twilio = require('./twilio');
var middlewares = require('./middlewares');
var routes = require('./routes');

var app = express();

app.use(bodyParser.json())

app.get('/', function(req, res) {
	res.send('hello world');
});

routes(app);


module.exports = {
	start: function () {
		var server = app.listen(config.port, function () {
			var host = server.address().address;
			var port = server.address().port;
			console.log('Listening at http://%s:%s', host, port);
		});
	}
}

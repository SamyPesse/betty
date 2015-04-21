var express = require('express');
var _ = require('lodash');

var config = require('./config');
var twilio = require('./twilio');

var app = express();


app.get('/', function(req, res) {
	res.send('hello world');
});


// Answer to external call
app.get('/twiml/call/external/:number?', function(req, res) {
	var resp = new twilio.TwimlResponse();
	var number = Number(req.params.number || 0);
	var from = req.body.From;
	var isTeam = _.contains(config.numbers, from);

	if (isTeam) {
		// Ask for a number to call
		resp.say('Enter the number to call, then press #')
		.gather({
			action:twilio.actionUrl('dial'),
			finishOnKey:'#'
		});
	} else {
		// Welcome message
		resp.say(config.message.welcome);

		// Dial number
		resp.dial({
			number: config.numbers[number],
	        action: twilio.actionUrl('call/external/'+number+'/status')
	    });
	}

	res.set('Content-Type', 'text/xml');
    res.status(200).send(twiml.toString());
});

// Answer to external call
app.get('/twiml/call/external/:number/status', function(req, res) {
	var resp = new twilio.TwimlResponse();
	var number = Number(req.params.number || 0);

	// Welcome message
	resp.say(config.message.welcome);

	// Dial number
	resp.dial({
		number: config.numbers[number],
        action: twilio.actionUrl('call/external/'+number+'/status')
    });

	res.set('Content-Type', 'text/xml');
    res.status(200).send(twiml.toString());
});

var server = app.listen(config.port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
var Twilio = require('twilio');
var config = require('../config');

module.exports = Twilio(config.twilio.sid, config.twilio.token);

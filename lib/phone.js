var Twilio = require('twilio');
var config = require('./config');


var client = Twilio('ACCOUNT_SID', 'AUTH_TOKEN');

// Return an action url
function getActionUrl(action) {
	return config.host+'/twiml/'+call;
}


module.exports = {
	TwimlResponse: client.TwimlResponse,
	actionUrl: getActionUrl
};

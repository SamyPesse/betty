
module.exports = {
	name: "Betty",
	voice: 'woman',
    language: 'en-us',

    messages: {
    	error: "Your call could not be processed for the moment. Sorry for the inconvenient",

    	// Visitor
    	callWelcome: "Thanks for calling, your call will be transfered to one of our team members",
    	callUnavailable: "All of our team members are currently busy, say your message after the signal, then press #",
    	callHold: "Please hold while we tranfer you to one of our team members",

    	// Team
    	teamPrompNumber: "Hello %s, Enter the number to call, then press #",
    	teamFailed: "Sorry, the call has failed, you should probably start again later",

    	// SMS
    	smsReceived: "Your message has been forwarded to one of our team members",
        smsForward: "Hi %s, we've received a text message from %s, just reply to this message to start the conversation:\n\n%s"
    }
};


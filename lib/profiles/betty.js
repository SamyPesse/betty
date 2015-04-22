
module.exports = {
	name: "Betty",
	voice: 'woman',
    language: 'en-us',

    messages: {
    	// Visitor
        callError: "Your call could not be processed for the moment. Sorry for the inconvenient",
    	callWelcome: "Thanks for calling <%= config.org.name %>, your call will be transfered to one of our team members",
    	callUnavailable: "All of our team members are currently busy, say your message after the signal, then press #",
    	callHold: "Please hold while we tranfer you to one of our team members",

    	// Team
    	teamPrompNumber: "Hello <%= member.name %>, Enter the number to call, then press #",
    	teamFailed: "Sorry, the call has failed, you should probably start again later",

    	// SMS
        callError: "Your sms could not be processed for the moment. Sorry for the inconvenient",
    	smsReceived: "Your message has been forwarded to one of our team members",
        smsForward: "Hi <%= member.name %>, we've received a text message from <%= message.from %>, just reply to this message to start the conversation:\n\n<%= message.body %>"
    }
};


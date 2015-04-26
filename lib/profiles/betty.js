
module.exports = {
    name: "Betty",
    voice: 'alice',
    language: 'en-us',

    messages: {
        // Visitor
        callError: "Your call could not be processed at the moment. Sorry for the inconvenience",
        callWelcome: "Thanks for calling <%= config.org.name %>, your call will be transfered to one of our team members",
        callUnavailable: "All of our team members are currently busy, please record your message after the signal, then press #",
        callConfirm: "Hi <%= member.name %>, we have an incoming call from <%= from %>, press 1 to accept the call",
        callRecord: "Thank you, your message has been recorded, our team will get in touch with you soon",

        // Team
        teamPrompNumber: "Hello <%= member.name %>, Enter the number to call, then press #",
        teamFailed: "Sorry, the call has failed, please try again later",

        // SMS
        smsError: "Your sms could not be processed at the moment. Sorry for the inconvenience",
        smsReceived: "Your message has been forwarded to one of our team members",
        smsAlreadyHandled: "This conversation is already being taken care of by <= by.name %>",
        smsForward: "Hi <%= member.name %>, we've received a text message from <%= message.from %>, just reply to this message to start the conversation:\n\n<%= message.body %>",

        // SMS Actions
        smsActionStop: "Ok <%= member.name %>, I stopped your sms conversation with <%= to %>",
        smsActionUnknown: "Sorry, I didn't understand your message",
        smsActionText: "Ok, you're now in conversation with <%= to %>, all your messages will be forward to them",
        smsActionCall: "Ok, you'll soon receive a call to connect you to <%= to %>"
    }
};


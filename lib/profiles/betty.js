
module.exports = {
    name: "Betty",
    voice: 'alice',
    language: 'en-us',

    messages: {
        // Visitor
        callError: "Your call could not be processed for the moment. Sorry for the inconvenient",
        callWelcome: "Thanks for calling <%= config.org.name %>, your call will be transfered to one of our team members",
        callUnavailable: "All of our team members are currently busy, say your message after the signal, then press #",
        callConfirm: "Hi <%= member.name %>, we have an incoming call from <%= from %>, press 1 if you accept the call",
        callRecord: "Thank you, your message has been recorded, our team will get in touch with you soon",

        // Team
        teamPrompNumber: "Hello <%= member.name %>, Enter the number to call, then press #",
        teamFailed: "Sorry, the call has failed, you should probably start again later",

        // SMS
        smsError: "Your sms could not be processed for the moment. Sorry for the inconvenient",
        smsReceived: "Your message has been forwarded to one of our team members",
        smsAlreadyHandled: "This conversation is already taking care of by <= by.name %>",
        smsForward: "Hi <%= member.name %>, we've received a text message from <%= message.from %>, just reply to this message to start the conversation:\n\n<%= message.body %>",

        // SMS Actions
        smsActionStop: "Ok <%= member.name %>, I stopped your sms conversation with <%= to %>",
        smsActionUnknown: "Sorry, I didn't understand your message",
        smsActionText: "Ok, you're now in conversation with <%= to %>, all your messages will be forward to him",
        smsActionCall: "Ok, you'll soon a call that connects you to <%= to %>"
    }
};


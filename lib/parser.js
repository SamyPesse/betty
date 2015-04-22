var _ = require('lodash');
var phone = require('phone-regex');

// Parse a message to return an action or null
function parse(msg) {
    var phones = msg.match(phone());
    var type;
    msg = msg.toLowerCase();

    if (msg.indexOf("text") >= 0) {
        type = "text";
    }
    if (msg.indexOf("call") >= 0) {
        type = "call";
    }


    if (!type) return null;
    return {
        type: type,
        phone: _.first(phones).trim()
    };
}


module.exports = {
    parse: parse
};

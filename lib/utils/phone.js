var _ = require('lodash');
var phone = require('node-phonenumber');
var phoneUtil = phone.PhoneNumberUtil.getInstance();
var phoneRegex = require('phone-regex');

// Normalize phone number
function normalizePhone(num) {
    try {
        var phoneNumber = phoneUtil.parse(num, 'MY');
        return phoneUtil.format(phoneNumber, phone.PhoneNumberFormat.INTERNATIONAL);
    } catch (e) {
        return num;
    }
}

// Test if it's a correct phone number
function isPhone(num) {
    try {
        var phoneNumber = phoneUtil.parse(num, 'MY');
        return true;
    } catch (e) {
        return false;
    }
}

// Compare 2 phone numbers
function equals(n1, n2) {
    return normalizePhone(n1) == normalizePhone(n2);
}

// Extract a phone number from a message
function extractPhone(msg) {
    var phones = msg.match(phoneRegex());
    if (!phones || phones.length == 0) return undefined;
    return _.first(phones).trim();
}


module.exports = {
    normalize: normalizePhone,
    valid: isPhone,
    equals: equals,
    extract: extractPhone
};

var phone = require('node-phonenumber');
var phoneUtil = phone.PhoneNumberUtil.getInstance();

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

module.exports = {
    normalize: normalizePhone,
    valid: isPhone
};

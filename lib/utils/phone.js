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

module.exports = {
    normalize: normalizePhone
};

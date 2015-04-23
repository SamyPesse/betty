var phone = require('node-phonenumber');
var phoneUtil = phone.PhoneNumberUtil.getInstance();

// Normalize phone number
function normalizePhone(num) {
    var phoneNumber = phoneUtil.parse(num, 'MY');
    return phoneUtil.format(phoneNumber, phone.PhoneNumberFormat.INTERNATIONAL);
}

module.exports = {
    normalize: normalizePhone
};

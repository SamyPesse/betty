var _ = require('lodash');
var phone = require('node-phonenumber');
var phoneUtil = phone.PhoneNumberUtil.getInstance();

var config = require('../config');

// Normalize phone number
function normalizePhone(num) {
    var phoneNumber = phoneUtil.parse(num, 'MY');
    return phoneUtil.format(phoneNumber, phone.PhoneNumberFormat.INTERNATIONAL);
}

// Normalize the source of a call
function normalizeNumber(num) {
    num = normalizePhone(num);
    var config = require('../config');
    var toMember = _.find(config.team, { phone: num });

    return {
        phone: num,
        member: toMember
    };
}

// Normalize a twilio call
function normalizeCall(call) {
    return {
        // Unique id for the call
        id: call.sid,

        // From and To (number nd member)
        from: normalizeNumber(call.from),
        to: normalizeNumber(call.to),

        // Timestamps and duration
        startTime: call.startTime,
        endTime: call.endTime,
        duration: Number(call.duration),

        // Price of this call
        price: call.price,

        // Direction "inbound" or "outbound"
        direction: call.direction,

        // Status (queued, ringing, in-progress, canceled, completed, failed, busy or no-answer)
        status: call.status
    };
}

// Normalize a twilio sms
function normalizeSMS(sms) {
    return {
        // Unique id for the sms
        id: sms.sid,

        // From and To (number nd member)
        from: normalizeNumber(sms.from),
        to: normalizeNumber(sms.to),

        // Body
        body: sms.body,

        // Price of this call
        price: sms.price,

        // Direction "inbound" or "outbound"
        direction: call.direction
    };
}

module.exports = {
    phone: normalizePhone,
    number: normalizeNumber,
    call: normalizeCall,
    sms: normalizeSMS
};

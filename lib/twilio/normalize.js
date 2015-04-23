var _ = require('lodash');
var phone = require('node-phonenumber');
var phoneUtil = phone.PhoneNumberUtil.getInstance();


// Normalize phone number
function normalizePhone(num) {
    var phoneNumber = phoneUtil.parse(num, 'MY');
    return phoneUtil.format(phoneNumber, phone.PhoneNumberFormat.INTERNATIONAL);
}

// Normalize a call/sms direction
function normalizeDirection(dir) {
     return _.first(dir.split('-'));
}

// Normalize the source of a call
function normalizeNumber(num) {
    num = normalizePhone(num);
    var team = require('../team');
    var toMember = team.get(num);

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
        forwardedFrom: (call.forwardedFrom && call.forwardedFrom != call.to)? normalizeNumber(call.forwardedFrom) : null,

        // Timestamps and duration
        startTime: call.startTime,
        endTime: call.endTime,
        duration: Number(call.duration),

        // Price of this call
        price: call.price,

        // Direction "inbound" or "outbound"
        direction: normalizeDirection(call.direction),

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

        // Date
        sentTime: sms.dateSent,

        // Body
        body: sms.body,

        // Status
        status: sms.status,

        // Price of this call
        price: sms.price,

        // Direction "inbound" or "outbound"
        direction: normalizeDirection(sms.direction)
    };
}

// Normalize a recording
function normalizeRecording(rc) {
    return {
        id: rc.id,

        // Date
        createdTime: rc.DateCreated,

        // Call
        call: rc.callSid,

        // Duration
        duration: rc.duration,

        // Urls to read
        urls: {
            mp3: rc.url+'.mp3'
        }
    };
}

module.exports = {
    phone: normalizePhone,
    number: normalizeNumber,
    call: normalizeCall,
    sms: normalizeSMS
};

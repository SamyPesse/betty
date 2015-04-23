var _ = require('lodash');
var path = require('path');
var phone = require('node-phonenumber');
var phoneUtil = phone.PhoneNumberUtil.getInstance();

var start = Date.now();

var USAGE_LABELS = {
    totalprice: {
        title: "Total Cost"
    },
    calls: {
        title: "Calls",
        unit: "minutes"
    },
    sms: {
        title: "SMS",
        unit: "messages"
    },
    recordings: {
        title: "Recordings",
        unit: " recorded minutes"
    }
}


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
        price: Number(call.price),

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
        price: Number(sms.price),

        // Direction "inbound" or "outbound"
        direction: normalizeDirection(sms.direction)
    };
}

// Normalize a recording
function normalizeRecording(rc) {
    return {
        id: rc.id,

        // Date
        createdTime: rc.dateCreated,

        // Call
        call: rc.callSid,

        // Duration
        duration: Number(rc.duration),

        // Urls to read
        urls: {
            mp3: "https://api.twilio.com"+(rc.uri.slice(0, -5))+'.mp3'
        }
    };
}

// Normalize an account
function normalizeAccount(a, usages) {
    var config = require('../config');

    return {
        id: a.sid,
        name: a.friendlyName,

        uptime: (Date.now() - start),
        phones: config.phones,

        // Status
        status: a.status,

        // Date
        createdTime: a.dateCreated,

        usages: _.chain(usages.usage_records)
            .map(function(u) {
                return [
                    u.category,
                    {
                        value: Number(u.usage),
                        price: Number(u.price),
                        unit: u.usage_unit,
                        label: USAGE_LABELS[u.category]
                    }
                ];
            })
            .object()
            .value()
    };
}

module.exports = {
    phone: normalizePhone,
    number: normalizeNumber,
    call: normalizeCall,
    sms: normalizeSMS,
    recording: normalizeRecording,
    account: normalizeAccount
};

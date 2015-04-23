var _ = require('lodash');
var path = require('path');
var phone = require('../utils/phone');

var config = require('../config');
var team = require('../team');

var start = Date.now();

var USAGE_LABELS = {
    totalprice: {
        title: "Total Cost",
        icon: "ion-social-usd"
    },
    calls: {
        title: "Calls",
        unit: "minutes",
        icon: "ion-android-call"
    },
    sms: {
        title: "SMS",
        unit: "messages",
        icon: "ion-android-textsms"
    },
    recordings: {
        title: "Recordings",
        unit: " recorded minutes",
        icon: "ion-ios-recording"
    }
}


// Normalize a call/sms direction
function normalizeDirection(dir) {
     return _.first(dir.split('-'));
}

// Normalize the source of a call
function normalizeNumber(num) {
    var toMember = team.get(num);

    return {
        phone: phone.normalize(num),
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
        id: rc.sid,

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
    return {
        id: a.sid,
        name: a.friendlyName,

        uptime: (Date.now() - start),
        phones: config.phones,
        startTime: start,
        profile: team.profile,

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
    number: normalizeNumber,
    call: normalizeCall,
    sms: normalizeSMS,
    recording: normalizeRecording,
    account: normalizeAccount
};

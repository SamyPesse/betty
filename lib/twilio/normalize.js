var _ = require('lodash');
var Q = require('q');
var url = require('url');
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
var CLIENT_PREFIX = 'client:';
function normalizeNumber(num, incoming) {
    if (num.indexOf(CLIENT_PREFIX) === 0) {
        num = num.slice(CLIENT_PREFIX.length);
    }

    var toMember = team.get(num);

    // Unknown entry
    if (!phone.valid(num) && !toMember) {
        num = null;
    }

    // If no num, then it's for betty
    if (!num || num == 'Anonymous') {
        if (incoming) {
            return {
                alias: "Anonymous"
            };
        }

        toMember = team.betty();
    }

    return {
        phone: phone.valid(num)? phone.normalize(num) : (toMember? toMember.phone : num),
        member: toMember
    };
}

// Normalize a twilio call
function normalizeCall(call) {
    return {
        // Unique id for the call
        id: call.sid,

        // From and To (number nd member)
        from: normalizeNumber(call.from, true),
        to: normalizeNumber(call.to, false),
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
        from: normalizeNumber(sms.from, true),
        to: normalizeNumber(sms.to, false),

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

// Normalize a paginated request
function normalizePage(uri) {
    if (!uri) return null;
    var parts = url.parse(uri, true);

    return {
        pagetoken: parts.query.PageToken,
        page: Number(parts.query.Page)
    };
}
function normalizePagination(fn, selector, normalize, opts) {
    opts = opts || {};

    opts.PageSize = opts.limit || 20;
    delete opts.limit;

    if (opts.page) {
        opts.Page = (opts.page || 0);
        opts.PageToken = opts.pagetoken;
        delete opts.page;
        delete opts.pagetoken;
    }

    return Q.nfcall(fn, opts)
    .then(function(result) {
        var items = result[selector];
        return {
            list: _.map(items, normalize),
            start: result.start || 0,
            limit: result.pageSize,
            pages: {
                previous: normalizePage(result.previousPageUri),
                next: normalizePage(result.nextPageUri)
            }
        };
    });
}

module.exports = {
    number: normalizeNumber,
    call: normalizeCall,
    sms: normalizeSMS,
    recording: normalizeRecording,
    account: normalizeAccount,
    pagination: normalizePagination
};

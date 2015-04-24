var _ = require('lodash');

var config = require('./config');
var profile = require('./profiles')[config.profile];
var phone = require('./utils/phone');
var username = require('./utils/username');

var LIST = _.chain([
        {
            name: profile.name,
            machine: true,
            phone: _.first(config.phones)
        }
    ])
    .concat(config.team)
    .map(function(m) {
        m.username = username.normalize(m.name);
        return m;
    })
    .value();

// Return a member by phone
function getMember(entry) {
    var user;

    // Try by phone number
    user = _.find(LIST, {
        phone: phone.normalize(entry)
    });
    if (user) return user;

    return _.find(LIST, {
        username: username.normalize(entry)
    });
}

// Check if a member exists
function exits(num) {
    return getMember(num) != null;
}

// Return list of all members
function listAll() {
    return LIST;
}

// List all humans
function listHumans() {
    return _.filter(LIST, function(m) {
        return m.machine != true;
    });
}

// Get betty
function getBetty() {
    return _.find(LIST, {
        machine: true
    });
}

// Authenticate an user
function auth(user) {
    if (!config.secret) return true;
    if (!user || !user.name || !user.pass || user.pass != config.secret) return false;
    return getMember(user.name);
}

module.exports = {
    profile: profile,
    get: getMember,
    exits: exits,
    list: listAll,
    humans: listHumans,
    betty: getBetty,
    auth: auth
}
var _ = require('lodash');

var config = require('./config');
var profile = require('./profiles')[config.profile];
var phone = require('./utils/phone');

var LIST = _.chain([
        {
            name: profile.name,
            machine: true,
            phone: _.first(config.phones)
        }
    ])
    .concat(config.team)
    .map(function(m) {
        m.username = m.name;
        return m;
    })
    .value();

// Return a member by phone
function getMember(num) {
    num = phone.normalize(num);
    return _.find(LIST, {
        phone: num
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

// Authenticate an user
function auth(user) {
    if (!config.secret) return true;
    if (!user || !user.name || !user.pass) return false;
    var u = _.find(LIST, { name: user.name });
    return (u && u.pass == config.secret)? u : null;
}

module.exports = {
    profile: profile,
    get: getMember,
    exits: exits,
    list: listAll,
    humans: listHumans,
    auth: auth
}
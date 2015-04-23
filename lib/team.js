var _ = require('lodash');
var config = require('./config');
var profile = require('./profiles')[config.profile];

var LIST = [
    {
        name: profile.name,
        machine: true,
        phone: _.first(config.phones)
    }
].concat(config.team);

// Return a member by phone
function getMember(num) {
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
    return _.first(LIST, function(m) {
        return m.machine != true;
    });
}

module.exports = {
    profile: profile,
    get: getMember,
    exits: exits,
    list: listAll,
    humans: listHumans
}
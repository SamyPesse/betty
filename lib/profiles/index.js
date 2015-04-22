var _ = require('lodash');

var PROFILES = {
    betty: require('./betty'),
    ben: require('./ben'),
    catherine: require('./catherine')
};

module.exports = _.mapValues(PROFILES, function(profile) {
    return _.merge(profile, PROFILES.betty, _.defaults);
});

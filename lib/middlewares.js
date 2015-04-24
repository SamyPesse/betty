var twilio = require('twilio');
var _ = require('lodash');
var basicAuth = require('basic-auth');

var config = require('./config');
var team = require('./team');
var twilio = require('./twilio');

// Block non team member
function teamMember(req, res, next) {
    var from = req.body.From;
    var member = team.get(from);

    if (member) {
        req.teamMember = member;
        next();
    } else {
        res.status(403).send('Limited to team member');
    }
}

// Admin Authentication
function adminAuth(req, res, next) {
    var user = basicAuth(req);
    user = team.auth(user);

    if (user) {
        res.locals.capability = {
            token: twilio.capability(user)
        };

        return next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    };
}


module.exports = {
    team: teamMember,
    admin: adminAuth
};

var express = require('express');
var _ = require('lodash');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var nunjucks = require('nunjucks');
var moment = require('moment');
var session = require('cookie-session');

var config = require('./config');
var twilio = require('./twilio');
var middlewares = require('./middlewares');
var routes = require('./routes');
var profile = require('./profiles')[config.profile];

var app = express();
app.set('trust proxy', 1)

app.use(morgan('combined'));

app.use(session({
    secret: config.session.secret
}));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use('/public', express.static(path.resolve(__dirname, '../public')));


// Templating
var tpl = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.resolve(__dirname, '../views'))
);
tpl.addGlobal('config', config);
tpl.addGlobal('profile', profile);
tpl.addFilter('relativeDate', function(d) {
    return moment(d).fromNow();
});
tpl.addFilter('nl2br', function(s) {
    return s.replace(/(?:\r\n|\r|\n)/g, '<br />');
});
tpl.express(app);

routes(app);

app.use(function(req, res, next) {
    var e = new Error("Not Found");
    e.status = 404;
    next(e);
});

app.use(function(error, req, res, next) {
    console.log("Error:", error.stack || error.message || error);
    res.status(error.status || 500).send({
        error: error.message || error,
        code: error.status || 500
    });
});

module.exports = {
    start: function () {
        var server = app.listen(config.port, function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log('Listening at http://%s:%s', host, port);
        });
    }
}

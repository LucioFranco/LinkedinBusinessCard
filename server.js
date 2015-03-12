var express = require('express');
var app = express();
var mongoose = require('mongoose');
var linkedinController = require('./server/controllers/linkedinController');
var bodyParser = require('body-parser');
var fs = require('fs');

if (fs.existsSync(__dirname + '/.env')) {
    var env = require('node-env-file');
    env(__dirname + '/.env');
}

var Linkedin = require('node-linkedin')(process.env.apikey, process.env.apisecret, process.env.callback);
var session = require('express-session');
var routes = require('./routes');

//FIXME fix database from mean-demo to linkedinbusiness
console.log(process.env);
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/linkedin-app');
var linkedin = Linkedin.init(process.env.apisecret);

app.use(bodyParser());
app.use(session({ secret: 'ombudsecret' }));
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/img', express.static(__dirname + '/client/img'));
app.use('/css', express.static(__dirname + '/client/css'));

app.get('/isloggedin', linkedinController.isloggedin);

app.get('/subviews/:name', function(req, res) {
    res.sendFile(__dirname + '/client/views/subviews/' + req.params.name);
});

app.get('/api/getme', linkedinController.getme);

app.get('/oauth/login', function(req, res) {
    // This will ask for permisssions etc and redirect to callback url.
    Linkedin.auth.authorize(res, [
    'r_basicprofile',
    'r_fullprofile',
    'r_emailaddress',
    'r_contactinfo'
    ]);
});

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if(err) {
            console.error(err);
        }else {
            res.redirect('/');
        }
    });
});

app.get('/oauth/linkedin/callback', linkedinController.callback);

app.get('/error', function(req, res) {
        res.write('there was an error');
        res.end();
});


//REST API
app.get('/api/getme', linkedinController.getme);

app.post('/api/save/:linkedinid', linkedinController.save);

app.get('/api/card/:linkedinid/:index', linkedinController.getCard);

app.all('/', routes.layout);

var port = process.env.PORT || 3000;
app.listen(port, function() {
        console.log('Server listening... on localhost:' + port);
});

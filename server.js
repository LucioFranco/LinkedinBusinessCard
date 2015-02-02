var express = require('express');
var app = express();
var mongoose = require('mongoose');
var meetupsController = require('./server/controllers/meetupsController');
var linkedinController = require('./server/controllers/linkedinController');
var bodyParser = require('body-parser');
var Linkedin = require('node-linkedin')('78qiht85oc8bac', '1RbWvjRzU9xsVzf7', 'http://localhost:3000/oauth/linkedin/callback');
var session = require('express-session');
var routes = require('./routes');

mongoose.connect('mongodb://localhost:27017/mean-demo');
var linkedin = Linkedin.init('1RbWvjRzU9xsVzf7');

app.use(bodyParser());
app.use(session({ secret: 'ombudsecret' }));
app.use('/js', express.static(__dirname + '/client/js'));



app.get('/subviews/:name', function(req, res) {
    res.sendFile(__dirname + '/client/views/subviews/' + req.params.name);
});

app.get('/linkedin', function(req, res) {
        res.sendFile(__dirname + '/client/views/linkedin.html');
});

app.get('/api/getme', linkedinController.getme);

app.get('/login', function(req, res) {
    //TODO fix login screen
    res.redirect('/oauth/login');
});

app.get('/oauth/login', function(req, res) {
    // This will ask for permisssions etc and redirect to callback url.
    Linkedin.auth.authorize(res, ['r_basicprofile', 'r_fullprofile', 'r_emailaddress', 'r_network', 'r_contactinfo', 'rw_nus', 'rw_groups', 'w_messages']);
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
app.post('/api/meetups', meetupsController.create);
app.get('/api/meetups', meetupsController.list);

app.post('/api/getindustry', linkedinController.getIndustry);
app.get('/api/getindustry', linkedinController.getIndustry);

app.get('/api/getme', linkedinController.getme);
app.post('/api/getme', linkedinController.getme);

app.get('/', routes.index);
app.get('*', routes.index);
app.listen(3000, function() {
        console.log('Server listening... on localhost/3000');
});

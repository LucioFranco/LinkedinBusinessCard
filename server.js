var express = require('express');
var app = express();
var mongoose = require('mongoose');
var meetupsController = require('./server/controllers/meetupsController');
var linkedinController = require('./server/controllers/linkedinController');
var bodyParser = require('body-parser');
var Linkedin = require('node-linkedin')('78qiht85oc8bac', '1RbWvjRzU9xsVzf7', 'http://localhost:3000/oauth/linkedin/callback');

mongoose.connect('mongodb://localhost:27017/mean-demo');
var linkedin = Linkedin.init('1RbWvjRzU9xsVzf7');

app.use(bodyParser());

app.get('/', function(req, res) {
        res.sendFile(__dirname + '/client/views/index.html');
});

app.get('/linkedin', function(req, res) {
        res.sendFile(__dirname + '/client/views/linkedin.html');
});

app.get('/oauth/linkedin', function(req, res) {
    // This will ask for permisssions etc and redirect to callback url.
    Linkedin.auth.authorize(res, ['r_basicprofile', 'r_fullprofile', 'r_emailaddress', 'r_network', 'r_contactinfo', 'rw_nus', 'rw_groups', 'w_messages']);
});


app.get('/oauth/linkedin/callback', linkedinController.callback);

app.use('/js/vendor', express.static(__dirname + '/public/javascripts/vendor'));
app.use('/js', express.static(__dirname + '/client/js'));

//REST API
app.post('/api/meetups', meetupsController.create);
app.get('/api/meetups', meetupsController.list);

app.post('/api/linkedin/getcompany/:firstName/:lastName', linkedinController.getCompany);
app.get('/api/linkedin/getcompany/:firstName/:lastName', linkedinController.getCompany);

app.listen(3000, function() {
        console.log('Server listening... on localhost/3000');
});

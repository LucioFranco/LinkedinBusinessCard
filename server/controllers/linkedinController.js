var LinkedinProfile = require('../models/linkedin');

module.exports.getme = function(req, res) {
    var session = req.session;

    if(!session.linkedinid) {
        res.redirect('/#/login');
        return;
    }

    LinkedinProfile.findOne({ linkedinid: session.linkedinid }, function(err, result) {
        res.json(result);
    });
};

module.exports.callback = function(req, res) {
    var Linkedin = require('node-linkedin')(process.env.apikey, process.env.apisecret, 'http://localhost:3000/oauth/linkedin/callback');
    var session = req.session;

    Linkedin.auth.getAccessToken(res, req.query.code, function(err, results) {

        if ( err )
            return console.error(err);

        /**
         * Results have something like:
         * {"expires_in":5184000,"access_token":". . . ."}
         */
        var linkedin = Linkedin.init(JSON.parse(results).access_token);
        var resjson = {};

        linkedin.people.me(function(err, data) {
            session.linkedinid = data.id;
            LinkedinProfile.findOne({ linkedinid: data.id }, function (err, result) {
                if(result === null) {
                    console.log("adding " + data.firstName + " to the db");

                    var phoneNumber = '888-888-8888';
                    if(data.phoneNumbers.length > 0) {
                        phoneNumber = data.phoneNumbers.values[0].phoneNumber;
                    }


                    var profile = new LinkedinProfile({
                        "linkedinid": data.id,
                        "firstName": data.firstName,
                        "lastName": data.lastName,
                        "formattedName": data.formattedName,
                        "email": data.emailAddress,
                        "website": 'http://example.com',
                        "phoneNumber": phoneNumber,
                        "industry": data.industry,
                        "location": data.location.name,
                        "headline": data.headline,
                        "pictureUrl": data.pictureUrl
                    });

                    profile.save(function (err, result) {
                        res.json(data);
                    });
                }else {
                    res.redirect('/');
                }
            });
        });
    });
};

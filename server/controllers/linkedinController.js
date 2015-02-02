var LinkedinProfile = require('../models/linkedin');

module.exports.getIndustry = function (req, res) {
    var session = req.session;

    if(!session.linkedinid) {
        res.redirect('/login');
    }

    LinkedinProfile.findOne({ linkedinid: session.linkedinid }, function (err, result) {
        if(err) {
            return console.error(err);
        }

        if(!result) {
            res.redirect('/error');
            console.error("empty result");
        }

        res.json(result.industry);

    });
};

module.exports.getme = function(req, res) {
    var session = req.session;

    if(!session.linkedinid) {
        res.redirect('/login');
        return;
    }

    LinkedinProfile.findOne({ linkedinid: session.linkedinid }, function(err, result) {
        res.json(result);
    });
};

module.exports.callback = function(req, res) {
    var Linkedin = require('node-linkedin')('78qiht85oc8bac', '1RbWvjRzU9xsVzf7', 'http://localhost:3000/oauth/linkedin/callback');
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
                    var profile = new LinkedinProfile({
                        "linkedinid": data.id,
                        "firstName": data.firstName,
                        "lastName": data.lastName,
                        "email": data.emailAddress,
                        "industry": data.industry,
                        "location": data.location.name,
                        "headline": data.headline
                    });

                    profile.save(function (err, result) {
                        res.redirect('/');
                    });
                }else {
                    res.redirect('/');
                }
            });
        });
    });
};

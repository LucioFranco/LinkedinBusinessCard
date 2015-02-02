var LinkedinProfile = require('../models/linkedin');

module.exports.getCompany = function (req, res) {

};

module.exports.callback = function(req, res) {
    var Linkedin = require('node-linkedin')('78qiht85oc8bac', '1RbWvjRzU9xsVzf7', 'http://localhost:3000/oauth/linkedin/callback');

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

            LinkedinProfile.findOne({ linkedinid: data.id }, function (err, result) {
                if(result === null) {
                    console.log("adding " + data.formattedName + " to the db");
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
                        res.json(result);
                    });
                }else {
                    console.log(result);
                    res.json(result);
                }
            });
        });
    });
};

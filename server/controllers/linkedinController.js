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
        console.log(results);
        var linkedin = Linkedin.init(JSON.parse(results).access_token);
        var resjson = {};

        linkedin.people.me(function(err, data) {
            console.log(data);

            var profile = new LinkedinProfile({
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
        });
    });
};

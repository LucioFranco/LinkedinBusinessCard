var LinkedinProfile = require('../models/linkedin');
var Card = require('../models/card');

module.exports.getcard = function(req, res) {
    //TODO make get card post api call
};

module.exports.isloggedin = function(req, res) {
    var session = req.session;
    if(!session.linkedinid) {
        res.json({ 'isloggedin': 'false' });
    }else {
        res.json({ 'isloggedin': 'true' });
    }
};

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

module.exports.getCards = function(req, res) {
    Card.find({ linkedinid: req.params.linkedinid }, function(err, result) {
        res.json(result);
    });
};

module.exports.getCard = function(req, res) {
    Card.findOne({ _id: mongoose.Types.ObjectId(req.params.cardid) }, function(err, result) {
        res.json(result);
    });
};

module.exports.saveCard = function(req, res) {
    var params = req.params;

    var card = new Card({
        id: params.id,
        linkedinid: params.linkedinid,
        formattedName: params.formattedName,
        email: params.email,
        website: params.website,
        phoneNumber: params.phoneNumber,
        location: params.location,
        headline: params.headline,
        pictureUrl: params.pictureUrl,
        cardTitle: params.cardTitle
    });

    card.save(function(err, result) {
        //TODO fix redirect for save card
        var msgs;
        if(err === null) {
            msgs = {
                saved: 'true'
            };
        }else {
            msgs = {
                saved: 'true'
            };
        }
        console.log('saved:' + msg.saved);
        res.json(msgs);
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
                        "phoneNumber": phoneNumber,
                        "industry": data.industry,
                        "location": data.location.name,
                        "headline": data.headline,
                        "pictureUrl": data.pictureUrl,
                        "cards": [
                            {
                                'linkedinid': data.id,
                                'formattedName': data.formattedName,
                                'email': data.emailAddress,
                                'website': 'http://example.com',
                                'phoneNumber': phoneNumber,
                                'location': data.location.name,
                                'headline': data.headline,
                                'pictureUrl': data.pictureUrl,
                                'cardTitle': 'Default Card'
                            }
                        ]
                    });

                    console.log(profile.cards);

                    profile.save(function (err, result) {
                        //TODO fix redirect for linkedin save
                        res.redirect('/');
                    });
                }else {
                    res.redirect('/');
                }
            });
        });
    });
};

var mongoose = require('mongoose');

var cards = new mongoose.Schema({
    linkedinid: String,
    formattedName: String,
    email: String,
    website: String,
    phoneNumber: String,
    location: String,
    headline: String,
    pictureUrl: String,
    cardTitle: String
});

module.exports = mongoose.model('profile', {
    linkedinid: String,
    firstName: String,
    lastName: String,
    formattedName: String,
    email: String,
    website: String,
    phoneNumber: String,
    industry: String,
    location: String,
    headline: String,
    pictureUrl: String,
    cards: [ cards ]
});

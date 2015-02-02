var mongoose = require('mongoose');

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
    pictureUrl: String
});

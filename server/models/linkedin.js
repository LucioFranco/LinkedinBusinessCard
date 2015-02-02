var mongoose = require('mongoose');

module.exports = mongoose.model('profile', {
    linkedinid: String,
    firstname: String,
    lastname: String,
    email: String,
    industry: String,
    location: String,
    headline: String
});

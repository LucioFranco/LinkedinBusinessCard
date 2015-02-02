var mongoose = require('mongoose');

module.exports = mongoose.model('profile', {
    linkedinid: String,
    firstName: String,
    lastName: String,
    email: String,
    industry: String,
    location: String,
    headline: String
});

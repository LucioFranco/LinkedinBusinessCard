var mongoose = require('mongoose');

module.exports = mongoose.model('profile', {
    firstname: String,
    lastname: String,
    email: String,
    industry: String,
    location: String,
    headline: String
});

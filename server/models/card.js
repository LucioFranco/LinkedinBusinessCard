var mongoose = require('mongoose');

module.exports = mongoose.model('cards', {
    userid: String,
    formattedName: String,
    email: String,
    website: String,
    phoneNumber: String,
    location: String,
    headline: String,
    pictureUrl: String,
    cardTitle: String
});

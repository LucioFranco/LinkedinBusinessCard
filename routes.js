module.exports.index = function(req, res) {
    res.sendFile(__dirname + '/client/views/layout.html');
};

module.exports.subviews = function(req, res) {
    res.sendFile(__dirname + '/client/views/subviews/' + req.params.name);
};

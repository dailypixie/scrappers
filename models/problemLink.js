var mongoose = require('mongoose');
var schema = new mongoose.Schema({ date: {type: Date, default: Date.now()}, link: String });
module.exports = mongoose.model('ProblemLink', schema);
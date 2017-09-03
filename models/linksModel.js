var mongoose = require('mongoose');
var schema = new mongoose.Schema({
     date: {type: Date, default: Date.now()},
     type: String,
     comment: String,
     website: String,
     url: String,
     links: [String] });
module.exports = mongoose.model('DailyLinks', schema);
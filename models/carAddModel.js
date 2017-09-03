var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    Date: { type: Date, default: Date.now() },
    Link: String,
    Mark: String,
    Model: String,
    Fuel: String,
    YearMade: Number,
    Rulaj: Number,
    Type: String,
    MotorCapacity: Number,
    Price: Number,
    Currency: String,
    City: String,
    County: String
});
module.exports = mongoose.model('CarAdd', schema);
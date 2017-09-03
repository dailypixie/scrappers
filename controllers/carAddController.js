"use strict";
var model = require('../models/carAddModel.js')
class carAddController {
  getCarModels(mark, done) {
    model.find({Mark:mark}).distinct('Model', done);
  }
  getCarMarks(done) {
    model.find().distinct('Mark', done);
  }
};

module.exports = carAddController;


var express = require('express');
var mongoose = require('mongoose');
var CarAddController = require('./controllers/carAddController.js')
mongoose.connect('mongodb://localhost:27017/olx-scrapper');

var carAddControllerIns = new CarAddController;
var app = express();

app.get('/api/cars', function (req, res) {
  carAddControllerIns.getCarMarks(function (err, marks) {
    if(err)
      return res.send(500);
    res.json(marks)
  })
});

app.get('/api/cars/models', function(req, res) {
  carAddControllerIns.getCarModels( req.query.Mark, function (err, models) {
    if(err)
      return res.send(500);
    res.json(models)
  })
});

app.post('/api/price', function(req, res) {
  model.find({Mark: req.query.Mark}).distinct('Model', function(err, models) {
    if(err)
      return res.send(500);
    res.json(models)
  })
});

app.listen(80, function () {
  console.log('Olx scrapper listening on port 80');
});
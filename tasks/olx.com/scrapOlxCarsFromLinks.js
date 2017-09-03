var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var mongoose = require('mongoose');
var linkModel = require('../../models/linksModel.js');
var carAddModel = require('../../models/carAddModel.js');
var linkProblema = require('../../models/problemLink.js');
var links = [];
var count = 0;
var error = 0;
module.exports = function (done) {
  async.series([function (done) {
    linkModel.find({}).lean().exec(function (err, carLinks) {
      links = carLinks;
      done();
    });
  }, function (done) {
    async.whilst(
      function () { return count < links[0].links.length; },
      function (done) {
        var i = count++;
        request(links[0].links[i], function (err, resp, body) {
          if (err)
            console.error(err);
          $ = cheerio.load(body);
          //var details = $('td.value > strong > a');
          var details = $('td.value > strong');
          if (details.length < 9 || !check(details)) {
            var lp = new linkProblema();
            lp.link = links[0].links[i];
            lp.save(function (err) {
              console.log('Error');
            });
            return done(null, count);
          }

          var city = details[1].children[1].attribs.title.split('-')[1]
          var mark = details[1].children[1].attribs.title.split('-')[0];
          mark = mark.substring(0, mark.length - 1);
          var model = details[2].children[1].attribs.title.split('-')[0]
          model = model.substring(0, model.length - 1);
          model = model.split(' ')[1];
          var year = details[4].children[0].data
          var rulaj = details[5].children[0].data
          var fuel = details[3].children[1].attribs.title.split('-')[0]
          fuel = fuel.substring(0, fuel.length - 1);
          var type = details[6].children[1].attribs.title.split('-')[0]
          type = type.substring(0, type.length - 1);
          var priceLoc = $('strong.xxxx-large')[0].children[0].data;
          priceLoc = priceLoc.split(' ');
          var currency = priceLoc.pop();
          var price = Number(priceLoc.join(''));
          var motor = details[7].children[0].data;
          motor = motor.replace(/\s+/g, '');
          motor = motor.substring(0, motor.length - 2);
          motor = Number(motor);
          rulaj = rulaj.replace(/\s+/g, '');
          rulaj = rulaj.substring(0, rulaj.length - 2);
          rulaj = Number(rulaj);

          year = Number(year.replace(/\s+/g, ''));
          var newCar = new carAddModel({
            Link: links[0].links[i],
            Mark: mark || "not",
            Model: model || "not",
            Fuel: fuel || "not",
            YearMade: year || 1,
            Rulaj: rulaj || 1,
            Type: type || "not",
            MotorCapacity: motor || 1,
            Price: price || 1,
            Currency: currency || "not",
            City: city || "not",
            County: 'Romania'
          });
          console.log('Saved' + mark + " " + model);
          newCar.save(function (err, res) {
            if (err)
              done(err)
            done(null, count)
          });
        });
      }, done
    );
  }], function (err, res) {
    if (err)
      console.log(err);
    console.log('done');
    done();
  });
}

function check(details) {
  var val = details[1].children[1] && details[1].children[1].attribs.title && details[2].children[1] &&
    details[2].children[1].attribs.title && details[3].children[1] && details[3].children[1].attribs.title &&
    details[6].children[1] && details[6].children[1].attribs.title && details[5].children[0] &&
    details[5].children[0].data && details[4].children[0] && details[4].children[0].data &&
    details[7].children[0] && details[7].children[0].data
  return !!val;
}
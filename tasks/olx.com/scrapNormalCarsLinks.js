var request = require('request')
var cheerio = require('cheerio')
var async = require('async')
var mongoose = require('mongoose');
var linkModel = require('../../models/linksModel.js')

var links = [];
var count = 1;
var linksArray = [];
module.exports = function (pageCount, mark, done) {
  var url = 'http://olx.ro/auto-masini-moto-ambarcatiuni/autoturisme/' + mark + '/?search%5Bfilter_float_price%3Afrom%5D=200&page=';
  async.whilst(
    function () { return count < pageCount; },
    function (done) {
      var i = count++;
      request(url + i, function (err, resp, body) {
        if (err)
          console.error(err);
        //console.log(body)
        $ = cheerio.load(body);
        links[i] = $('.detailsLink');
        console.log(mark + ' page: ' + count);
        done(null, count);
      });
    },
    function (err, n) {
      links.forEach(function (page) {
        for (index in page) {
          if (index % 2 == 0) {
            var elAtr = page[index].attribs;

            if (elAtr && elAtr.href)
              linksArray.push(elAtr.href);
          }

        }
      });
      linkModel.findOne({ date: Date.now() }, function (err, res) {
        if (err)
          return console.log(err);
        if (!res) {
          res = new linkModel();
        }
        res.date = Date.now();
        res.links = linksArray;
        res.comment = mark;
        res.type = 'normal';
        res.website = 'olx.ro';
        res.url = url;
        res.save(function (err, res) {
          if (err)
            console.log(err)
          console.log(res);
          done();
        });
      });
    }
  );
}
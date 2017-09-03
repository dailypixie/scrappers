var request = require('request')
var cheerio = require('cheerio')
var async = require('async')
var mongoose = require('mongoose');
var linkModel = require('../../models/linksModel.js')

var url = 'http://olx.ro/auto-masini-moto-ambarcatiuni/autoturisme/?search%5Bpaidads_listing%5D=1&page=';
var links = [];
var count = 1;
var linksArray = [];
module.exports = function (done) {
  async.whilst(
    function () { return count < 84; },
    function (done) {
      var i = count++;
      request(url + i, function (err, resp, body) {
        if (err)
          console.error(err);
        //console.log(body)
        $ = cheerio.load(body);
        links[i] = $('.detailsLinkPromoted');
        console.log('Promoted page: ' + count);
        done(null, count);
      });
    },
    function (err, n) {
      var promoSubstring = ";promoted";
      var promoSubStringLength = promoSubstring.length;
      links.forEach(function (page) {
        for (index in page) {
          var elAtr = page[index].attribs;

          if (elAtr && elAtr.href)
            if (elAtr.href.substr(elAtr.href.length - promoSubStringLength) !== promoSubstring)
              linksArray.push(elAtr.href);

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
        res.save(function (err, res) {
          if (err)
            console.log(err)
          console.log(res)
          done();
        });
      });
    }
  );
}
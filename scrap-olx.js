var mongoose = require('mongoose');
var async = require('async');
var mark = require('./tasks/olx.com/markAndPage.js')

var scrapCarsPromotedLinkTask = require('./tasks/olx.com/scrapPromotedCarsLinks.js');
var scrapNormalCarsLinkTask = require('./tasks/olx.com/scrapNormalCarsLinks.js');
var scrapCarsTasks = require('./tasks/olx.com/scrapOlxCarsFromLinks.js');

async.parallel([
  function(done) {
    scrapCarsPromotedLinkTask(done);
  },
  function(done) {
    async.forEachOf(mark, scrapNormalCarsLinkTask, done);
  },
], function(err, res) {
  scrapCarsTasks(function() {
    console.log('Done everything.');
  });
});
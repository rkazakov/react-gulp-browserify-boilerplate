var bibleApi = require('./bibleApi');
var locallydb = require('locallydb');
var db = new locallydb('db');
var collection = db.collection('verses');

var router = module.exports = require('express').Router();

router
  .get('/healthcheck', function (req, res, next) {
    res.writeHead(200);
    res.end();
  });

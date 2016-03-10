/**
 * @fileoverview router for /rest/news
 *
 * @author Wei Chengli (foundwei@qq.com)
 * @version 1.0 (2016-03-10)
 */
 
var express = require('express');
var router = express.Router();
var News = require('../../navy.mil/models/News.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	News.findFirst(function(err, obj) {
		if(err) {
			res.send('Failed to fetch news!');
		} else {
			res.send(obj.content);
		}
	});
});

module.exports = router;
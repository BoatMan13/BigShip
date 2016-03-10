/**
 * @fileoverview router for /rest/tweets
 *
 * @author Wei Chengli (foundwei@qq.com)
 * @version 1.0 (2016-03-10)
 */
 
var express = require('express');
var router = express.Router();
var Tweet = require('../../navy.mil/models/Tweet.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	Tweet.findFirst(function(err, obj) {
		if(err) {
			res.send('Failed to fetch tweets!');
		} else {
			res.send(obj.content);
		}
	});
});

module.exports = router;
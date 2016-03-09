/**
 * @fileoverview Model for Tweet object.
 *
 * @author Wei Chengli (foundwei@qq.com)
 * @version 1.0 (2016-03-08)
 */
 
var db = require('../../util/dbconnection.js');
var Schema = db.mongoose.Schema;

var TweetSchema = new Schema({
	pubdate: String,
	content: String,
	last_id: Number
});

var Tweet = db.mongoose.model('Tweet', TweetSchema);
var TweetDAO = function() {};

TweetDAO.prototype.save = function(obj, callback) {
	var instance = new Tweet(obj);
	instance.save(function(err) {
		callback(err);
	});
}

TweetDAO.prototype.findByDate = function(date, callback) {
	Tweet.findOne({pubdate: date}, function(err, obj) {
		callback(err, obj);
	});
}

TweetDAO.prototype.findFirst = function(callback) {
	Tweet.findOne({}, function(err, obj) {
		callback(err, obj);
	});
}

module.exports = new TweetDAO();
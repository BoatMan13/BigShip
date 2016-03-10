/**
 * @fileoverview Model for News object.
 *
 * @author Wei Chengli (foundwei@qq.com)
 * @version 1.0 (2016-03-08)
 */

var db = require('../../util/dbconnection.js');
var Schema = db.mongoose.Schema;

var NewsSchema = new Schema({
	pubdate: String,
	content: [String],
	adddate: Date
});

var News = db.mongoose.model('News', NewsSchema);
var NewsDAO = function() {};

NewsDAO.prototype.save = function(obj, callback) {
	var instance = new News(obj);
	instance.save(function(err) {
		callback(err);
	});
}

NewsDAO.prototype.findByDate = function(date, callback) {
	News.findOne({pubdate: date}, function(err, obj) {
		callback(err, obj);
	});
}

NewsDAO.prototype.findFirst = function(callback) {
	News.findOne({}, null, {sort: {adddate: -1}}, function(err, obj) {
		callback(err, obj);
	});
}

module.exports = new NewsDAO();

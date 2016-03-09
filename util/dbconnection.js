/**
 * @fileoverview MongoDB Connection.
 *
 * @author Wei Chengli (foundwei@qq.com)
 * @version 1.0 (2016-03-08)
 */

var mongoose = require('mongoose');
var conf = require('./conf.js');
mongoose.connect(conf.mongourl);

module.exports.mongoose = mongoose;

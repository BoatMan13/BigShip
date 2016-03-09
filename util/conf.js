/**
 * @fileoverview Utilities methods/functions in this file.
 *
 * @author Wei Chengli (foundwei@qq.com)
 * @version 1.0 (2016-03-07)
 */

// mongoDB related information
var mongo = {
	'hostname':'localhost',
	'port':27017,
	'username':'',
	'password':'',
	'name':'',
	'db':'bigship'
}

var generate_mongo_url = function(obj) {
	obj.hostname = (obj.hostname || 'localhost');
	obj.port = (obj.port || 27017);
	obj.db = (obj.db || 'bigship');

	if(obj.username && obj.password) {
		return 'mongodb://' + obj.username + ':' + obj.password + '@' + obj.hostname + ':' + obj.port + '/' + obj.db;
	} else {
		return 'mongodb://' + obj.hostname + ':' + obj.port + '/' + obj.db;
	}
}

var mongourl = generate_mongo_url(mongo);

// twitter related information
var consumer_key ='qeqHGILQqniRrz3QE6uLKA7gV';
var consumer_secret = 'iHdKyoACKTGsBPZrwzBNE3gBmeP9YrpKY0Ieg0sguPsxkzkqod';
var access_token_key = '707112700279533568-2nElzjH6X5n8tmIY8PzkY2ATjvaO3tb';
var access_token_secret = '54iNGxzH5MNxwgL5qVGfYHZMwc4g7oo7UADBobYyVBQjY';


module.exports.mongourl = mongourl;
module.exports.consumer_key = consumer_key;
module.exports.consumer_secret = consumer_secret;
module.exports.access_token_key = access_token_key;
module.exports.access_token_secret = access_token_secret;

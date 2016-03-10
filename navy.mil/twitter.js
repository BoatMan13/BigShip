/**
 * @fileoverview This file is used to retrive the lateset tweets from twitter.
 *
 * @author Wei Chengli (foundwei@qq.com)
 * @version 1.0 (2016-03-08)
 */

var http = require('http');
var Buffer = require('buffer');
var schedule = require('node-schedule');
var Tweet = require('./models/Tweet.js');
var twitter = require('ntwitter');
var conf = require('../util/conf.js');
var utils = require('../util/utils.js');

var last_id;
var waiter;
var trytimes = 20;

var twit = new twitter({
	consumer_key: conf.consumer_key,
	consumer_secret: conf.consumer_secret,
	access_token_key: conf.access_token_key,
	access_token_secret: conf.access_token_secret
});

function getTweetsOfYesterday() {
	twit.verifyCredentials(function(err, data) {
		//console.log(data);
	}).updateStatus('CSICDATA/' + twitter.VERSION, function(err, data) {
		//console.log(data);
	});
	
	getLastId(function() {
		twit.getUserTimeline({screen_name: 'USNavy', since_id: last_id}, function(err, data) {
			if(err) {
				if(trytimes > 0) {
					waiter = setTimeout(getTweetsOfYesterday, 60 * 1000);
					trytimes--;
				} else {
					trytimes = 20;
					console.log('have already tried 20 times for twitter, give up today!');
				}
			} else {
				saveResult(data);
			}
		});
	});
	
}

function getLastId(callback) {
	Tweet.findFirst(function(err, obj) {
		if(err)
			console.log('Failed to get last_id of tweets!');
		else {
			last_id = obj.last_id;
			callback();
		}
	});
}

function saveResult(d) {
	var results = [];
	var y = utils.yesterday();
	var pd = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
	
	if(d && d.length > 0) {
		for(var i = 0; i < d.length; i++) {
			results.push(d[i].text + ' (' + d[i].created_at + ')');
		}
		
		last_id = d[0].id;
		Tweet.save({pubdate: pd, content: results, last_id: last_id, adddate: Date()}, function(err) {
			if(err)
				console.error('Failed to save Tweet:' + err);
		});
	}
}

function startJob() {
	// schedule this job at 8:30AM for everyday, '30 8 * * *' is crontab format.
	schedule.scheduleJob('30 8 * * *', getTweetsOfYesterday);
}

// the following line is for test intention.
// getTweetsOfYesterday();

module.exports.startJob = startJob;

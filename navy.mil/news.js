/**
 * @fileoverview This file is used to retrive the top news from www.navy.mil.
 *
 * @author Wei Chengli (foundwei@qq.com)
 * @version 1.0 (2016-03-04)
 */

var http = require('http');
var Buffer = require('buffer');
var schedule = require('node-schedule');
//jquery need jsdom for html parsing
var jsdom = require('jsdom');
var $ = require('jquery')(jsdom.jsdom().defaultView);
var News = require('./models/News.js');
var utils = require('../util/utils.js');

var results = [];
var waiter;
var trytimes = 20;
var curLocDate;

function getTopNewsOfYesterday() {
	curLocDate = utils.yesterday();
	trytimes--;
	var formatDate = '(' + curLocDate.getDate() + ' ' + utils.getMonthName(curLocDate.getMonth()) + ' ' + curLocDate.getFullYear() + ')';
	
	var options = {
		hostname: 'www.navy.mil',
		port: 80,
		path: '/listStories.asp?x=4', 
		method: 'GET'
	};
	
	var req = http.request(options, function(res) {
		var body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});
		
		res.on('end', function() {
			// error handler, navy.mil seems not stable enough, we often got server error.
			var error = new RegExp("Server Error", "gi");
			if(error.test(body)) {
				if(trytimes > 0) {
					waiter = setTimeout(getTopNewsOfYesterday, 60 * 5 * 1000);
					console.error('Server Error occurred, try again 5 minutes later...');
				} else { 	//after try 20 times, give up
					trytimes = 20;
					console.log('have already tried 20 times, give up today!');
				}
				
			} else {
				var re = new RegExp(formatDate,"gi");
				// reset trying times
				trytimes = 20;
				if(waiter)
					clearTimeout(waiter);

				$(body).find('div[style="width:950px; margin: 10px 25px;"]').each(function($this) {
					var title = $($(this).children('div')[0]).text();
					if(re.test(title)) {
						var a = $(this).find('a')[0];
						var href = $(a).attr('href');
						$(a).attr('href', 'http://www.navy.mil' + href);
						results.push($(this).html().replace(/\n\t/g, ''));
					}
				});
				
				console.log('Completed grabbing top news on ' + formatDate);
				saveResult(results);
				results = [];
			}
		});
		
		req.on('error', function() {
			console.error('encounter an error when request resource');
		});
	});
	
	req.end();
}

function startJob() {
	// schedule this job at 8:00AM for everyday, '0 8 * * *' is crontab format.
	schedule.scheduleJob('0 8 * * *', getTopNewsOfYesterday);
}

/**
 *  This function will post the retrived data to WeChat.
 */
function saveResult(data) {
	var sd = curLocDate.getFullYear() + '-' + (curLocDate.getMonth() + 1) + '-' + curLocDate.getDate();
	News.save({pubdate: sd, content: data, adddate: Date()}, function(err) {
		if(err)
			console.error('Failed to save News:' + err);
	});
}

// the following line is for test intention.
//startJob();
// getTopNewsOfYesterday();

module.exports.startJob = startJob;

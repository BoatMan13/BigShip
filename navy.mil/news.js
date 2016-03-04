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

var results = [];
var waiter;
var trytimes = 20;

function getTopNewsOfYesterday() {
	var curLocDate = new Date();
	curLocDate.setDate(curLocDate.getDate() - 2);
	trytimes--;
	var formatDate = '(' + curLocDate.getDate() + ' ' + getMonthName(curLocDate.getMonth()) + ' ' + curLocDate.getFullYear() + ')';
	
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
						results.push($(this).html());
					}
				});
				
				console.log('Completed grabbing top news on ' + formatDate);
				postResult(results);
				results = [];
				console.log(results);
			}
		});
		
		req.on('error', function() {
			console.error('encounter an error when request resource');
		});
	});
	
	req.end();
}

function startJob() {
	// schedule this job at 9:00AM for everyday, '0 9 * * *' is crontab format.
	schedule.scheduleJob('0 9 * * *', getTopNewsOfYesterday);
}

/**
 *  This function will post the retrived data to WeChat.
 */
function postResult(data) {
	console.log(data);
}

/**
 *  get the Month name by its number
 */
function getMonthName(i) {
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	
	return months[i];
}

// the following line is for test intention.
//startJob();

module.exports.startJob = startJob;

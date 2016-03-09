/**
 * @fileoverview The utilities functions/methods go into this file.
 *
 * @author Wei Chengli (foundwei@qq.com)
 * @version 1.0 (2016-03-09)
 */
 
 
 /**
 *  get the Month name by its number
 */
function getMonthName(i) {
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	
	return months[i];
}

/**
 * Get the Date of yesterday
 */
function yesterday() {
	var curLocDate = new Date();
	curLocDate.setDate(curLocDate.getDate() - 1);
	
	return curLocDate;
}

module.exports.getMonthName = getMonthName;
module.exports.yesterday = yesterday;

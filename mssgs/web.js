/**
 * MssGs-node-bot
 *
 * A NodeJS plugin-based bot for mss.gs
 * Copyright 2012 Michael Owens & Dean Ward
 */
var web = exports.init = function (port, password) {
	this.port = port;
	this.password = password;
	
	console.log('[web] Web interface started on port ' + port);
};
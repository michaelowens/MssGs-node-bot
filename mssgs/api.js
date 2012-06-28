/**
 * MssGs-node-bot
 *
 * A NodeJS plugin-based bot for mss.gs
 * Copyright 2012 Michael Owens & Dean Ward
 */
var fs = require('fs'),
	webInterface = require('./web'),
	user = require('./user'),
	channel = require('./channel');

var instance = exports.instance  = function () {
	var self = this;
	fs.readFile('./config.json', 'utf8', function (err, config) {
		if (err) {
			throw 'Could not find the config';
		}
		
		var c;
		try {
			var c = JSON.parse(config);
			self.init(c);
		}
		catch (e) {
			throw 'Config file seems to be invalid';
		}
	});
};

instance.prototype.init = function (config) {
	this.username = config.username || 'NodeBot';
	this.webPort = config.webPort || 8080;
	this.webPassword = config.webPassword || '';
	this.channels = config.lastChannels || [];
	
	// web interface
	this.web = webInterface.init(this.webPort, this.webPassword);
	
	this.connect();
};

instance.prototype.connect = function () {
	console.log('[bot] Start...');
};
/**
 * MssGs-node-bot
 *
 * A NodeJS plugin-based bot for mss.gs
 * Copyright 2012 Michael Owens & Dean Ward
 */
var fs = require('fs'),
	io = require('socket.io-client'),
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
		}
		catch (e) {
			throw '[error] ' + e.message;
		}
		self.init(c);
	});
};

instance.prototype.init = function (config) {
	this.s = null;
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
	
	var self = this;
	this.s = io.connect('api.mss.gs', {port: 443, secure: true, reconnect: true});
	this.s.on('connect', function () { self.onConnect() });
	this.s.on('auth', function () { self.onAuth() });
};

instance.prototype.onConnect = function () {
	console.log('[bot] Connected');
	this.s.emit('auth', {'username': this.username, 'avatar': 'http://newleafdigital.com/files/nodejs-dark.png'});
};

instance.prototype.onAuth = function () {
	console.log('[bot] Authenticated');
	this.join('nodebot');
};

instance.prototype.join = function (channel, password) {
	console.log('[bot] Joining channel: ' + channel);
	var packet = {'conversation': channel};
	if (password !== null) packet['robot password'] = password;
	
	this.s.emit('join conversation', packet);
};
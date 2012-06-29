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
	this.config = {};
	this.config.username = config.username || 'NodeBot';
	this.config.avatar = config.avatar || '';
	this.config.commandPrefix = (!config.commandPrefix || config.commandPrefix.length == 0) ? '@' + this.config.username : config.commandPrefix;
	this.config.webPort = config.webPort || 8080;
	this.config.webPassword = config.webPassword || '';
	this.config.channels = config.lastChannels || [];
	
	console.log(this.config.commandPrefix);
	
	// web interface
	this.web = webInterface.init(this.config.webPort, this.config.webPassword);
	
	this.connect();
};

instance.prototype.connect = function () {
	console.log('[bot] Start...');
	
	var self = this;
	this.s = io.connect('api.mss.gs', {port: 443, secure: true, reconnect: true});
	this.s.on('connect', function () { self.onConnect() });
	this.s.on('auth', function () { self.onAuth() });
	this.s.on('message', function (data) { self.onMessage(data) });
};

instance.prototype.onConnect = function () {
	console.log('[bot] Connected');
	this.s.emit('auth', {'username': this.config.username, 'avatar': this.config.avatar});
};

instance.prototype.onAuth = function () {
	console.log('[bot] Authenticated');
	this.join('nodebot');
};

instance.prototype.onMessage = function (data) {
	console.log('[bot][<<]: Message from ' + data.username);
	
	if (data.username.toLowerCase() == 'internal') {
		// handle internal
		return;
	}
	
	var arg = data.message.split(' ');
	if (arg[0].toLowerCase() !== this.config.commandPrefix.toLowerCase()) return;
	
	arg.shift();
	var cmd = arg[0];
	arg.shift();
	var msg = arg.join(' ');
	console.log('[command]: ' + cmd);
	console.log('[arguments]:');
	console.log(arg);
	console.log('[message]: ' + msg);
	
	this.s.emit('message', {'conversation': data.conversation, 'text': 'What\'s up, ' + data.username + '?'});
};

instance.prototype.join = function (channel, password) {
	console.log('[bot] Joining channel: ' + channel);
	var packet = {'conversation': channel};
	if (password !== null) packet['robot password'] = password;
	
	this.s.emit('join conversation', packet);
};
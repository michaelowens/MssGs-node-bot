/**
 * MssGs-node-bot
 *
 * A NodeJS plugin-based bot for mss.gs
 * Copyright 2012 Michael Owens & Dean Ward
 */
var util = require('util'),
	events = require('events'),
	fs = require('fs'),
	path = require('path'),
	io = require('socket.io-client'),
	webInterface = require('./web'),
	user = require('./user'),
	channel = require('./channel'),
	Logger = require('./log');

global.log = new Logger();

var instance = exports.instance  = function () {
	var self = this;
	fs.readFile('./config.json', 'utf8', function (err, config) {
		if (err) {
			log.error('[bot]', 'Could not find the config');
			throw err;
		}
		
		var c;
		try {
			var c = JSON.parse(config);
		}
		catch (e) {
			throw e;
		}
		self.init(c);
	});
};

util.inherits(instance, events.EventEmitter);

instance.prototype.init = function (config) {
	this.s = null;
	this.config = {};
	this.config.username = config.username || 'NodeBot';
	this.config.avatar = config.avatar || '';
	this.config.commandPrefix = (!config.commandPrefix || config.commandPrefix.length == 0) ? '@' + this.config.username : config.commandPrefix;
	this.config.webPort = config.webPort || 8080;
	this.config.webPassword = config.webPassword || '';
	this.config.channels = config.lastChannels || [];
	
	this.hooks = [];
	this.triggers = [];
	
	// plugins
	this.plugins = [];
	for (var i = 0, z = config.plugins.length; i < z; i++) {
		this.loadPlugin(config.plugins[i]);
	}
	
	// web interface
	this.web = webInterface.init(this.config.webPort, this.config.webPassword);
	
	this.connect();
};

instance.prototype.connect = function () {
	log.info('[bot]', 'Starting bot...');
	
	var self = this;
	this.s = io.connect('api.mss.gs', {port: 443, secure: true, reconnect: true});
	this.s.on('connect', function () { self.onConnect() });
	this.s.on('auth', function () { self.onAuth() });
	this.s.on('message', function (data) { self.onMessage(data) });
};

instance.prototype.loadPlugin = function (name) {
	this.unloadPlugin(name);
	
	try {
		var p = require('../plugins/' + name);
		this.plugins[name] = new p.Plugin(this);
		log.pass('[bot]', 'loaded plugin: ' + name);
	} catch(e) {
		log.error('[bot]', 'plugin could not be loaded');
	}
};

instance.prototype.unloadPlugin = function (name) {
	if (typeof this.plugins[name] == 'undefined') return;
	delete this.plugins[name];
	
	var p = path.normalize(__dirname + '/../plugins/' + name);
	delete require.cache[p + '.js'];
};


/**
 * Socket functions
 */
instance.prototype.onConnect = function () {
	log.info('[bot]', 'Connected');
	this.s.emit('auth', {'username': this.config.username, 'avatar': this.config.avatar});
};

instance.prototype.onAuth = function () {
	log.info('[bot]', 'Authenticated');
	this.join('nodebot');
};

instance.prototype.onMessage = function (data) {
	log.info('[bot][<<]', 'Message from ' + data.username);
	
	if (data.username.toLowerCase() == 'internal') {
		console.log(data);
		var cmd = data.message.split(':')[0];
		switch (cmd) {
			case 'kick':
				// rejoin
				this.join(data.conversation);
				break;
		}
		// handle internal
		return;
	}
	
	var arg = data.message.split(' ');
	if (arg[0].toLowerCase() !== this.config.commandPrefix.toLowerCase()) return;
	
	arg.shift();
	var cmd = arg[0];
	arg.shift();
	var msg = arg.join(' ');
	
	switch (cmd) {
		case 'reload':
			if (typeof arg[0] == 'undefined') break;
			this.loadPlugin(arg[0]);
			break;
	}
	
	for(var p in this.plugins) {
		this.plugins[p].emit('command ' + cmd, data, arg, msg);
	}
	this.emit('message', data, arg, msg);
};

// API functions
instance.prototype.join = function (channel, password) {
	log.info('[bot]', 'Joining channel: ' + channel);
	var packet = {'conversation': channel};
	if (password !== null) packet['robot password'] = password;
	
	this.s.emit('join conversation', packet);
};

instance.prototype.reply = function (data, msg) {
	if (typeof data == 'undefined' || typeof data.conversation == 'undefined' || typeof msg == 'undefined') {
		log.warn('invalid reply');
		return;
	}
	
	var packet = {'conversation': data.conversation, 'text': msg};
	this.s.emit('message', packet);
};
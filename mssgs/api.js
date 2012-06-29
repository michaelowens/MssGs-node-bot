/**
 * MssGs-node-bot
 *
 * A NodeJS plugin-based bot for mss.gs
 * Copyright 2012 Michael Owens & Dean Ward
 */
var util = require('util'),
	fs = require('fs'),
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
			throw e;
		}
		self.init(c);
	});
};

util.inherits(instance, process.EventEmitter);

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
	console.log('[bot] Start...');
	
	var self = this;
	this.s = io.connect('api.mss.gs', {port: 443, secure: true, reconnect: true});
	this.s.on('connect', function () { self.onConnect() });
	this.s.on('auth', function () { self.onAuth() });
	this.s.on('message', function (data) { self.onMessage(data) });
};

instance.prototype.addListener = function (plugin, event, f) {
	if (typeof this.hooks[plugin] == 'undefined') {
		this.hooks[plugin] = [];
	}
	
	var callback = (function () {
		return function () {
			f.apply(that, arguments);
		}
	})();
	
	this.hooks[plugin].push({'event': event, 'callback': callback});
	
	var that = this.plugins[plugin];
	return this.on(event, callback);
};

instance.prototype.addTrigger = function (plugin, trigger, callback) {
	if (typeof this.triggers[trigger] == 'undefined') {
		this.triggers[trigger] = {'plugin': plugin.config.name, 'callback': callback};
	}
};

instance.prototype.loadPlugin = function (name) {
	this.unloadPlugin(name);
	
	var that = this;
	fs.readFile('./plugins/' + name + '.js', 'utf8', function (err, data) {
		if (err) {
			console.log(err);
			return;
		}
		
		eval(data);
		that.plugins[name] = new Plugin(that);
		
		['connect', 'auth', 'message'].forEach(function (event) {
			var onEvent = 'on' + event.charAt(0).toUpperCase() + event.substr(1),
				callback = this.plugins[name][onEvent];
			
			if (typeof callback == 'function') {
				this.addListener(name, event, callback);
			}
		}, that);
	});
};

instance.prototype.unloadPlugin = function (name) {
	if (typeof this.plugins[name] == 'undefined') return;
	
	delete this.plugins[name];
	
	for(var trigger in this.triggers) {
		if (this.triggers[trigger].plugin == name) {
			delete this.triggers[trigger];
		}
	}
};


/**
 * Socket functions
 */
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
	
	this.s.emit('message', {'conversation': data.conversation, 'text': 'What\'s up, ' + data.username + '?'});
	
	if (typeof this.triggers[cmd] != 'undefined') {
		var trig = this.triggers[cmd];
		trig.callback.apply(this.plugins[trig['plugin']], arguments, msg);
	}
	
	this.emit(cmd, msg);
	this.emit('message', arg, msg);
};

// API functions
instance.prototype.join = function (channel, password) {
	console.log('[bot] Joining channel: ' + channel);
	var packet = {'conversation': channel};
	if (password !== null) packet['robot password'] = password;
	
	this.s.emit('join conversation', packet);
};
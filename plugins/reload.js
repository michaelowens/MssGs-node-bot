/**
 * Example Plugin
 *
 * An example plugin showing off the basic functionality of plugins
 */
var util = require('util'),
	events = require('events');

var Plugin = exports.Plugin = function (bot) {
	this.config = [];
	this.config.name = 'example';
	this.config.title = 'Example Plugin';
	this.config.version = '1.0';
	this.config.author = 'Michael Owens';
	
	this.bot = bot;
	this.s = bot.s;
	
	this.on('command reload', this.cmdReload);
};

util.inherits(Plugin, events.EventEmitter);

Plugin.prototype.cmdReload = function (msg, arg, str) {
	if (typeof arg[0] == 'undefined') {
		this.bot.reply(msg, 'Please give a plugin to reload');
		return;
	}
	
	try {
		this.loadPlugin(arg[0]);
	} catch(e) {
		this.bot.reply(msg, 'Could not reload plugin (note: plugin is now inactive!)');
	}
};
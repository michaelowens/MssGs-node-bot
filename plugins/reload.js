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
	
	this.on('command load', this.cmdLoad);
	this.on('command reload', this.cmdReload);
	this.on('command reloadall', this.cmdReloadAll);
};

util.inherits(Plugin, events.EventEmitter);

Plugin.prototype.cmdReload = function (msg, arg, str) {
	if (typeof arg[0] == 'undefined') {
		this.bot.reply(msg, 'Please give a plugin to reload');
		return;
	}
	
	try {
		this.bot.loadPlugin(arg[0]);
		this.bot.reply(msg, 'Plugin reloaded!');
	} catch(e) {
		this.bot.reply(msg, 'Could not reload plugin (note: plugin is now inactive!)');
	}
};

Plugin.prototype.cmdLoad = function (msg, arg, str) {
	if (typeof arg[0] == 'undefined') {
		this.bot.reply(msg, 'Please give a plugin to load');
		return;
	}
	
	if (typeof this.bot.plugins[arg[0]] != 'undefined') {
		this.bot.reply(msg, 'This plugin is already loaded');
		return;
	}
	
	try {
		this.bot.loadPlugin(arg[0]);
		this.bot.reply(msg, 'Plugin loaded!');
	} catch(e) {
		this.bot.reply(msg, 'Could not load plugin');
	}
};

Plugin.prototype.cmdReloadAll = function (msg, arg, str) {
	this.bot.reply(msg, 'This is soon to be implemented');
};
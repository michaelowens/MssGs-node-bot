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
	
	this.on('command example', this.onExample);
};

util.inherits(Plugin, events.EventEmitter);

Plugin.prototype.onExample = function (msg, arg, str) {
	this.bot.reply(msg, 'Thanks for using Example Plugin v2!');
	//this.bot.s.emit('message', {'conversation': msg.conversation, 'text': 'Thanks for using Example Plugin!'});
};
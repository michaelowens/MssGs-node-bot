/**
 * Memory Test
 */
var util = require('util'),
	events = require('events');

var Plugin = exports.Plugin = function (bot) {
	this.config = [];
	this.config.name = 'memory_test';
	this.config.title = 'Memory Test Plugin';
	this.config.version = '1.0';
	this.config.author = 'Michael Owens';
	
	this.bot = bot;
	this.s = bot.s;
	
	this.on('command memorytest', this.cmdMemoryTest);
};

util.inherits(Plugin, events.EventEmitter);

Plugin.prototype.cmdMemoryTest = function (msg, arg, str) {
	this.bot.reply(msg, 'Thanks for using Memory Test Plugin!');
	//this.bot.s.emit('message', {'conversation': msg.conversation, 'text': 'Thanks for using Example Plugin!'});
};
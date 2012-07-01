/**
 * Memory Plugin
 *
 * A plugin to test memory usage
 */
var util = require('util'),
	events = require('events');

var Plugin = exports.Plugin = function (bot) {
	this.config = [];
	this.config.name = 'memory';
	this.config.title = 'Memory Plugin';
	this.config.version = '1.0';
	this.config.author = 'Michael Owens';
	
	this.bot = bot;
	this.s = bot.s;
	this.mem = null;
	this.test = null;
	this.runs = 0;
	
	this.on('command memory', this.cmdExample);
};

util.inherits(Plugin, events.EventEmitter);

Plugin.prototype.cmdExample = function (msg, arg, str) {
	this.bot.reply(msg, '@github starttest');
	
	var self = this;
	this.test = setInterval(function () {
		self.mem = process.memoryUsage();
		console.log(self.bot);
		console.log(msg);
		self.bot.reply(msg, '@github add ' + self.mem.heapUsed);
		self.runTest();
		self.runs++;
		if (self.runs >= 50) {
			clearInterval(self.test);
			self.bot.reply(msg, '@github endtest');
		}
	}, 30000);
	//this.bot.s.emit('message', {'conversation': msg.conversation, 'text': 'Thanks for using Example Plugin!'});
};

Plugin.prototype.runTest = function (callback) {
	var i;
	for (i = 0; i < 1000; i++) {
		this.bot.loadPlugin('memory_test');
	}
	this.bot.unloadPlugin('memory_test');
};
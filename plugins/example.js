/**
 * Example Plugin
 *
 * An example plugin showing off the basic functionality of plugins
 */
exports.Plugin = Plugin = function (bot) {
	this.config = [];
	this.config.name = 'example';
	this.config.title = 'Example Plugin';
	this.config.version = '0.1';
	this.config.author = 'Michael Owens';
	
	this.bot = bot;
	this.s = bot.s;
	
	bot.addTrigger(this, 'example', this.exampleResponse);
};

Plugin.prototype.exampleResponse = function (msg) {
	this.s.emit('message', {'conversation': msg.conversation, 'text': 'Thanks for using Example Plugin!'});
}
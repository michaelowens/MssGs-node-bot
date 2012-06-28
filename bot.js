/**
 * MssGs-node-bot
 *
 * A NodeJS plugin-based bot for mss.gs
 * Copyright 2012 Michael Owens
 * http://www.michaelowens.nl
 */
var mssgs = require('./mssgs');

/**
 * Config
 */
var config = {
	username: 'MikeBot',
	conversation: 'botdev',
	// password: 'conversation password',
	debug: true,
	
	plugin: ['reload']
};

var bot = new mssgs.instance(config);
bot.connect();
/**
 * MssGs-node-bot
 *
 * A NodeJS plugin-based bot for mss.gs
 * Copyright 2012 Michael Owens & Dean Ward
 */
var mssgs = require('./mssgs/api');

/**
 * Configure the bot
 * (soon to become a json file)
 */
var c = {};

// Bot config
c.username = 'MikeBot';
c.commandPrefix = '@' + c.username;

// Web interface config
c.webPort = 8080;
c.webPassword = '';
	
// debug config
c.debug = true;

/**
 * Start the bot
 */
var bot = new mssgs.instance(c);
bot.connect();
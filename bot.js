/**
 * MssGs-node-bot
 *
 * A NodeJS plugin-based bot for mss.gs
 * Copyright 2012 Michael Owens & Dean Ward
 */
var mssgs = require('./mssgs/api');

var bot = new mssgs.instance();
bot.connect();
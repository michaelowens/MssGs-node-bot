/**
 * MssGs-node-bot
 *
 * A NodeJS plugin-based bot for mss.gs
 * Copyright 2012 Michael Owens
 * http://www.michaelowens.nl
 */
var util = require('util'),
	net = require('net'),
	user = require('./user'),
	conversation = require('./conversation');

var instance = exports.instance  = function (config) {
	this.init(config);
};

instance.prototype.init = function (config) {
	this.username = config.username || 'MikeBot';
	this.conversations = config.conversations || [];
};

instance.prototype.connect = function () {
	console.log('start...');
};
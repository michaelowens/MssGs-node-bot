/**
 * MssGs-node-bot
 *
 * A NodeJS plugin-based bot for mss.gs
 * Copyright 2012 Michael Owens & Dean Ward
 */
var express = require('express');

exports.init = web = function (port, password) {
	this.port = port;
	this.password = password;
	
	this.app = app = express.createServer();
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});
	
	app.configure(function () {
		app.use(express.methodOverride());
	    app.use(express.bodyParser());
	    app.use(app.router);
		//app.use(express.static(__dirname + '/../web_ui/assets', {maxAge: 31557600000})); // one year
		app.use(express.static(__dirname + '/web_ui'));
		
		app.set('views', __dirname + '/web_ui');
		app.set('view engine', 'ejs');
		app.set('view options', {
			open: '{{',
			close: '}}'
		});
	});
	
	app.listen(port);
	
	console.log('[web] Web interface started on port ' + port);
};
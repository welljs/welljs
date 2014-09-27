var http = require('http');
var express = require('express');
var path = require('path');
var app = express();

app.use(require('body-parser')()); // стандартный модуль, для парсинга JSON в запросах
app.use(require('method-override')()); // поддержка put и delete

function createServer(name, port, currentEnv) {
	var env = {
		production: 'production',
		development: 'development'
	}[currentEnv] || '';

	app.use(express.static(path.join(__dirname, '../' + name + '/' + env + '/'), {hidden : true}));
	app.set('port', port);
	http.createServer(app).listen(app.get('port'), '127.0.0.1', function(){
		console.log('Express server listening on port ' + port);
		console.log('current environment: ', env);
	});
}

createServer('example', 3002, 'development');
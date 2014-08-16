var http = require('http');
var express = require('express');
var path = require('path');
var app = express();

app.use(require('body-parser')()); // стандартный модуль, для парсинга JSON в запросах
app.use(require('method-override')()); // поддержка put и delete

var env = 'development';
app.use(express.static(path.join(__dirname, '../client/'+ env + '/'), {hidden : true}));

app.set('view engine', 'jade');
app.set('views', __dirname);
app.get('/', function (req, res) {
	res.render('views/index.jade', {
		production: env === 'production'
	});
});

var port = 3002;
app.set('port', port); // порт настроен на сервер
http.createServer(app).listen(app.get('port'), '127.0.0.1', function(){
	console.log('Express server listening on port ' + port);
});

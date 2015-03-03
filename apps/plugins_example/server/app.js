var http = require('http');
var express = require('express');
var path = require('path');
var app = express();
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(express.static(path.join(__dirname, '../'), {hidden : true}));
var port = 5000;
app.set('port', port);
http.createServer(app).listen(app.get('port'), '127.0.0.1', function(){
	console.log('Express server listening on port ' + port);
});

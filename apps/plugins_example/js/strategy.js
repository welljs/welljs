wellDefine('Strategy', function (app) {
	this.use('Vendor:JqueryWell');
	this.use('Vendor:UnderscoreWell');
	this.use('Plugins:User:Main', {as: 'User'});
	this.exports(function () {
		var user = app.User = new this.User({
			onLoginSuccess: function () {
				$('#site-container').html('<h3>Hello, ' + user.model.get('name') + '</h3>')
			},
			onLoginError: function (err) {
				alert(err);
			}
		});
	});
});
wellDefine('Strategy', function (app, modules) {
	this.use('Vendor:JqueryWell', {autoInit: true});
	this.use('Vendor:UnderscoreWell', {autoInit: true});
	this.use('Vendor:BackboneWell', {autoInit: true});
	this.use('Plugins:User:Main', {as: 'User', autoInit: true});
	this.exports(function () {
		var user = app.User = new this.User();
		user.showLogin();
	});
});
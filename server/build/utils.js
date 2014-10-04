module.exports = function (app) {
	var _ = app._;
	return {
		getArg: function (arg, undefined) {
			var args = process.argv;
			var i = args.indexOf(arg);
			return i === -1 ? undefined : args[i + 1];
		},

		parseFile: function (file) {
			var s = file;
			var t = file.split('.');
			return {
				fullName: s,
				ext: '.' + t.splice(-1, 1),
				name: t.join('.')
			};
		},

		makePath: function (path) {
			if (path[0] !== '/' && path[0] !== '.')
				path = '/' + path;
			if (path[path.length - 1] !== '/')
				path += '/';
			return path;
		},

		//some/file-name -> Some:FileName
		transformToName: function (path) {
			if (!path) return;
			path = this.capitalize(path.replace('.','-').replace(/^\//, '').split('/')).join(':');
			return this.capitalize(path.split('-')).join('');
		},

		//transform first letter to uppercase in all array items
		capitalize: function (arr) {
			return _.map(arr, function (str) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			});
		}

	}
};
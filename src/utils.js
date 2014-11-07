	//a bit of functionality borrowed from Underscore.js
	var Utils = function () {};
	var nativeKeys = Object.keys;

	var ObjProto = Object.prototype;
	var hasOwnProperty =  ObjProto.hasOwnProperty;
	var toString = ObjProto.toString;
	var nativeBind = Function.prototype.bind;

	var createCallback = function(func, context, argCount) {
		if (context === void 0) return func;
		switch (argCount == null ? 3 : argCount) {
			case 1: return function(value) {
				return func.call(context, value);
			};
			case 2: return function(value, other) {
				return func.call(context, value, other);
			};
			case 3: return function(value, index, collection) {
				return func.call(context, value, index, collection);
			};
			case 4: return function(accumulator, value, index, collection) {
				return func.call(context, accumulator, value, index, collection);
			};
		}
		return function() {
			return func.apply(context, arguments);
		};
	};

	Utils.prototype.iteratee = function (value, context, argCount) {
		if (this.isFunction(value)) return createCallback(value, context, argCount);
		if (this.isObject(value)) return this.matches(value);
		return this.property(value);
	};

	Utils.prototype.matches  = function (attrs) {
		var pairs = this.pairs(attrs), length = pairs.length;
		return function(obj) {
			if (obj == null) return !length;
			obj = new Object(obj);
			for (var i = 0; i < length; i++) {
				var pair = pairs[i], key = pair[0];
				if (pair[1] !== obj[key] || !(key in obj)) return false;
			}
			return true;
		};
	};

	Utils.prototype.pairs = function(obj) {
		var keys = this.keys(obj);
		var length = keys.length;
		var pairs = Array(length);
		for (var i = 0; i < length; i++) {
			pairs[i] = [keys[i], obj[keys[i]]];
		}
		return pairs;
	};


	Utils.prototype.property = function(key) {
		return function(obj) {
			return obj[key];
		};
	};


	Utils.prototype.isFunction = function (obj) {
		return typeof obj == 'function' || false;
	};

	Utils.prototype.each = function (obj, iteratee, context) {
		if (obj == null) return obj;
		iteratee = createCallback(iteratee, context);
		var i, length = obj.length;
		if (length === +length) {
			for (i = 0; i < length; i++) {
				iteratee(obj[i], i, obj);
			}
		} else {
			var keys = this.keys(obj);
			for (i = 0, length = keys.length; i < length; i++) {
				iteratee(obj[keys[i]], keys[i], obj);
			}
		}
		return obj;
	};

	Utils.prototype.map = function (obj, iteratee, context) {
		if (obj == null) return [];
		iteratee = this.iteratee(iteratee, context);
		var keys = obj.length !== +obj.length && this.keys(obj),
			length = (keys || obj).length,
			results = Array(length),
			currentKey;
		for (var index = 0; index < length; index++) {
			currentKey = keys ? keys[index] : index;
			results[index] = iteratee(obj[currentKey], currentKey, obj);
		}
		return results;
	};


	// Shortcut function for checking if an object has a given property directly
	// on itself (in other words, not on a prototype).
	Utils.prototype.has = function(obj, key) {
		return obj != null && hasOwnProperty.call(obj, key);
	};


	Utils.prototype.keys = function (obj) {
		if (!this.isObject(obj)) return [];
		if (nativeKeys) return nativeKeys(obj);
		var keys = [];
		for (var key in obj) if (this.has(obj, key)) keys.push(key);
		return keys;
	};

	Utils.prototype.extend = function (obj) {
		if (!this.isObject(obj)) return obj;
		var source, prop;
		for (var i = 1, length = arguments.length; i < length; i++) {
			source = arguments[i];
			for (prop in source) {
				if (hasOwnProperty.call(source, prop)) {
					obj[prop] = source[prop];
				}
			}
		}
		return obj;
	};

	Utils.prototype.isObject = function (obj) {
		var type = typeof obj;
		return type === 'function' || type === 'object' && !!obj;
	};

	Utils.prototype.isString = function (obj) {
		var type = typeof obj;
		return type === 'string' && !!obj;
	};

	Utils.prototype.isArray = function (obj) {
		return toString.call(obj) === '[object Array]';
	};

	Utils.prototype.clone = function (obj) {
		if (!this.isObject(obj)) return obj;
		return this.isArray(obj) ? obj.slice() : this.extend({}, obj);
	};


	// Determine if at least one element in the object matches a truth test.
	// Aliased as `any`.
	Utils.prototype.some = function(obj, predicate, context) {
		if (obj == null) return false;
		predicate = this.iteratee(predicate, context);
		var keys = obj.length !== +obj.length && this.keys(obj),
			length = (keys || obj).length,
			index, currentKey;
		for (index = 0; index < length; index++) {
			currentKey = keys ? keys[index] : index;
			if (predicate(obj[currentKey], currentKey, obj)) return true;
		}
		return false;
	};


	Utils.prototype.find = function (obj, predicate, context) {
		var result;
		predicate = this.iteratee(predicate, context);
		this.some(obj, function(value, index, list) {
			if (predicate(value, index, list)) {
				result = value;
				return true;
			}
		});
		return result;
	};

	Utils.prototype.filter = function (obj, predicate, context) {
		var results = [];
		if (obj == null) return results;
		predicate = this.iteratee(predicate, context);
		this.each(obj, function(value, index, list) {
			if (predicate(value, index, list)) results.push(value);
		});
		return results;
	};

	Utils.prototype.merge = function () {
		var res = [];
		this.each(arguments, function (arg) {
			var length = arg.length;
			var i = -1;
			var value;
			while(++i < length) {
				value = arg[i];
				if (res.indexOf(value) === -1)
					res.push(value);
			}
		});
		return res;
	};

	Utils.prototype.parseName = function (moduleName) {
		var t = moduleName.split(':');
		var name = t[t.length - 1];
		t.splice(-1, 1);
		return {
			alias: t.join(':'),
			name: name
		};
	};

	var _ = _ ? _ : new Utils();
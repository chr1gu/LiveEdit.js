// Global function/object that leaks into global scope by purpose ;)
// thanks http://trephine.org/t/index.php?title=JavaScript_call_and_apply for explaining me how the scope works AGAIN :D
// Please use it for debugging only!
var LiveEdit = function() {

	var scope, registeredObject;

	// mock console for really old browsers
	if (typeof console === 'undefined') {
		console = function(){
			return {
				error: function(){
					alert(arguments[0]);
				},
				warn: function(){
					alert(arguments[0]);
				},
				info: function(){ },
				log: function(){ }
			}
		}();
	}

	// defines registeredObjects
	registeredObject = function(value){
		var initialValue = value,
			currentValue = value;
		return {
			reset: function() {
				currentValue = initialValue;
				return this;
			},
			setValue: function(value) {
				currentValue = value;
				return this;
			},
			getValue: function() {
				return currentValue;
			}
		}
	};

	console.info('LiveEdit initiated. Type "LiveEdit" into your console to get further information');

	// public methods/properties
	return scope = {
		registeredObjects: [],
		verbose: true,
		logValueMaxLength: 40,

		toString: function() {
			var i, str = '=== LiveEdit usage ===\n';
			str += 'usefull methods:\n';
			str += '  LiveEdit.reg(function|object|value)\n';
			str += '  LiveEdit.get(name)\n';
			str += '  LiveEdit.set(name, value)\n';
			str += '  LiveEdit.reset(name)\n';
			str += '\n';
			str += 'registered objects:\n';
			for (i in scope.registeredObjects) {
				str += ('  "'+i+'": '+(typeof scope.registeredObjects[i].getValue())+'\n');
			}
			str += '\n';
			return str;
		},

		listObjects: function() {
			var i, str;
			str = '[LiveEdit] Current registered objects:\n';
			for (i in scope.registeredObjects) {
				str += ('"'+i+'": '+(typeof scope.registeredObjects[i].getValue())+'\n');
			}
			console.info(str);
			return str;
		},

		getRandomName: function(length) {
			var chars, str, i;
			if (!length) length = 12;
			chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
			str = '';
			for (i = 0; i < length; i++) {
				str += chars[Math.floor(Math.random() * chars.length)];
			}
			return str;
		},

		// returns a registeredObject
		get: function(name) {
			return scope.registeredObjects[name];
		},

		// sets back the initial value of the registered object
		reset: function(name) {
			var obj = scope.get(name);
			if (obj) {
				obj.reset();
			} else {
				console.error('[LiveEdit] Object "'+name+'" not found!');
				scope.listObjects();
			}
			return obj;
		},

		// overwrite an existing registeredObject
		set: function(name, value) {
			var obj = scope.get(name);
			if (obj) {
				obj.setValue(value);
				if (scope.verbose) {
					console.info('[LiveEdit] Object "'+name+'" modified.', 'New value:', value);
				}
			} else {
				console.error('[LiveEdit] Object "'+name+'" not found!');
				scope.listObjects();
			}
			return obj;
		},

		reg: function(name, value) {
			// do some basic validation
			if (typeof value === 'undefined') {
				if (typeof name === 'undefined') {
					console.error('[LiveEdit] reg-error: No arguments!');
					return false;
				} else {
					console.warn('[LiveEdit] reg-warn: The first argument must be a valid name to identify your registered object');
					value = name;
					name = scope.getRandomName();
				}
			}

			// shorten output value for better readability
			var shortVal = value.toString();
			shortVal = shortVal.replace(/(\r\n|\n|\r)/gm," ");
			shortVal = shortVal.replace(/\s+/g," ");
			if (shortVal.length>scope.logValueMaxLength) {
				shortVal = shortVal.substring(0,scope.logValueMaxLength)+'...';
			}

			// check if there is already an object with the same name
			if (scope.get(name)) {
				console.warn('[LiveEdit] There is already an object registered with the name "'+name+'". A random name has been generated!' );
				name = name + '-' + scope.getRandomName(5);
			}

			if (scope.verbose) {
				console.info('[LiveEdit] Object "'+name+'" registered:', '=>', shortVal);
			}

			// "register" object
			scope.registeredObjects[name] = registeredObject(value);

			// todo: check that this works with objects that have nested functions
			if (typeof value === 'function') {
				return function(){
					scope.get(name).getValue().apply(this, arguments);
				}
			}
			return scope.get(name).getValue();
		}
	};
}();

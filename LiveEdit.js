// Global function/object that leaks into global scope by purpose ;)
// thanks http://trephine.org/t/index.php?title=JavaScript_call_and_apply for explaining me how the scope works AGAIN :D
// Please use it for debugging only!
var LiveEdit = function() {
	var scope;
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

	console.info('LiveEdit initiated. Type "LiveEdit" into your console to get further information');

	// public methods/properties
	// todo: rename method stuff
	scope = {
		methods: [],
		verbose: true,
		logValueMaxLength: 40,
		swapMethod: function(oldMethod, newMethod) {

		},
		toString: function() {
			var i, str = '=== LiveEdit usage ===\n';
			str += 'usefull methods:\n';
			str += '  LiveEdit.reg(function|object|value)\n';
			str += '  LiveEdit.get(name)\n';
			str += '  LiveEdit.set(name, value)\n';
			str += '\n';
			str += 'registered objects:\n';
			for (i in scope.methods) {
				str += ('  "'+i+'": '+(typeof scope.methods[i])+'\n');
			}
			str += '\n';
			return str;
		},
		getRandomName: function(length){
			var chars, str, i;
			if (!length) length = 12;
			chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
			str = '';
			for (i = 0; i < length; i++) {
				str += chars[Math.floor(Math.random() * chars.length)];
			}
			return str;
		},
		get: function(name) {
			// todo check that it exists
			return scope.methods[name];
		},
		set: function(name, value) {
			scope.methods[name] = value;
			if (scope.verbose) {
				console.info('[LiveEdit] Method "'+name+'" modified.', 'New value:', value);
			}
			return scope.methods[name];
		},
		reg: function(name, value) {
			// shorten output value for better readability
			var shortVal = value.toString();
			// remove linkebreaks
			shortVal = shortVal.replace(/(\r\n|\n|\r)/gm," ");
			//Replace all double white spaces with single spaces
			shortVal = shortVal.replace(/\s+/g," ");
			if (shortVal.length>scope.logValueMaxLength) {
				shortVal = shortVal.substring(0,scope.logValueMaxLength)+'...';
			}
			/*var method, name;
			 if (typeof arguments[0] === 'function') {
			 method = arguments[0];
			 } else if (typeof arguments[0] === 'string') {
			 name = arguments[0];
			 }
			 if (typeof arguments[1] === 'function') {
			 method = arguments[1];
			 }
			 if (!name && method) {
			 name = scope.getRandomName();
			 }
			 if (!method) {
			 // method not specified return lambda
			 console.error('Couldn\'t register method!', 'check args:', arguments);
			 return function(){};
			 }*/
			if (scope.verbose) {
				console.info('[LiveEdit] Method "'+name+'" registered:', '=>', shortVal);
			}
			// todo: check that method doesn't already exist else use different name
			scope.methods[name] = value;
			return function(){
				// todo: check that this does not only work with functions!
				scope.get(name).call(this);
			}
		}
	};
	return scope;
}();
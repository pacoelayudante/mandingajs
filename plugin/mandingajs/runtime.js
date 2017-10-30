// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Mandinga = function(runtime) {
	this.runtime = runtime;
};

(function() {
	var pluginProto = cr.plugins_.Mandinga.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function() {};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type) {
		this.includedFiles = [];
		this.type = type;
		this.runtime = type.runtime;
		this.returnValue = 0;
		this.justLoaded = "";
		this.firstLoad = 0;
	};

	var instanceProto = pluginProto.Instance.prototype;

	var isInPreview = false; // set in onCreate
	var headNode = document.getElementsByTagName("head")[0];

	instanceProto.onCreate = function() {
		isInPreview = (typeof cr_is_preview !== "undefined");

		// Attach a global function to run functions so JS integrators don't have to
		// resort to appalling hacks
		var self = this;
	};

	instanceProto.setReturn = function(value_) {
		if (value_) {
			if (typeof value_ === "number" || typeof value_ === "string")
				self.returnValue = value_;
			else if (typeof value_ === "boolean")
				self.returnValue = (value_ ? 1 : 0);
			else
				self.returnValue = 0;
		} else {
			self.returnValue = 0;
		}
		return self.returnValue;
	}

	instanceProto.loadAndRunFile = function(_file) {
		var self = this;
		var summonedScript = document.createElement("script");
		headNode.appendChild(summonedScript);
		summonedScript.setAttribute("async", false);
		summonedScript.onload = function() {
			if (self.includedFiles[_file] !== undefined) self.includedFiles[_file] = true;
			self.justLoaded = _file;
			self.firstLoad = 1;
			self.runtime.trigger(cr.plugins_.Mandinga.prototype.cnds.OnLoaded, self);
		};
		summonedScript.setAttribute("src", _file);
		return true;
	}

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.OnLoaded = function(file_, _firsttime) {
		return cr.equals_nocase(file_, this.justLoaded) && this.firstLoad >= _firsttime;
	};

	Cnds.prototype.IsLoaded = function(file_) {
		return this.includedFiles[file_] ? 1 : 0;
	};

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.Include = function(file_) {
		if (this.includedFiles[file_] === undefined) {
			this.includedFiles[file_] = false;
			this.loadAndRunFile(file_);
		} else if (this.includedFiles[file_]) {
			this.firstLoad = 0;
			this.justLoaded = file_;
			this.runtime.trigger(cr.plugins_.Mandinga.prototype.cnds.OnLoaded, this);
		}
	};

	Acts.prototype.Run = function(file_) {
		this.loadAndRunFile(file_);
	};

	Acts.prototype.Function = function(func_, params_) {
		if (window[func_]) this.setReturn(window[func_].apply(window, params_));
		else {
			console.warn(name_ + " function is not defined at global scope (window)");
			this.setReturn(0);
		}
	};

	Acts.prototype.FunctionWithObjects = function(func_, obj_, params_) {
		if (window[func_]) {
			if(params_) this.setReturn(window[func_].apply(window, [obj_.getCurrentSol().getObjects()].concat(params_)));
			else this.setReturn(window[func_].apply(window, obj_.getCurrentSol().getObjects()));
		}
		else {
			console.warn(name_ + " function is not defined at global scope (window)");
			this.setReturn(0);
		}
	};

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.ReturnValue = function(ret) {
		ret.set_any(this.returnValue);
	};

	Exps.prototype.IsLoaded = function(ret, file_) {
		ret.set_int(this.includedFiles[file_] ? 1 : 0);
	};

	Exps.prototype.Function = function(ret, name_) {
		//for (i = 2, len = arguments.length; i < len; i++)
		//	fs.params.push(arguments[i]);
		if (window[name_]) {
			var argumentos = [];
			for (var i = 2; i < arguments.length; i++) argumentos.push(arguments[i]);
			ret.set_any(this.setReturn(window[name_].apply(window, argumentos)));
		} else {
			if (name_) console.warn(name_ + " function is not defined at global scope (window)");
			else console.warn("Trying to use Mandinga.Function but no argument specified");
			this.setReturn(0);
		}
	};

	pluginProto.exps = new Exps();

}());
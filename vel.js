'use strict';

function Vel(params) {
	if (!params) {
		params = {};
	}
	this.$ = params.jQuery || params.$ || jQuery;
	this._window = params.window || window;

	this._loaders = [];

	this._bindEvents();
}

Vel.prototype.lazyLoad = function(selector, params) {
	if (!params) {
		params = {};
	}
	params.selector = selector;
	params.$ = this.$;
	var vel = new VelManager(params);
	this._loaders.push(vel);
	return vel;
}

Vel.prototype.cancelAllLoads = function() {
	this._callAtAll('cancelLoad');
}

// Vel.prototype.suspendAll = function() {
// 	this._callAtAll('suspend');	
// }

// Vel.prototype.resumeAll = function() {
// 	this._callAtAll('resume');
// }

Vel.prototype._callAtAll = function(func) {
	for (var i=0; i < this._loaders.length; i++) {
		this._loaders[i][func]();
	}	
}

Vel.prototype._bindEvents = function() {
	this.$(this._window).off('scroll.visible-elements-loader').on('scroll.visible-elements-loader', this._scrollEvent.bind(this));
	this.$(this._window).off('resize.visible-elements-loader').on('resize.visible-elements-loader', this._scrollEvent.bind(this));
}

Vel.prototype._scrollEvent = function() {
	this._callAtAll('scrollEvent');
}
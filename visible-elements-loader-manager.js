'use strict';

function VisibleElementsLoaderManager(params) {
	this.$ = params.jQuery || params.$ || jQuery;
	this._window = params.window || window;

	this._loaders = [];

	this._bindEvents();
}

VisibleElementsLoaderManager.prototype.bindElements = function(selector, params) {
	params.selector = selector;
	params.$ = this.$;
	var vel = new VisibleElementsLoader(params);
	this._loaders.push(vel);
	return vel;
}

VisibleElementsLoaderManager.prototype.cancelAllLoads = function() {
	this._callAtAll('cancelLoad');
}

// VisibleElementsLoaderManager.prototype.suspendAll = function() {
// 	this._callAtAll('suspend');	
// }

// VisibleElementsLoaderManager.prototype.resumeAll = function() {
// 	this._callAtAll('resume');
// }

VisibleElementsLoaderManager.prototype._callAtAll = function(func) {
	for (var i=0; i < this._loaders.length; i++) {
		this._loaders[i][func]();
	}	
}

VisibleElementsLoaderManager.prototype._bindEvents = function() {
	this.$(this._window).off('scroll.visible-elements-loader').on('scroll.visible-elements-loader', this._scrollEvent.bind(this));
	this.$(this._window).off('resize.visible-elements-loader').on('resize.visible-elements-loader', this._scrollEvent.bind(this));
}

VisibleElementsLoaderManager.prototype._scrollEvent = function() {
	this._callAtAll('scrollEvent');
}
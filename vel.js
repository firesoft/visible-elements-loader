'use strict';

function Vel(params) {
	if (!params) {
		params = {};
	}
	this._$ = params.jQuery || params.$ || jQuery;
	this._window = params.window || window;

	this._elementFactory = null;
	this._initElementFactory();

	this._loaders = [];

	this._bindEvents();
}

Vel.prototype.lazyLoad = function(selector, params) {
	if (!params) {
		params = {};
	}
	params.selector = selector;
	params.$ = this._$;
	params.elementFactory = this._elementFactory;
	var vel = new VelManager(params);
	this._loaders.push(vel);
	return vel;
}

Vel.prototype.loadVisibleElements = function() {
	this._callAtAll('loadVisibleElements');
}

Vel.prototype.cancelAllLoads = function() {
	this._callAtAll('cancelLoad');
}

Vel.prototype.suspendAll = function() {
	this._callAtAll('suspend');	
}

Vel.prototype.resumeAll = function() {
	this._callAtAll('resume');
}

Vel.prototype.registerVelFactoryClass = function(dataSrc, elementClass) {
	this._elementFactory.registerElementClass(dataSrc, elementClass);
}

Vel.prototype._initElementFactory = function() {
	this._elementFactory = new VelElementFactory({$: this._$});
	this._elementFactory.registerElementClass('ajax-html', VelAjaxHtmlElement);
}

Vel.prototype._callAtAll = function(func) {
	for (var i = 0; i < this._loaders.length; i++) {
		this._loaders[i][func]();
	}	
}

Vel.prototype._bindEvents = function() {
	this._$(this._window).off('scroll.visible-elements-loader').on('scroll.visible-elements-loader', this._scrollEvent.bind(this));
	this._$(this._window).off('resize.visible-elements-loader').on('resize.visible-elements-loader', this._scrollEvent.bind(this));
}

Vel.prototype._scrollEvent = function() {
	this._callAtAll('scrollEvent');
}
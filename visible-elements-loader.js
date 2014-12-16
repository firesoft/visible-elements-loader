'use strict';

//bind polyfill needed


function VisibleElementsLoader(params) {
	this.$ = params.$ || jQuery;
	this._selector = params.selector;
	this._waitTime = params.waitTime || 600;
	this._margin = params.margin || 0;
	this._jsonCallback = params.jsonCallback || null;
	this._htmlCallback = params.htmlCallback || null;
	this._loadConcurrency = params.loadConcurrency || -1;

	this._elementSelector = new VelElementSelector(params);

	this._id = 0;
	this._inited = false;
	this._timeoutId = null;
	this._ajaxLoaders = [];

	this._init();
}

VisibleElementsLoader.prototype.scrollEvent = function() {
	this.loadVisibleElements();
}

VisibleElementsLoader.prototype.loadVisibleElements = function() {
	if (!this._inited || this._timeoutId) {
		return;
	}

	if (this._isAjaxLoadersLimitHit()) {
		this._initTimeoutCheck();
		return;
	}

	var element = this._elementSelector.getElementToLoad();
	if (!element) {
		return;
	}
	this._loadElementData(element);
}

VisibleElementsLoader.prototype.cancelLoad = function() {
	
	if (this._timeoutId) {
		clearTimeout(this._timeoutId);
		this._timeoutId = null;
	}
	this._cancelAjaxLoaders();
}

VisibleElementsLoader.prototype._cancelAjaxLoaders = function() {
	for (var i = 0; i < this._ajaxLoaders.length; i++) {
		this._ajaxLoaders[i].cancelLoad();
	}
	this._ajaxLoaders = [];
}

VisibleElementsLoader.prototype._isAjaxLoadersLimitHit = function() {
	return this._ajaxLoaders.length >= this._loadConcurrency;
}

VisibleElementsLoader.prototype._init = function() {
	var _this = this;
	this.$(function() {
		_this._inited = true;
		_this._initTimeoutCheck();
	});
}

VisibleElementsLoader.prototype._initTimeoutCheck = function() {
	if (this._timeoutId) {
		return;
	}
	this._timeoutId = setTimeout(this._timeoutCheckHit.bind(this), this._waitTime);
}

VisibleElementsLoader.prototype._timeoutCheckHit = function() {
	this._timeoutId = null;
	this.loadVisibleElements();
}

VisibleElementsLoader.prototype._loadElementData = function(element) {
	var velElementParams = this._getVelElementParams(element);
	this._ajaxLoaders.push(new VelElement(velElementParams));
}

VisibleElementsLoader.prototype._getVelElementParams = function(element) {
	this._generateNextId();
	return {
		id: this._id,
		$: this.$,
		element: element,
		jsonCallback: this._jsonCallback,
		htmlCallback: this._htmlCallback,
		completeCallback: this._elementLoadedCallback.bind(this)
	};
}

VisibleElementsLoader.prototype._generateNextId = function() {
	this._id++;
}

VisibleElementsLoader.prototype._elementLoadedCallback = function(id) {
	if (this._removeComletetedAjaxLoader(id)) {
		this._initTimeoutCheck();
	}
}

VisibleElementsLoader.prototype._removeComletetedAjaxLoader = function(id) {
	for (var i = 0; i < this._ajaxLoaders.length; i++) {
		if (this._ajaxLoaders[i].getId() == id) {
			this._ajaxLoaders[i].splice(i, 1);
			return true;
		}
	}
	return false;
}
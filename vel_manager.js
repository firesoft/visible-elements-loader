'use strict';

//bind polyfill needed


function VelManager(params) {
	this.$ = params.$ || jQuery;
	this._selector = params.selector;
	this._waitTime = params.hasOwnProperty('waitTime') ? params.waitTime : 600;
	this._suspended = false;
	this._loadConcurrency = params.loadConcurrency || -1;
	this._margin = params.margin || 0;
	this._doneCallback = params.doneLoadCallback;

	this._elementFactory = params.elementFactory;
	this._elementSelector = new VelElementSelector(params);

	this._inited = false;
	this._timeoutId = null;
	this._elementLoaders = [];

	this._init();
}

VelManager.prototype.scrollEvent = function() {
	this.loadVisibleElements();
}

VelManager.prototype.loadVisibleElements = function() {
	if (!this._inited || this._timeoutId || this._suspended) {
		return;
	}

	if (this._isLoadersLimitHit()) {
		this._initTimeoutCheck();
		return;
	}

	var domNode = this._elementSelector.getElementToLoad();
	if (!domNode) {
		return;
	}
	this._loadElementData(domNode);
	this._initTimeoutCheck();
}

VelManager.prototype.cancelLoad = function() {
	
	if (this._timeoutId) {
		clearTimeout(this._timeoutId);
		this._timeoutId = null;
	}
	this._cancelElementLoaders();
}

VelManager.prototype.suspend = function() {
	this._suspended = true;
}

VelManager.prototype.resume = function() {
	this._suspended = false;
	this._initTimeoutCheck();
}

VelManager.prototype._cancelElementLoaders = function() {
	for (var i = 0; i < this._elementLoaders.length; i++) {
		this._elementLoaders[i].cancelLoad();
	}
	this._elementLoaders = [];
}

VelManager.prototype._isLoadersLimitHit = function() {
	if (this._loadConcurrency == -1) {
		return false;
	}
	return this._elementLoaders.length >= this._loadConcurrency;
}

VelManager.prototype._init = function() {
	var _this = this;
	this.$(function() {
		_this._inited = true;
		_this._initTimeoutCheck();
	});
}

VelManager.prototype._initTimeoutCheck = function() {
	if (this._timeoutId) {
		return;
	}
	this._timeoutId = setTimeout(this._timeoutCheckHit.bind(this), this._waitTime);
}

VelManager.prototype._timeoutCheckHit = function() {
	this._timeoutId = null;
	this.loadVisibleElements();
}

VelManager.prototype._loadElementData = function(domNode) {
	var _this = this;
	this._setElementAsLoaded(domNode);
	var elementLoader = this._elementFactory.getVelElement(domNode);
	if (!elementLoader) {
		return;
	}

	this._elementLoaders.push(elementLoader);
	elementLoader.load(function(err, data) {
		_this._elementDoneCallback(err, elementLoader, data);
	});
}

VelManager.prototype._elementDoneCallback = function(err, elementLoader, data) {
	var id = elementLoader.getId();
	this._removeComletetedElementLoader(id);
	if (!err && this._doneCallback) {
		this._doneCallback(elementLoader.getDomNode(), data);
	}
}

VelManager.prototype._removeComletetedElementLoader = function(id) {
	for (var i = 0; i < this._elementLoaders.length; i++) {
		if (this._elementLoaders[i].getId() == id) {
			this._elementLoaders.splice(i, 1);
			return true;
		}
	}
	return false;
}

VelManager.prototype._setElementAsLoaded = function(domNode) {
	this.$(domNode).data('loader-status','done');
}
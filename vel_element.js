'use strict';

function VelElement(params) {
	this._id = params.id;
	this.$ = params.$ || jQuery;
	this._element = params.element;
	this._elementObj = this.$(params.element);
	this._jsonCallback = params.jsonCallback || null;
	this._htmlCallback = params.htmlCallback || null;
	this._completeCallback = params.completeCallback || null;
	this._ajaxPromise = null;

	this._load();
}

VelElement.prototype.getId = function() {
	return this._id;
}

VelElement.prototype.isLoadInProgress = function() {
	return (this._ajaxPromise ? true : false);
}

VelElement.prototype.cancelLoad = function() {
	if (this.isLoadInProgress()) {
		this._ajaxPromise.reject();
	}
}

VelElement.prototype._load = function() {
	this._setElementAsLoaded();
	var htmlSrc = this._elementObj.data('ajax-html-source');
	if (htmlSrc) {
		this._makeAjaxHtmlRequest(htmlSrc);
		return;
	}
	var jsonSrc = this._elementObj.data('ajax-json-source');
	if (jsonSrc) {
		this._makeAjaxJsonRequest(jsonSrc);
		return;
	}
}

VelElement.prototype._setElementAsLoaded = function() {
	this._elementObj.data('loader-status','done');
}

VelElement.prototype._makeAjaxHtmlRequest = function(src) {
	var _this = this;
	this._ajaxPromise = this.$.get(src).done(function(html) {
		_this._injectHtml(html);
		if (_this._htmlCallback) {
			_this._htmlCallback(_this.element, html);
		}
	}).always(this._ajaxComplete.bind(this));
}

VelElement.prototype._makeAjaxJsonRequest = function(src) {
	var _this = this;
	this._ajaxPromise = this.$.getJSON(src).done(function(data) {
		if (data.html) {
			_this._injectHtml(data.html);
		}
		if (_this._jsonCallback) {
			_this._jsonCallback(_this._element, data);
		}
	}).always(this._ajaxComplete.bind(this));
}

VelElement.prototype._ajaxComplete = function() {
	this._ajaxPromise = null;
	if (this._completeCallback) {
		this._completeCallback(this._id);
	}
}

VelElement.prototype._injectHtml = function(html) {
	if (!html) {
		return;
	}
	this._elementObj.html(html);
}
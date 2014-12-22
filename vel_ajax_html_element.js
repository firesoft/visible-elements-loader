'use strict';

function VelAjaxHtmlElement(params) {
	VelElementBase.call(this, params);

	this._ajaxPromise = null;
}

VelAjaxHtmlElement.prototype = Object.create(VelElementBase.prototype);
VelAjaxHtmlElement.constructor = VelElementBase;

VelAjaxHtmlElement.prototype.load = function(callback) {
	var _this = this;
	this._ajaxPromise = this._$.get(this._src).done(function(html) {
		_this._ajaxPromise = null;
		_this._injectHtml(html);
		callback(null, html);
	}).fail(function() {
		_this._ajaxPromise = null;
		callback(new Error('fail'));
	});
}

VelAjaxHtmlElement.prototype.cancelLoad = function() {
	if (this._ajaxPromise) {
		this._ajaxPromise.reject();
	}
}

VelAjaxHtmlElement.prototype._injectHtml = function(html) {
	this._domNodeObject.html(html);
}
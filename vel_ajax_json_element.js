'use strict';

function VelAjaxJsonElement(params) {
	VelElementBase.call(this, params);

	this._ajaxPromise = null;
}

VelAjaxJsonElement.prototype = Object.create(VelElementBase.prototype);
VelAjaxJsonElement.constructor = VelElementBase;

VelAjaxJsonElement.prototype.load = function(callback) {
	var _this = this;
	this._ajaxPromise = this._$.getJSON(this._src).done(function(jsonData) {
		_this._ajaxPromise = null;
		_this._injectHtml(jsonData);
		callback(null, jsonData);
	}).fail(function() {
		_this._ajaxPromise = null;
		callback(new Error('fail'));
	});
}

VelAjaxJsonElement.prototype.cancelLoad = function() {
	if (this._ajaxPromise) {
		this._ajaxPromise.reject();
	}
}

VelAjaxJsonElement.prototype._injectHtml = function(jsonData) {
	if (jsonData.hasOwnProperty('html')) {
		this._domNodeObject.html(jsonData.html);
	}
}
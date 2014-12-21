'use strict';

function VelElementBase(params) {
	if (!params) {
		return;
	}
	this._id = params.id;
	this._$ = params.$;
	this._type = params.type;
	this._src = params.src;
	this._domNode = params.domNode;
	this._domNodeObject = this._$(this._domNode);
	this._callback = null;
}

VelElementBase.prototype.getId = function() {
	return this._id;
}

VelElementBase.prototype.getType = function() {
	return this._type;
}

VelElementBase.prototype.getDomNode = function() {
	return this._domNode;
}

VelElementBase.prototype.load = function(callback) {
}

VelElementBase.prototype.cancelLoad = function() {
}
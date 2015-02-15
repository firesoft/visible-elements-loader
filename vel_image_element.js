'use strict';

function VelImageElement(params) {
	VelElementBase.call(this, params);
}

VelImageElement.prototype = Object.create(VelElementBase.prototype);
VelImageElement.prototype.constructor = VelImageElement;

VelImageElement.prototype.load = function(callback) {
	this._domNodeObject.attr('src', this._src);
	callback(null, this._src);
}
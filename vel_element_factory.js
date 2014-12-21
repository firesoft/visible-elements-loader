'use strict';

function VelElementFactory(params) {
	this._$ = params.$;

	this._id = 0;
	this._elementsClass = {};
}

VelElementFactory.prototype.registerElementClass = function(dataSrc, elementClass) {
	this._elementsClass[dataSrc] = elementClass;
}

VelElementFactory.prototype.getVelElement = function(domNode) {
	for (var dataSrc in this._elementsClass) {
		var src = this._$(domNode).data(dataSrc);
		if (src) {
			var velElementParams = this._getElementParams(src, dataSrc, domNode);
			return new this._elementsClass[dataSrc](velElementParams);
		}
	}

	return null;
}

VelElementFactory.prototype._getElementParams = function(src, type, domNode) {
	this._incrementId();
	return {
		id: this._id,
		$: this._$,
		domNode: domNode,
		type: type,
		src: src
	}
}

VelElementFactory.prototype._incrementId = function() {
	this._id++;
}
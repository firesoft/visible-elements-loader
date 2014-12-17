'use strict';

function VelElementSelector(params) {
	this.$ = params.$ || jQuery;
	this._selector = params.selector;
	this._margin = params.margin || 0;
}

VelElementSelector.prototype.getElementToLoad = function() {
	var elements = this._getElementsToLoad();
	if (!elements.length) {
		return null;
	}
	return elements[0];
}

VelElementSelector.prototype._getElementsToLoad = function() {
	return this.$(this._selector).filter(this._isElementValidToLoad.bind(this)).toArray().sort(this._compareElements.bind(this));
}

VelElementSelector.prototype._isElementValidToLoad = function(index, element) {
	if (!this._isElementVisible(element)) {
		return false;
	}
	return !this._isELementLoaded(element);
}

VelElementSelector.prototype._isELementLoaded = function(element) {
	return (this.$(element).data('loader-status') == 'done');
}

VelElementSelector.prototype._isElementVisible = function(element) {
    var docViewTop = this.$(window).scrollTop();
    var docViewBottom = docViewTop + this.$(window).height();
    var elemTop = this._getElementTop(element);

    return elemTop - this._margin <= docViewBottom;
}

VelElementSelector.prototype._getElementTop = function(element) {
	return this.$(element).offset().top;	
}

VelElementSelector.prototype._compareElements = function(element1, element2) {
	return this._getElementTop(element1) - this._getElementTop(element2);
}
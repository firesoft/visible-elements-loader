'use strict';

//bind polyfill needed


function VisibleElementsLoader(params) {
	this.$ = params.jQuery || params.$ || jQuery;
	this._selector = params.selector;
	this._waitTime = params.waitTime || 800;
	this._lastCheckTime = 0;
	this._timeoutId = null;

	this._bindEvents();
}

VisibleElementsLoader.prototype._bindEvents = function() {
	this.$(window).off('scroll.visible-elements-loader').on('scroll.visible-elements-loader', this.loadVisibleElements.bind(this));
	this.$(window).off('resize.visible-elements-loader').on('resize.visible-elements-loader', this.loadVisibleElements.bind(this));
}


VisibleElementsLoader.prototype.loadVisibleElements = function() {
	if (this._isInWaitTime()) {
		this._initTimeoutCheck();
		return;
	}

	this._lastCheckTime = Date.now();
	this._timeoutId = null;

	var element = this._getElementToLoad();
	if (!element) {
		return;
	}
	this._setElementAsLoaded(element);
	this._loadElementData(element);
	this._initTimeoutCheck();
}

VisibleElementsLoader.prototype._isInWaitTime = function() {
	return (Date.now() - this._lastCheckTime < this._waitTime);
}


VisibleElementsLoader.prototype._initTimeoutCheck = function() {
	if (this._timeoutId) {
		return;
	}
	this._timeoutId = setTimeout(this.loadVisibleElements.bind(this), this._waitTime);
}

VisibleElementsLoader.prototype._setElementAsLoaded = function(element) {
	element.data('loader-status','done');
}

VisibleElementsLoader.prototype._loadElementData = function(element) {
	var src = element.data('ajax-source');
	if (!src) {
		return;
	}
	this.$.getJSON(src, function(data) {
		this._injectData(element, data);
	});;
}

VisibleElementsLoader.prototype._injectData = function(element, data) {
	if (!data.html) {
		return '';
	}
	element.html(data.html);
}

VisibleElementsLoader.prototype._getElementToLoad = function() {
	var elements = this._getElementsToLoad();
	if (!elements.length) {
		return;
	}
	return elements[0];
}

VisibleElementsLoader.prototype._getElementsToLoad = function() {
	return this.$(this._selector).filter(this._isElementValidToLoad.bind(this)).toArray().sort(this._compareElements.bind(this));
}

VisibleElementsLoader.prototype._isElementValidToLoad = function(index, element) {
	if (!this._isElementVisible(element)) {
		return false;
	}
	return !this._isELementLoaded(element);
}

VisibleElementsLoader.prototype._isELementLoaded = function(element) {
	return (this.$(element).data('loader-status') == 'done');
}

VisibleElementsLoader.prototype._isElementVisible = function(element) {
    var docViewTop = this.$(window).scrollTop();
    var docViewBottom = docViewTop + this.$(window).height();
    var elemTop = this._getElementTop(element);

    return elemTop <= docViewBottom;
}

VisibleElementsLoader.prototype._getElementTop = function(element) {
	return this.$(element).offset().top;	
}

VisibleElementsLoader.prototype._compareElements = function(element1, element2) {
	return this.getElementTop(element1) - this.getElementTop(element2);
}


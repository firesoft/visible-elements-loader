'use strict';

//bind polyfill needed


function VisibleElementsLoader(params) {
	this.$ = params.jQuery || params.$ || jQuery;
	this._selector = params.selector;
	this._waitTime = params.waitTime || 800;
	this._lastCheckTime = 0;
	this._timeoutId = null;
}

VisibleElementsLoader.prototype.bindEvents = function() {
	this.$(window).off('scroll.visible-elements-loader').on('scroll.visible-elements-loader', this.loadVisibleElements.bind(this));
	this.$(window).off('resize.visible-elements-loader').on('resize.visible-elements-loader', this.loadVisibleElements.bind(this));
}



VisibleElementsLoader.prototype.loadVisibleElements = function() {
	if (this._isInWaitTime()) {
		this.initTimeoutCheck();
	}
	
	this._lastCheckTime = Date.now();
	this._timeoutId = null;

	var element = this.getElementToLoad();
	if (!element) {
		return;
	}
	this.setElementAsLoaded(element);
	this.loadElementData(element);
	this.initTimeoutCheck();
}

VisibleElementsLoader.prototype._isInWaitTime = function() {
	return (Date.now() - this._lastCheckTime < this._waitTime);
}


VisibleElementsLoader.prototype.initTimeoutCheck = function() {
	if (this._timeoutId) {
		return;
	}
	this._timeoutId = setTimeout(this.loadVisibleElements.bind(this), this._waitTime);
}

VisibleElementsLoader.prototype.setElementAsLoaded = function(element) {
	element.data('loader-status','done');
}

VisibleElementsLoader.prototype.loadElementData = function(element) {
	var src = element.data('ajax-source');
	if (!src) {
		return;
	}
	this.$.getJSON(src, function(data) {
		this.injectData(element, data);
	});;
}

VisibleElementsLoader.prototype.injectData = function(element, data) {
	if (!data.html) {
		return '';
	}
	element.html(data.html);
}

VisibleElementsLoader.prototype.getElementToLoad = function() {
	var elements = this.getElementsToLoad();
	if (!elements.length) {
		return;
	}
	return elements[0];
}

VisibleElementsLoader.prototype.getElementsToLoad = function() {
	return this.$(this._selector).filter(this.isElementValidToLoad.bind(this)).toArray().sort(this.compareElements.bind(this));
}

VisibleElementsLoader.prototype.isElementValidToLoad = function(index, element) {
	if (!this.isElementVisible(element)) {
		return false;
	}
	return !isELementLoaded(element);
}

VisibleElementsLoader.prototype.isELementLoaded = function(element) {
	return (this.$(element).data('loader-status') == 'done');
}

VisibleElementsLoader.prototype.isElementVisible = function(element) {
    var docViewTop = this.$(window).scrollTop();
    var docViewBottom = docViewTop + this.$(window).height();
    var elemTop = this.getElementTop(element);

    return elemTop <= docViewBottom;
}

VisibleElementsLoader.prototype.getElementTop = function(element) {
	return this.$(element).offset().top;	
}

VisibleElementsLoader.prototype.compareElements = function(element1, element2) {
	return this.getElementTop(element1) - this.getElementTop(element2);
}


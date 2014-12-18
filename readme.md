## visible-elements-loader aka Vel ##

This readme is still under construction.


Library lazy-loads data via ajax on element show - usually during scroll.

#### Requirements ####
 * jquery library (or equivalent)
 * bind function support (or polyfill: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill)



#### Installation ####
```html
<script src="path/to/vel_min.js"></script>
```
or
```html
<script src="path/to/vel_element_selector.js"></script>
<script src="path/to/vel_element.js"></script>
<script src="path/to/vel_manager.js"></script>
<script src="path/to/vel.js"></script>
```

#### Usage ####
```javascript
var vel = new Vel({jQuery: $, window: window});
vel.lazyLoad(".js-lazyload", {waitTime: 600, loadConcurrency: 1, htmlCallback: function(element, data) {
	console.log('loaded!');
}});
```




#### Vel constructor params ####
Vel constructor takes one param. Object with following keys:
 * jQuery - reference to jQuery library (default: jQuery)
 * window - reference to window object (default: jQuery)


#### Public Vel methods ####
 * lazyLoad - starts to watch matched elements and loads content into on show
 * cancelAllLoads - cancells all loads


##### lazyLoad method#####
lazyLoad method takes two params:
 * selector - required, jquery compatible selector of elements
 * params object

 Params object can have following keys:
 * waitTime - wait time in milliseconds between start of loads, default: 600
 * loadConcurrency - how many concurrent loads we can handle, default: -1 (infinity)
 * margin - distance in pixels, element is considered as visible when distance between bottom of viewport and top of the element is less or equal than margin, default: 0
 * jsonCallback - function called after json-type load complete, takes two params: element, data
 * htmlCallback - function called after html-type load complete, takes two params: element, data
 
lazyLoad method returns VelManager object.

#### VelManager ####
VelManager object watches elements that match selector, and load their contents on show.

#### Elements ####
Each element should have "data-ajax-html-source" or "data-ajax-json-source" attribute with valid url from which content will be loaded. htmlCallback or jsonCallback will be called upon load.

#### Ajax request ####
Ajax request is made using GET call on desired url. Ajax request should return json object with "html" key or html data. Loaded data is injected into element.


## visible-elements-loader aka Vel ##

This readme is still under construction.


Library lazy-loads data via ajax on element show - usually during scroll or resize.

#### Requirements ####
 * jquery library (or equivalent)
 * function.bind method support (or polyfill: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill)
 * object.create method support (or polyfill: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill) 



#### Installation ####
```html
<script src="path/to/vel_min.js"></script>
```
or
```html
<script src="./vel_element_base.js"></script>
<script src="./vel_ajax_html_element.js"></script>
<script src="./vel_ajax_json_element.js"></script>
<script src="./vel_image_element.js"></script>
<script src="./vel_element_factory.js"></script>
<script src="./vel_element_selector.js"></script>
<script src="./vel_manager.js"></script>
<script src="./vel.js"></script>
<script src="./vel_factory.js"></script>
```

#### Usage ####
```javascript
jQuery.vel.lazyLoad(".js-lazyload", {waitTime: 600, loadConcurrency: 1, doneLoadCallback: function(element, data) {
	console.log('loaded!');
}});
```


#### Public Vel methods ####
 * lazyLoad - starts to watch elements that match selector and loads content into on show
 * cancelAllLoads - cancels all loads
 * suspendAll - suspends all watches
 * resumeAll - resumes all suspended watches
 * registerVelFactoryClass - registers new element type handler


##### lazyLoad method #####
lazyLoad method takes two params:
 * selector - required, jquery compatible selector of elements
 * params object

 Params object can have following keys:
 * waitTime - wait time in milliseconds between start of loads, default: 600
 * loadConcurrency - how many concurrent loads we can handle, default: -1 (infinity)
 * margin - distance in pixels, element is considered as visible when distance between bottom of viewport and top of the element is less or equal than margin, default: 10
 * doneLoadCallback - a function to execute after the load is complete (with success)
 
lazyLoad method returns VelManager object.

#### VelManager ####
VelManager object watches elements that match selector, and loads their contents on show.

#### Elements Loaders ####
* VelAjaxHtmlElement - loads html data into desired element using ajax GET request, element should have data-ajax-html attribute with valid url
* VelAjaxJsonElement - loads json data into desired element using ajax getJSON request, element should have data-ajax-json attribute with valid url, request should return valid json with html property
* VelImageElement - sets src attribute of image element to content of data-image attribute

#### doneLoadCallback ####
A function to execute after the load is complete with success. Function is called with two params: 
 * domNode
 * loaded data (html, json, img src, ...)
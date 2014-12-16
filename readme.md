## visible-elements-loader ##

this readme is out of date, new documentation underway


Library lazy-loads html data via ajax on element show - usually during scroll.

#### Requirements ####
 * jquery library (or equivalent)
 * bind function support (or polyfill)



#### Installation ####
```html
<script src="path/to/visible-elements-loader.js"></script>
```

#### Usage ####
```javascript
var vel = new VisibleElementsLoader({selector:".js_load_content"});
```

#### Constructor params ####
VisibleElementsLoader constructor takes one param. Object with following keys:
 * jQuery - reference to jQuery library
 * selector - required, jquery compatible selector of elements
 * waitTime - wait time in milliseconds between loads, default: 800
 * margin - distance in pixels, element is considered as visible when distance between bottom of viewport and top of the element is less or equal than margin, default: 0
 

#### Public methods ####
  * loadVisibleElements - force visible elements data load.

#### Elements ####
Each element should have "data-ajax-source" attribute with valid url from which content will be loaded.

#### Ajax request ####
Ajax request is made using GET call on desired url. Ajax request should return json object with "html" key. Value of the key is injected into element.


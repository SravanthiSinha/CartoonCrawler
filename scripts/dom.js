cartoon.dom = (function() {
    var $ = Sizzle;

    function hasClass(el, clsName) {
        var regex = new RegExp("(^|\\s)" + clsName + "(\\s|$)");
        return regex.test(el.className);
    }

    function addClass(el, clsName) {
        if (!hasClass(el, clsName)) {
            el.className += " " + clsName;
        }
    }

    function removeClass(el, clsName) {
	 var els = Array.prototype.slice.call(
        document.getElementsByClassName( clsName)
    );
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        el.className = el.className.replace(
            new RegExp('(^|\\s+)' +  clsName + '(\\s+|$)', 'g'),
            '$1'
        );
    }
      
    }

  
	 function bind(element, event, handler) {
        if (typeof element == "string") {
            element = $(element)[0];
        }
        element.addEventListener(event, handler, false)
    }
     return {
        $ : $,
        hasClass : hasClass,
        addClass : addClass,
        removeClass : removeClass,
		 bind : bind
    };
})();

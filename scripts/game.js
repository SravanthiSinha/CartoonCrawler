cartoon.game = (function() {
    var dom = cartoon.dom,
        $ = dom.$;

    // hide the active screen (if any) and show the screen
    // with the specified id
    function showScreen(screenId) {
        var activeScreen = $("#game .screen.active")[0],
            screen = $("#" + screenId)[0];
        if (activeScreen) {
            dom.removeClass(screen, "active");
        }
        cartoon.screens[screenId].run();
        // display the screen html
        dom.addClass(screen, "active");
    }
	function setup() {
        // disable native touchmove behavior to
        // prevent overscroll
        dom.bind(document, "touchmove", function(event) {
            event.preventDefault();
        });
    }
    // expose public methods
    return {
        showScreen : showScreen,
		setup:setup
    };
})();

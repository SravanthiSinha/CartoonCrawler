cartoon.board = (function() {
    var settings,
        cartoons,
        cols,
        rows,
        baseScore,
        numcartoonTypes;

    function initialize() {
        settings = cartoon.settings;
        numcartoonTypes = settings.numcartoonTypes,
        baseScore = settings.baseScore,
        cols = settings.cols;
        rows = settings.rows;
        fillBoard(); 
		callback();
    }
	function getcartoon(x, y) {
        if (x < 0 || x > cols-1 || y < 0 || y > rows-1) {
            return -1;
        } else {
            return cartoons[x][y];
        }
    }
 function fillBoard() {
        var x, y,
            type;
        cartoons = [];
        for (x = 0; x < cols; x++) {
            cartoons[x] = [];
            for (y = 0; y < rows; y++) {
                type = randomcartoon();
                while ((type === getcartoon(x-1, y) &&
                        type === getcartoon(x-2, y)) ||
                       (type === getcartoon(x, y-1) &&
                        type === getcartoon(x, y-2))) {
                    type = randomcartoon();
                }
                cartoons[x][y] = type;
            }
        }
    }
	 function randomcartoon() {
        return Math.floor(Math.random() * numcartoonTypes);
    }
    function print() {
        var str = "";
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                str += getcartoon(x, y) + " ";
            }
            str += "\r\n";
        }
        console.log(str);
    }
// returns the number cartoons in the longest chain
    // that includes (x,y)
    function checkChain(x, y) {
        var type = getcartoon(x, y),
            left = 0, right = 0,
            down = 0, up = 0;
    // look right
    while (type === getcartoon(x + right + 1, y)) {
        right++;
    }
        // look left
        while (type === getcartoon(x - left - 1, y)) {
            left++;
        }

        // look up
        while (type === getcartoon(x, y + up + 1)) {
            up++;
        }

        // look down
        while (type === getcartoon(x, y - down - 1)) {
            down++;
        }

        return Math.max(left + 1 + right, up + 1 + down);
    }
	 // returns true if (x1,y1) can be swapped with (x2,y2)
    // to form a new match
    function canSwap(x1, y1, x2, y2) {
        var type1 = getcartoon(x1,y1),
            type2 = getcartoon(x2,y2),
            chain;

        if (!isAdjacent(x1, y1, x2, y2)) {
            return false;
        }

        // temporarily swap cartoons
        cartoons[x1][y1] = type2;
        cartoons[x2][y2] = type1;

        chain = (checkChain(x2, y2) > 2
              || checkChain(x1, y1) > 2);

        // swap back
        cartoons[x1][y1] = type1;
        cartoons[x2][y2] = type2;

        return chain;
    }
	 function isAdjacent(x1, y1, x2, y2) {
        var dx = Math.abs(x1 - x2),
            dy = Math.abs(y1 - y2);
        return (dx + dy === 1);
    }
 // returns a two-dimensional map of chain-lengths
    function getChains() {
        var x, y,
            chains = [];

        for (x = 0; x < cols; x++) {
            chains[x] = [];
            for (y = 0; y < rows; y++) {
                chains[x][y] = checkChain(x, y);
            }
        }
        return chains;
    }
	 // returns true if at least one match can be made
    function hasMoves() {
        for (var x = 0; x < cols; x++) {
            for (var y = 0; y < rows; y++) {
                if (canJewelMove(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }
	// if possible, swaps (x1,y1) and (x2,y2) and
    // calls the callback function with list of board events
    function swap(x1, y1, x2, y2, callback) {
        var tmp,
            events;

        if (canSwap(x1, y1, x2, y2)) {

            // swap the jewels
            tmp = getJewel(x1, y1);
            jewels[x1][y1] = getJewel(x2, y2);
            jewels[x2][y2] = tmp;

            // check the board and get list of events
            events = check();

            callback(events);
        } else {
            callback(false);
        }
    }

	  function fillBoard() {
       

        // recursive fill if new board has no moves
        if (!hasMoves()) {
            fillBoard();
        }
    }
	 function canJewelMove(x, y) {
        return ((x > 0 && canSwap(x, y, x-1, y)) ||
                (x < cols-1 && canSwap(x, y, x+1, y)) ||
                (y > 0 && canSwap(x, y, x, y-1)) ||
                (y < rows-1 && canSwap(x, y, x, y+1)));
    }
	// create a copy of the jewel board
    function getBoard() {
        var copy = [],
            x;
        for (x = 0; x < cols; x++) {
            copy[x] = jewels[x].slice(0);
        }
        return copy;
    }

	 function check(events) {
        var chains = getChains(),
            hadChains = false, score = 0,
            removed = [], moved = [], gaps = [];
events = events || [];

        if (hadChains) {
            events.push({
                type : "remove",
                data : removed
            }, {
                type : "score",
                data : score
            }, {
                type : "move",
                data : moved
            });
            if (!hasMoves()) {
                fillBoard();
                events.push({
                    type : "refill",
                    data : getBoard()
                });
            }
            return check(events);
        } else {
            return events;
        }
    }
        for (var x = 0; x < cols; x++) {
            gaps[x] = 0;
            for (var y = rows-1; y >= 0; y--) {
                if (chains[x][y] > 2) {
                    hadChains = true;
                    gaps[x]++;
                    removed.push({
                        x : x, y : y,
                        type : getcartoon(x, y)
                    });
					 // add points to score
                    score += baseScore
                           * Math.pow(2, (chains[x][y] - 3));

                } else if (gaps[x] > 0) {
                    moved.push({
                        toX : x, toY : y + gaps[x],
                        fromX : x, fromY : y,
                        type : getcartoon(x, y)
                    });
                    cartoons[x][y + gaps[x]] = getcartoon(x, y);
                }
            }
			 for (y = 0; y < gaps[x]; y++) {
                cartoons[x][y] = randomcartoon();
                moved.push({
                    toX : x, toY : y,
                    fromX : x, fromY : y - gaps[x],
                    type : cartoons[x][y]
                });
				
            }
        }
    }
    return {
       initialize : initialize,
        swap : swap,
        canSwap : canSwap,
        getBoard : getBoard,
        print : print
    };
})();

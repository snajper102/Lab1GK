"use strict";  // gives improved error-checking in scripts.

var canvas;    // The canvas element on which we will draw.
var graphics;  // A 2D graphics context for drawing on the canvas.

/**
 * This function returns a string representing a random RGB color.
 * The returned string can be assigned as the value of graphics.fillStyle
 * or graphics.strokeStyle.
 */
function randomColorString() {
    var r = Math.floor(256 * Math.random());
    var g = Math.floor(256 * Math.random());
    var b = Math.floor(256 * Math.random());
    return "rgb(" + r + "," + g + "," + b + ")";
}

function clear() {
    graphics = canvas.getContext('2d');
    graphics.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * This function is called in init() to set up mouse event handling
 * on the canvas.  You can modify the nested functions doMouseDown,
 * doMouseDrag, and possibly doMouseUp to change the reponse to
 * mouse events.  As an example, this program does some simple drawing.
 */
function installMouseHandler() {

    var dragging = false;  // set to true when a drag action is in progress.
    var startX, startY;    // coordinates of mouse at start of drag.
    var prevX, prevY;      // previous mouse position during a drag.

    var colorChoice;
    let shapeType;

    function doMouseDown(evt) {
        // This function is called when the user presses a button on the mouse.
        // Only the main mouse button will start a drag.
        if (dragging) {
            return;  // if a drag is in progress, don't start another.
        }
        if (evt.button != 0) {
            return;  // don't respond unless the button is the main (left) mouse button.
        }
        var x, y;  // mouse position in canvas coordinates
        var r = canvas.getBoundingClientRect();
        x = Math.round(evt.clientX - r.left);  // translate mouse position from screen coords to canvas coords.
        y = Math.round(evt.clientY - r.top);   // round to integer values; some browsers would give non-integers.
        dragging = true;  // (this won't be the case for all mousedowns in all programs)
        if (dragging) {
            startX = prevX = x;
            startY = prevY = y;
            document.addEventListener("mousemove", doMouseMove, false);
            document.addEventListener("mouseup", doMouseUp, false);
        }

        colorChoice = Number(document.getElementById("colorChoice").value);
        shapeType = Number(document.getElementById("shapeType").value);
        // TODO: Anything else to do when mouse is first pressed?
    }

    function doMouseMove(evt) {
        // This function is called when the user moves the mouse during a drag.
        if (!dragging) {
            return;  // (shouldn't be possible)
        }

        var x, y;  // mouse position in canvas coordinates
        var r = canvas.getBoundingClientRect();
        x = Math.round(evt.clientX - r.left);
        y = Math.round(evt.clientY - r.top);

        /*------------------------------------------------------------*/
        /* TODO: Add support for more drawing tools. */

        if (Math.abs(x - prevX) + Math.abs(y - prevY) < 3) {
            return;  // don't draw squares too close together
        }

        switch (colorChoice) {
            case 0:
                graphics.fillStyle = randomColorString();
                break;
            case 1:
                graphics.fillStyle = "red";
                break;
            case 2:
                graphics.fillStyle = "green";
                break;
            case 3:
                graphics.fillStyle = "blue";
                break;
            case 4:
                graphics.fillStyle = "yellow";
                break;
        }

        switch (shapeType) {
            case 0:
                graphics.fillRect(x - 20, y - 20, 40, 40);
                graphics.strokeRect(x - 20, y - 20, 40, 40);
                break;

            case 1: {
                const numOfVertices = 13;
                const size = 50;

                graphics.beginPath();
                graphics.moveTo(
                    x + size * Math.cos(0),
                    y + size * Math.sin(0))
                ;

                for (var i = 0; i <= numOfVertices; i++) {
                    const nx = (x + size * Math.cos(i * 2 * Math.PI / numOfVertices));
                    const ny = (y + size * Math.sin(i * 2 * Math.PI / numOfVertices));

                    graphics.lineTo(nx, ny);
                }

                graphics.fill();
                graphics.stroke();
                break;
            }
        }

        prevX = x;  // update prevX,prevY to prepare for next call to doMouseMove
        prevY = y;
    }

    function doMouseUp(evt) {
        if (!dragging) {
            return;  // (shouldn't be possible)
        }

        dragging = false;
        document.removeEventListener("mousemove", doMouseMove, false);
        document.removeEventListener("mouseup", doMouseMove, false);
    }

    canvas.addEventListener("mousedown", doMouseDown, false);

} // end installMouseHandler


/**
 * This function can be called to add a collection of extra drawing function to
 * a graphics context, to make it easier to draw basic shapes with that context.
 * The parameter, graphics, must be a canvas 2d graphics context.
 *
 * The following new functions are added to the graphics context:
 *
 *    graphics.strokeLine(x1,y1,x2,y2) -- stroke the line from (x1,y1) to (x2,y2).
 *    graphics.fillCircle(x,y,r) -- fill the circle with center (x,y) and radius r.
 *    graphics.strokeCircle(x,y,r) -- stroke the circle.
 *    graphics.fillOval(x,y,r1,r2) -- fill oval with center (x,y) and radii r1 and r2.
 *    graphics.stokeOval(x,y,r1,r2) -- stroke the oval
 *    graphics.fillPoly(x1,y1,x2,y2,...) -- fill polygon with vertices (x1,y1), (x2,y2), ...
 *    graphics.strokePoly(x1,y1,x2,y2,...) -- stroke the polygon.
 *    graphics.getRGB(x,y) -- returns the color components of pixel at (x,y) as an array of
 *         four integers in the range 0 to 255, in the order red, green, blue, alpha.
 *
 * (Note that "this" in a function that is called as a member of an object refers to that
 * object.  Here, this will refer to the graphics context.)
 */
function addGraphicsContextExtras(graphics) {
    graphics.strokeLine = function (x1, y1, x2, y2) {
        this.beginPath();
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        this.stroke();
    }
    graphics.fillCircle = function (x, y, r) {
        this.beginPath();
        this.arc(x, y, r, 0, 2 * Math.PI, false);
        this.fill();
    }
    graphics.strokeCircle = function (x, y, radius) {
        this.beginPath();
        this.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.stroke();
    }
    graphics.fillPoly = function () {
        if (arguments.length < 6)
            return;
        this.beginPath();
        this.moveTo(arguments[0], arguments[1]);
        for (var i = 2; i + 1 < arguments.length; i = i + 2) {
            this.lineTo(arguments[i], arguments[i + 1]);
        }
        this.closePath();
        this.fill();
    }
    graphics.strokePoly = function () {
        if (arguments.length < 4)
            return;
        this.beginPath();
        this.moveTo(arguments[0], arguments[1]);
        for (var i = 2; i + 1 < arguments.length; i = i + 2) {
            this.lineTo(arguments[i], arguments[i + 1]);
        }
        this.closePath();
        this.stroke();
    }
    graphics.fillOval = function (x, y, horizontalRadius, verticalRadius) {
        this.save();
        this.translate(x, y);
        this.scale(horizontalRadius, verticalRadius);
        this.beginPath();
        this.arc(0, 0, 1, 0, 2 * Math.PI, false);
        this.restore();
        this.fill();
    }
    graphics.strokeOval = function (x, y, horizontalRadius, verticalRadius) {
        this.save();
        this.translate(x, y);
        this.scale(horizontalRadius, verticalRadius);
        this.beginPath();
        this.arc(0, 0, 1, 0, 2 * Math.PI, false);
        this.restore();
        this.stroke();
    }
    graphics.getRGB = function (x, y) {
        var color = this.getImageData(x, y, 1, 1);
        return color.data;
    }
}    // end of addGraphicsContextExtras()


/**
 * The init() function is called after the page has been
 * loaded.  It initializes the canvas and graphics variables,
 * and it installs mouse and key listeners.  If an error
 * occurs, a message is displayed in place of the canvas.
 */
function init() {
    try {
        canvas = document.getElementById("canvas");
        graphics = canvas.getContext("2d");
    } catch (e) {
        document.getElementById("canvasholder").innerHTML =
            "<p>Canvas graphics is not supported.<br>" +
            "An error occurred while initializing graphics.</p>";
        return;
    }
    addGraphicsContextExtras(graphics);
    installMouseHandler();
    graphics.fillStyle = "white";
    graphics.fillRect(0, 0, canvas.width, canvas.height);
}

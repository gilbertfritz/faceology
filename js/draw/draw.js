var drawingApp = (function () {

    "use strict";

    var canvas,
            context,
            canvasWidth = 500,
            canvasHeight = 666,
            colorRed = "#FF0000",
            colorGreen = "#00FF00",
            colorYellow = "#FFFF00",
            colorBlack = "#000000",
//            colorPurple = "#cb3594",
//            colorGreen = "#659b41",
//            colorYellow = "#ffcf33",
            colorBrown = "#986928",
            outlineImage = new Image(),
            crayonImage = new Image(),
            markerImage = new Image(),
            eraserImage = new Image(),
            crayonBackgroundImage = new Image(),
            markerBackgroundImage = new Image(),
            eraserBackgroundImage = new Image(),
            crayonTextureImage = new Image(),
            menuImage = new Image(),
            clickX = [],
            clickY = [],
            clickColor = [],
            clickTool = [],
            clickSize = [],
            clickDrag = [],
            paint = false,
            curColor = colorRed,
            curTool = "marker",
            curSize = "large",
            brushColor = colorGreen,
            mediumStartX = 18,
            mediumStartY = 19,
            mediumImageWidth = 93,
            mediumImageHeight = 46,
            drawingAreaX = 111,
            drawingAreaY = 11,
            drawingAreaWidth = 267,
            drawingAreaHeight = 200,
            toolHotspotStartY = 23,
            toolHotspotHeight = 38,
            sizeHotspotStartY = 157,
            sizeHotspotHeight = 36,
            totalLoadResources = 2,
            curLoadResNum = 0,
            sizeHotspotWidthObject = {
                huge: 39,
                large: 25,
                normal: 18,
                small: 16
            },
    fuck = function () {

    },
            clearCanvas = function () {
                context.clearRect(0, 0, canvas.width, canvas.height);
            },
            // Redraws the canvas.
            redraw = function () {

                var locX,
                        locY,
                        radius,
                        i,
                        selected;


                // Make sure required resources are loaded before redrawing
                if (curLoadResNum < totalLoadResources) {
                    return;
                }

                clearCanvas();

                // For each point drawn
                for (i = 0; i < clickX.length; i += 1) {

                    // Set the drawing radius
                    switch (clickSize[i]) {
                        case "small":
                            radius = 2;
                            break;
                        case "normal":
                            radius = 5;
                            break;
                        case "large":
                            radius = 10;
                            break;
                        case "huge":
                            radius = 20;
                            break;
                        default:
                            break;
                    }

                    // Set the drawing path
                    context.beginPath();
                    // If dragging then draw a line between the two points
                    if (clickDrag[i] && i) {
                        context.moveTo(clickX[i - 1], clickY[i - 1]);
                    } else {
                        // The x position is moved over one pixel so a circle even if not dragging
                        context.moveTo(clickX[i] - 1, clickY[i]);
                    }
                    context.lineTo(clickX[i], clickY[i]);

                    // Set the drawing color
                    if (clickTool[i] === "eraser") {
                        //context.globalCompositeOperation = "destination-out"; // To erase instead of draw over with white
                        context.strokeStyle = 'white';
                    } else {
                        //context.globalCompositeOperation = "source-over";	// To erase instead of draw over with white
                        context.strokeStyle = clickColor[i];
                    }
                    context.lineCap = "round";
                    context.lineJoin = "round";
                    context.lineWidth = radius;
                    context.stroke();
                    context.closePath();
                }
                context.closePath();
                //context.globalCompositeOperation = "source-over";// To erase instead of draw over with white
                context.restore();

                // Overlay a crayon texture (if the current tool is crayon)
                if (curTool === "crayon") {
                    context.globalAlpha = 0.4; // No IE support
                    context.drawImage(crayonTextureImage, 0, 0, canvasWidth, canvasHeight);
                }
                context.globalAlpha = 1; // No IE support

                // Draw the outline image
                context.drawImage(outlineImage, 0, 0);
                context.drawImage(menuImage, 0, 0, 0.60 * menuImage.width, 0.60 * menuImage.height);
            },
            // Adds a point to the drawing array.
            // @param x
            // @param y
            // @param dragging
            addClick = function (x, y, dragging) {

                clickX.push(x);
                clickY.push(y);
                clickTool.push(curTool);
                clickColor.push(curColor);
                clickSize.push(curSize);
                clickDrag.push(dragging);
            },
            // Add mouse and touch event listeners to the canvas
            createUserEvents = function () {

                var press = function (e) {
                    // Mouse down location
                    var sizeHotspotStartX,
                            mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
                            mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

                    var menuScale = 0.6;
                    var menuWidth = 130;
                    var menuHeight = 402;
                    var menuSectionHeight = 90;
                    var menuColorSectionHeight = 40;

                    if (mouseX < menuWidth * menuScale) { // Left of the drawing area
                        if (mouseY > menuSectionHeight * menuScale * 0 && mouseY < menuSectionHeight * menuScale * 1) {
                            curTool = "marker";
                            curColor = brushColor;
                        } else if (mouseY > menuSectionHeight * menuScale * 1 && mouseY < menuSectionHeight * menuScale * 2) {
                            curTool = "marker";
                            curColor = colorBlack;
                        } else if (mouseY > menuSectionHeight * menuScale * 2 && mouseY < menuSectionHeight * menuScale * 3) {
                            curTool = "eraser";
                        } else if (mouseY > menuSectionHeight * menuScale * 3 && mouseY < menuSectionHeight * menuScale * 3 + 40 * menuColorSectionHeight) {
                            if (mouseX > ((menuWidth * menuScale) / 3) * 0 && mouseX < ((menuWidth * menuScale) / 3) * 1) {
                                curTool = "marker";
                                curColor = colorGreen;
                                brushColor = curColor;
                            } else if (mouseX > ((menuWidth * menuScale) / 3) * 1 && mouseX < ((menuWidth * menuScale) / 3) * 2) {
                                curTool = "marker";
                                curColor = colorYellow;
                                brushColor = curColor;
                            } else if (mouseX > ((menuWidth * menuScale) / 3) * 2 && mouseX < ((menuWidth * menuScale) / 3) * 3) {
                                curTool = "marker";
                                curColor = colorRed;
                                brushColor = curColor;
                            }
                        }

//                        if (mousey > mediumStartX) {
//                            if (mouseY > mediumStartY && mouseY < mediumStartY + mediumImageHeight) {
//                                curColor = colorPurple;
//                            } else if (mouseY > mediumStartY + mediumImageHeight && mouseY < mediumStartY + mediumImageHeight * 2) {
//                                curColor = colorGreen;
//                            } else if (mouseY > mediumStartY + mediumImageHeight * 2 && mouseY < mediumStartY + mediumImageHeight * 3) {
//                                curColor = colorYellow;
//                            } else if (mouseY > mediumStartY + mediumImageHeight * 3 && mouseY < mediumStartY + mediumImageHeight * 4) {
//                                curColor = colorBrown;
//                            }
//                        }
//                        curTool = "eraser";
                    }
//                    else if (mouseX > drawingAreaX + drawingAreaWidth) { // Right of the drawing area
//
//                        if (mouseY > toolHotspotStartY) {
//                            if (mouseY > sizeHotspotStartY) {
//                                sizeHotspotStartX = drawingAreaX + drawingAreaWidth;
//                                if (mouseY < sizeHotspotStartY + sizeHotspotHeight && mouseX > sizeHotspotStartX) {
//                                    if (mouseX < sizeHotspotStartX + sizeHotspotWidthObject.huge) {
//                                        curSize = "huge";
//                                    } else if (mouseX < sizeHotspotStartX + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge) {
//                                        curSize = "large";
//                                    } else if (mouseX < sizeHotspotStartX + sizeHotspotWidthObject.normal + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge) {
//                                        curSize = "normal";
//                                    } else if (mouseX < sizeHotspotStartX + sizeHotspotWidthObject.small + sizeHotspotWidthObject.normal + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge) {
//                                        curSize = "small";
//                                    }
//                                }
//                            } else {
//                                if (mouseY < toolHotspotStartY + toolHotspotHeight) {
//                                    curTool = "crayon";
//                                } else if (mouseY < toolHotspotStartY + toolHotspotHeight * 2) {
//                                    curTool = "marker";
//                                } else if (mouseY < toolHotspotStartY + toolHotspotHeight * 3) {
//                                    curTool = "eraser";
//                                }
//                            }
//                        }
//                    }
                    paint = true;
                    addClick(mouseX, mouseY, false);
                    redraw();
                },
                        drag = function (e) {

                            var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
                                    mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

                            if (paint) {
                                addClick(mouseX, mouseY, true);
                                redraw();
                            }
                            // Prevent the whole page from dragging if on mobile
                            e.preventDefault();
                        },
                        release = function () {
                            paint = false;
                            redraw();
                        },
                        cancel = function () {
                            paint = false;
                        };

                // Add mouse event listeners to canvas element
                canvas.addEventListener("mousedown", press, false);
                canvas.addEventListener("mousemove", drag, false);
                canvas.addEventListener("mouseup", release);
                canvas.addEventListener("mouseout", cancel, false);

                // Add touch event listeners to canvas element
                canvas.addEventListener("touchstart", press, false);
                canvas.addEventListener("touchmove", drag, false);
                canvas.addEventListener("touchend", release, false);
                canvas.addEventListener("touchcancel", cancel, false);
            },
            // Calls the redraw function after all neccessary resources are loaded.
            resourceLoaded = function () {

                curLoadResNum += 1;
                if (curLoadResNum === totalLoadResources) {
                    redraw();
                    createUserEvents();
                }
            },
            // Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
            init = function () {

                // Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
                canvas = document.createElement('canvas');
                canvas.setAttribute('width', canvasWidth);
                canvas.setAttribute('height', canvasHeight);
                canvas.setAttribute('id', 'canvas');
                document.getElementById('canvasDiv').appendChild(canvas);
                if (typeof G_vmlCanvasManager !== "undefined") {
                    canvas = G_vmlCanvasManager.initElement(canvas);
                }
                context = canvas.getContext("2d"); // Grab the 2d canvas context
                // Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
                //     context = document.getElementById('canvas').getContext("2d");

                // Load images
                outlineImage.onload = resourceLoaded;
                outlineImage.src = "images/faces/0.png";

                menuImage.onload = resourceLoaded;
                menuImage.src = "images/menusmall.png";
            },
            send = function () {
                var dataURL = canvas.toDataURL();

                var name = jQuery("#nameinput").val();
                var age = jQuery("#ageinput").val();
                var town = jQuery("#towninput").val();
                var prof = jQuery("#profinput").val();
                var mail = jQuery("#mailinput").val();
                var info = name + ";" + age + ";" + town + ";" + prof + ";" + mail + ";";

                jQuery.ajax({
                    type: "POST",
                    url: "receive.php",
                    data: {
                        imgBase64: dataURL,
                        info: info
                    }
                }).done(function (o) {
                    console.log('saved');
                });

            };

    return {
        init: init,
        send: send
    };
}());
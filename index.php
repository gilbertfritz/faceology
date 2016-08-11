<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="css/faceology.css">
        <title>Faceology</title>
    </head>
    <body>
        <div id="header">
            <p>FACEOLOGY</p>
        </div>
        <!--        <div id="page1"  class="pagediv">
                    <p>Faceology is ....</p>
                </div>
                <div id="page2">
                    <p>Choose your face ..</p>
                </div>-->
        <div id="page3" class="pagediv">
            <div id="canvasDiv"></div>
            <div id="buttonDiv">
                <button onclick="nextpage()">NEXT</button>
            </div>
        </div>

        <div id="page4" class="pagediv" style="display: none">
            <div id="formdiv">
                Name: <input id="nameinput" type="text" name="fname"><br />
                Age:<input id="ageinput" type="text" name="fname"><br />
                Town:<input id="towninput" type="text" name="fname"><br />
                Profession:<input id="profinput" type="text" name="fname"><br />
                Email:<input id="mailinput" type="text" name="fname"><br />
                <button onclick="nextpage();drawingApp.send();">SEND</button>
            </div>
        </div>
        
        <div id="page5" class="pagediv" style="display: none">
            Thanks you for submitting! BYE!
        </div>

        <div id="footer">
            <p>Terms and Condition | about IDENTITYLAB</p>
        </div>


<!--[if IE]><script type="text/javascript" src="excanvas.js"></script><![endif]-->
        <script type="text/javascript" src="js/lib/jquery-3.1.0.min.js"></script>
        <!--<script type="text/javascript" src="js/draw/data.js"></script>-->
        <script type="text/javascript" src="js/draw/draw.js"></script>
        <script type="text/javascript" src="js/nav.js"></script>
        <script type="text/javascript">
                    drawingApp.init();
        </script>
    </body>
</html>
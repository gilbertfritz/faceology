//transform html

window.onload = function () {
    for (var idx = 0; idx < data.length; idx++) {
        var name = data[idx]["name"];
        var btn = document.createElement("BUTTON");
        btn.setAttribute("onclick", "selectPath(" + idx + ")");
        btn.setAttribute("style", "color: black");
        btn.setAttribute("id", "bid" + idx);
        btn.innerHTML = name;
        document.getElementById("btndiv").appendChild(btn);
    }
    selectPath(0);
};



var calcFormattedPoints = function (_points) {
    var dataOut = [];
    for (var pid = 0; pid < data.length; pid++) {
        var path = {};
        path.name = data[pid].name;
        path.path = [];
        for (var i = 0; i < _points[pid].length; i++) {
            path.path.push(Math.round(points[pid][i][0]));
            path.path.push(Math.round(points[pid][i][1]));
        }
        dataOut[pid] = path;
    }
    return "data = " + JSON.stringify(dataOut);
};


//build svg
var width = 500,
        height = 666;


var selectPath = function (_path) {
    svg.select("#path" + selectedPath).attr("visibility", "hidden");
    var btn = document.getElementById("bid" + selectedPath);
    btn.setAttribute("style", "color: black");
    selectedPath = _path;
    svg.select("#path" + selectedPath).attr("visibility", "visible").attr("style","fill:lime;fill-opacity:0.5");
    redraw();
    var btn = document.getElementById("bid" + selectedPath);
    btn.setAttribute("style", "color: red");
}

var points = [];

for (var i = 0; i < data.length; i++) {
//    points[i] = d3.range(1, 5).map(function (i) {
//        return [i * width / 5, 50 + Math.random() * (height - 100)];
//    });
    var pc = 0;
    points[i] = [];
    for( var j = 0; j < data[i].path.length; j+=2){
        var x = data[i].path[j];
        var y = data[i].path[j+1];
        
        points[i][pc] = [];
        points[i][pc][0] = x;
        points[i][pc][1] = y;
        pc++;
    }
}
document.getElementById("points").innerHTML = calcFormattedPoints(points);

var dragged = null,
        selectedPath = 0,
        selected = points[selectedPath][0];

var line = d3.svg.line();



var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("tabindex", 1)
        .attr("class", "svg");

svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .on("mousedown", mousedown);

svg.append("path")
        .datum(points[0])
        .attr("class", "line")
        .attr("id", "path0" /*+ selectedPath*/)
        .call(redraw);

for (var i = 0; i < data.length; i++) {
    svg.append("path")
            .datum(points[i])
            .attr("class", "line")
            .attr("id", "path" + i)
            .attr("visible", "hidden")
            .call(redraw);
}
svg.select("#path0").attr("visible", "visible");


d3.select(window)
        .on("mousemove", mousemove)
        .on("mouseup", mouseup)
        .on("keydown", keydown);

d3.select("#interpolate")
        .on("change", change)
        .selectAll("option")
        .data([
            "linear",
            "step-before",
            "step-after",
            "basis",
            "basis-open",
            "basis-closed",
            "cardinal",
            "cardinal-open",
            "cardinal-closed",
            "monotone"
        ])
        .enter().append("option")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        });

svg.node().focus();

function redraw() {
    svg.select("#path" + selectedPath).attr("d", line);

    var circle = svg.selectAll("circle")
            .data(points[selectedPath], function (d) {
                return d;
            });

    circle.enter().append("circle")
            .attr("r", 1e-6)
            .on("mousedown", function (d) {
                selected = dragged = d;
                redraw();
            })
            .transition()
            .duration(750)
            .ease("elastic")
            .attr("r", 6.5);

    circle.classed("selected", function (d) {
        return d === selected;
    })
            .attr("cx", function (d) {
                return d[0];
            })
            .attr("cy", function (d) {
                return d[1];
            });

    circle.exit().remove();

    if (d3.event) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
    }
}

function change() {
    line.interpolate(this.value);
    redraw();
}

function mousedown() {
    points[selectedPath].push(selected = dragged = d3.mouse(svg.node()));
    redraw();
    
    document.getElementById("points").innerHTML = calcFormattedPoints(points);
}

function mousemove() {
    if (!dragged)
        return;
    var m = d3.mouse(svg.node());
    dragged[0] = Math.max(0, Math.min(width, m[0]));
    dragged[1] = Math.max(0, Math.min(height, m[1]));
    redraw();
    
    document.getElementById("points").innerHTML = calcFormattedPoints(points);
}

function mouseup() {
    if (!dragged)
        return;
    mousemove();
    dragged = null;
}

function keydown() {
    if (!selected)
        return;
    switch (d3.event.keyCode) {
        case 8: // backspace
        case 46:
        { // delete
            var i = points[selectedPath].indexOf(selected);
            points[selectedPath].splice(i, 1);
            selected = points[selectedPath].length ? points[0][i > 0 ? i - 1 : 0] : null;
            redraw();
            document.getElementById("points").innerHTML = calcFormattedPoints(points);
            break;
        }
    }
}
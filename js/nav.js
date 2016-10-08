
var page = 1;



var nextpage = function () {
    jQuery("#page" + page).hide();
    jQuery("#page" + (page + 1)).show();
    $("#nav-element" + page).toggleClass("active");
    page++;
    if (page === 4) {
        $(".rightarrow").css("visibility", "hidden");
    } else {
        $(".rightarrow").css("visibility", "visible");
    }
    $(".leftarrow").css("visibility", "visible");
    $("#nav-element" + page).toggleClass("active");
};

var prevpage = function () {
    jQuery("#page" + page).hide();
    jQuery("#page" + (page - 1)).show();
    $("#nav-element" + page).toggleClass("active")
    page--;
    if (page === 1) {
        $(".leftarrow").css("visibility", "hidden");
    } else {
        $(".leftarrow").show();
    }
    $(".rightarrow").css("visibility", "visible");
    $("#nav-element" + page).toggleClass("active")
};

//var selectFace = function (face) {
//
//};


jQuery(document).ready(function ($) {

    $(".facediv").click(function () {
        $(".facediv").removeClass("faceselected");
        $(this).toggleClass("faceselected");
        var id = $(this).attr("id");
        drawingApp.setface(id);
    });

    $("form").submit(function () {
                $("form").hide();
                $(".thanks").show();
                drawingApp.send();
                return false;
            });
});
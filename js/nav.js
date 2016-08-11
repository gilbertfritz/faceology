
var page = 3;

var nextpage = function(){
    jQuery("#page" + page).hide();
    jQuery("#page" + (page+1)).show();
    page++;
}


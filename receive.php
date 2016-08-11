<?php

//include_once("php/Pointlocation.class.php");

define('FACEREGION_OUTLINE', '0');
define('FACEREGION_HAIR', '1');
define('FACEREGION_FOREHEAD', '2');
define('FACEREGION_EYELEFT', '3');
define('FACEREGION_EYERIGHT', '4');
define('FACEREGION_NOSE', '5');
define('FACEREGION_CHEEKLEFT', '6');
define('FACEREGION_CHEEKRIGHT', '7');
define('FACEREGION_MOUTH', '8');
define('FACEREGION_CHIN', '9');
define('FACEREGION_EARLEFT', '10');
define('FACEREGION_EARRIGHT', '11');
define('FACEREGION_NECK', '12');

define('IMAGE_WIDTH', '500');
define('IMAGE_HEIGHT', '666');

        const STATS_HEADLINE = "date;sum_green;sum_yellow;sum_red;" .
        "hair_green;hair_yellow;hair_red;" .
        "forehead_green;forehead_yellow;forehead_red;" .
        "eyes_green;eyes_yellow;eyes_red;" .
        "nose_green;nose_yellow;nose_red;" .
        "cheeks_green;cheeks_yellow;cheeks_red;" .
        "mouth_green;mouth_yellow;mouth_red;" .
        "chin_green;chin_yellow;chin_red;" .
        "ears_green;ears_yellow;ears_red;" .
        "neck_green;neck_yellow;neck_red;";

        const AREA_MAPPING = array("outline", "hair", "forehead", "eyes", "eyes", "nose", "cheeks", "cheeks", "mouth", "chin", "ears", "ears", "neck");
        const COLOR_RED = array("red" => 255, "green" => 0, "blue" => 0);
        const COLOR_YELLOW = array("red" => 255, "green" => 255, "blue" => 0);
        const COLOR_GREEN = array("red" => 0, "green" => 255, "blue" => 0);

        const STATSFILE = "stats/stats.csv";
        const PICSFOLDER = "stats/pictures";
        const DOMAIN = "http://gilbertfritz.com/faceology/";

$postimg = $_POST['imgBase64'];
$postinfo = $_POST['info'];

$now = date("d.m.Y");
$uniqid = uniqid();
$statsfilename = STATSFILE;
$picfilename = PICSFOLDER . "/" . $now . "_" . $uniqid . ".png";
$piclink = DOMAIN . $picfilename;
decode_and_save_image($postimg, $picfilename);
$image = imagecreatefrompng($picfilename);
$polygons = create_array_from_json(file_get_contents("polygondata/data.json"));
$colored_pixels = extract_colored_pixels($image, $polygons);
$stats_line = generate_stats($colored_pixels, $now, $piclink, $postinfo);
appendToStatsFile($statsfilename, $stats_line);


function appendToStatsFile($stats_file, $stats_line) {
// Write the contents to the file, 
// using the FILE_APPEND flag to append the content to the end of the file
// and the LOCK_EX flag to prevent anyone else writing to the file at the same time
    file_put_contents($stats_file, $stats_line, FILE_APPEND | LOCK_EX);
}

function generate_stats($colored_pixels, $now, $piclink, $postinfo) {
    $color_sums = $colored_pixels["color_sums"];
    $color_area = $colored_pixels["color_area"];
    $stats_line = $now . ";" . $postinfo;
    $stats_line = $stats_line . $color_sums["green"] . ";" . $color_sums["yellow"] . ";" . $color_sums["red"];
    foreach ($color_area as $areakey => $areavalue) {
        $green = $areavalue["green"];
        $yellow = $areavalue["yellow"];
        $red = $areavalue["red"];
//        $max = max($green, $yellow, $red);
        $stats_line = $stats_line . ";" . $green . ";" . $yellow . ";" . $red;
    }
    return $stats_line . ";" . $piclink . "\n";
}

function assign_area($point, $polygons) {
    $area = null;
    for ($i = 1; $i < 13; $i++) {
        $path = $polygons[$i];
        if (pointInPolygon($point, $path)) {
            $area = $i;
            break;
        }
    }
    return $area ? AREA_MAPPING[$area] : null;
}

function extract_colored_pixels($image, $polygons) {
    $color_sums = array("green" => 0, "yellow" => 0, "red" => 0);
    $color_area = array("hair" => array("green" => 0, "yellow" => 0, "red" => 0),
        "forehead" => array("green" => 0, "yellow" => 0, "red" => 0),
        "eyes" => array("green" => 0, "yellow" => 0, "red" => 0),
        "nose" => array("green" => 0, "yellow" => 0, "red" => 0),
        "cheeks" => array("green" => 0, "yellow" => 0, "red" => 0),
        "mouth" => array("green" => 0, "yellow" => 0, "red" => 0),
        "chin" => array("green" => 0, "yellow" => 0, "red" => 0),
        "ears" => array("green" => 0, "yellow" => 0, "red" => 0),
        "neck" => array("green" => 0, "yellow" => 0, "red" => 0));
//    foreach ($area as $color_area) {
//        $area = array("green" => 0, "yellow" => 0, "red" => 0);
//    }
    for ($x = 0; $x < IMAGE_WIDTH; $x++) {
        for ($y = 0; $y < IMAGE_HEIGHT; $y++) {
            $point = new Point($y, $x);
            if (pointInPolygon($point, $polygons[FACEREGION_OUTLINE])) {
                $colors = imagecolorsforindex($image, imagecolorat($image, $x, $y));
                $classified_color = classify_color($colors);
                if ($classified_color) {
                    $color_sums[$classified_color] ++;
                    $area = assign_area($point, $polygons);
                    if ($area) {
                        $color_area[$area][$classified_color] ++;
                    }
                }
            }
        }
    }
    return array("color_sums" => $color_sums, "color_area" => $color_area);
}

function classify_color($colors) {
    if ($colors['red'] == COLOR_RED['red'] && $colors['green'] == COLOR_RED['green'] && $colors['blue'] == COLOR_RED['blue']) {
        return "red";
    }
    if ($colors['red'] == COLOR_YELLOW['red'] && $colors['green'] == COLOR_YELLOW['green'] && $colors['blue'] == COLOR_YELLOW['blue']) {
        return "yellow";
    }
    if ($colors['red'] == COLOR_GREEN['red'] && $colors['green'] == COLOR_GREEN['green'] && $colors['blue'] == COLOR_GREEN['blue']) {
        return "green";
    }
    return null;
}

function decode_and_save_image($postImgBase64, $filename) {
    $img = str_replace('data:image/png;base64,', '', $postImgBase64);
    $img = str_replace(' ', '+', $img);
    $imageContent = base64_decode($img);
    file_put_contents($filename, $imageContent);
}

function create_array_from_json($jsondata) {
    $string = $jsondata;
    $json_a = json_decode($string, true);
    $polygons = array();
    for ($p = 0; $p < count($json_a); $p++) {
        $path = $json_a[$p]["path"];
        $polygons[$p] = array();
        for ($i = 0; $i < count($path); $i+=2) {
            array_push($polygons[$p], new Point($path[$i + 1], $path[$i]));
        }
    }
    return $polygons;
}

//Point class, storage of lat/long-pairs
class Point {

    public $lat;
    public $long;

    function Point($lat, $long) {
        $this->lat = $lat;
        $this->long = $long;
    }

}

//the Point in Polygon function
function pointInPolygon($p, $polygon) {
    //if you operates with (hundred)thousands of points
    set_time_limit(60);
    $c = 0;
    $p1 = $polygon[0];
    $n = count($polygon);

    for ($i = 1; $i <= $n; $i++) { //any student need to go through this
        $p2 = $polygon[$i % $n];
        if ($p->long > min($p1->long, $p2->long) && $p->long <= max($p1->long, $p2->long) && $p->lat <= max($p1->lat, $p2->lat) && $p1->long != $p2->long) {
            $xinters = ($p->long - $p1->long) * ($p2->lat - $p1->lat) / ($p2->long - $p1->long) + $p1->lat;
            if ($p1->lat == $p2->lat || $p->lat <= $xinters) {
                $c++;
            }
        }
        $p1 = $p2;
    }
    // if the number of edges we passed through is even, then it's not in the poly.
    return $c % 2 != 0;
}

?>
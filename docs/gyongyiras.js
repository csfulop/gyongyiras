var COLUMNS = 32;
var VALID_VONALAZAS = ["1", "2", "3", "4"];
var WORD_BOUNDARY = [" ", "\n", ".", "!", "?", "-"];

var ROWS;
var BACKGROUND_LINE_CHAR;
var BACKGROUND_BOTTOM_LINE_CHAR;

function getCssVariables() {
    ROWS = getComputedStyle(document.getElementById("print")).getPropertyValue("--number-of-rows");
    console.log('ROWS="'+ROWS+'"');
    BACKGROUND_LINE_CHAR = getComputedStyle(document.getElementById("print")).getPropertyValue("--background-line-char");
    console.log('BACKGROUND_LINE_CHAR="'+BACKGROUND_LINE_CHAR+'"');
    BACKGROUND_BOTTOM_LINE_CHAR = getComputedStyle(document.getElementById("print")).getPropertyValue("--background-bottom-line-char");
    console.log('BACKGROUND_BOTTOM_LINE_CHAR="'+BACKGROUND_BOTTOM_LINE_CHAR+'"');
}

function update() {
    var input = document.getElementById("input").value;
    var output = "";
    for (var i=0; i<input.length; i++) {
        if (input.charAt(i) === "%") {
            continue;
        }
        var prev = i>0 ? input.charAt(i-1) : null;
        var color = false;
        if (prev === "%") {
            color = true;
            prev = i>1 ? input.charAt(i-2) : null;
        }
        var c = input.charAt(i);
        var next = i<input.length-1 ? input.charAt(i+1) : null;
        if (next === "%") {
            next = i<input.length-2 ? input.charAt(i+2) : null;
        }
        var wordStart = prev === null || WORD_BOUNDARY.includes(prev);
        var wordEnd = next === null || WORD_BOUNDARY.includes(next);
        var fent = "boóöőrvwF".includes(prev);
        var kotes = fent ? "f" : "l";
        var szam = "0123456789".includes(c);
        if ("P".includes(prev)) {
            kotes = "t";
        } else if ("NTVW".includes(prev)) {
            if ("ábéfhiíjklóöőtúüű".includes(c)) {
                kotes = "t";
            } else {
                kotes = "k";
            }
        }
        else if ("BDINOÓÖŐSs".includes(prev)) {
            kotes = "k";
        }
        // console.log("pcn="+prev+c+next+", fent="+fent+", kotes="+kotes);
        if (c === 't' && next === 't') {
            c = ']';
            i++;
        }
        var colorClass = color ? " red" : "";
        if (szam) {
            output += c;
        } else if (wordStart && wordEnd) {
            output += "<span class=\"egy"+colorClass+"\">"+c+"</span>";
        } else if (wordStart && !wordEnd) {
            output += "<span class=\"e"+colorClass+"\">"+c+"</span>";
        } else if (!wordStart && !wordEnd) {
            output += "<span class=\""+kotes+colorClass+"\">"+c+"</span>";
        } else if (!wordStart && wordEnd) {
            output += "<span class=\""+kotes+"v"+colorClass+"\">"+c+"</span>";
        } else {
            output += c;
        }
    }
    var outputRows = output.split("\n");
    document.getElementById("output1").innerHTML = outputRows.slice(0,ROWS).join("\n");
    document.getElementById("output2").innerHTML = outputRows.slice(ROWS,2*ROWS).join("\n");
}

function fillBackgroundById(id) {
    var row = BACKGROUND_LINE_CHAR.repeat(COLUMNS).concat("\n");
    var background = row.repeat(ROWS-1);
    background += BACKGROUND_BOTTOM_LINE_CHAR.repeat(COLUMNS);
    document.getElementById(id).innerHTML = background;
}

function fillBackground() {
    fillBackgroundById("background1");
    fillBackgroundById("background2");
}

function refreshOutput() {
    getCssVariables();
    fillBackground();
    update();
}

function changeVonalazas() {
    var vonalazas = document.getElementById("settingVonalazas").value;
    if (VALID_VONALAZAS.includes(vonalazas)) {
        document.getElementById("print").className = "osztaly"+vonalazas;
        refreshOutput();
    }
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function processParameter() {
    var content = getUrlParameter("c");
    if (content !== "") {
        document.getElementById("input").innerHTML = content;
    }
}

processParameter();
refreshOutput();

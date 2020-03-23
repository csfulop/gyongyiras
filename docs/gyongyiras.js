var COLUMNS = 24;
var VALID_VONALAZAS = ["1", "2"];
var WORD_BOUNDARY = [" ", "\n", ".", "!", "?", "-"];

function update() {
    var rows = getComputedStyle(document.getElementById("print")).getPropertyValue("--number-of-rows");
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
        console.log("pcn="+prev+c+next+", fent="+fent+", kotes="+kotes);
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
    document.getElementById("output1").innerHTML = outputRows.slice(0,rows).join("\n");
    document.getElementById("output2").innerHTML = outputRows.slice(rows,2*rows).join("\n");
}

function fillBackgroundById(id) {
    var rows = getComputedStyle(document.getElementById("print")).getPropertyValue("--number-of-rows");
    var row = " ".repeat(COLUMNS).concat("\n");
    var background = row.repeat(rows-1);
    background += "_".repeat(COLUMNS);
    document.getElementById(id).innerHTML = background;
}

function fillBackground() {
    fillBackgroundById("background1");
    fillBackgroundById("background2");
}

function changeVonalazas() {
    var vonalazas = document.getElementById("settingVonalazas").value;
    if (VALID_VONALAZAS.includes(vonalazas)) {
        document.getElementById("print").className = "osztaly"+vonalazas;
        fillBackground();
        update();
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
update();
fillBackground();

var LINES = 14;
var COLUMNS = 24;

function update() {
    input = document.getElementById("input").value;
    var output = "";
    for (var i=0; i<input.length; i++) {
        var prev = i>0 ? input.charAt(i-1) : null;
        var c = input.charAt(i);
        var next = i<input.length-1 ? input.charAt(i+1) : null;
        var wordStart = prev === null || prev === ' ' || prev === '\n';
        var wordEnd = next === null || next === ' ' || next === '\n';
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
        if (szam) {
            output += c;
        } else if (wordStart && wordEnd) {
            output += "<span class=\"egy\">"+c+"</span>";
        } else if (wordStart && !wordEnd) {
            output += "<span class=\"e\">"+c+"</span>";
        } else if (!wordStart && !wordEnd) {
            output += "<span class=\""+kotes+"\">"+c+"</span>";
        } else if (!wordStart && wordEnd) {
            output += "<span class=\""+kotes+"v\">"+c+"</span>";
        } else {
            output += c;
        }
    }
    var lines = output.split("\n");
    document.getElementById("output1").innerHTML = lines.slice(0,LINES).join("\n");
    document.getElementById("output2").innerHTML = lines.slice(LINES,2*LINES).join("\n");
}

function fillBackground(id) {
    var line = " ".repeat(COLUMNS).concat("\n");
    var background = line.repeat(LINES-1);
    background += "_".repeat(COLUMNS);
    document.getElementById(id).innerHTML = background;
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
fillBackground("background1");
fillBackground("background2");

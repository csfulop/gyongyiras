var VONALAZAS_TO_CLASS = new Map();
VONALAZAS_TO_CLASS.set("1","osztaly1")
                  .set("2","osztaly2")
                  .set("3","osztaly3")
                  .set("4","osztaly4")
                  .set("gyl1","gyl1")
                  .set("gyl2","gyl2");

var VONALAZAS_DEFAULT_PAGE = new Map();
VONALAZAS_DEFAULT_PAGE.set("1","a5")
                      .set("2","a5")
                      .set("3","a5")
                      .set("4","a5")
                      .set("gyl1","a4l")
                      .set("gyl2","a4l");

var PAGE_TO_CLASS = new Map();
PAGE_TO_CLASS.set("a5","pageA5")
             .set("a4l","pageA4-landscape")
             .set("a4p","pageA4");

var WORD_CHARACTERS = "aáäbcdeéfghiíjklmnoóöőpqrstuúüűvwxyzß" +
                      "AÁÄBCDEÉFGHIÍJKLMNOÓÖŐPQRSTUÚÜŰVWXYZ";
var NUMBERS = "0123456789";
var WORD_BOUNDARY = NUMBERS + "!\"'+,-.:;<=>? \n−/()";
var SUPPORTED_CHARACTERS = WORD_CHARACTERS + WORD_BOUNDARY;
var SPEC_COLOR = "%";
var SPECIAL_CHARACTERS = SPEC_COLOR;

var COLUMNS;
var ROWS;
var BACKGROUND_LINE_CHAR;
var BACKGROUND_BOTTOM_LINE_CHAR;

var selectedColor;
var COLOR_TO_CSS = new Map();
COLOR_TO_CSS.set("red","red")
            .set("green","#00e600")
            .set("blue","blue");
setSelectedColor();
// FIXME: when color is changed then update its css instead of regenerate the content

function getCssVariables() {
    ROWS = getComputedStyle(document.getElementById("page1")).getPropertyValue("--number-of-rows");
    console.log('ROWS="'+ROWS+'"');
    COLUMNS = getComputedStyle(document.getElementById("page1")).getPropertyValue("--number-of-columns");
    console.log('COLUMNS="'+COLUMNS+'"');
    BACKGROUND_LINE_CHAR = getComputedStyle(document.getElementById("page1")).getPropertyValue("--background-line-char");
    console.log('BACKGROUND_LINE_CHAR="'+BACKGROUND_LINE_CHAR+'"');
    BACKGROUND_BOTTOM_LINE_CHAR = getComputedStyle(document.getElementById("page1")).getPropertyValue("--background-bottom-line-char");
    console.log('BACKGROUND_BOTTOM_LINE_CHAR="'+BACKGROUND_BOTTOM_LINE_CHAR+'"');
}

function update() {
    var input = document.getElementById("input").value;
    var output = "";
    for (var i=0; i<input.length; i++) {
        if (!SUPPORTED_CHARACTERS.includes(input.charAt(i))) {
            continue;
        }
        var prev = i>0 ? input.charAt(i-1) : null;
        var color = false;
        if (prev === SPEC_COLOR) {
            color = true;
            prev = i>1 ? input.charAt(i-2) : null;
        }
        var c = input.charAt(i);
        var next = i<input.length-1 ? input.charAt(i+1) : null;
        if (next === SPEC_COLOR) {
            next = i<input.length-2 ? input.charAt(i+2) : null;
            i++;
        }
        var wordStart = prev === null || WORD_BOUNDARY.includes(prev);
        var wordEnd = next === null || WORD_BOUNDARY.includes(next);
        if (WORD_BOUNDARY.includes(c)) {
            if (color) {
                wordStart = wordEnd = true;
            } else {
                output += c;
                continue;
            }
        }
        var kotes;
        if ("P".includes(prev)) {
            kotes = "t";
        } else if ("NTVW".includes(prev)) {
            if ("ábéfhiíjklóöőtúüűßä".includes(c)) {
                kotes = "t";
            } else {
                kotes = "k";
            }
        }
        else if ("BDIOÓÖŐSs".includes(prev)) {
            kotes = "k";
        } else {
            var fent = "boóöőrvwF".includes(prev);
            kotes = fent ? "f" : "l";
        }
        // console.log("pcn="+prev+c+next+", fent="+fent+", kotes="+kotes);
        if (c === 't' && next === 't') {
            c = ']';
            i++;
        }
        var colorCss = color ? " style=\"color: "+selectedColor+"\"" : "";
        if (wordStart && wordEnd) {
            output += "<span class=\"egy\""+colorCss+">"+c+"</span>";
        } else if (wordStart && !wordEnd) {
            output += "<span class=\"e\""+colorCss+">"+c+"</span>";
        } else if (!wordStart && !wordEnd) {
            output += "<span class=\""+kotes+"\""+colorCss+">"+c+"</span>";
        } else if (!wordStart && wordEnd) {
            output += "<span class=\""+kotes+"v\""+colorCss+">"+c+"</span>";
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
    console.log("refreshOutput()");
    getCssVariables();
    fillBackground(); // FIXME: fill background only once with max content?
    update();
}

function setContent(content) {
    if (content !== "") {
        console.log("setContent("+content+")");
        document.getElementById("input").innerHTML = content;
    }
}

function changeSettingVonalazas() {
    changeVonalazas();
    refreshOutput();
}

function setVonalazas(vonalazas) {
    if (isValidVonalazas(vonalazas)) {
        console.log("setVonalazas("+vonalazas+")");
        document.getElementById("settingVonalazas").value = vonalazas;
        changeVonalazas();
    }
}

function changeVonalazas() {
    var vonalazas = document.getElementById("settingVonalazas").value;
    console.log("changeVonalazas("+vonalazas+")");
    if (isValidVonalazas(vonalazas)) {
        document.getElementById("print").className = VONALAZAS_TO_CLASS.get(vonalazas);

        var defaultPage = VONALAZAS_DEFAULT_PAGE.get(vonalazas);
        document.getElementById("settingPage").value = defaultPage;

        var pageClass = PAGE_TO_CLASS.get(defaultPage);
        document.getElementById("page1").className = pageClass;
        document.getElementById("page2").className = pageClass;
    }
}

function isValidVonalazas(vonalazas) {
    return VONALAZAS_TO_CLASS.has(vonalazas);
}

function changeSettingColor() {
    setSelectedColor();
    refreshOutput(); // FIXME: won't be needed if color change is done by CSS
}

function setColor(color) {
    if (isValidColor(color)) {
        console.log("setColor("+color+")");
        var select = document.getElementById("settingColor");
        select.value = color;
        setSelectedColor();
    }
}

function setSelectedColor() {
    var color = document.getElementById("settingColor").value;
    console.log("setSelectedColor("+color+")");
    if (isValidColor(color)) {
        selectedColor = COLOR_TO_CSS.get(color);
    }
}

function isValidColor(color) {
    return COLOR_TO_CSS.has(color);
}

function changeSettingPage() {
    changePage();
    refreshOutput();
}

function setPage(page) {
    if (isValidPage(page)) {
        console.log("setPage("+page+")");
        var select = document.getElementById("settingPage");
        select.value = page;
        changePage();
    }
}

function changePage() {
    var page = document.getElementById("settingPage").value;
    console.log("changePage("+page+")");
    if (isValidPage(page)) {
        var pageClass = PAGE_TO_CLASS.get(page);
        document.getElementById("page1").className = pageClass;
        document.getElementById("page2").className = pageClass;
    }
}

function isValidPage(page) {
    return PAGE_TO_CLASS.has(page);
}

function changeSettingSima() {
    changeSima();
}

function setSima(sima) {
    if (typeof sima !== 'undefined') {
        console.log("setSima("+sima+")");
        var select = document.getElementById("settingSima");
        select.checked = sima=="1";
        changeSima();
    }
}

function changeSima() {
    function setDisplayForClass(cls, display) {
        var items = document.getElementsByClassName(cls);
        for(var i=0; i<items.length; i++) {
            items[i].style.display = display;
        }
    }

    var sima = document.getElementById("settingSima").checked;
    console.log("changeSima("+sima+")");
    var display =  sima ? "none" : null;
    setDisplayForClass("backgroundOuter", display);
    setDisplayForClass("sideMargins", display);
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function processParameters() {
    console.log("processParameters("+location.search+")");
    setContent(getUrlParameter("c"));
    setVonalazas(getUrlParameter("v"));
    setPage(getUrlParameter("p"));
    setColor(getUrlParameter("sz"));
    setSima(getUrlParameter("s"));
}

processParameters();
refreshOutput();

let VONALAZAS_SZ="sz";
let VONALAZAS_TO_CLASS = new Map();
VONALAZAS_TO_CLASS.set("1","osztaly1")
                  .set("2","osztaly2")
                  .set("3","osztaly3")
                  .set("4","osztaly4")
                  .set(VONALAZAS_SZ,"szotar")
                  .set("gyl1","gyl1")
                  .set("gyl2","gyl2");

let VONALAZAS_DEFAULT_PAGE = new Map();
VONALAZAS_DEFAULT_PAGE.set("1","a5")
                      .set("2","a5")
                      .set("3","a5")
                      .set("4","a5")
                      .set(VONALAZAS_SZ,"a5")
                      .set("gyl1","a4l")
                      .set("gyl2","a4l");

let PAGE_TO_CLASS = new Map();
PAGE_TO_CLASS.set("a5","pageA5")
             .set("a4l","pageA4-landscape")
             .set("a4p","pageA4");

let WORD_CHARACTERS = "aáäbcdeéfghiíjklmnoóöőpqrstuúüűvwxyzß" +
                      "AÁÄBCDEÉFGHIÍJKLMNOÓÖŐPQRSTUÚÜŰVWXYZ";
let NUMBERS = "0123456789";
let WORD_BOUNDARY = NUMBERS + "!\"'+,-.:;<=>? \n−/()";
let SUPPORTED_CHARACTERS = WORD_CHARACTERS + WORD_BOUNDARY;
let SPEC_COLOR = "%";
let SPECIAL_CHARACTERS = SPEC_COLOR;

let COLUMNS;
let ROWS;
let BACKGROUND_LINE_CHAR;
let BACKGROUND_BOTTOM_LINE_CHAR;

let selectedColor;
let COLOR_TO_CSS = new Map();
COLOR_TO_CSS.set("red","red")
            .set("green","#00e600")
            .set("blue","blue");
setSelectedColor();
// FIXME: when color is changed then update its css instead of regenerate the content

let settingSima = getSettingSima();
let settingDictionary = getSettingDictionary();
let settingVonalazas = getSettingVonalazas();

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
    let input = document.getElementById("input").value;
    let inputRows = input.split("\n");
    let outputRows = [];
    let leftRows = [];
    let rightRows = [];
    for (let row=0; row<inputRows.length; row++) {
        let input = inputRows[row];
        let match = input.match(/^(.*?)(?:\/\/(.*))?$/);
        if (typeof match[2] !== 'undefined') {
            outputRows.push("");
            leftRows.push(convertLine(match[1]));
            rightRows.push(convertLine(match[2]));
        }
        else {
            outputRows.push(convertLine(match[0]));
            leftRows.push("");
            rightRows.push("");
        }
    }

    // console.log("outputRows="+outputRows);
    // console.log("leftRows="+leftRows);
    // console.log("rightRows="+rightRows);

    document.getElementById("output1").innerHTML = outputRows.slice(0,ROWS).join("\n");
    document.getElementById("output2").innerHTML = outputRows.slice(ROWS,2*ROWS).join("\n");

    document.getElementById("left1").innerHTML = leftRows.slice(0,ROWS).join("\n");
    document.getElementById("left2").innerHTML = leftRows.slice(ROWS,2*ROWS).join("\n");

    document.getElementById("right1").innerHTML = rightRows.slice(0,ROWS).join("\n");
    document.getElementById("right2").innerHTML = rightRows.slice(ROWS,2*ROWS).join("\n");
}

function convertLine(input) {
    let output = "";
    if (typeof input == 'undefined') {
        return output;
    }
    for (let i=0; i<input.length; i++) {
        if (!SUPPORTED_CHARACTERS.includes(input.charAt(i))) {
            continue;
        }
        let prev = i>0 ? input.charAt(i-1) : null;
        let color = false;
        if (prev === SPEC_COLOR) {
            color = true;
            prev = i>1 ? input.charAt(i-2) : null;
        }
        let c = input.charAt(i);
        let next = i<input.length-1 ? input.charAt(i+1) : null;
        if (next === SPEC_COLOR) {
            next = i<input.length-2 ? input.charAt(i+2) : null;
            i++;
        }
        let wordStart = prev === null || WORD_BOUNDARY.includes(prev);
        let wordEnd = next === null || WORD_BOUNDARY.includes(next);
        if (WORD_BOUNDARY.includes(c)) {
            if (color) {
                wordStart = wordEnd = true;
            } else {
                output += c;
                continue;
            }
        }
        let kotes;
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
            let fent = "boóöőrvwF".includes(prev);
            kotes = fent ? "f" : "l";
        }
        // console.log("pcn="+prev+c+next+", fent="+fent+", kotes="+kotes);
        if (c === 't' && next === 't') {
            c = ']';
            i++;
        }
        let colorCss = color ? " style=\"color: "+selectedColor+"\"" : "";
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
    return output;
}

function fillBackgroundById(id) {
    let row = BACKGROUND_LINE_CHAR.repeat(COLUMNS).concat("\n");
    let background = row.repeat(ROWS-1);
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
    fillBackground();
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
    settingVonalazas = getSettingVonalazas();
    console.log("changeVonalazas("+settingVonalazas+")");
    if (isValidVonalazas(settingVonalazas)) {
        document.getElementById("print").className = VONALAZAS_TO_CLASS.get(settingVonalazas);

        let defaultPage = VONALAZAS_DEFAULT_PAGE.get(settingVonalazas);
        document.getElementById("settingPage").value = defaultPage;

        let pageClass = PAGE_TO_CLASS.get(defaultPage);
        document.getElementById("page1").className = pageClass;
        document.getElementById("page2").className = pageClass;
    }
    changeDictionary();
}

function getSettingVonalazas() {
    return document.getElementById("settingVonalazas").value;
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
        let select = document.getElementById("settingColor");
        select.value = color;
        setSelectedColor();
    }
}

function setSelectedColor() {
    let color = document.getElementById("settingColor").value;
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
        let select = document.getElementById("settingPage");
        select.value = page;
        changePage();
    }
}

function changePage() {
    let page = document.getElementById("settingPage").value;
    console.log("changePage("+page+")");
    if (isValidPage(page)) {
        let pageClass = PAGE_TO_CLASS.get(page);
        document.getElementById("page1").className = pageClass;
        document.getElementById("page2").className = pageClass;
    }
}

function isValidPage(page) {
    return PAGE_TO_CLASS.has(page);
}

function changeSettingSima() {
    changeSima();
    changeDictionary();
}

function setSima(sima) {
    if (typeof sima !== 'undefined') {
        console.log("setSima("+sima+")");
        let select = document.getElementById("settingSima");
        select.checked = (sima == "1");
        changeSima();
    }
}

function changeSima() {
    settingSima = getSettingSima();
    console.log("changeSima("+settingSima+")");
    let display =  settingSima ? "none" : null;
    setDisplayForClass("background", display);
    setDisplayForClass("sideMargins", display);
}

function getSettingSima() {
    return document.getElementById("settingSima").checked;
}

function changeSettingDictionary() {
    changeDictionary();
    refreshOutput();
}

function setDictionary(dictionary) {
    if (typeof dictionary !== 'undefined') {
        console.log("setDictionary("+dictionary+")");
        let select = document.getElementById("settingDictionary");
        select.checked = (dictionary == "1");
        changeDictionary();
    }
}

function changeDictionary() {
    settingDictionary = getSettingDictionary();
    console.log("changeDictionary("+settingDictionary+")");
    let display =  settingDictionary ? "block" : "none";
    setDisplayForClass("dictionaryLine", settingVonalazas === VONALAZAS_SZ && !settingSima ? "" : display);
}

function getSettingDictionary() {
    return document.getElementById("settingDictionary").checked;
}

function setDisplayForClass(cls, display) {
    console.log("setDisplayForClass("+cls+","+display+")");
    let items = document.getElementsByClassName(cls);
    for(let i=0; i<items.length; i++) {
        items[i].style.display = display;
    }
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function processParameters() {
    console.log("processParameters("+location.search+")");
    setContent(getUrlParameter("c"));
    setVonalazas(getUrlParameter("v"));
    setPage(getUrlParameter("p"));
    setColor(getUrlParameter("sz"));
    setSima(getUrlParameter("s"));
    setDictionary(getUrlParameter("d"));
}

processParameters();
refreshOutput();

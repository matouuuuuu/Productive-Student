
if (localStorage.getItem("user") === null) {
    // window.location.replace("connexion.html");
}

function disconnectFromApp() {
    localStorage.clear();
    window.location.replace("connexion.html");
}
//Dark mode/lightmode
const toggleSwitch = document.querySelector('#checkbox');

function switchTheme(e) {
    themeColor();
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); //add this
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'light') {
        toggleSwitch.checked = true;
    }
}




function refreshWidgetTomuss() {
    setTimeout(refreshWidgetTomuss, 1000);



    var elementcontent = document.querySelectorAll('.widgetTomuss');
    elementcontent.forEach(function (el) {
        var selec = el.getElementsByTagName('input')[0].value;


        var RSS_URL = "https://ptut.annwan.me/corsproxy?url=" + selec;


        if (selec.length >= 1) {
            fetch(RSS_URL)
                .then(response => response.text())
                .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
                .then(data => {


                    var elementcontent = data.querySelector('item:last-child');
                    var subject = elementcontent.getElementsByTagName('description')[0].innerHTML;
                    subject = subject.split(' ').slice(1).join(' ');
                    subject = subject.split(';').join('')
                    subject = subject.split(':').join('')
                    subject = subject.split('/').join('')
                    subject = subject.split('-').join(' ')
                    subject = subject.split(',').join(' ')
                    if (subject.charAt(0) == ' ') subject = subject.substring(1);
                    subject = subject.split(' ').slice(0, 3).join(' ');

                    var grade = elementcontent.getElementsByTagName('title')[0].innerHTML;
                    grade = grade.split(" ").pop();

                    el.getElementsByTagName('p')[1].innerHTML = subject;
                    el.getElementsByTagName('p')[2].innerHTML = grade;



                })
        }



    });

}
refreshWidgetTomuss();

function editModeTomuss(widget) {
    widget.getElementsByTagName('div')[2].style.display = "flex";
}
// revenir a la normale
function normalModeTomuss(ev, widget) {

    if (ev.key === 'Enter' || ev.keyCode === 13) {
        widget.parentNode.style.display = "none";

    }


}

function editModeCal(widget) {

    widget.getElementsByTagName('div')[14].style.display = "flex";
}
// revenir a la normale
function normalModeCal(ev, widget) {
    if (ev.key === 'Enter' || ev.keyCode === 13) {
        widget.parentNode.style.display = "none";
        exportWidget();
    }

}

// Celui s'occupe de refresh velov
function refreshWidget() {
    setTimeout(refreshWidget, 1000);



    var elementcontent = document.querySelectorAll('.widgetVelov');

    elementcontent.forEach(function (el) {
        var selec = el.getElementsByTagName('select')[0].value;
        if (selec.length > 0) {
            getVelo(selec).then(val => {
                // got value here
                el.getElementsByTagName('p')[0].innerHTML = val[2];
                el.getElementsByTagName('p')[2].innerHTML = val[0];
                el.getElementsByTagName('p')[4].innerHTML = val[1];
            }).catch(e => {
                // error
                el.getElementsByTagName('p')[0].innerHTML = "Nom de l'arret";
                el.getElementsByTagName('p')[2].innerHTML = "0";
                el.getElementsByTagName('p')[4].innerHTML = "0";
            });


        }





    });
    /////////////////////////////////////////////////////////

    var elementcontent = document.querySelectorAll('.widgetCal');
    elementcontent.forEach(function (el) {
        var selec = el.querySelector(".ade-link").value;
        ical(selec).then(val => {
            // got value here

            var x = Object.keys(val["events"]).length;
            eventsOftheday = val["events"];
            /*eventsOftheday.sort(function (a, b) {
                return parseInt(a["loc"].split(":")[0]) - parseInt(b["loc"].split(":")[0]);
            });*/
            for (i = 1; i <= x; i++) {
                var name = eventsOftheday[i - 1]["name"].split(' ');
                var salle = eventsOftheday[i - 1]["loc"].replace(/\\/, "");
                el.querySelector(".nameCours-" + i + "").innerHTML = name[1];
                el.querySelector(".salleCours-" + i + "").innerHTML = salle;
                el.querySelector(".heureCoursEt-" + i + "").innerHTML = eventsOftheday[i - 1]["et"];
                el.querySelector(".heureCoursSt-" + i + "").innerHTML = eventsOftheday[i - 1]["st"];
            }
        }).catch(e => {
            /*
            el.getElementsByTagName('p')[0].innerHTML = "Nom de l'arret";
            el.getElementsByTagName('p')[2].innerHTML = "0";
            el.getElementsByTagName('p')[4].innerHTML = "0";
            */
        });

    });

}
refreshWidget();

// permet d'afficher le prompt pour changer la station
function editMode(widget) {
    widget.getElementsByTagName('div')[0].style.display = "flex";
}
// revenir a la normale
function normalMode(widget) {

    widget.parentNode.style.display = "none";

}


// avoir les info depuis l'api
async function getVelo(borne) {

    var i;
    const api_url = 'https://api.jcdecaux.com/vls/v3/stations/' + borne + '?contract=lyon&apiKey=194a7148f397a3b536c0c129ef9bc69d42459963';
    const response = await fetch(api_url);
    const data = await response.json();
    var VeloD = data.totalStands.availabilities.bikes;
    var Place = data.totalStands.availabilities.stands;
    var Name = data.name;
    return [VeloD, Place, Name];
}




function addButtonClicked() {

    document.getElementById("addMenuSelectable").style.display = "inline";
    if (toggleRemove) {
        removeWidget();
    }

}

function openTCL() {

    document.getElementById("addMenuSelectable2").style.display = "inline";


}
var velovID = 0;

function addVelov(idGareVelo) {
    menuDisappear();
    velovID = velovID + 1;
    var x = document.getElementById("addMenu");
    x.insertAdjacentHTML('beforebegin', '<div ondblclick="editMode(this)" class="widgetVelov"><img src="images/logo-contract 1.png"><p>Nom de l arret</p><p>Vélo restants :</p><p>0</p><p>places libres :</p><p>0</p><div><p>Choisir une borne :</p><select id="' + velovID + '" onchange="normalMode(this)" placeholder="Lieu"><option></option></select></div></div>');
    var y = document.getElementById(velovID);
    for (index in example_array) {

        y.options[y.options.length] = new Option(example_array[index], index);
    }
    $(y).selectize({
        sortField: 'text'
    });
    console.log(y);
    $('#' + velovID + '').data('selectize').setValue(idGareVelo);
}

function addTomuss(link) {
    if (link == null) {
        link = "";
    }
    menuDisappear();
    var x = document.getElementById("addMenu");
    x.insertAdjacentHTML('beforebegin', '<div ondblclick="editModeTomuss(this)" class="widgetTomuss"><div><p>Dernière note</p><img src="images/Group.png"></div><div><p>Matiere</p><hr><p>0/20</p></div><div><p>Lien RSS :</p><input class="tommussInput"  onkeydown="normalModeTomuss(event,this)" placeholder="https://tomuss.univ-lyon1.fr/S/2020/Automne/rss/14f0a25dd2b2e23b" value="' + link + '" type="text"></div></div>');

}
function addTexteLibre(title, content) {
    if (title == null) {
        title = "texte libre";
    }
    if (content == null) {
        content = "Ecrivez un texte";
    }
    menuDisappear();
    var x = document.getElementById("addMenu");
    x.insertAdjacentHTML('beforebegin', '<div class="widgetText"> <div> <p class="title" contenteditable="true">' + title + '</p><img src="images/Group.png"> </div> <div> <p class="content" contenteditable="true">' + content + '</p> </div> </div>');

}

function addAlertTCL() {
    menuDisappear();
    var x = document.getElementById("addMenu");
    x.insertAdjacentHTML('beforebegin', '<div class="widgetalerteTCL" ><img src="images/tcllogo.png"><div><p>ALERTE RESEAU : CELA DEVRAIT S AFFICHER ICI</p></div></div>');

}

function addTCL() {
    menuDisappear();
    var x = document.getElementById("addMenu");
    x.insertAdjacentHTML('beforebegin', ' <div class="widgetTCL"><img src="images/tcllogo.png"><div><p>Prochains Trams :</p></div><div><div><p>T1</p><p>IUT FEYSSINE</p><p>6</p><p>min</p></div><div><p>T1</p><p>IUT FEYSSINE</p><p>6</p><p>min</p></div></div></div>');

}

function addCal(rss) {
    if (rss == null) {
        rss = "";
    }
    menuDisappear();
    var x = document.getElementById("addMenu");
    var nodeString = "<div ondblclick='editModeCal(this)' class='widgetCal'><div><p>Aujourd hui</p><img src='images/Groupcalendrier.png'></div><div><div><div><p class='nameCours-1'>PROG IHM</p><p class='salleCours-1'>S12</p></div><div><p class='heureCoursSt-1' >8:00</p><p> - </p><p class='heureCoursEt-1'>10:00</p></div></div><div><div><p class='nameCours-2' >JAVA</p><p class='salleCours-2'>S26</p></div><div><p class='heureCoursSt-2'>10:00</p><p> - </p><p class='heureCoursEt-2'>12:00</p></div></div><div><div><p class='nameCours-3'>Droit</p><p class='salleCours-3'>A47</p></div><div><p class='heureCoursSt-3'>13:30</p><p> - </p><p class='heureCoursEt-3'>15:30</p></div></div><div><div><p class='nameCours-4'>PHP</p><p class='salleCours-4'>S12</p></div><div><p class='heureCoursSt-4'>15:30</p><p> - </p><p class='heureCoursEt-4'>17h30</p></div></div></div><div><p>Lien iCal :</p><input class='ade-link' onkeyup='normalModeCal(event,this)' placeholder='https://ical' type='text' value='" + rss + "'></div></div>";
    x.insertAdjacentHTML('beforebegin', nodeString);

}


window.addEventListener('click', function (e) {
    if (document.getElementById("addButton").contains(e.target) || document.getElementById("addMenuSelectable").contains(e.target)) {
        // Clicked in box
    } else {
        menuDisappear();
    }
});

function menuDisappear() {
    document.getElementById("addMenuSelectable").style.display = "none";
    document.getElementById("addMenuSelectable2").style.display = "none";
}
var timeout;

function doStuff() {
    //doStuff 
    timeout = setTimeout(doStuff, 2000);

    var elementcontent = document.querySelectorAll('.widgetVelov, .widgetTomuss, .widgetTCL, .widgetalerteTCL,.widgetCal,.widgetText');
    elementcontent.forEach(function (el) {
        el.classList.add("giggleMode");

        el.addEventListener('click', removeWidgetFunc);

    });
}

// Ceci efface le widget

function removeWidgetFunc() {
    this.remove();

}

var toggleRemove = false;

function removeWidget() {

    if (toggleRemove == false) {
        document.getElementById("trash").setAttribute("src", "images/delete.png");
        doStuff()
        toggleRemove = true;
    } else {
        clearTimeout(timeout);
        document.getElementById("trash").setAttribute("src", "images/deleteclosed.png");
        var elementcontent = document.querySelectorAll('.widgetVelov, .widgetTomuss, .widgetTCL, .widgetalerteTCL,.widgetCal,.widgetText');
        elementcontent.forEach(function (el) {
            el.classList.remove("giggleMode");
            try {
                el.removeEventListener('click', removeWidgetFunc);
            } catch (error) {

            }

            toggleRemove = false;

        });

    }
}

async function exportWidget() {



    document.getElementById("loading").classList.add("show");
    var saveData = {};
    var elementcontent = document.querySelectorAll('#main-screen > div');
    var iteration = 0;
    elementcontent.forEach(function (el) {

        var wtype = el.classList;
        switch (wtype[0]) {
            case "widgetVelov":
                var subdata = {};
                var selec = el.getElementsByTagName('select')[0].value;
                subdata["apiKey"] = selec;
                var widgetInfo = { 'wtype': wtype[0], 'data': subdata };
                saveData[iteration] = widgetInfo;
                iteration = iteration + 1;
                break;
            case "widgetTomuss":
                var subdata = {};
                var selec = el.getElementsByTagName('input')[0].value;
                subdata["rssKey"] = selec;
                var widgetInfo = { 'wtype': wtype[0], 'data': subdata };
                saveData[iteration] = widgetInfo;
                iteration = iteration + 1;
                break;
            case "widgetText":
                var subdata = {};
                var content = el.querySelector(".content").innerHTML;
                var title = el.querySelector(".title").innerHTML;
                subdata["content"] = content;
                subdata["title"] = title;
                var widgetInfo = { 'wtype': wtype[0], 'data': subdata };
                saveData[iteration] = widgetInfo;
                iteration = iteration + 1;
                break;
            case "widgetTCL":
                var subdata = {};
                var selec = "nothing";
                subdata["apiKey"] = selec;
                var widgetInfo = { 'wtype': wtype[0], 'data': subdata };
                saveData[iteration] = widgetInfo;
                iteration = iteration + 1;
                break;
            case "widgetalerteTCL":
                var subdata = {};
                var selec = "nothing";
                subdata["apiKey"] = selec;
                var widgetInfo = { 'wtype': wtype[0], 'data': subdata };
                saveData[iteration] = widgetInfo;
                iteration = iteration + 1;
                break;
            case "widgetCal":
                var subdata = {};
                var selec = el.querySelector('.ade-link').value;;
                subdata["apiKey"] = selec;
                var widgetInfo = { 'wtype': wtype[0], 'data': subdata };
                saveData[iteration] = widgetInfo;
                iteration = iteration + 1;
                break;
            default:
            // code block
        }


    });
    var list = {
        "type": "user-save",
        "uid": "id de lutilisateur"
    };
    colorArray = {
        "accentColor": document.getElementById("accentColor").value,
        "backgroundColor": document.getElementById("backgroundColor").value,
        "backgroundElementColor": document.getElementById("backgroundElementColor").value,
        "backgroundButtonColor": document.getElementById("backgroundButtonColor").value,
        "foregroundColor": document.getElementById("foregroundColor").value,
        "borderColor": document.getElementById("borderColor").value


    };

    list["color"] = colorArray;
    list["customCSS"] = document.getElementById("cssPerso").value;
    saveData["userContent"] = list;
    id = localStorage.getItem('user')

    saveData = JSON.stringify(saveData);
    console.log(saveData);
    let answer = await fetch("https://" + window.location.host + "/save", {
        method: "POST",
        body: JSON.stringify({
            type: "user.save",
            token: id,
            save: saveData
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    console.log(answer.status);
    if (!answer.ok) {
        document.getElementById("loading").classList.remove("show");
        throw new Error("HTTP status " + answer.status);
        //document.getElementById("info").innerHTML = "Veuilllez rentrez un nom d'utilisateur valide.";
    } else {
        document.getElementById("loading").classList.remove("show");

    }

    /*
        const a = document.createElement("a");

        a.href = URL.createObjectURL(new Blob([JSON.stringify(saveData, null, 2)], {
            type: "text/plain"
        }));
        a.setAttribute("download", "data.txt");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        */

}

importWidget();

async function importWidget() {
    id = localStorage.getItem('user')

    let answer = await fetch("https://" + window.location.host + "/load", {
        method: "POST",
        body: JSON.stringify({
            token: id
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    console.log(answer.status);
    if (!answer.ok) {
        throw new Error("HTTP status " + answer.status);
        //document.getElementById("info").innerHTML = "Veuilllez rentrez un nom d'utilisateur valide.";
    } else {


    }
    var obj = await answer.json();
    console.log(obj);
    obj = JSON.parse(obj);
    console.log(obj);

    var x = Object.keys(obj).length;
    for (i = 0; i < x - 1; i++) {
        var wtype = obj[i]["wtype"];
        switch (wtype) {
            case "widgetVelov":
                addVelov(obj[i]["data"]["apiKey"]);
                break;
            case "widgetTCL":
                addTCL();
                break;
            case "widgetalerteTCL":
                addAlertTCL();
                break;
            case "widgetTomuss":
                addTomuss(obj[i]["data"]["rssKey"]);
                break;
            case "widgetText":
                addTexteLibre(obj[i]["data"]["title"], obj[i]["data"]["content"]);
                break;
            case "widgetCal":
                addCal(obj[i]["data"]["apiKey"]);
                break;
            default:
                break;
        }

    }
    // pour les couleurs
    console.log(obj["userContent"]["color"]);
    let root = document.documentElement;
    for (var key in obj["userContent"]["color"]) {

        var color = obj["userContent"]["color"][key];
        switch (key) {
            case 'accentColor':
                root.style.setProperty('--main-accent-color', color);
                document.getElementById("accentColor").setAttribute("value", color);
                break;
            case 'backgroundColor':
                root.style.setProperty('--main-bg-color', color);
                document.getElementById("backgroundColor").setAttribute("value", color);
                break;
            case 'backgroundElementColor':
                root.style.setProperty('--main-el-bg-color', color);
                document.getElementById("backgroundElementColor").setAttribute("value", color);
                break;
            case 'backgroundButtonColor':
                root.style.setProperty('--main-bt-bg-color', color);
                document.getElementById("backgroundButtonColor").setAttribute("value", color);
                break;
            case 'foregroundColor':
                root.style.setProperty('--main-text-color', color);
                document.getElementById("foregroundColor").setAttribute("value", color);
                break;
            case 'borderColor':
                root.style.setProperty('--main-border-color', color);
                document.getElementById("borderColor").setAttribute("value", color);
                break;
            case 'font':
                root.style.setProperty('--main-text-font', color);
                document.getElementById("font").setAttribute("value", color);
                break;
            default:
                break;
        }
    }

    document.getElementById("cssPerso").value = obj["userContent"]["customCSS"];
    customCSS();
}

function openSettings() {
    var x = document.getElementById("settings");
    x.classList.add("open");
}

function closeSettingMenu() {
    var x = document.getElementById("settings");
    x.classList.remove("open");

}

//ajout des elements drag
$('#colorSettings').draggable({
    cancel: '#textInput'
});
$('#cssSettings').draggable({
    cancel: '#cssPerso'
});



var drag = false;
function sort() {
    if (drag == true) {
        sortableDisable()
        drag = false;
    } else {
        sortableEnable();
        drag = true;
    }
}

function sortableEnable() {
    document.getElementById("dragAndDrop").classList.add("fillAccentColor");
    $("#main-screen").sortable({
        cancel: '#addMenu, .placeholder, .ade-link,.selectized,.tommussInput',
        items: ">div:not(#addMenu):not(.placeholder)",
        distance: 1,
        cursor: "pointer"
    });

    $("#main-screen").sortable("option", "disabled", false);
    // ^^^ this is required otherwise re-enabling sortable will not work!
    $("#main-screen").disableSelection();
    return false;
}

function sortableDisable() {
    document.getElementById("dragAndDrop").classList.remove("fillAccentColor")
    $("#main-screen").sortable("option", "disabled", true);
    return false;
}


/*
dragElement(document.getElementById("colorSettings"));


function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
*/
themeColor();

function themeColor() {


    document.getElementById("accentColor").setAttribute("value", getCSSColorVar("--main-accent-color"));
    document.getElementById("backgroundColor").setAttribute("value", getCSSColorVar("--main-bg-color"));
    document.getElementById("backgroundElementColor").setAttribute("value", getCSSColorVar("--main-el-bg-color"));
    document.getElementById("backgroundButtonColor").setAttribute("value", getCSSColorVar("--main-bt-bg-color"));
    document.getElementById("foregroundColor").setAttribute("value", getCSSColorVar("--main-text-color"));
    document.getElementById("borderColor").setAttribute("value", getCSSColorVar("--main-border-color"));

}

function getCSSColorVar(cssVar) {
    var x = getComputedStyle(document.documentElement).getPropertyValue(cssVar);
    x = x.replace(/\s+/g, '');
    return x;
}

function openPopup(id) {
    id.classList.add("show");
    closeSettingMenu();
}

function closePopup(id) {
    id.classList.remove("show");
    exportWidget();

}

function colorChanging(el) {
    let root = document.documentElement;
    switch (el.id) {
        case 'accentColor':
            root.style.setProperty('--main-accent-color', el.value);
            break;
        case 'backgroundColor':
            root.style.setProperty('--main-bg-color', el.value);
            break;
        case 'backgroundElementColor':
            root.style.setProperty('--main-el-bg-color', el.value);
            break;
        case 'backgroundButtonColor':
            root.style.setProperty('--main-bt-bg-color', el.value);
            break;
        case 'foregroundColor':
            root.style.setProperty('--main-text-color', el.value);
            break;
        case 'borderColor':
            root.style.setProperty('--main-border-color', el.value);
            break;
        case 'font':
            console.log(el.value)
            root.style.setProperty('--main-text-font', el.value);
            break;
        default:
            break;
    }
}


async function ical(ade) {

    var String = "http://adelb.univ-lyon1.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=";
    ade = ade.replace(String, '');
    ade = ade.split("&")[0];

    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    const _date = utc.split('/');
    const dateObj = { month: _date[1], day: _date[2], year: _date[0] };
    dayOffset = dateObj.day - 1;
    date = dateObj.year + '-' + dateObj.month + '-' + dayOffset;

    if (ade != '') {
        const response = await fetch("https://" + window.location.host + "/edt/for-group/" + ade + "/for-day/" + date + "", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();

        return data;
    }

}

function themeColorFromImport() {


    document.getElementById("accentColor").setAttribute("value",);
    document.getElementById("backgroundColor").setAttribute("value",);
    document.getElementById("backgroundElementColor").setAttribute("value",);
    document.getElementById("foregroundColor").setAttribute("value",);
    document.getElementById("borderColor").setAttribute("value",);

}

function customCSS() {
    try {
        var sheetToBeRemoved = document.getElementById('styleSheetId');
        var sheetParent = sheetToBeRemoved.parentNode;
        sheetParent.removeChild(sheetToBeRemoved);
    } catch (error) {
        console.log("notFound");
    }


    var sheet = document.createElement('style')
    sheet.setAttribute("id", "styleSheetId");
    sheet.innerHTML = document.getElementById("cssPerso").value;
    document.body.appendChild(sheet);



}


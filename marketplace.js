//Dark mode/lightmode
const toggleSwitch = document.querySelector('#checkbox');

function switchTheme(e) {
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



async function downloadSetTheme() {
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
    
    obj["userContent"]=matrixTheme["userContent"];

    saveData = JSON.stringify(obj);
    console.log(saveData);
    let answer2 = await fetch("https://" + window.location.host + "/save", {
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
    console.log(answer2.status);
    if (!answer2.ok) {
        throw new Error("HTTP status " + answer2.status);
        //document.getElementById("info").innerHTML = "Veuilllez rentrez un nom d'utilisateur valide.";
    } else {


    }
}

//Dark mode/lightmode
const toggleSwitch = document.querySelector('#checkbox');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); //add this
        document.getElementById("mainLogo").src = "images/logo1.png";
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
        document.getElementById("mainLogo").src = "images/logo1darkmode.png";
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'light') {
        document.getElementById("mainLogo").src = "images/logo1.png";
        toggleSwitch.checked = true;
    }
}

//Fonction qui permet de vérifier si l'utilisateur est connecter 
async function connect() {
    let name = document.getElementById("name").value;
    let pass = document.getElementById("pass").value;

    if (name != '' && pass != '') {
        let answer = await fetch("https://" + window.location.host + "/auth", {
            method: "POST",
            body: JSON.stringify({
                type: "user.request",
                username: name,
                passwd: pass
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        
        console.log(answer.status); // Will show you the status
        console.log(answer);
        if (!answer.ok) {
                throw new Error("HTTP status " + answer.status);
                //document.getElementById("info").innerHTML = "Veuilllez rentrez un nom d'utilisateur valide.";
         }  else  {
            let data = await answer.json()
            console.log(data);
            let uid = data.token
          
            localStorage.setItem("user", uid);
            document.location.href = "./index.html";
        } 
    } else {
        document.getElementById("info").innerHTML = "Un champ est mal remplie.";
    }
}

async function inscription() {
    let name = document.getElementById("name").value;
    let pass = document.getElementById("pass").value;

    if (name != '' && pass != '') {
        let answer = await fetch("https://" + window.location.host + "/register", {
            method: "POST",
            body: JSON.stringify({
                type: "user.register",
                username: name,
                passwd: pass
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!answer.ok) {
            throw new Error("HTTP status " + answer.status);
            //document.getElementById("info").innerHTML = "Veuilllez rentrez un nom d'utilisateur valide.";
     }  else  {
        
 
       document.location.href = "./connexion.html";
      
    } 
    } else {
        document.getElementById("info").innerHTML = "Un champ est mal remplie.";
    }
}

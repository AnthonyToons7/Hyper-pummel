let ready = false;
let winner = false;
let delay;
let desktopDelay;
let timer = 10000;
let clicks = 0;
let user;
let chosenType;
const player = {
    numberOfHits: "",
    hitFunction(player, pokey) {
        if (window.location.href.indexOf("solo-mode") > -1 && timer <= 0){return};
        if (!ready || winner) return;
        if (!pokey) return results(player);
        let hitsLeft = pokey.dataset.hits;
        hitsLeft = Number(hitsLeft) - 1;
        pokey.textContent = hitsLeft;
        pokey.dataset.hits = hitsLeft;
        if (hitsLeft <= 0) pokey.remove();
        const playerPokeys = document.querySelectorAll(`${player} .pokey`);
        if (!playerPokeys || playerPokeys.length == 0) return results(player);
        clicks++;
    }
};

function connScriptHandler(buttonPressed){
    document.querySelector(".controller-container").appendChild(document.getElementById("controller0"));
    document.querySelector(".left-arrow").style.display="block";
    
    if (buttonPressed == 1){
        if (window.location.href.indexOf("solo-mode") > -1 && chosenType == "keyboard") {return;}
        clearTimeout(delay)
        delay = setTimeout(() => {
            const player1Pokeys = document.querySelectorAll("#player-1 .pokey");
            player1.hitFunction("#player-1", player1Pokeys[player1Pokeys.length - 1]);
        }, 30);
    }
}

function registerUser(type, name){
    chosenType = type;
    let browserr = displayDetectedBrowsers();
    fetch(`/games/hyper-pummel/private/registerUser.php?type=${type}&name=${name}&browser=${browserr}`);
}
function updateCPS(cps){
    let browserr = displayDetectedBrowsers();
    fetch(`/games/hyper-pummel/private/updateCPS.php?cps=${cps}&user=${user}&type=${chosenType}&browser=${browserr}`);
}

function calculateCPS(){
    let clicksPerSecond = Number(clicks / 10);
    updateCPS(clicksPerSecond);
}

function startTimer() {
    const countdownElement = document.querySelector(".countdown-timer");

    const timerInterval = setInterval(() => {
    if (timer <= 0) {
        clearInterval(timerInterval);
        countdownElement.textContent = "0.00";
        calculateCPS();
    } else {
        const seconds = Math.floor(timer / 1000);
        const milliseconds = (timer % 1000) / 10;
        countdownElement.textContent = `${seconds}.${milliseconds.toFixed(2)}`;
        timer -= 10;
    }
    }, 10);
}


document.addEventListener("DOMContentLoaded", ()=>{
    const pokeyContainers = document.querySelectorAll(".pokey-container");
    let index = 0;
    pokeyContainers.forEach(container => {
        index++;
        for(let i = 0; i < 10 ; i++){
            const pokey = document.createElement("div");
            container.id=`player-${index}`;
            let number;
            window.location.href.indexOf("solo-mode") > -1 ? number = 20 : number = 7;
            if (index <= 1){
                for (const prop in player1) {
                    pokey[prop] = player1[prop];
                }
            } else {
                for (const prop in player2) {
                    pokey[prop] = player2[prop];
                }
            }
            pokey.textContent=number;
            pokey.classList.add("pokey");
            pokey.dataset.hits=number;
            container.appendChild(pokey);
        }
    });
    document.addEventListener("keyup",(ev)=>{
        if (window.location.href.indexOf("solo-mode") > -1 && chosenType == "controller") {return;}
        if (ev.key==" " || ev.keyCode == 32 || ev.code == "Space"){
            clearTimeout(desktopDelay);
            desktopDelay = setTimeout(() => {
                if (window.location.href.indexOf("solo-mode") > -1){
                    const player1Pokeys = document.querySelectorAll("#player-1 .pokey");
                    player1.hitFunction("#player-1", player1Pokeys[player1Pokeys.length - 1]);
                } else {
                    const player2Pokeys = document.querySelectorAll("#player-2 .pokey");
                    player2.hitFunction("#player-2", player2Pokeys[player2Pokeys.length - 1]);
                }
            }, 55);
        }
    });
    if (window.location.href.indexOf("solo-mode") > -1){
        document.getElementById("names").addEventListener("submit",(a)=>{
            a.preventDefault();
            const select = document.getElementById("type");
            const name = document.getElementById("name");

            user = name.value;

            registerUser(select.value, name.value);
            event.target.parentElement.remove();
            document.querySelector(".cover").remove();
        })
    }
});
function results(player){
    winner = true;
    document.querySelector("h1.countdown").textContent = `Congratulations! ${player.replace("#","").replace("-", " ")} won!`;
}
document.querySelector("button.ready-button").addEventListener("click", ()=>{
    document.querySelector("button.ready-button").style.display="none";

    let interval;
    let countdown = 2;
    const countdownContainer = document.querySelector("h1.countdown");
    interval=setInterval(() => {
        if (countdown == 0) {
            countdownContainer.textContent = "";
            ready=true;
            clearInterval(interval);
            if (window.location.href.indexOf("solo-mode") > -1){
                startTimer();
            }
            return;
        };
        countdownContainer.textContent=countdown;
        countdown--;
    },1000);
});
const player1 = Object.create(player);
const player2 = Object.create(player);


function detectBrowser() {
    const userAgent = window.navigator.userAgent;

    if (userAgent.includes("Chrome")) {
        return "Chrome";
    }
    else if (userAgent.includes("Firefox")) {
        return "Mozzarella Firefox";
    }
    else {
        return "Unknown Browser";
    }
}


function displayDetectedBrowsers() {
    return detectBrowser();
  }

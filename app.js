    const routes = document.querySelector("#routes");
const nearby = document.querySelector("#nearby");
const logo = document.querySelector("#logo");
const home = document.querySelector("#home");
const background = document.querySelector("#map-bg")
let startX = 0;
let startY = 0;
let homeOpen = true;
let routeOpen = false;
let nearbyOpen = false;

const overlay = document.querySelector("#overlay");
if (homeOpen === true){
    overlay.style.opacity = "0";
}
else if (homeOpen === false){
    overlay.style.opacity = "1";
}
function updateOverlay() {
    overlay.style.opacity = homeOpen ? "0" : "1";
}

document.addEventListener("touchstart",(e)=>{

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

});

document.addEventListener("touchend",(e)=>{

    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let dx = endX - startX;
    let dy = endY - startY;

    // links öffnen

    if(dx < -80 && homeOpen === true){

        routes.style.transition = "0.4s";
        routes.style.left = "0";
        logo.style.transition = "0.4s";
        logo.style.opacity = "0";
        background.style.transition = "0.4s";
        background.style.background = "white";
        routeOpen = true;
        homeOpen = false;
        updateOverlay();
        
    }

    // rechts schließen

    if(dx > 80 && homeOpen === false && routeOpen === true){

        routes.style.transition = "0.4s";
        routes.style.left = "100vw";
        logo.style.transition = "0.4s";
        logo.style.opacity = "1";
        background.style.transition = "0.4s";
        background.style.background = "#222";
        routeOpen = false;
        homeOpen = true;
        updateOverlay();
        
    }

    // hoch öffnen

    if(dy < -80 && homeOpen === true){

        nearby.style.transition = "0.4s";
        nearby.style.top = "0";
        logo.style.transition = "0.4s";
        logo.style.opacity = "0";
        background.style.transition = "0.4s";
        background.style.background = "white";
        nearbyOpen = true;
        homeOpen = false;
        updateOverlay();
      
    }

    // runter schließen

    if(dy > 80 && homeOpen === false && nearbyOpen === true){

        nearby.style.transition = "0.4s";
        nearby.style.top = "100vh";
        logo.style.transition = "0.4s";
        logo.style.opacity = "1";
        background.style.transition = "0.4s";
        background.style.background = "#222";
        nearbyOpen = false;
        homeOpen = true;
        updateOverlay();
        
    }

}
);



if(nearby.style.top ==="0"){
    nearbyOpen = true;
    routeOpen = false;
    homeOpen = false;
}
if(routes.style.left === "0"){
    routeOpen = true;
    homeOpen = false; 
    nearbyOpen = false;
}
if (nearbyOpen === false && routeOpen === false){
    homeOpen = true;
}else if (homeOpen === false && routeOpen === false){
    nearbyOpen = true;
}else if (homeOpen === false && nearbyOpen === false){
    routeOpen = true;
}
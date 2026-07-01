const routes = document.querySelector("#routes");
const nearby = document.querySelector("#nearby");
const logo = document.querySelector("#logo");
const home = document.querySelector("#home");
const overlay = document.querySelector("#overlay");
let startX = 0;
let startY = 0;
let homeOpen = true;
let routeOpen = false;
let nearbyOpen = false;

function updateOverlay() {
    overlay.style.opacity = homeOpen ? "0" : "1";
}

updateOverlay();


//Distanz berechnen

function toRad(value) {
    return value * Math.PI / 180;
}

function getDistanceMeters(lat1, lng1, lat2, lng2) {
    const earthRadius = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
}

function formatDistance(meters) {
    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)} km entfernt`;
    }
    return `${Math.round(meters)} m entfernt`;
}

async function geocodeAddress(address) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`, {
        headers: {
            "Accept-Language": "de"
        }
    });

    if (!response.ok) {
        throw new Error("Geocoding failed");
    }

    const data = await response.json();
    if (!data[0]) {
        throw new Error("Address not found");
    }

    return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
    };
}

async function updatePlaceDistances(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    const cards = document.querySelectorAll(".place-card");

    for (const card of cards) {
        const distanceEl = card.querySelector(".distance");
        if (!distanceEl) continue;

        const address = card.dataset.address;
        distanceEl.textContent = "Wird berechnet…";

        try {
            const { lat, lng } = await geocodeAddress(address);
            const distance = getDistanceMeters(userLat, userLng, lat, lng);
            distanceEl.textContent = formatDistance(distance);
        } catch (error) {
            distanceEl.textContent = "Adresse nicht verfügbar";
        }
    }
}

function showDistanceError() {
    document.querySelectorAll(".distance").forEach((el) => {
        el.textContent = "Standort nicht verfügbar";
    });
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        updatePlaceDistances(position);
    }, showDistanceError, {
        enableHighAccuracy: true,
        timeout: 10000
    });
} else {
    showDistanceError();
}

//ende

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
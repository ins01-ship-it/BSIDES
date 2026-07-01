const routes = document.querySelector("#routes");
const nearby = document.querySelector("#nearby");
const logo = document.querySelector("#logo");
const overlay = document.querySelector("#overlay");
let startX = 0;
let startY = 0;
let homeOpen = true;
let routeOpen = false;
let nearbyOpen = false;

const places = [
    { name: "Schlossplatz", lat: 52.2643, lng: 10.5236 },
    { name: "Löwenwall", lat: 52.2634, lng: 10.5248 },
    { name: "Kirschbaum-Allee", lat: 52.2647, lng: 10.5232 },
    { name: "Franki Bücherschrank", lat: 52.2640, lng: 10.5208 },
    { name: "Weißes Ross", lat: 52.2638, lng: 10.5195 },
    { name: "Studentenwohnheim Michaelishof", lat: 52.2523, lng: 10.5407 },
    { name: "Residenzschloss/Schlossarkaden", lat: 52.2555, lng: 10.5272 },
    { name: "Walhalla", lat: 52.2648, lng: 10.5334 },
    { name: "Kolonialdenkmal an der Jasperallee", lat: 52.2732, lng: 10.5337 },
    { name: "Wunderlauchfeld an der Ebertallee, Nussberg", lat: 52.2734, lng: 10.5318 },
    { name: "Nexus", lat: 52.2729, lng: 10.5265 },
    { name: "Jahnstraße", lat: 52.2672, lng: 10.5232 },
    { name: "Naturhistorisches Museum", lat: 52.2632, lng: 10.5228 },
    { name: "Altstadtmarkt", lat: 52.2643, lng: 10.5241 },
    { name: "Wendenring", lat: 52.2587, lng: 10.5301 },
    { name: "Kaiserstraße", lat: 52.2670, lng: 10.5357 }
];

function updateOverlay() {
    overlay.style.opacity = homeOpen ? "0" : "1";
}

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

function buildPlaceCards() {
    const container = document.querySelector("#place-list");
    if (!container) return;

    container.innerHTML = places.map((place) => `
        <div class="place-card" data-lat="${place.lat}" data-lng="${place.lng}">
            <h2>${place.name}</h2>
            <p class="distance">Standort wird ermittelt…</p>
        </div>
    `).join("");
}

function updatePlaceDistances(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    const cards = document.querySelectorAll(".place-card");

    cards.forEach((card) => {
        const distanceEl = card.querySelector(".distance");
        if (!distanceEl) return;

        const lat = parseFloat(card.dataset.lat);
        const lng = parseFloat(card.dataset.lng);
            const distance = getDistanceMeters(userLat, userLng, lat, lng);
            distanceEl.textContent = formatDistance(distance);
    });
}

function showDistanceError() {
    document.querySelectorAll(".distance").forEach((el) => {
        el.textContent = "Standort nicht verfügbar";
    });
}

buildPlaceCards();
updateOverlay();

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

document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let dx = endX - startX;
    let dy = endY - startY;

    if (dx < -80 && homeOpen === true) {
        routes.style.transition = "0.4s";
        routes.style.left = "0";
        logo.style.transition = "0.4s";
        logo.style.opacity = "0";

        routeOpen = true;
        homeOpen = false;
        updateOverlay();
    }

    if (dx > 80 && homeOpen === false && routeOpen === true) {
        routes.style.transition = "0.4s";
        routes.style.left = "100vw";
        logo.style.transition = "0.4s";
        logo.style.opacity = "1";

        routeOpen = false;
        homeOpen = true;
        updateOverlay();
    }

    if (dy < -80 && homeOpen === true) {
        nearby.style.transition = "0.4s";
        nearby.style.top = "0";
        logo.style.transition = "0.4s";
        logo.style.opacity = "0";

        nearbyOpen = true;
        homeOpen = false;
        updateOverlay();
    }

    if (dy > 80 && homeOpen === false && nearbyOpen === true) {
        nearby.style.transition = "0.4s";
        nearby.style.top = "100vh";
        logo.style.transition = "0.4s";
        logo.style.opacity = "1";

        nearbyOpen = false;
        homeOpen = true;
        updateOverlay();
    }
});

if (nearby.style.top === "0") {
    nearbyOpen = true;
    routeOpen = false;
    homeOpen = false;
}
if (routes.style.left === "0") {
    routeOpen = true;
    homeOpen = false; 
    nearbyOpen = false;
}
if (nearbyOpen === false && routeOpen === false) {
    homeOpen = true;
} else if (homeOpen === false && routeOpen === false) {
    nearbyOpen = true;
} else if (homeOpen === false && nearbyOpen === false) {
    routeOpen = true;
}
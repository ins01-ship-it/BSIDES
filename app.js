const routes = document.querySelector("#routes");
const nearby = document.querySelector("#nearby");
const logo = document.querySelector("#logo");
const overlay = document.querySelector("#overlay");
let startX = 0;
let startY = 0;
let homeOpen = true;
let routeOpen = false;
let nearbyOpen = false;
let lastPosition = null;

const places = [
    { name: "Schlossplatz", lat: 52.263435477338334, lng: 10.526912560591368, image: "images/Bilder-Kachel/Schlossplatz.jpg" },
    { name: "Löwenwall", lat: 52.259965782185674, lng: 10.531160758482834, image: "images/Bilder-Kachel/Löwenwall.jpg" },
    { name: "Kirschbaum-Allee", lat: 52.264140620822126, lng: 10.512969398257592, image: "images/Bilder-Kachel/Kirschbaum-Allee.png" },
    { name: "Franki Bücherschrank", lat: 52.2640, lng: 10.5208, image: "images/Bilder-Kachel/Bücherschrank.gif" },
    { name: "Weißes Ross", lat: 52.27258461526232, lng: 10.506436144762455, image: "images/Bilder-Kachel/Weißes Ross.png" },
    { name: "Studentenwohnheim Michaelishof", lat: 52.26083589130686, lng: 10.5149323524782, image: "images/Bilder-Kachel/Michaelishof.jpg" },
    { name: "Residenzschloss/Schlossarkaden", lat: 52.2646023240278, lng: 10.52876450569208, image: "images/Bilder-Kachel/Schlossarkaden.JPG" },
    { name: "Walhalla", lat: 52.25067746950721, lng: 10.533116567820066, image: "images/Bilder-Kachel/FLINTA Sk8.jpg" },
    { name: "Kolonialdenkmal an der Jasperallee", lat: 52.2697727011103, lng: 10.546490552228796, image: "images/Bilder-Kachel/Kolonialdenkmal.jpg" },
    { name: "Wunderlauchfeld an der Ebertallee, Nussberg", lat: 52.27047411273886, lng: 10.556453251247943, image: "images/Bilder-Kachel/Wunderlauchfeld.jpeg" },
    { name: "Nexus", lat: 52.250711891020686, lng: 10.510508213064814, image: "images/Bilder-Kachel/Nexus.jpg" },
    { name: "Jahnstraße", lat: 52.24975405757498, lng: 10.505342923322987, image: "images/Bilder-Kachel/Jahnstraße.png" },
    { name: "Naturhistorisches Museum", lat: 52.27529138046867, lng: 10.529079268744166, image: "images/Bilder-Kachel/Naturhistorisches Museum.jpg" },
    { name: "Altstadtmarkt", lat: 52.2643, lng: 10.5241, image: "images/Bilder-Kachel/Altstadtmarkt.png" },
    { name: "Wendenring", lat: 52.2587, lng: 10.5301, image: "images/Bilder-Kachel/Wendenring.png" },
    { name: "Kaiserstraße", lat: 52.2670, lng: 10.5357, image: "images/Bilder-Kachel/Kaiserstraße.png" }
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
        <a class="place-card" href="https://www.google.com/search?q=${encodeURIComponent(place.name + " Braunschweig")}" target="_blank" rel="noopener noreferrer" data-lat="${place.lat}" data-lng="${place.lng}">
            <img class="place-image" src="${place.image || "images/path.jpg"}" alt="${place.name}" loading="lazy">
            <div class="place-content">
                <h2>${place.name}</h2>
                <p class="distance">Standort wird ermittelt…</p>
            </div>
        </a>
    `).join("");

    container.scrollLeft = 0;
}

function resetNearbyListPosition() {
    const container = document.querySelector("#place-list");
    if (!container) return;

    container.scrollLeft = 0;
}

function sortPlaceCards(position) {
    const container = document.querySelector("#place-list");
    if (!container) return;

    const cards = Array.from(container.querySelectorAll(".place-card"));
    if (!cards.length || !position) return;

    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    cards.forEach((card) => {
        const distanceEl = card.querySelector(".distance");
        if (!distanceEl) return;

        const lat = parseFloat(card.dataset.lat);
        const lng = parseFloat(card.dataset.lng);
        const distance = getDistanceMeters(userLat, userLng, lat, lng);

        card.dataset.distance = distance;
        distanceEl.textContent = formatDistance(distance);
    });

    cards.sort((a, b) => parseFloat(a.dataset.distance || 0) - parseFloat(b.dataset.distance || 0));
    cards.forEach((card) => container.appendChild(card));
}

function updatePlaceDistances(position) {
    lastPosition = position;
    sortPlaceCards(position);
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
        resetNearbyListPosition();

        if (lastPosition) {
            sortPlaceCards(lastPosition);
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(updatePlaceDistances, showDistanceError, {
                enableHighAccuracy: true,
                timeout: 10000
            });
        }
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
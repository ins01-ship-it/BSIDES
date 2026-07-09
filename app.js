const routes = document.querySelector("#routes");
const nearby = document.querySelector("#nearby");
const logo = document.querySelector("#logo");
const overlay = document.querySelector("#overlay");
const arrows = document.querySelectorAll(".arrow, .arrow2, .arrow3, .arrow4");
let startX = 0;
let startY = 0;
let homeOpen = true;
let routeOpen = false;
let nearbyOpen = false;
let lastPosition = null;

const places = [
    { name: "Schlossplatz", lat: 52.263435477338334, lng: 10.526912560591368, image: "images/Bilder-Kachel/Schlossplatz.jpg", link: "placeholder.html?place=schlossplatz" },
    { name: "Löwenwall", lat: 52.259965782185674, lng: 10.531160758482834, image: "images/Bilder-Kachel/Löwenwall.jpg", link: "placeholder.html?place=loewenwall" },
    { name: "Kirschbaum-Allee", lat: 52.264140620822126, lng: 10.512969398257592, image: "images/Bilder-Kachel/Kirschbaum-Allee.jpeg", link: "placeholder.html?place=kirschbaum-allee" },
    { name: "Franki Bücherschrank", lat: 52.253462923702884, lng: 10.510528496151975, image: "images/Bilder-Kachel/Bücherschrank.gif", link: "placeholder.html?place=franki-buecherschrank" },
    { name: "Weißes Ross", lat: 52.27258461526232, lng: 10.506436144762455, image: "images/Bilder-Kachel/Ross.png", link: "placeholder.html?place=weisses-ross" },
    { name: "Michaelishof", lat: 52.26083589130686, lng: 10.5149323524782, image: "images/Bilder-Kachel/Michaelishof.jpg", link: "placeholder.html?place=michaelishof" },
    { name: "Schlossarkaden", lat: 52.2646023240278, lng: 10.52876450569208, image: "images/Bilder-Kachel/Schlossarkaden.png", link: "placeholder.html?place=schlossarkaden" },
    { name: "Walhalla", lat: 52.25067746950721, lng: 10.533116567820066, image: "images/Bilder-Kachel/Skate.gif", link: "placeholder.html?place=walhalla" },
    { name: "Liberating the Monument", lat: 52.2697727011103, lng: 10.546490552228796, image: "images/Bilder-Kachel/Kolonialdenkmal.jpg", link: "placeholder.html?place=liberating-the-monument" },
    { name: "Wunderlauchfeld an der Ebertallee, Nussberg", lat: 52.26765299237686, lng: 10.561003331540446, image: "images/Bilder-Kachel/Lauch.jpeg", link: "placeholder.html?place=wunderlauchfeld" },
    { name: "Nexus", lat: 52.250711891020686, lng: 10.510508213064814, image: "images/Bilder-Kachel/Nexus.jpg", link: "placeholder.html?place=nexus" },
    { name: "Jahnstraße", lat: 52.24975405757498, lng: 10.505342923322987, image: "images/Bilder-Kachel/jahnstraße.png", link: "placeholder.html?place=jahnstrasse" },
    { name: "Naturhistorisches Museum", lat: 52.27529138046867, lng: 10.529079268744166, image: "images/Bilder-Kachel/Naturhistorisches Museum.jpg", link: "placeholder.html?place=naturhistorisches-museum" },
    { name: "Das Atelier", lat: 52.26040284877345, lng: 10.535146627884695, image: "images/Bilder-Kachel/Atelier.jpg", link: "placeholder.html?place=das-atelier" },
    { name: "Rednerpult Prinzenpark", lat: 52.27170497738349, lng: 10.553943008212302, image: "images/Bilder-Kachel/Rednerpult Prinzenpark.jpeg", link: "placeholder.html?place=wendenring" },
    { name: "Fliegerhorst", lat: 52.250863376843604, lng: 10.491093573006431, image: "images/Bilder-Kachel/stig.jpg", link: "placeholder.html?place=fliegerhorst" }
];

function updateOverlay() {
    overlay.style.opacity = homeOpen ? "0" : "1";
    arrows.forEach((arrow) => {
        arrow.style.opacity = homeOpen ? "1" : "0";
    });
}

function openRoutesSection() {
    routes.style.transition = "0.4s";
    routes.style.left = "0";
    logo.style.transition = "0.4s";
    logo.style.opacity = "0";

    routeOpen = true;
    homeOpen = false;
    nearbyOpen = false;
    updateOverlay();
}

function openHomeSection() {
    routes.style.transition = "0.4s";
    routes.style.left = "100vw";
    nearby.style.transition = "0.4s";
    nearby.style.top = "100vh";
    logo.style.transition = "0.4s";
    logo.style.opacity = "1";

    routeOpen = false;
    nearbyOpen = false;
    homeOpen = true;
    updateOverlay();
}

function openNearbySection() {
    nearby.style.transition = "0.4s";
    nearby.style.top = "0";
    logo.style.transition = "0.4s";
    logo.style.opacity = "0";

    nearbyOpen = true;
    homeOpen = false;
    routeOpen = false;
    updateOverlay();
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
        <div class="place-card" data-link="${place.link || "placeholder.html"}" data-lat="${place.lat}" data-lng="${place.lng}">
            <img class="place-image" src="${place.image || "images/path.jpg"}" alt="${place.name}" loading="lazy">
            <div class="place-content">
                <h2>${place.name}</h2>
                <p class="distance">Standort wird ermittelt…</p>
                <a class="place-map-link" href="https://www.google.com/maps?q=${place.lat},${place.lng}" target="_blank" rel="noopener noreferrer">Wo?</a>
            </div>
        </div>
    `).join("");

    container.scrollLeft = 0;
}

function handlePlaceCardClick(event) {
    const linkButton = event.target.closest(".place-map-link");
    if (linkButton) {
        event.stopPropagation();
        return;
    }

    const card = event.target.closest(".place-card");
    if (card) {
        window.location.href = card.dataset.link || "placeholder.html";
    }
}

document.addEventListener("click", handlePlaceCardClick);

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

const requestedSection = sessionStorage.getItem("bsides-open-section");
if (requestedSection === "routes") {
    openRoutesSection();
    sessionStorage.removeItem("bsides-open-section");
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
        openRoutesSection();
    }

    if (dx > 80 && homeOpen === false && routeOpen === true) {
        openHomeSection();
    }

    if (dy < -80 && homeOpen === true) {
        openNearbySection();
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
        openHomeSection();
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


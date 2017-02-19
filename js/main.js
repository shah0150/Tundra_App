// html
let imageElement = null;
let textElement = null;
let imgUrl = null;

// data
let profiles = [];
let LOCAL_STORAGE_KEY = 'shah0150';
let localMaybes = null;

// fetch
let gender = "";
// ^ female or male or blank for both
let url = "https://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=" + gender;

// flow control
let firstShown = false;

// top level function
document.addEventListener('DOMContentLoaded', init);

function init() {
    imageElement = document.getElementById("image");
    textElement = document.getElementById("text");
    addSwipe(document.getElementById("intheway"));
    getProfiles();

    localMaybes = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localMaybes) {
        localMaybes = JSON.parse(localMaybes);
        console.log('local storage already stored:', localMaybes);
    } else {
        localMaybes = [];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localMaybes));
        console.log('local storage initialized:', localMaybes);
    }
}

function saveToLocal(profile) {
    localMaybes.unshift(profile);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localMaybes));
    console.log('local storage someone added:', localMaybes);
}

function getProfiles() {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            profiles = Array.prototype.concat(profiles, data.profiles);
            imgUrl = decodeURIComponent(data.imgBaseURL);
            // asyncronous nature of this needs separating out.
            dataReturnEvent();
        })
        .catch(function (err) {
            alert(err.message);
        });
}

function dataReturnEvent() {
    if (!firstShown) {
        showFirst();
        firstShown = true;
    }
}

function showFirst() {
    imageElement.innerHTML = "";
    textElement.innerHTML = "";
    if (profiles.length == 0) {
        textElement.innerHTML = "none currently available";
        return;
    }
    person = profiles[0];
    textElement.innerHTML = person.first + " " + person.last + '<br><small>' + person.distance + '</small>';

    let img = document.createElement("img");
    img.src = imgUrl + person.avatar;
    imageElement.appendChild(img);
}

// processing user events
function next() {
    profiles.shift();
    showFirst();
    if (profiles.length < 3) {
        getProfiles();
    }
}

function sayNo() {
    next();
}

function sayMaybe() {
    saveToLocal(profiles[0]);
    next();
}

// setting up swipe events
function addSwipe(element) {
    var region = ZingTouch.Region(element, true, false);
    var swipe = new ZingTouch.Swipe({
        numInputs: 1,
        maxRestTime: 100,
        escapeVelocity: 0.1
    });
    region.bind(element, swipe, swipeEvent);
}

function swipeEvent(ev) {
    let vel = ev.detail.data[0].velocity;
    let dir = ev.detail.data[0].currentDirection;
    if (dir > 270 || dir < 90) {
        sayMaybe();
    } else {
        sayNo();
    }
}

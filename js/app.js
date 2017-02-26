let gender = ""; //female or male or blank for both
let url = "http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=female" + gender;
let profiles = [];
let imgurl = "";
var savedProfileList = [];

function getProfiles() {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            imgurl = decodeURIComponent(data.imgBaseURL);

            profiles = data.profiles;

            showSingleProfile();

        })
        .catch(function (err) {
            alert(err.message);
        });
}

getProfiles();


function showList() {

    document.getElementById("list").className = "tab-item active";
    document.getElementById("single").className = "tab-item";

    var par = document.querySelector("#output");
    par.innerHTML = "";

    var savedProfiles = JSON.parse(localStorage.getItem("shah0150"));

    if (savedProfiles == null || savedProfiles == "") {

        par.innerHTML = "<br><br><br>No Matches, Start Swiping!"
    } else {

        savedProfiles.forEach(function (person) {
            let img = document.createElement("img");
            let p = document.createElement("p");

            p.id = "listView";

            let name = "".concat(person.first, " ", person.last);
            img.src = imgurl + person.avatar;

            let trash = document.createElement("span");
            trash.className = "icon icon-trash";

            p.appendChild(trash);
            p.appendChild(img);

            p.innerHTML += " " + name;
            document.getElementById("output").appendChild(p);

            p.addEventListener("click", function () {

                findAndRemove(savedProfiles, 'first', person.first, 'last', person.last);
                findAndRemove(savedProfileList, 'first', person.first, 'last', person.last);

                localStorage.setItem("shah0150", JSON.stringify(savedProfiles));

                showList();
            });
        });
    }
}

function findAndRemove(array, property1, value1, property2, value2) {
    array.forEach(function (result, index) {

        if (result[property1] === value1 && result[property2] === value2) {

            array.splice(index, 1);
        }
    });
}

function showSingleProfile() {

    document.getElementById("single").className = "tab-item active";
    document.getElementById("list").className = "tab-item";

    var par = document.querySelector("#output");
    par.innerHTML = "";

    if (profiles.length < 3) {

        getProfiles();
    } else {

        let person = profiles[0];
        let img = document.createElement("img");
        let p = document.createElement("p");

        p.id = "singleView";

        let name = "".concat(person.first, " ", person.last);
        let distance = "Distance: " + person.distance;
        let gender = "Gender: " + person.gender;

        img.src = imgurl + person.avatar;
        p.appendChild(img);
        p.innerHTML += " " + name + "<br>" + distance + "<br>" + gender;
        document.getElementById("output").appendChild(p);

        letSwipe();
    }
}

function letSwipe() {

    var swipeArea = document.querySelector('#singleView');
    var activeRegion = ZingTouch.Region(swipeArea);

    activeRegion.bind(swipeArea, 'pan', function (e) {

        let angle = e.detail.data[0].directionFromOrigin;

        if ((angle >= 315 && angle <= 360) || (angle <= 45 && angle >= 0)) {

            savedProfileList.push(profiles[0]);

            localStorage.setItem("shah0150", JSON.stringify(savedProfileList));

            profiles.shift();

            var par = document.querySelector("#output");

            par.innerHTML = "<br><br><br>SAVED!";

            setTimeout(function () {

                par.innerHTML = "";

                showSingleProfile();

            }, 470);
        } else if (angle >= 135 && angle <= 225) {

            profiles.shift();

            var par = document.querySelector("#output");

            par.innerHTML = "<br><br><br>DELETED!";

            setTimeout(function () {

                par.innerHTML = "";

                showSingleProfile();

            }, 470);
        }
    });
}

document.querySelector("#list").addEventListener('click', function (ev) {

    showList();
});

document.querySelector("#single").addEventListener('click', function (ev) {

    showSingleProfile();
});

'use strict'

let launchData; // JSON from LaunchLibrary
let weatherData; // JS Object to hold a reference to a launch ID and its associated weather forecast
let map; // GoogleMap
let mapLoaded = false;

function setupLaunchList(launchData) {
    launchData.forEach(launch => {
        console.log(launch);
        $('#js-launch-list').append(
            `
            <div class="launch-list-item">
            <h1>${launch.name}</h1>
            <p>${launch.missions[0] ? launch.missions[0].description : 'Mission description is unavailable.'}</p>
            <p>Launch window: <date>${launch.windowstart} to ${launch.windowend}</p>
            </div>
            `
        );
    });
}

function addMapMarkers(launchData) {
    console.log(`mapLoaded: ${mapLoaded}`);
    console.log(`launchData length: ${launchData.length}`);
    // Per: https://developers.google.com/maps/documentation/javascript/earthquakes
    for(let i = 0; i < launchData.length; i++) {
        let lat, lng, latLng;
        lat = launchData[i].location.pads[0].latitude;
        lng = launchData[i].location.pads[0].longitude;
        console.log(lat, lng);
        latLng = new google.maps.LatLng(lat, lng);
        let marker = new google.maps.Marker({position: latLng, map: map});
    }
}

function setupApplication() {
    console.log('setupApplication()');
    // TODO:
    // Make requests to weather API based on the location data for each launch
    // merge that weather data with the launch data object
    //

    console.log("Making initial call to launchLibrary");
    fetch('https://launchlibrary.net/1.4/launch/next/5')
    .then(response => response.json())
    .then(rjson => {
        launchData = rjson.launches; // launches is the name of the array of launch elements
        addMapMarkers(launchData);
        setupLaunchList(launchData);
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('js-map-inner'), {center: {lat: 30.2672, lng: -97.7431}, zoom: 3});
    map.style.position = 'fixed';
    mapLoaded = true;
}

$(setupApplication);
'use strict'

let launchData; // JSON from LaunchLibrary
let map; // GoogleMap
let mapLoaded = false;


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
    // Make request to LaunchLibrary.net for upcoming launches
    // process the LaunchLibrary data into a new JS object - launch data
    // Make requests to weather API based on the location data for each launch
    // merge that weather data with the launch data object
    //

    console.log("Making initial call to launchLibrary");
    fetch('https://launchlibrary.net/1.4/launch/next/5')
    .then(response => response.json())
    .then(rjson => {
        launchData = rjson.launches;
        addMapMarkers(launchData);
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('js-map'), {center: {lat: 30.2672, lng: 97.7431}, zoom: 3});
    mapLoaded = true;
}

$(setupApplication);
'use strict'

let launchData; // JSON from LaunchLibrary
let weatherData; // JS Object to hold a reference to a launch ID and its associated weather forecast
let map; // GoogleMap
let markerList = {};
let mapLoaded = false;

function setupLaunchList(launchData) {
    launchData.forEach(launch => {
        console.log(launch);
        $('#js-launch-list').append(
            `
            <div class="launch-list-item" >
            <h1>${launch.name}</h1>
            <p>${launch.missions[0] ? launch.missions[0].description : 'Mission description is unavailable.'}</p>
            <p>Launch window: <date>${launch.windowstart} to ${launch.windowend}</p>
            </div>
            `
        );
    });
}

function setupMapMarkers(launchData) {
    console.log(`mapLoaded: ${mapLoaded}`); // 'debugging' to make sure the map hs benn through init
    console.log(`launchData length: ${launchData.length}`); // How many elements are in launchData
    // Per: https://developers.google.com/maps/documentation/javascript/earthquakes
    // Loop through the elements of launchData, extract the pad locations, create LatLng objects, and add a marker to the map
    for(let i = 0; i < launchData.length; i++) {
        //let lat, lng, latLng;
        let lat = launchData[i].location.pads[0].latitude;
        let lng = launchData[i].location.pads[0].longitude;
        //console.log(lat, lng);
        let latLng = new google.maps.LatLng(lat, lng);
        let marker = new google.maps.Marker({position: latLng, map: map});
        // Finally, create an object whose keys are launchData.id and value is a reference to the marker
        markerList[launchData[i].id] = marker;
    }
    console.log(markerList);
}

function setupClickListeners() {
    $('.launch-list-item').click(event => {
        console.log('Clicked a launchList item');
    });
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
        setupMapMarkers(launchData);
        setupLaunchList(launchData);
        setupClickListeners();
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('js-map-inner'), {center: {lat: 30.2672, lng: -97.7431}, zoom: 3});
    //map.style.position = 'fixed';
    mapLoaded = true;
}

$(setupApplication);
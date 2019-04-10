'use strict'

let launchData; // JSON from LaunchLibrary
//let weatherData; // JS Object to hold a reference to a launch ID and its associated weather forecast
let map; // GoogleMap
let markerList = {}; // key: launch id from LaunchLibray, value: reference to associated GoogleMap marker
let mapLoaded = false;
let currentSelectedListItem = null;

function setupLaunchList(launchData) {
    launchData.forEach(launch => {
        console.log(launch);
        $('#js-launch-list')
            .append(
                `
                <div class="launch-list-item" data-id="${launch.id}">
                <h1>${launch.name}</h1>
                <p>${launch.missions[0] ? launch.missions[0].description : 'Mission description is unavailable.'}</p>
                <p>Launch window: <date>${launch.windowstart} to ${launch.windowend}</p>
                </div>
                `
            );
    });
}

function setupMapMarkers(launchData) {
    console.log(`mapLoaded: ${mapLoaded}`); // 'debugging' to make sure the map has been through init
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

function highlightLaunchListElement(element) {
    if(currentSelectedListItem) {
        currentSelectedListItem.removeClass('launch-list-item-selected');
    }
    currentSelectedListItem = element;
    currentSelectedListItem.addClass('launch-list-item-selected');
}

function launchListClickEvents() {
    // User clicks a launchList item: zoom and center the map to the correct marker, highlight the list item
 $('.launch-list-item').click(function(e) {
     console.log(`list item id: ${$(this).data('id')}`);
     let marker = markerList[$(this).data('id')];
     map.setZoom(10);
     map.setCenter(marker.getPosition());
     highlightLaunchListElement($(this));
 });
}

function setupEventListeners() {
    launchListClickEvents();
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
        setupEventListeners();
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('js-map-inner'), {center: {lat: 30.2672, lng: -97.7431}, zoom: 2});
    //map.style.position = 'fixed';
    mapLoaded = true;
}

$(setupApplication);
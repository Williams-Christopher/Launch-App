'use strict'

let baseUrl = 'https://launchlibrary.net/1.4/';
let launchData; // JSON from LaunchLibrary
let map; // GoogleMap reference
let markerList = {}; // key: launch id from LaunchLibray, value: reference to associated GoogleMap marker
let currentSelectedListItem = null;
let mapInitialZoom = 2;
let mapMarkerSelectZoom = 15;

function setupLaunchList(launchData) {
    launchData.forEach(launch => {
        $('#js-launch-list')
            .append(
                `
                <div class="launch-list-item" data-id="${launch.id}">
                <h1>${launch.name}</h1>
                <p>${launch.missions[0] ? launch.missions[0].description : 'Mission description is unavailable.'}</p>
                <p>Launch window: <time datetime="${launch.windowstart}">${launch.windowstart}</time> to <time datetime="${launch.windowend}">${launch.windowend}</time> <a href="${baseUrl + 'calendar/' + launch.id}" target="_blank">[Add to calendar - .ics]</a></p>
                ${(launch.rocket.agencies !== null) ? (launch.rocket.agencies[0]) ? `<p>Rocket agency: <a href="${launch.rocket.agencies[0].wikiURL}" target="_blank">${launch.rocket.agencies[0].name}</a></p>` : '' : ''}
                ${launch.missions[0] ? (launch.missions[0].agencies !== null) ? (launch.missions[0].agencies[0]) ? `<p>Mission agency: <a href="${launch.missions[0].agencies[0].wikiURL}" target="_blank">${launch.missions[0].agencies[0].name}</a></p>` : '' : '' : ''}
                ${launch.vidURLs[0] ? `<p>Watch this launch: <a href="${launch.vidURLs[0]}" target="_blank">${launch.vidURLs[0]}</a></p>` : ''}
                </div>
                `
            );
    });
}

function setupMapMarkers(launchData) {
    // Per: https://developers.google.com/maps/documentation/javascript/earthquakes
    // Loop through the elements of launchData, extract the pad locations, create LatLng objects, and add a marker to the map
    for(let i = 0; i < launchData.length; i++) {
        let lat = launchData[i].location.pads[0].latitude;
        let lng = launchData[i].location.pads[0].longitude;
        let latLng = new google.maps.LatLng(lat, lng);
        let marker = new google.maps.Marker({position: latLng, map: map});
        marker.addListener('click', mapMarkerClickEvent);
        // Finally, create an object whose keys are launchData.id and value is a reference to the marker
        markerList[launchData[i].id] = marker;
    }
}

function highlightLaunchListElement(element, isScroll = true) {
    if(currentSelectedListItem) {
        currentSelectedListItem.removeClass('launch-list-item-selected');
    }
    currentSelectedListItem = element;
    currentSelectedListItem.addClass('launch-list-item-selected');
    if(isScroll) {
        scrollSelectedElementToTop(element);
    }
}

function scrollSelectedElementToTop(element) {
    // find the difference between the top of list item to scroll to and the top of the launch list div. Let jQuery animate moving the top of the list item to the new position.
    $($([document.documentElement, document.body])).animate({scrollTop: ($(element).offset().top - 5) - $(element).parent().offset().top + $(element).parent().scrollTop()});
}

function launchListClickEvents() {
    // User clicks a launchList item: zoom and center the map to the correct marker, highlight the list item
    $('.launch-list-item').click(function(e) {
        let marker = markerList[$(this).data('id')];
        map.setZoom(mapMarkerSelectZoom);
        map.setCenter(marker.getPosition());
        highlightLaunchListElement($(this), false);
    });
}

let mapMarkerClickEvent = function() {
    map.setZoom(mapMarkerSelectZoom);
    map.setCenter(this.getPosition());
    findKeyForMarker(this);
}

function findKeyForMarker(marker) {
    let keys = Object.keys(markerList);
    let launchListElementId = keys.filter(key => markerList[key] === marker);
    findLaunchListItemForId(launchListElementId[0]);
}

function findLaunchListItemForId(id) {
    let launchListElement = $('#js-launch-list').children(`[data-id="${id}"]`);
    highlightLaunchListElement(launchListElement);
}

function aboutSplashClickEvents() {
    $('#js-about-overlay').on ('click', toggleAboutSplashDisplay);
    
    // Stop event bubbling when a link is clicked on the About splash
    $('#js-about-overlay a').click(function(e) {
        e.stopPropagation();
    })
}

function toggleAboutSplashDisplay() {
    $('#js-about-overlay').toggleClass('about-overlay-hidden');
    $('body').toggleClass('no-scroll');
}

function setupAdditionalEventListeners() {
    // Map event listeners:
    // Listener for marker clicks defined in setupMapMarkers()
    // Listener for Zoom map button click in initMap()
    // Listener for about LaunchApp map button click in initMap()

    // Additonal events:
    launchListClickEvents();
}

function setupApplication(apiEndPoint) {
    // Make sure that events for overlay clicks are registered early on in case of error
    aboutSplashClickEvents();

    
    // Build query
    let requestUrl = baseUrl + apiEndPoint;

    // Make request / handle error
    fetch(requestUrl)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new error(response.statusText);
    })
    .then(rjson => {
        launchData = rjson.launches; //{"launches":[{launch01}, {launch02}]}
        setupMapMarkers(launchData);
        setupLaunchList(launchData);
        setupAdditionalEventListeners();
    })
    .catch(e => handleError(e));
}

function handleError(e) {
    $('#js-launch-list').append(
        `
        <div class="launch-list-item error">
            <p>So sorry - An error occured while retrieving the list of upcoming launches. Please try again in a few moments by refreshing this page.<p>
            <p>If this issue continues, <a href="mailto:apperror@chriswillia.ms?subject=LaunchApp%20Error&body=Error%20message-${e.message}">please let me know</a>.</p>
            <p>Additional error information:</p>
            <p>${e.message}</p>
        </div>
        `
        );
}

function initMap() {
    map = new google.maps.Map(document.getElementById('js-map-inner'),
    {
        mapTypeId: 'terrain',
        center: {lat: 0.0, lng: 0.0},
        zoom: mapInitialZoom,
        streetViewControl: false,
        fullscreenControl: false,
        minZoom: mapInitialZoom
    });

    // Add Zoom to World map control
    let zoomControlDiv = document.createElement('div');
    let zoomControl = new mapZoomOutControl(zoomControlDiv, map);
    zoomControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(zoomControlDiv);

    // Add About map control
    let aboutControlDiv = document.createElement('div');
    let aboutControl = new mapAboutControl(aboutControlDiv, map);
    aboutControlDiv.index = 2;
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(aboutControlDiv);
}

$(setupApplication('launch/next/10'));
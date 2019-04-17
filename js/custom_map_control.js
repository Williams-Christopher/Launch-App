'use strict'

function mapZoomOutControl(controlDiv, map) {
    // Control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginRight = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Zoom out to world';
    controlDiv.appendChild(controlUI);

    // Control interior
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Zoom to World';
    controlUI.appendChild(controlText);

    // Add event listener for zoom out to world button clicks
    controlUI.addEventListener('click', () => map.setZoom(mapInitialZoom));
}

function mapAboutControl(controlDiv, map) {
    // Control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginRight = '10px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'About LaunchApp';
    controlDiv.appendChild(controlUI);

    // Control interior
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = '<img class="btn-about-logo" src="./images/btn_about_logo.png" alt="LaunchApp Logo" />About LaunchApp';
    controlUI.appendChild(controlText);

    // Add event listener for about button clicks
    controlUI.addEventListener('click', () => toggleAboutSplashDisplay());
}
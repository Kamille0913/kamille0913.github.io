// Select different HTML elements with which we will interact
var $area_input = document.querySelector('#roofArea')
var $popupTemplate = document.querySelector('#popup-template').innerHTML

var bounds = [
    [80.1978, 13.0127], // Southwest coordinates
    [80.267, 13.0645]  // Northeast coordinates
    ]

var nav = new mapboxgl.NavigationControl();

mapboxgl.accessToken = 'pk.eyJ1IjoiYm9nZGFudmVjdHVlbCIsImEiOiJjazNmMXN6cXEwMGFpM29wMDI3dDhvb2dyIn0.FmiPjC9moq80QNz3wfEARg';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/bogdanvectuel/cjspvwhnc2d4r1fs10rbwq08j', // stylesheet location
    center: [80.2295, 13.0376], // starting position [lng, lat]
    zoom: 14, // starting zoom
    maxBounds: bounds
})

map.on('load', function () {
    map.addLayer({
    "id": "boundary",
    "type": "line",
    "source": {
    type: 'vector',
    url: 'mapbox://bogdanvectuel.bhrc2jjb'
        },
    "source-layer": "Boundaries_v2-3qmeh6",
    "layout": {
    "line-join": "round",
    "line-cap": "round"
        },
    "paint": {
    "line-color": "#007bff",
    "line-width": 3
        }
})

map.addControl(nav, 'bottom-right');

map.addLayer({
    "id": "buildings",
    "type": "fill",
    "source": {
    type: 'vector',
    url: 'mapbox://bogdanvectuel.cy02msck'
    },
    "source-layer": "buildings_mambalam-c03um8",
    "paint": {
    "fill-color": "#007bff",
    "fill-opacity": 0.3
}
})

map.addLayer({
    "id": "buildings-hovered",
    "type": "fill",
    "source": {
    type: 'vector',
    url: 'mapbox://bogdanvectuel.cy02msck'
    },
    "source-layer": "buildings_mambalam-c03um8",
    "filter": ["in", "osm_id", ""],
    "paint": {
    "fill-color": "#ff69b4",
    "fill-opacity": 0.6
}
})

map.addLayer({
    "id": "buildings-selected",
    "type": "fill",
    "source": {
    type: 'vector',
    url: 'mapbox://bogdanvectuel.cy02msck'
    },
    "source-layer": "buildings_mambalam-c03um8",
    "filter": ["in", "osm_id", ""],
    "paint": {
    "fill-color": "#F3FF00",
    "fill-opacity": 1
}
})

map.on('mouseover','buildings', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer'

    // Single out the first found feature.
    var feature = e.features[0];
    map.setFilter("buildings-hovered", ['in', 'osm_id', feature.properties.osm_id]);
}, 0)

//Declare a global instance of the popup
const popup = new mapboxgl.Popup({closeOnClick: false})

map.on('click', 'buildings', function(e){

    var feature = e.features[0]

    var clickCoords = e.lngLat

    // create an element with the popup content

    const html = Mustache.render($popupTemplate, {
        area: feature.properties.Area_sqft
    })

    
    popup.setLngLat(e.lngLat).setHTML(html).addTo(map)

    map.setFilter("buildings-selected", ['in', 'osm_id', feature.properties.osm_id])
    
    map.flyTo({
        center: [clickCoords.lng, clickCoords.lat],
        zoom: 19
        });
    
    //Fill in the rooftop area input with the corresponding value
    $area_input.value = feature.properties.Area_sqft
})

// Declare what happens when we close the popup
popup.on('close', function(e) {
    $area_input.value = ''
    map.setFilter("buildings-selected", ['in', 'osm_id', ''])
    map.setFilter("buildings-hovered", ['in', 'osm_id', ''])
})

map.on('mouseleave','buildings', function() {
    map.getCanvas().style.cursor = ''
    })
})

map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    bbox: [80.1978, 13.0127, 80.267, 13.0645]
}))
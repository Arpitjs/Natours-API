let mapBox = document.getElementById('map')

let displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXJwaXRqcyIsImEiOiJjazE1dWsxbzQweXc0M2xxZGtreHloZmZpIn0.ZsPq84XxmY1s6vOC_D-yxw';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom: false
    // center: [-118.113349134,.111745],
    // zoom: 10,
    // interactive: false
    });
    
    let bounds = new mapboxgl.LngLatBounds()
    
    locations.forEach(loc => {
        //cretae marker
        let el = document.createElement('div')
        el.className = 'marker'
        // add marker
        new mapboxgl.Marker( { 
            element: el,
            anchor: 'bottom'
        })
        .setLngLat(loc.coordinates).addTo(map)
        // add popup
        new mapboxgl.Popup({offset: 30 }).setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map)
        // extend the map bounds to include the current location
        bounds.extend(loc.coordinates)
    })
    
    map.fitBounds(bounds,  {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    })    
}

if (mapBox) {
    let locations = JSON.parse(mapBox.dataset.locations)
    console.log(locations)
    displayMap(locations)
}
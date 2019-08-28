d3.json('assets/data/map_data.geojson', function (data) {
    createFeatures(data.features)
});

function chooseColor(d) {
    return d > 4999  ? '#581845' :
           d > 999  ? '#900C3F' :
           d > 299  ? '#C70039' :
           d > 99.9   ? '#FF5733' :
           d > 9.9   ? '#FFC300' :
           d > .25   ? '#BAFF2F' :
                    '#4FFF2F';
};

function chooseRadius(d) {
    return d > 4999  ? 50 :
           d > 999  ? 40 :
           d > 299  ? 30 :
           d > 99.9   ? 15 :
           d > 9.9   ? 8 :
           d > .25   ? 5 :
                    2;
};

// A=greater than 0 but less than or equal to 0.25 acres, 
// B=0.26-9.9 acres, C=10.0-99.9 acres, D=100-299 acres, 
// E=300 to 999 acres, F=1000 to 4999 acres, and G=5000+ acres).

function createFeatures(fireData) {
    function onEachFeature(feature, layer) {
        var months = ['Jan','Feb','Mar','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        var days = ['Sun','Mon','Tues','Wed','Thu','Fri','Sat']
        var timestamp = new Date(feature.properties.date);
        var day = days[timestamp.getDay()];
        var month = months[timestamp.getMonth()];
        var date = timestamp.getDate();
        var year = timestamp.getFullYear();
        // var hours = timestamp.getHours();
        // var minutes = "0" + timestamp.getMinutes();
        var formattedTime = day + ", " + month + " " + date + " " + year ;
        // + " " + hours + ':' + minutes.substr(-2)

        layer.bindPopup(`<strong>County: ${feature.properties.county}</strong>
            <hr>
            Fire size: ${feature.properties.size} acres
            <br>
            Time: ${formattedTime}`);
    };

    var fires = L.geoJSON(fireData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: chooseRadius(feature.properties.size),
                fillColor: chooseColor(feature.properties.size),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: onEachFeature
    });
    createMap(fires);
};

function createMap(fires) {
    
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });
    
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });
    
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };
    
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Fires: fires
    };
    
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        timeDimension: true,
        timeDimensionOptions: {
            timeInterval: "2014-01-01/2014-12-31",
            period: "PT1H"},
        timeDimensionControl: true,
        layers: [streetmap, fires]
    });
    
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);



    // // Legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 0.25, 9.9, 99.9, 299, 999, 4999],
            labels = [];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1]  + ' acres' + '<br>' : '+' + ' acres');
        }

        return div;
    }

    legend.addTo(myMap);

    //TimeDimention
    var timeSeriesLayer = L.geoJSON(timeSeriesGeoJSON, {style: style});
    var geojson = L.timeDimension.layer.geoJson(timeSeriesLayer, {updateTimeDimensionMode: 'replace'});
    geojson.addTo(myMap);

    // // Slider

    // //Create a marker layer (in the example done via a GeoJSON FeatureCollection)
    // var sliderControl = L.control.sliderControl({position: "bottomleft", layer: fires});

    // //Make sure to add the slider to the map ;-)
    // // map.addControl(sliderControl);

    // sliderControl.addTo(myMap)

    // //And initialize the slider
    // sliderControl.startSlider();
};
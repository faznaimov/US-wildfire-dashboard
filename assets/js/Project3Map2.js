var myMap = L.map("map", {
    center: [39.8283, 98.5795],
    zoom: 6
});
  
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 6,
    id: "mapbox.streets",
    accessToken: 'pk.eyJ1Ijoic2hvb3NoaWUyMDEyIiwiYSI6ImNqejkweGFveDFkNXQzbnFpY2dvbHlhOWMifQ.pw67tjIsDxdnR-KibW2bDQ'
  }).addTo(myMap);
  
var url = "https://www.openstreetmap.org/#map=4/37.79/-95.63";
  
d3.csv("Heatmap.csv", function(err, heatdata) {
    if (err) throw err;
    console.log(heatdata);
      
    var heatArray = [];
      
    for (var i = 0; i < heatdata.fire_size; i++) {
        var location = heatdata[i].location;
          
        if (location) {
            heatArray.push([location.latitude[1], location.longitude[0]]);
            }
        }
        
    var heat = L.heatLayer(heatArray, {
        radius: 50,
        blur: 70}).addTo(myMap);
});
  
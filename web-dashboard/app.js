// Global variable for Mappls API callback
let mapData;

function initMap1() {
    console.log("Mappls Direct Access Token Authenticated.");

    // 1. Initialize the Base Map (Centering on an example Incident Location)
    mapData = new mappls.Map('map-container', {
        center: [28.6139, 77.2090], // New Delhi Coordinates (Change to dynamic SOS later)
        zoomControl: true,
        location: true,
        zoom: 14 // Get close enough to see the streets
    });

    // 2. Wait for map to fully render before plotting directions
    mapData.addListener('load', function () {
        console.log("Map Loaded Successfully.");
        
        // 3. Initiate the Mappls Directions Plugin!
        // This is exactly what the mentor requested for routing
        var direction_plugin = mappls.direction({
            map: mapData,
            // Simulating an Ambulance coming from a nearby hospital to the SOS
            start: { label: 'Amb-04 (Responder)', geoposition: "28.6189,77.2150" }, 
            end: { label: 'Civilian SOS', geoposition: "28.6139,77.2090" },
            Profile: ['driving']
        }, function(data) {
            // Callback once Mappls successfully calculates the traffic routing
            console.log("Directions Plugin Response:", data);
            
            // Extract the ETA and distance to display dynamically in our HUD
            if(data && data.routes && data.routes[0]) {
                const route = data.routes[0];
                const distanceKm = (route.distance / 1000).toFixed(1);
                const timeMins = Math.ceil(route.duration / 60);

                // Update the Dashboard UI natively
                document.getElementById('eta-display').innerHTML = 
                    `✅ ETA: <strong>${timeMins} Mins</strong><br>
                     <span style="font-size:0.8rem; color:#8b949e">Distance: ${distanceKm} km | Live Traffic Monitored</style>`;
            }
        });
    });
}
